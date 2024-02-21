/**
 * 
 * The code above consists of three functions: `asCodePointsIterator`, `asCodePointsArray`, and `asCodePointsCallback`. Each function processes an iterable (or async iterable) of Uint8Array chunks containing UTF-8 encoded characters. The functions extract UTF-8 characters from the chunks, calculate their corresponding Unicode code points, and produce the code points in different ways:
 *
 * - `asCodePointsIterator` yields the code points one by one as an async generator.
 * - `asCodePointsArray` collects the code points in an array and returns the array once the processing is complete.
 * - `asCodePointsCallback` invokes a provided callback function for each code point.
 *
 * The comments explain the steps involved in processing the input iterable and provide additional details about specific code blocks. The comments also include links to external resources for further reference.
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
 * @param iterable - An iterator or async iterator of UTF-8 filled Uint8Array's.
 * @returns An async generator that yields Unicode code points.
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
    while (i < str.length) {
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
 * @param iterable - The source iterable, which can be either synchronous or asynchronous, containing Uint8Array chunks.
 * @returns A promise that resolves to an array of Unicode code points.
 */
export async function asCodePointsArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<number> {
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
    const size = str.length;
    while (i < size) {
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
 * @template T - The type of elements in the iterable (default: Uint8Array).
 * @param {AsyncIterable<T> | Iterable<T>} iterable - The iterable or async iterable to process.
 * @param {(codePoint: number) => void} cb - The callback to invoke for each code point.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
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
    const size = str.length;
    while (i < size) {
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