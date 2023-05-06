import { asCodePointsCallback } from '../mod.ts';

// Text Analysis
const frequencyMap = new Map<number, number>();
const updateFrequency = (codePoint: number) => {
  const count = frequencyMap.get(codePoint) || 0;
  frequencyMap.set(codePoint, count + 1);
};
const text1 = new TextEncoder().encode('Hello, World!');
await asCodePointsCallback([text1], updateFrequency);
console.log("Text Analysis", frequencyMap);

// Text Filtering
const filteredText: string[] = [];
const filterControlCharacters = (codePoint: number) => {
  if (codePoint >= 32) {
    filteredText.push(String.fromCodePoint(codePoint));
  }
};
const text2 = new TextEncoder().encode(`Hello,
World!`);
await asCodePointsCallback([text2], filterControlCharacters);
console.log("Text Filtering", filteredText.join(''));

// Character Set Validation
const validateAscii = (codePoint: number) => {
  if (codePoint > 127) {
    throw new Error(`Non-ASCII character found: ${String.fromCodePoint(codePoint)}`);
  }
};
const text3 = new TextEncoder().encode('Hello, 世界!');
try {
  await asCodePointsCallback([text3], validateAscii);
  console.error("Character Set Validation", "passed");
} catch (error) {
  console.error("Character Set Validation", error.message);
}

// Text Transformation
const transformedText: string[] = [];
const toUpperCase = (codePoint: number) => {
  transformedText.push(String.fromCodePoint(codePoint).toUpperCase());
};
const text4 = new TextEncoder().encode('Hello, World!');
await asCodePointsCallback([text4], toUpperCase);
console.log("Text Transformation", transformedText.join(''));

// Unicode Normalization
const normalizedText: string[] = [];
const accumulateCodePoints = (codePoint: number) => {
  normalizedText.push(String.fromCodePoint(codePoint));
};
const text5 = new TextEncoder().encode('Café');
await asCodePointsCallback([text5], accumulateCodePoints);
console.log("Unicode Normalization", normalizedText.join('').normalize('NFD'));

// Text Encoding Conversion
const utf16Buffer: number[] = [];
const toUtf16 = (codePoint: number) => {
  if (codePoint <= 0xFFFF) {
    utf16Buffer.push(codePoint);
  } else {
    const highSurrogate = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
    const lowSurrogate = ((codePoint - 0x10000) % 0x400) + 0xDC00;
    utf16Buffer.push(highSurrogate, lowSurrogate);
  }
};
const text6 = new TextEncoder().encode('Hello, 世界!');
await asCodePointsCallback([text6], toUtf16);
const utf16Array = new Uint16Array(utf16Buffer);
console.log("Text Encoding Conversion", new TextDecoder('utf-16le').decode(utf16Array));
