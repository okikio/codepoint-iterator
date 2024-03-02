/**
 * @module
 * Provides extensions for `ReadableStream` to enhance its usability in JavaScript environments.
 * This module includes a function to convert a `ReadableStream` into an asynchronous iterable,
 * allowing for easier consumption of streamed data in a more modern and convenient syntax.
 * 
 * This is particularly useful in environments or scenarios where `ReadableStream` does not natively support async iteration.
 * 
 * @example
 * ```ts
 * // Assuming you have a function that returns a ReadableStream, e.g., fetching some data
 * async function fetchDataAsStream() {
 *   const response = await fetch('https://example.com/data');
 *   return response.body; // This is a ReadableStream
 * }
 * 
 * // Utilize `getIterableStream` to consume the ReadableStream as an async iterable
 * async function processStreamData() {
 *   const stream = await fetchDataAsStream();
 *   for await (const chunk of getIterableStream(stream)) {
 *     console.log(chunk); // Process each chunk of data as it's read from the stream
 *   }
 * }
 * 
 * processStreamData();
 * ```
 * Consuming a `ReadableStream` of data (e.g., from a network response) using the `getIterableStream` function,
 * enabling the use of an async for-loop to process the data in chunks as it's received.
 */

/**
 * Converts a `ReadableStream` into an async iterable. This allows for easier consumption
 * of stream data using asynchronous iteration, providing a more modern approach to handling streamed data.
 * 
 * Ideally this would already be built into ReadableStream, 
 * but it's currently not so this should help tide over til
 * js runtimes support async iterables for ReadableStreams.
 * 
 * @param stream The `ReadableStream` to be converted into an async iterable. This stream can contain any type of data, typically `Uint8Array` for binary data.
 * @returns An `AsyncIterable` that yields data chunks from the `ReadableStream` as they are read.
 * @template T The type of data chunks contained within the `ReadableStream`, defaulting to `Uint8Array`.
 * 
 * @example
 * ```ts
 * const responseStream = fetch('https://example.com/data').then(res => res.body);
 * for await (const chunk of getIterableStream(await responseStream)) {
 *   console.log(new TextDecoder().decode(chunk)); // Assuming the stream is text data
 * }
 * ```
 * Converting a `ReadableStream` from a fetch request into an async iterable,
 * and then asynchronously iterating over each chunk of data, decoding and logging the text content.
 */
export async function* getIterableStream<T = Uint8Array>(stream: ReadableStream<T>): AsyncIterable<T> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export { getIterableStream as getIterableFromStream }