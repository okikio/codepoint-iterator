// 1-byte encoding
export const LEAD_FOR_1B = 0x80; // 1000 0000
export const MASK_FOR_1B = 0x3F; // 0011 1111

// 2-byte encoding
export const BITS_FOR_2B = 6; // bits 7 -> 12
export const LEAD_FOR_2B = 0xC0; // 1100 0000
export const MASK_FOR_2B = 0x1F; // 0001 1111

// 3-byte encoding
export const BITS_FOR_3B = 12; // bits 13 -> 18
export const LEAD_FOR_3B = 0xE0; // 1110 0000
export const MASK_FOR_3B = 0x0F; // 0000 1111

// 4-byte encoding
export const BITS_FOR_4B = 18; // highest bits 19 -> 21
export const LEAD_FOR_4B = 0xF0; // 1111 0000
export const MASK_FOR_4B = 0x07; // 0000 0111

// 5-byte encoding
export const LEAD_FOR_5B = 0xF8; // 1111 1000

// The maximum number of bytes required to represent a UTF-8 character
export const UTF8_MAX_BYTE_LENGTH = 4;

/**
 * Calculates the number of bytes required to represent a single UTF-8 character.
 * 
 * UTF-8 can be represented by 1 to 4 bytes. 
 * This function given the byte value of the leading byte for the utf-8 character 
 * calculates how many more bytes are required to represent the utf-8 character,
 * this allows emoji's another other symbols to be represented in utf-8.
 *
 * @param byte - The lead byte of a UTF-8 character.
 * @returns The number of bytes in a Uint8Array required to represent the UTF-8 character (the number of bytes ranges from 1 to 4).
 */
export function getByteLength(byte: number) {
  return (
    byte < LEAD_FOR_1B ? 1 :
    LEAD_FOR_2B === (LEAD_FOR_3B & byte) ? 2 :
    LEAD_FOR_3B === (LEAD_FOR_4B & byte) ? 3 :
    LEAD_FOR_4B === (LEAD_FOR_5B & byte) ? 4 
    : 1
  );
}

/**
 * UTF-8 bytes to codepoint.
 * Calculates the Unicode code point from the bytes of a UTF-8 character.
 * 
 * UTF-8 can be represented by 1 to 4 bytes. 
 * This function given the byte length of the utf-8 character 
 * calculates the code point using the 1 to 4 numbers given for the bytes
 * of the utf-8 character.
 * 
 * Due to the dynamic length of utf-8 characters, 
 * its faster to just grab the bytes from the Uint8Array then calculate it's codepoint
 * than trying to decode said Uint8Array into a string and then converting 
 * said string into codepoints.
 *
 * @param byteLength The number of bytes in a Uint8Array required to represent a single UTF-8 character (the number of bytes ranges from 1 to 4).
 * @param [bytes] - An array of length `byteLength` bytes that make up the UTF-8 character.
 * @returns The Unicode code point of the UTF-8 character.
 */
export function bytesToCodePoint(byteLength: number, [byte1, byte2, byte3, byte4]: number[]) {
  return (
    // 1-byte UTF-8 sequence
    byteLength === 1 ?
      byte1

    // 2-byte UTF-8 sequence
    : byteLength === 2 ?
      (MASK_FOR_2B & byte1) << BITS_FOR_2B |
      MASK_FOR_1B & byte2

    // 3-byte UTF-8 sequence
    : byteLength === 3 ?
      (MASK_FOR_3B & byte1) << BITS_FOR_3B |
      (MASK_FOR_1B & byte2) << BITS_FOR_2B |
      MASK_FOR_1B & byte3

    // 4-byte UTF-8 sequence
    : byteLength === 4 ?
      (MASK_FOR_4B & byte1) << BITS_FOR_4B |
      (MASK_FOR_1B & byte2) << BITS_FOR_3B |
      (MASK_FOR_1B & byte3) << 6 |
      MASK_FOR_1B & byte4

    // 1-byte UTF-8 sequence (fallback)
    : byte1
  );
}

// Helper function to calculate code point from buffer using indexed access
export function bytesToCodePointFromBuffer(byteLength: number, buffer: Uint8Array, head: number) {
  const bufferSize = buffer.length;
  switch (byteLength) {
    case 1:
      return buffer[head];
    case 2:
      return (MASK_FOR_2B & buffer[head]) << BITS_FOR_2B |
        MASK_FOR_1B & buffer[(head + 1) % bufferSize];
    case 3:
      return (MASK_FOR_3B & buffer[head]) << BITS_FOR_3B |
        (MASK_FOR_1B & buffer[(head + 1) % bufferSize]) << BITS_FOR_2B |
        MASK_FOR_1B & buffer[(head + 2) % bufferSize];
    case 4:
      return (MASK_FOR_4B & buffer[head]) << BITS_FOR_4B |
        (MASK_FOR_1B & buffer[(head + 1) % bufferSize]) << BITS_FOR_3B |
        (MASK_FOR_1B & buffer[(head + 2) % bufferSize]) << 6 |
        MASK_FOR_1B & buffer[(head + 3) % bufferSize];
    default:
      return buffer[head];
  }
}

/**
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
export async function* asCodePointsIterator<T = Uint8Array>(
  iterable: AsyncIterator<T> | Iterator<T>
) {
  /**
   * - `byteSequence` stores the bytes of the current UTF-8 character being processed.
   * - `byteSequenceRemainingBytes` keeps track of the remaining bytes needed for the current UTF-8 character.
   */
  const byteSequence = new Uint8Array(UTF8_MAX_BYTE_LENGTH);
  let byteSequenceRemainingBytes = 0;

  let head = 0; // Head pointer (start position)
  let tail = 0; // Tail pointer (end position)

  while (true) {
    const result = await iterable.next();
    if (result.done) break;
    
    const bytes = result.value as Uint8Array;
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
        yield bytesToCodePointFromBuffer(byteLength, byteSequence, head);
        head = tail; // Move head pointer to the current tail pointer
      }
    }
  }

  if (head !== tail) {
    // Calculate code point for the last UTF-8 character in buffer
    const byteLength = (tail - head + UTF8_MAX_BYTE_LENGTH) % UTF8_MAX_BYTE_LENGTH || UTF8_MAX_BYTE_LENGTH;
    yield bytesToCodePointFromBuffer(byteLength, byteSequence, head);
  }
}

// export async function asCodePointsCallback<T = Uint8Array>(
//   iterable: AsyncIterator<T> | Iterator<T>,
//   cb: (codePoint: number) => void
// ) {
//   const utf8Decoder = new TextDecoder("utf-8");

//   while (true) {
//     const result = await iterable.next();
//     if (result.done) break;

//     const chunk = result.value as Uint8Array;
//     const str = utf8Decoder.decode(chunk, { stream: true });

//     // Extract code points in larger batches
//     let i = -1;
//     const size = str.length;
//     while (++i < size) {
//       // const codePoint = str.codePointAt(i)!;
//       const first = str.charCodeAt(i)!;
//       if ( // check if it’s the start of a surrogate pair
//         first >= 0xD800 && first <= 0xDBFF && // high surrogate
//         size > i + 1 // there is a next code unit
//       ) {
//         const second = str.charCodeAt(i + 1);
//         if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
//           // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
//           const codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000)
//           cb(codePoint);
//           if (codePoint > 0xFFFF) ++i; // Adjust index based on code point size)
//         }
//       }
//     }
//   }

//   // Flush the decoder's internal state
//   utf8Decoder.decode(new Uint8Array());
// }


/**
 * Processes an iterable or async iterable of Uint8Array chunks and invokes a callback for each code point.
 * @template T - The type of elements in the iterable (default: Uint8Array).
 * @param {AsyncIterable<T> | Iterable<T>} source - The iterable or async iterable to process.
 * @param {(codePoint: number) => void} cb - The callback to invoke for each code point.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
export async function asCodePointsCallback<T extends Uint8Array>(
  source: AsyncIterable<T> | Iterable<T>,
  cb: (codePoint: number) => void
): Promise<void> {
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in source
    ? source[Symbol.asyncIterator]() : 
    Symbol.iterator in source 
    ? source[Symbol.iterator]() 
    : source;

  let codePoint: number;
  let size: number;
  let first: number;
  let second: number;

  // Use a while loop to iterate over the async iterator.
  while (true) {
    const result = await iterator.next();
    if (result.done) { break; }

    const chunk = result.value;
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = -1;
    size = str.length;
    while (++i < size) {
      first = str.charCodeAt(i);
      if (
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > i + 1 // there is a next code unit
      ) {
        second = str.charCodeAt(i + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // Calculate the code point using the surrogate pair formula
          codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000);
          cb(codePoint);
          if (codePoint > 0xFFFF) ++i; // Adjust index based on code point size)
        }
      }
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

/**
 * Processes an iterable or async iterable of Uint8Array chunks and invokes a callback for each code point.
 * @template T - The type of elements in the iterable (default: Uint8Array).
 * @param {AsyncIterable<T> | Iterable<T>} source - The iterable or async iterable to process.
 * @param {(codePoint: number) => void} cb - The callback to invoke for each code point.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
export async function asCodePoints<T extends Uint8Array>(
  next: () => Promise<ReadableStreamDefaultReadDoneResult | ReadableStreamDefaultReadValueResult<T>>,
  cb: (codePoint: number) => void
): Promise<void> {
  const utf8Decoder = new TextDecoder("utf-8");

  let codePoint: number;
  let size: number;
  let first: number;
  let second: number;

  // Use a while loop to iterate over the async iterator.
  while (true) {
    const result = await next();
    if (result.done) { break; }

    const chunk = result.value;
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = -1;
    size = str.length;
    while (++i < size) {
      first = str.charCodeAt(i);
      if (
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > i + 1 // there is a next code unit
      ) {
        second = str.charCodeAt(i + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // Calculate the code point using the surrogate pair formula
          codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000);
          cb(codePoint);
          if (codePoint > 0xFFFF) ++i; // Adjust index based on code point size)
        }
      }
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

export default asCodePointsIterator;

export * from "./iterable.ts";