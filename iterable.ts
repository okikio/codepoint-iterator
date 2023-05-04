/**
 * Converts ReadableStream into async iterable
 * 
 * Ideally this would already be built into ReadableStream, 
 * but it's currently not so this should help tide over til
 * js runtimes support async iterables for ReadableStreams.
 * 
 * @param stream ReadableStream to convert into async iterable
 */
export async function* getIterableStream<T = Uint8Array>(stream: ReadableStream<T>) {
  const reader = stream.getReader();
  let done: boolean;
  let value: T | undefined;
  try {
    while ({ done, value } = await reader.read(), !done) {
      yield value!;
    }
  } finally {
    reader.releaseLock();
  }
}