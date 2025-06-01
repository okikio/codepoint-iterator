import { bytesToCodePointFromBuffer, codePointAt, getByteLength } from "../byte_methods.ts";
import { UTF8_MAX_BYTE_LENGTH } from "../constants.ts";

/**
 * Iterate through iterables using `TextDecoder` (stream mode) and `String.protoype.codePointAt(...)` to get and return an array of codepoints
 */
export async function textDecoderArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]() :
    Symbol.iterator in iterable
      ? iterable[Symbol.iterator]()
      : iterable;

  // Use a while loop to iterate over the async iterator.
  while (true) {
    const result = await iterator.next();
    if (result.done) break;

    const chunk = result.value;
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    const len = str.length;
    for (let i = 0; i < len;) {
      const codePoint = str.codePointAt(i)!;
      if (codePoint !== undefined) {
        arr.push(codePoint);
        i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
      }
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return arr;
}

/**
 * Iterate through iterables using `TextDecoder` (stream mode) and `String.protoype.codePointAt(...)` to get and return an array of codepoints
 */
export async function ForTextDecoderArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  // Use a while loop to iterate over the async iterator.
  for await (const chunk of iterable) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    const size = str.length;
    while (i < size) {
      const codePoint = str.codePointAt(i)!;
      arr.push(codePoint);
      i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return arr;
}

/**
 * `textDecoderArray` but use the custom `codePointAt(...)` method instead of `String.protoype.codePointAt(...)`  
 */
export async function textDecoderCustomCodePointAtArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]() :
    Symbol.iterator in iterable
      ? iterable[Symbol.iterator]()
      : iterable;

  // Use a while loop to iterate over the async iterator.
  while (true) {
    const result = await iterator.next();
    if (result.done) break;

    const chunk = result.value;
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    while (i < str.length) {
      const codePoint = codePointAt(str, i);
      if (codePoint === undefined) break; // If codePointAt returns undefined, break the loop.
      arr.push(codePoint);

      // Increment the index based on the size of the character (1 for BMP characters, 2 for others).
      if (codePoint > 0xFFFF) i += 2; // Surrogate pairs take up two units.
      else i++; // Regular characters take up one unit.
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return arr;
}

/**
 * `textDecoderArray` but use the custom `codePointAt(...)` method instead of `String.protoype.codePointAt(...)`  
 */
export async function ForTextDecoderCustomCodePointAtArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  // Use a while loop to iterate over the async iterator.
  for await (const chunk of iterable) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    while (i < str.length) {
      const codePoint = codePointAt(str, i);
      if (codePoint === undefined) break; // If codePointAt returns undefined, break the loop.
      arr.push(codePoint);

      // Increment the index based on the size of the character (1 for BMP characters, 2 for others).
      if (codePoint > 0xFFFF) i += 2; // Surrogate pairs take up two units.
      else i++; // Regular characters take up one unit.
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return arr;
}

/**
 * `textDecoderArray` but more complex, hopefully faster
 * 
 * Converts an iterable of UTF-8 filled Uint8Array's into an async generator of Unicode code points.
 *
 * The function iterates through the input iterable, which yields chunks of bytes (Uint8Array).
 * It processes each chunk to extract UTF-8 characters and calculate their corresponding Unicode code points.
 * The code points are then yielded one by one.
 * 
 * What's happening here is the optimized version of https://gist.github.com/okikio/6eb88f317ceeb2146b8268a255744fc6#file-uint8array-to-utf-8-ts
 * 
 * In simpler terms:
 * 
 * 1. Iterate through the iterable
 * 2. Grab the Uint8Array chunk from the iterable (it doesn't have to be a Uint8Array, but the default expected value is Uint8Array)
 * 3. Get the number of bytes required to represent a specific utf-8 character (utf-8 characters can range from 1 to 4 bytes)
 * 4. Loop through the Uint8Array chunk til you find all the bytes required for a utf-8 character
 *   a. If the last couple of bytes for a character span multiple 2 or more chunks
 *   b. Store the current gathered utf-8 character bytes til the full list of bytes have been acquired from other chunks
 * 5. Yield utf-8 character codepoint
 * 6. Go through steps 1 - 5, til you've gone through all chunks in the iterable  
 * 
 * @param iterable - Iterator or async iterator of UTF-8 filled Uint8Array's.
 * @returns An async generator that yields Unicode code points.
 */
export async function textDecoderComplexArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]() :
    Symbol.iterator in iterable
      ? iterable[Symbol.iterator]()
      : iterable;

  // Use a while loop to iterate over the async iterator.
  while (true) {
    const result = await iterator.next();
    if (result.done) { break; }

    const chunk = result.value;
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    const size = str.length;
    while (i < size) {
      const first = str.charCodeAt(i);
      if (
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > i + 1 // there is a next code unit
      ) {
        const second = str.charCodeAt(i + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // Calculate the code point using the surrogate pair formula
          const codePoint = ((first - 0xD800) << 10) + (second - 0xDC00) + 0x10000;
          arr.push(codePoint);
          i++; // Skip the next code unit (part of the surrogate pair)
        } else {
          // Unmatched high surrogate, treat it as an individual code point
          arr.push(first);
        }
      } else {
        // Regular code point (not part of a surrogate pair)
        arr.push(first);
      }
      ++i; // Use the ++i increment operator
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return arr;
}
/**
 * `textDecoderArray` but more complex, hopefully faster
 * 
 * Converts an iterable of UTF-8 filled Uint8Array's into an async generator of Unicode code points.
 *
 * The function iterates through the input iterable, which yields chunks of bytes (Uint8Array).
 * It processes each chunk to extract UTF-8 characters and calculate their corresponding Unicode code points.
 * The code points are then yielded one by one.
 * 
 * What's happening here is the optimized version of https://gist.github.com/okikio/6eb88f317ceeb2146b8268a255744fc6#file-uint8array-to-utf-8-ts
 * 
 * In simpler terms:
 * 
 * 1. Iterate through the iterable
 * 2. Grab the Uint8Array chunk from the iterable (it doesn't have to be a Uint8Array, but the default expected value is Uint8Array)
 * 3. Get the number of bytes required to represent a specific utf-8 character (utf-8 characters can range from 1 to 4 bytes)
 * 4. Loop through the Uint8Array chunk til you find all the bytes required for a utf-8 character
 *   a. If the last couple of bytes for a character span multiple 2 or more chunks
 *   b. Store the current gathered utf-8 character bytes til the full list of bytes have been acquired from other chunks
 * 5. Yield utf-8 character codepoint
 * 6. Go through steps 1 - 5, til you've gone through all chunks in the iterable  
 * 
 * @param iterable - Iterator or async iterator of UTF-8 filled Uint8Array's.
 * @returns An async generator that yields Unicode code points.
 */
export async function ForTextDecoderComplexArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  // Use a while loop to iterate over the async iterator.
  for await (const chunk of iterable) {
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    const size = str.length;
    while (i < size) {
      const first = str.charCodeAt(i);
      if (
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > i + 1 // there is a next code unit
      ) {
        const second = str.charCodeAt(i + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // Calculate the code point using the surrogate pair formula
          const codePoint = ((first - 0xD800) << 10) + (second - 0xDC00) + 0x10000;
          arr.push(codePoint);
          i++; // Skip the next code unit (part of the surrogate pair)
        } else {
          // Unmatched high surrogate, treat it as an individual code point
          arr.push(first);
        }
      } else {
        // Regular code point (not part of a surrogate pair)
        arr.push(first);
      }
      ++i; // Use the ++i increment operator
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
  return arr;
}

/**
 * Use a constant size `Uint8Array` as a buffer window to write and read, to get the utf-8 codepoints
 * 
 * Converts an iterable of UTF-8 filled Uint8Array's into an async generator of Unicode code points.
 *
 * The function iterates through the input iterable, which yields chunks of bytes (Uint8Array).
 * It processes each chunk to extract UTF-8 characters and calculate their corresponding Unicode code points.
 * The code points are then yielded one by one.
 * 
 * What's happening here is the optimized version of https://gist.github.com/okikio/6eb88f317ceeb2146b8268a255744fc6#file-uint8array-to-utf-8-ts
 * 
 * In simpler terms:
 * 
 * 1. Iterate through the iterable
 * 2. Grab the Uint8Array chunk from the iterable (it doesn't have to be a Uint8Array, but the default expected value is Uint8Array)
 * 3. Get the number of bytes required to represent a specific utf-8 character (utf-8 characters can range from 1 to 4 bytes)
 * 4. Loop through the Uint8Array chunk til you find all the bytes required for a utf-8 character
 *   a. If the last couple of bytes for a character span multiple 2 or more chunks
 *   b. Store the current gathered utf-8 character bytes til the full list of bytes have been acquired from other chunks
 * 5. Yield utf-8 character codepoint
 * 6. Go through steps 1 - 5, til you've gone through all chunks in the iterable  
 * 
 * @param iterable - Iterator or async iterator of UTF-8 filled Uint8Array's.
 * @returns An async generator that yields Unicode code points.
 */
export async function asCodePointsBufferWindowArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];

  /**
   * - `byteSequence` stores the bytes of the current UTF-8 character being processed.
   * - `byteSequenceRemainingBytes` keeps track of the remaining bytes needed for the current UTF-8 character.
   */
  const byteSequence = new Uint8Array(UTF8_MAX_BYTE_LENGTH);
  let byteSequenceRemainingBytes = 0;

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]() :
    Symbol.iterator in iterable
      ? iterable[Symbol.iterator]()
      : iterable;

  let head = 0; // Head pointer (start position)
  let tail = 0; // Tail pointer (end position)

  while (true) {
    const result = await iterator.next();
    if (result.done) break;

    const chunk = result.value;
    const len = chunk.length;
    for (let i = 0; i < len; ++i) {
      const byte = chunk[i];
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
        arr.push(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
        head = tail; // Move head pointer to the current tail pointer
      }
    }
  }

  if (head !== tail) {
    // Calculate code point for the last UTF-8 character in buffer
    const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
    arr.push(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
  }

  return arr;
}

/**
 * Use a constant size `Uint8Array` as a buffer window to write and read, to get the utf-8 codepoints
 * 
 * Converts an iterable of UTF-8 filled Uint8Array's into an async generator of Unicode code points.
 *
 * The function iterates through the input iterable, which yields chunks of bytes (Uint8Array).
 * It processes each chunk to extract UTF-8 characters and calculate their corresponding Unicode code points.
 * The code points are then yielded one by one.
 * 
 * What's happening here is the optimized version of https://gist.github.com/okikio/6eb88f317ceeb2146b8268a255744fc6#file-uint8array-to-utf-8-ts
 * 
 * In simpler terms:
 * 
 * 1. Iterate through the iterable
 * 2. Grab the Uint8Array chunk from the iterable (it doesn't have to be a Uint8Array, but the default expected value is Uint8Array)
 * 3. Get the number of bytes required to represent a specific utf-8 character (utf-8 characters can range from 1 to 4 bytes)
 * 4. Loop through the Uint8Array chunk til you find all the bytes required for a utf-8 character
 *   a. If the last couple of bytes for a character span multiple 2 or more chunks
 *   b. Store the current gathered utf-8 character bytes til the full list of bytes have been acquired from other chunks
 * 5. Yield utf-8 character codepoint
 * 6. Go through steps 1 - 5, til you've gone through all chunks in the iterable  
 * 
 * @param iterable - Iterator or async iterator of UTF-8 filled Uint8Array's.
 * @returns An async generator that yields Unicode code points.
 */
export async function ForAsCodePointsBufferWindowArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];

  /**
   * - `byteSequence` stores the bytes of the current UTF-8 character being processed.
   * - `byteSequenceRemainingBytes` keeps track of the remaining bytes needed for the current UTF-8 character.
   */
  const byteSequence = new Uint8Array(UTF8_MAX_BYTE_LENGTH);
  let byteSequenceRemainingBytes = 0;

  let head = 0; // Head pointer (start position)
  let tail = 0; // Tail pointer (end position)

  // Create an async iterator from the source (works for both async and sync iterables).
  for await (const chunk of iterable) {
    const len = chunk.length;
    for (let i = 0; i < len; ++i) {
      const byte = chunk[i];
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
        arr.push(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
        head = tail; // Move head pointer to the current tail pointer
      }
    }
  }

  if (head !== tail) {
    // Calculate code point for the last UTF-8 character in buffer
    const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
    arr.push(bytesToCodePointFromBuffer(byteLength, byteSequence, head));
  }

  return arr;
}
