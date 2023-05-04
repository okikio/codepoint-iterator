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