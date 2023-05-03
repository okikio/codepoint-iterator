import asCodePointsIterator, { asCodePoints, asCodePointsCallback, bytesToCodePointFromBuffer, getByteLength, getCallbackStream, getIterableStream, UTF8_MAX_BYTE_LENGTH } from "../mod.ts";
import { textDecoderCodepointIterator } from "./_variants.ts";

export function createResponse(textLen = 100_000, sliceLen = 3_000) {
  return new Response(
    new ReadableStream({
      start(controller) {
        const txt = `:root { --px: 100px } .c\\\u{1F914} { width: var(--px); color: red; } /* \u{1F914}\u{1F914}\u{1F914} .pta-\\\u{1F914} { color: blue; } */`;
        const buffer = new TextEncoder().encode(
          txt.repeat(textLen)
        ); 
        
        const len = buffer.length - sliceLen;
        for (let i = sliceLen; i < len; i += sliceLen) {
          controller.enqueue(buffer.slice(i - sliceLen, i));
        }
        controller.enqueue(buffer.slice(len));
        controller.close();
      }
    })
  );
}

export async function asCodePointsArrayBench() {
  const response = createResponse();
  const expectedResult: number[] = [];

  /**
   * - `byteSequence` stores the bytes of the current UTF-8 character being processed.
   * - `byteSequenceRemainingBytes` keeps track of the remaining bytes needed for the current UTF-8 character.
   */
  const byteSequence = new Uint8Array(UTF8_MAX_BYTE_LENGTH);
  let byteSequenceRemainingBytes = 0;

  let head = 0; // Head pointer (start position)
  let tail = 0; // Tail pointer (end position)

  for await (const bytes of getIterableStream(response.body!)) {
    const len = bytes.length;
    for (let i = 0; i < len; ++i) {
      const byte = bytes[i];
      byteSequence[tail] = byte;
      tail = (tail + 1) % UTF8_MAX_BYTE_LENGTH; // Circular buffer

      // If `byteSequenceRemainingBytes` is zero, it means we are at the start of a new UTF-8 character.
      // We calculate the number of bytes required for this character using `getByteLength`.
      if (byteSequenceRemainingBytes === 0) {
        byteSequenceRemainingBytes = getByteLength(byte) - 1;
      } else {
        // Decrement `byteSequenceRemainingBytes` as we process each byte of the current UTF-8 character.
        --byteSequenceRemainingBytes;
      }

      // When `byteSequenceRemainingBytes` reaches zero, we have collected all the bytes needed for the current UTF-8 character.
      // We calculate and yield its code point using `bytesToCodePoint`.
      if (byteSequenceRemainingBytes === 0) {
        // Calculate code point from buffer
        const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
        expectedResult.push(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
        head = tail; // Move head pointer to the current tail pointer
      }
    }
  }

  if (head !== tail) {
    // Calculate code point for the last UTF-8 character in buffer
    const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
    expectedResult.push(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
  }

  return expectedResult;
}

export async function asCodePointsCallbackBench(cb: (codePoint: number) => void) {
  const response = createResponse();

  /**
   * - `byteSequence` stores the bytes of the current UTF-8 character being processed.
   * - `byteSequenceRemainingBytes` keeps track of the remaining bytes needed for the current UTF-8 character.
   */
  const byteSequence = new Uint8Array(UTF8_MAX_BYTE_LENGTH);
  let byteSequenceRemainingBytes = 0;

  let head = 0; // Head pointer (start position)
  let tail = 0; // Tail pointer (end position)

  for await (const bytes of getIterableStream(response.body!)) {
    const len = bytes.length;
    for (let i = 0; i < len; ++i) {
      const byte = bytes[i];
      byteSequence[tail] = byte;
      tail = (tail + 1) % UTF8_MAX_BYTE_LENGTH; // Circular buffer

      // If `byteSequenceRemainingBytes` is zero, it means we are at the start of a new UTF-8 character.
      // We calculate the number of bytes required for this character using `getByteLength`.
      if (byteSequenceRemainingBytes === 0) {
        byteSequenceRemainingBytes = getByteLength(byte) - 1;
      } else {
        // Decrement `byteSequenceRemainingBytes` as we process each byte of the current UTF-8 character.
        --byteSequenceRemainingBytes;
      }

      // When `byteSequenceRemainingBytes` reaches zero, we have collected all the bytes needed for the current UTF-8 character.
      // We calculate and yield its code point using `bytesToCodePoint`.
      if (byteSequenceRemainingBytes === 0) {
        // Calculate code point from buffer
        const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
        cb(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
        head = tail; // Move head pointer to the current tail pointer
      }
    }
  }

  if (head !== tail) {
    // Calculate code point for the last UTF-8 character in buffer
    const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
    cb(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
  }
}

export async function asCodePointsIteratorBench() {
  const response = createResponse();
  const actualResult: number[] = [];

  for await (const codePoint of asCodePointsIterator(getIterableStream(response.body!))) {
    actualResult.push(codePoint);
  }

  return actualResult;
}

export async function TextDecoderArrayBench() {
  const utf8Decoder = new TextDecoder("utf-8");
  const response = createResponse();
  const expectedResult: number[] = [];

  for await (const chunk of getIterableStream(response.body!)) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    while (i < str.length) {
      const codePoint = str.codePointAt(i)!;
      expectedResult.push(codePoint);
      i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return expectedResult;
}

export async function TextDecoderArrayBench2() {
  const utf8Decoder = new TextDecoder("utf-8");
  const response = createResponse();
  const expectedResult: number[] = [];

  for await (const chunk of getIterableStream(response.body!)) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = -1;
    const size = str.length;
    while (++i < size) {
      // const codePoint = str.codePointAt(i)!;
      const first = str.charCodeAt(i)!;
      if ( // check if it’s the start of a surrogate pair
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > i + 1 // there is a next code unit
      ) {
        const second = str.charCodeAt(i + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          const codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000)
          expectedResult.push(codePoint);
          if (codePoint > 0xFFFF) ++i; // Adjust index based on code point size)
        }
      }
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return expectedResult;
}

export async function TextDecoderCallbackBench(cb: (codePoint: number) => void) {
  const utf8Decoder = new TextDecoder("utf-8");
  const response = createResponse();

  for await (const chunk of getIterableStream(response.body!)) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    while (i < str.length) {
      const codePoint = str.codePointAt(i)!;
      cb(codePoint);
      i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

export async function TextDecoderCallbackBench2(cb: (codePoint: number) => void) {
  const utf8Decoder = new TextDecoder("utf-8");
  const response = createResponse();

  for await (const chunk of getIterableStream(response.body!)) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = -1;
    const size = str.length;
    while (++i < size) {
      // const codePoint = str.codePointAt(i)!;
      const first = str.charCodeAt(i)!;
      if ( // check if it’s the start of a surrogate pair
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > i + 1 // there is a next code unit
      ) {
        const second = str.charCodeAt(i + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          const codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000)
          cb(codePoint);
          // if (codePoint > 0xFFFF) ++i; // Adjust index based on code point size)
        }
      }
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

export async function TextDecoderCallbackBench3(cb: (codePoint: number) => void) {
  const response = createResponse();

  const next = getCallbackStream(response.body!);
  await asCodePoints(next, cb)
}

export async function TextDecoderIteratorBench() {
  const response = createResponse();
  const actualResult: number[] = [];

  for await (const codePoint of textDecoderCodepointIterator(getIterableStream(response.body!))) {
    actualResult.push(codePoint);
  }

  return actualResult;
}
