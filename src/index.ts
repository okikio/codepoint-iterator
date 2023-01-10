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

/**
 * UTF-8 bytes to code point
 * 
 * UTF-8 can be represented by 1 to 4 bytes. 
 * This function  given the byte length of the utf-8 character 
 * calculates the code point using the 1 to 4 numbers given for the bytes
 * of the utf-8 character.
 * 
 * Due to the dynamic length of utf-8 characters, 
 * its faster to just grab the bytes from the Uint8Array then calculate it's codepoint
 * than trying to decode said Uint8Array into a string and then converting 
 * said string into codepoints.
 * 
 * @param byteLength The number of bytes required to represent a single utf-8 character (ranging from 1 to 4)
 * @param [bytes] An array of length `byteLength` bytes that make up the utf-8 character
 */
export function getByteLength(byte) {
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
 * @param byteLength The number of bytes required to represent a single utf-8 character (ranging from 1 to 4)
 * @param [bytes] An array of length `byteLength` bytes that make up the utf-8 character
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

/**
 * What's happening here is the optimized version of https://gist.github.com/okikio/6eb88f317ceeb2146b8268a255744fc6#file-uint8array-to-utf-8-ts
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
 * @param iterable Iterator of utf-8 filled Uint8Array's
 */
export async function* asCodePoints<T = Uint8Array>(
  iterable: AsyncIterator<T> | Iterator<T>
) {
  /**
   * - `byteSequence` is the array of the UTF-8 byte sequence being evaluated.
   * - `byteSequenceTalliedLength` is the length of the UTF-8 byte sequence as determined by the lead byte.
   * - `byteSequenceCurrentLength` is the length of the UTF-8 byte sequence as consumed by the iterator.
   */
  const byteSequence = [];
  let byteSequenceCurrentLength = 0;
  let byteSequenceTalliedLength = 0;

  let result = await iterable.next();
  while (!result.done) {
    const bytes = result.value as Uint8Array;
    const len = bytes.byteLength;

    let i = 0;
    let byte = bytes[i];
    byteSequenceCurrentLength = byteSequence.push(byte);

    for (; i < len;) {
      if (byteSequenceTalliedLength === 0) {
        byteSequenceTalliedLength = getByteLength(byte);
      }

      if (byteSequenceTalliedLength === byteSequenceCurrentLength) {
        yield bytesToCodePoint(
          byteSequenceTalliedLength,
          byteSequence.splice(0)
        );

        byteSequenceTalliedLength = 0;
        byteSequenceCurrentLength = 0;
      }

      byte = bytes[++i];
      byteSequenceCurrentLength = byteSequence.push(byte);
    }

    result = await iterable.next();
  }

  if (byteSequenceCurrentLength > 0) {
    yield bytesToCodePoint(byteSequenceTalliedLength, byteSequence.splice(0));
  }
}

export default asCodePoints;

export * from "./utils.ts";