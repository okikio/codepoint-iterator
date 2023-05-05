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
) {
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
 * Converts an iterable of UTF-8 filled Uint8Array's into an array of Unicode code points.
 *
 * Similar to asCodePointsIterator, this function processes the input iterable to extract UTF-8 characters
 * and calculate their corresponding Unicode code points. However, instead of yielding the code points one by one,
 * it stores them in an array and returns the array once the processing is complete.
 *
 * @param iterable - An iterator or async iterator of UTF-8 filled Uint8Array's.
 * @returns An array of Unicode code points.
 */
export async function asCodePointsArray<T extends Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const arr: number[] = [];
  const utf8Decoder = new TextDecoder("utf-8");

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]()
    : Symbol.iterator in iterable
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
          const codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000);
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

  // Create an async iterator from the source (works for both async and sync iterables).
  const iterator = Symbol.asyncIterator in iterable
    ? iterable[Symbol.asyncIterator]()
    : Symbol.iterator in iterable
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
          const codePoint = ((first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000);
          cb(codePoint);
          i++; // Skip the next code unit (part of the surrogate pair)
        } else {
          // Unmatched high surrogate, treat it as an individual code point
          cb(first);
        }
      } else {
        // Regular code point (not part of a surrogate pair)
        cb(first);
      }
      ++i; // Use the ++i increment operator
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

export default asCodePointsIterator;

export * from "./iterable.ts"; 
export * from "./byte_methods.ts";
export * from "./constants.ts";