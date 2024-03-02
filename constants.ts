/**
 * @module
 * This module defines constants used for UTF-8 character encoding, 
 * covering 1-byte to 5-byte sequences, including their leading bits 
 * and masks for identifying and extracting the encoded character bits.
 * 
 * Defines constants for UTF-8 encoding operations, including lead bytes, masks, and bits required for different byte sequences.
 * These constants are essential for encoding and decoding UTF-8 characters, from simple ASCII to complex symbols and emojis.
 * 
 * @example
 * Imagine encoding the character '𝄞' (the G Clef symbol in music), which requires a 4-byte UTF-8 sequence.
 * 
 * 1. Identify the lead byte for a 4-byte sequence: `LEAD_FOR_4B` (1111 0000 in binary)
 * 2. The mask for extracting significant bits from the first byte in a 4-byte sequence: `MASK_FOR_4B` (0000 0111 in binary)
 * 3. To encode '𝄞', we calculate its bits beyond the ASCII range, requiring `BITS_FOR_4B` (18 bits for the highest bits 19 -> 21).
 * 
 * The process involves:
 * - Using `LEAD_FOR_4B` to start the encoding sequence.
 * - Applying `MASK_FOR_4B` to extract the first few significant bits of the character.
 * - Shifting by `BITS_FOR_4B`, `BITS_FOR_3B`, and `BITS_FOR_2B` to position the remaining bits correctly.
 * 
 * For a 2-byte character like 'Ω' (Omega):
 * - Start with `LEAD_FOR_2B` (1100 0000 in binary) to indicate a 2-byte sequence.
 * - Use `MASK_FOR_2B` (0001 1111 in binary) for the first byte's significant bits.
 * - The shift amount is `BITS_FOR_2B` (6 bits for positions 7 to 12).
 * 
 * A 1-byte ASCII character, such as 'A':
 * - Simply uses `LEAD_FOR_1B` (1000 0000 in binary) and `MASK_FOR_1B` (0011 1111 in binary) to represent the character in UTF-8.
 */

// 1-byte encoding
/** 
 * Leading bits for a 1-byte sequence in UTF-8 encoding. 
 * This indicates that the character is represented with a single byte.
 * 
 * @example `1000 0000`
 */
export const LEAD_FOR_1B = 0x80; // 1000 0000

/** 
 * Mask for extracting the significant bits from a 1-byte encoded character.
 * 
 * @example `0011 1111`
 */
export const MASK_FOR_1B = 0x3F; // 0011 1111

// 2-byte encoding
/** 
 * Number of significant bits in a 2-byte sequence, used for characters beyond the ASCII range.
 * 
 * @example highest bits 7 -> 12
 */
export const BITS_FOR_2B = 6; // highest bits 7 -> 12

/** 
 * Leading bits for a 2-byte sequence, indicating the start of a 2-byte encoded character.
 * 
 * @example `1100 0000`
 */
export const LEAD_FOR_2B = 0xC0; // 1100 0000

/** 
 * Mask for extracting the significant bits from a 2-byte encoded character.
 * 
 * @example `0001 1111`
 */
export const MASK_FOR_2B = 0x1F; // 0001 1111

// 3-byte encoding
/** 
 * Number of significant bits in a 3-byte sequence, typically used for characters in many non-Western alphabets.
 * 
 * @example highest bits 13 -> 18
 */
export const BITS_FOR_3B = 12; // highest bits 13 -> 18

/** 
 * Leading bits for a 3-byte sequence, indicating the start of a 3-byte encoded character.
 * 
 * @example `1110 0000`
 */
export const LEAD_FOR_3B = 0xE0; // 1110 0000

/** 
 * Mask for extracting the significant bits from a 3-byte encoded character.
 * 
 * @example `0000 1111`
 */
export const MASK_FOR_3B = 0x0F; // 0000 1111

// 4-byte encoding
/** 
 * Number of significant bits in a 4-byte sequence, used for characters that are less common in daily use.
 * 
 * @example highest bits 19 -> 21
 */
export const BITS_FOR_4B = 18; // highest bits 19 -> 21

/** 
 * Leading bits for a 4-byte sequence, indicating the start of a 4-byte encoded character.
 * 
 * @example `1111 0000`
 */
export const LEAD_FOR_4B = 0xF0; // 1111 0000

/** 
 * Mask for extracting the significant bits from a 4-byte encoded character.
 * 
 * @example `0000 0111`
 */
export const MASK_FOR_4B = 0x07; // 0000 0111

// 5-byte encoding
/** 
 * Leading bits for a 5-byte sequence. This is not officially used in UTF-8 encoding 
 * and is included for completeness.
 * 
 * @example `1111 1000`
 */
export const LEAD_FOR_5B = 0xF8; // 1111 1000

// UTF-8 encoding specifics
/** 
 * The maximum number of bytes required to represent any UTF-8 character. 
 * This constant defines the upper limit for UTF-8 encoded character size.
 * 
 * @example 4
 */
export const UTF8_MAX_BYTE_LENGTH = 4;