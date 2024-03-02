/**
 * @module
 * Provides utility functions for working with UTF-8 encoded characters in TypeScript.
 * It includes methods for determining the byte length of UTF-8 characters, converting bytes to Unicode code points,
 * extracting code points from buffers, and dealing with UTF-16 code units in strings.
 * 
 * @example
 * ```ts
 * import { getByteLength, bytesToCodePoint, bytesToCodePointFromBuffer, codePointAt } from 'jsr:@okikio/codepoint-iterator/byte_methods';
 * 
 * // Determine the byte length of a UTF-8 encoded character
 * const leadByte = 0xF0; // Leading byte of a 4-byte UTF-8 character
 * console.log(getByteLength(leadByte)); // Expected output: 4
 * 
 * // Convert a sequence of UTF-8 bytes to a Unicode code point
 * const bytes = [0xF0, 0x9F, 0x92, 0xA9]; // UTF-8 encoded representation of the 💩 emoji
 * console.log(bytesToCodePoint(4, bytes)); // Expected output: 128169 (code point for 💩)
 * 
 * // Extract a Unicode code point from a buffer
 * const buffer = new Uint8Array([0xF0, 0x9F, 0x92, 0xA9]);
 * console.log(bytesToCodePointFromBuffer(4, buffer, 0)); // Expected output: 128169
 * 
 * // Calculate the Unicode code point of a character in a string
 * const str = '🌍';
 * console.log(codePointAt(str, 0)); // Expected output: 127757 (code point for 🌍)
 * ```
 */

import { 
  BITS_FOR_2B,
  BITS_FOR_3B,
  BITS_FOR_4B,

  LEAD_FOR_1B, 
  LEAD_FOR_2B, 
  LEAD_FOR_3B, 
  LEAD_FOR_4B, 
  LEAD_FOR_5B,

  MASK_FOR_1B,
  MASK_FOR_2B,
  MASK_FOR_3B,
  MASK_FOR_4B,
} from "./constants.ts";

/**
 * Calculates the number of bytes required to represent a single UTF-8 character.
 * 
 * Determines the byte length of a UTF-8 encoded character based on its leading byte.
 * This is crucial for correctly interpreting or encoding text in UTF-8, 
 * where characters may vary in byte length from 1 to 4 bytes.
 * 
 * This function given the byte value of the leading byte for the utf-8 character 
 * calculates how many more bytes are required to represent the utf-8 character,
 * this allows emoji's another other symbols to be represented in utf-8.
 *
 * @param byte The lead byte of a UTF-8 character.
 * @returns The number of bytes in a Uint8Array required to represent the UTF-8 character (the number of bytes ranges from 1 to 4).
 */
export function getByteLength(byte: number): number {
  return (
    byte < LEAD_FOR_1B ? 1 :
    LEAD_FOR_2B === (LEAD_FOR_3B & byte) ? 2 :
    LEAD_FOR_3B === (LEAD_FOR_4B & byte) ? 3 :
    LEAD_FOR_4B === (LEAD_FOR_5B & byte) ? 4
    : 1
  );
}

/**
 * Converts a sequence of bytes into a Unicode code point. This function is a key part of 
 * decoding UTF-8 encoded text, as it translates the raw bytes back into the characters they represent.
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
 * @param bytes An array of length `byteLength` bytes that make up the UTF-8 character.
 * @returns The Unicode code point of the UTF-8 character.
 */
export function bytesToCodePoint(byteLength: number, [byte1, byte2, byte3, byte4]: number[]): number {
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
    // Default to 1-byte sequence if length is unexpected
    : byte1
  );
}

/** 
 * Extracts a Unicode code point from a given buffer starting at a specified index. 
 * This method is useful for parsing a stream or array of data where UTF-8 characters 
 * are embedded within a larger set of binary data.
 * 
 * @param byteLength The byte length of the UTF-8 encoded character to extract.
 * @param buffer The buffer (array or Uint8Array) containing the UTF-8 data.
 * @param head The index in the buffer where the UTF-8 encoded character starts.
 * @returns The Unicode code point extracted from the buffer.
 */
export function bytesToCodePointFromBuffer<T extends number = number>(
  byteLength: number,
  buffer: Array<T> | Uint8Array,
  head: number
): number {
  // Constants for bit manipulation
  const bufferSize = buffer.length;

  // Calculate the code point based on the byte length
  switch (byteLength) {
    case 1:
      return buffer[head];
    case 2:
      return (
        (MASK_FOR_2B & buffer[head]) << BITS_FOR_2B |
        MASK_FOR_1B & buffer[(head + 1) % bufferSize]
      );
    case 3:
      return (
        (MASK_FOR_3B & buffer[head]) << BITS_FOR_3B |
        (MASK_FOR_1B & buffer[(head + 1) % bufferSize]) << BITS_FOR_2B |
        MASK_FOR_1B & buffer[(head + 2) % bufferSize]
      );
    case 4:
      return (
        (MASK_FOR_4B & buffer[head]) << BITS_FOR_4B |
        (MASK_FOR_1B & buffer[(head + 1) % bufferSize]) << BITS_FOR_3B |
        (MASK_FOR_1B & buffer[(head + 2) % bufferSize]) << BITS_FOR_2B |
        MASK_FOR_1B & buffer[(head + 3) % bufferSize]
      );
    default:
      // Default case for unexpected byteLength
      return buffer[head];
  }
}

/**
 * Extracts the Unicode code point and its size in UTF-16 code units from a string at a given position.
 * 
 * Calculates the Unicode code point of a character at a specific index in a string, 
 * taking into account UTF-16 encoding which may represent characters using one or two code units (surrogates).
 * This function is particularly useful for strings containing emoji or other characters 
 * that may be represented as surrogate pairs in JavaScript.
 * 
 * @param str The string to extract the code point from.
 * @param index The index of the character within the string.
 * @returns The Unicode code point of the character, considering potential surrogate pairs.
 */
export function codePointAt(str: string, index: number): number | undefined {
  const size = str.length;
  if (index < 0 || index >= size) return undefined; // Guard clause for out-of-bounds index

  // Get the first code unit
  const first = str.charCodeAt(index);

  // Surrogate pairs are a way to represent characters that don't fit in the standard size for a character in UTF-16 encoding.
  // Normally, characters in UTF-16 are represented using a single unit (16 bits).
  // However, this only allows for 65,536 unique characters (2^16),
  // which is not enough for all the characters and symbols we want to use.
  // To encode more than 65,536 characters, UTF-16 uses a pair of units (32 bits in total) for some characters.
  // This pair is known as a surrogate pair.

  // A surrogate pair consists of two parts: a high surrogate and a low surrogate.
  // The high surrogate is the first part and is a code unit in the range 0xD800 to 0xDBFF.
  // The low surrogate is the second part and is a code unit in the range 0xDC00 to 0xDFFF.
  // When these two parts are combined, they represent a single character that is outside the standard 65,536 characters.
  if ( 
    // check if it’s the start of a surrogate pair
    first >= 0xD800 && first <= 0xDBFF && // high surrogate
    size > index + 1 // there is a next code unit
  ) {
    const second = str.charCodeAt(index + 1);

    // Here, we check if the second unit is a low surrogate to confirm that we have a valid surrogate pair.
    // If it is, we combine the high and low surrogates to get the actual character they represent.
    // This is done using a specific formula that translates these two units into the correct character.
    if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae

      // The full code point is calculated using the formula:
      // (high surrogate - 0xD800) * 0x400 + (low surrogate - 0xDC00) + 0x10000
      // e.g. `return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;`
      // This formula converts the surrogate pair into the actual Unicode code point.

      // Use bitwise shift instead of multiplication and addition
      // Bitwise left shift (<< 10) is used here as an efficient way to multiply by 2^10 (or 2**10) (or 1024).
      // This is equivalent to the expression (first - 0xD800) * 0x400, since 0x400 in decimal is 1024.
      return ((first - 0xD800) << 10) + (second - 0xDC00) + 0x10000; // Calculate and return surrogate pair code point
    }
  }
  
  // Return the code unit if not a surrogate pair
  return first;
}