/**
 * @module
 * This module provides utilities for processing UTF-8 encoded text. It includes functions to work with iterables or async iterables of `Uint8Array` chunks, converting them into Unicode code points through different methods:
 * 
 * - `asCodePointsIterator` for yielding code points asynchronously,
 * - `asCodePointsArray` for collecting code points into an array,
 * - `asCodePointsCallback` for invoking a callback function with each code point.
 *
 * These utilities are designed to handle text data efficiently, especially useful for streaming or batch processing scenarios.
 * 
 * @example
 * Using `asCodePointsIterator` to asynchronously iterate over code points:
 * ```ts
 * // Example iterable of UTF-8 encoded Uint8Array chunks (representing 'hello')
 * const chunks = [new Uint8Array([104]), new Uint8Array([101, 108, 108, 111])];
 * (async () => {
 *   for await (const codePoint of asCodePointsIterator(chunks)) {
 *     console.log(String.fromCodePoint(codePoint)); // Logs each character: 'h', 'e', 'l', 'l', 'o'
 *   }
 * })();
 * ```
 * 
 * Using `asCodePointsArray` to get an array of code points:
 * ```ts
 * (async () => {
 *   const codePoints = await asCodePointsArray(chunks); // Assuming 'chunks' from the previous example
 *   console.log(codePoints.map(cp => String.fromCodePoint(cp)).join('')); // Logs: 'hello'
 * })();
 * ```
 * 
 * Using `asCodePointsCallback` to process code points with a callback:
 * ```ts
 * (async () => {
 *   asCodePointsCallback(chunks, codePoint => {
 *     console.log(String.fromCodePoint(codePoint)); // Logs each character: 'h', 'e', 'l', 'l', 'o'
 *   });
 * })();
 * ```
 * Versatility in handling streamed or batched UTF-8 data, making it easier to work with text in modern JavaScript environments.
 */

/**
 * Converts an iterable of UTF-8 filled Uint8Array's into an async generator of Unicode code points.
 *
 * The function performs the following steps:
 * 1. Iterate through the input iterable, which yields chunks of bytes (Uint8Array).
 * 2. Process each chunk using a TextDecoder to extract UTF-8 characters.
 * 3. Calculate the corresponding Unicode code points for the extracted characters.
 * 4. Yield the code points one by one.
 *
 * @param iterable An iterator or async iterator of `Uint8Array` chunks filled with UTF-8 encoded text.
 * @returns An async generator yielding Unicode code points from the given iterable.
 * 
 * @example
 * Convert an async iterable of `Uint8Array` chunks into an async iterable of Unicode code points.
 * ```ts
 * async function exampleIteratorUsage() {
 *   const utf8Chunks = [new Uint8Array([0xF0, 0x9F, 0x92, 0x96])]; // Represents the 💖 emoji
 *   for await (const codePoint of asCodePointsIterator(utf8Chunks)) {
 *     console.log(String.fromCodePoint(codePoint)); // Output: 💖
 *   }
 * }
 * exampleIteratorUsage();
 * ```
 */
export async function* asCodePointsIterator<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterable<number> {
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
    const len = str.length;
    while (i < len) {
      const codePoint = str.codePointAt(i)!;
      yield codePoint;
      i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

/**
 * Converts an iterable of Uint8Array (byte arrays) into an array of Unicode code points.
 * This is particularly useful for processing streams of text data, where each chunk
 * is represented as a Uint8Array, and you want to work with the text's Unicode code points.
 *
 * Similar to asCodePointsIterator, this function processes the input iterable to extract UTF-8 characters
 * and calculate their corresponding Unicode code points. However, instead of yielding the code points one by one,
 * it stores them in an array and returns the array once the processing is complete.
 * 
 * @param iterable The source iterable, either synchronous or asynchronous, containing `Uint8Array` chunks.
 * @returns A promise that resolves to an array of Unicode code points.
 * 
 * @example
 * Convert an iterable of `Uint8Array` chunks into an array of Unicode code points.
 * ```ts
 * async function exampleArrayUsage() {
 *   const utf8Chunks = [new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F])]; // Represents the string 'hello'
 *   const codePoints = await asCodePointsArray(utf8Chunks);
 *   console.log(codePoints.map(cp => String.fromCodePoint(cp)).join('')); // Output: 'hello'
 * }
 * exampleArrayUsage();
 * ```
 */
export async function asCodePointsArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<number[]> {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an iterator from the source, accommodating both async and sync iterables.
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]()
    : Symbol.iterator in iterable
      ? iterable[Symbol.iterator]()
      : iterable;

  // Iterate over each chunk in the iterable.
  while (true) {
    const result = await iterator.next();
    if (result.done) { break; }

    const chunk = result.value;
    // Decode the chunk of bytes into a string using UTF-8 decoding.
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Process each character in the decoded string.
    let i = 0;
    const len = str.length;
    while (i < len) {
      // Use the custom codePointAt function to handle surrogate pairs and regular characters.
      const codePoint = str.codePointAt(i);
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
 * Processes an iterable or async iterable of Uint8Array chunks and invokes a callback for each code point.
 * The function performs the following steps:
 * - Iterate through the input iterable, which yields chunks of bytes (Uint8Array).
 * - Process each chunk using a TextDecoder to extract UTF-8 characters.
 * - Calculate the corresponding Unicode code points for the extracted characters.
 * - Invoke the provided callback for each code point.
 * 
 * @template T The type of elements in the iterable (default: Uint8Array).
 * @param iterable An iterable or async iterable to process.
 * @param cb A callback function to invoke for each code point.
 * @returns A promise that resolves when all code points have been processed.
 * 
 * @example
 * Process each Unicode code point from an iterable of `Uint8Array` chunks using a callback function.
 * ```ts
 * async function exampleCallbackUsage() {
 *   const utf8Chunks = [new Uint8Array([0x77, 0x6F, 0x72, 0x6C, 0x64])]; // Represents the string 'world'
 *   await asCodePointsCallback(utf8Chunks, codePoint => {
 *     console.log(String.fromCodePoint(codePoint)); // Output: 'w', 'o', 'r', 'l', 'd'
 *   });
 * }
 * exampleCallbackUsage();
 * ```
*/
export async function asCodePointsCallback<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>,
  cb: (codePoint: number) => void
): Promise<void> {
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an iterator from the source, accommodating both async and sync iterables.
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]()
    : Symbol.iterator in iterable
      ? iterable[Symbol.iterator]()
      : iterable;

  // Iterate over each chunk in the iterable.
  while (true) {
    const result = await iterator.next();
    if (result.done) { break; }

    const chunk = result.value;
    // Decode the chunk of bytes into a string using UTF-8 decoding.
    const str = utf8Decoder.decode(chunk, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    const len = str.length;
    while (i < len) {
      // Use the custom codePointAt function to handle surrogate pairs and regular characters.
      const codePoint = str.codePointAt(i);
      if (codePoint === undefined) break; // If codePointAt returns undefined, break the loop.
      cb(codePoint);

      // Increment the index based on the size of the character (1 for BMP characters, 2 for others).
      if (codePoint > 0xFFFF) i += 2; // Surrogate pairs take up two units.
      else i++; // Regular characters take up one unit.
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

export default asCodePointsIterator;

export * from "./iterable.ts"; 
export * from "./byte_methods.ts";
export * from "./constants.ts";