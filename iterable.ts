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

/**
 * Converts ReadableStream into an async callback
 * 
 * Ideally this would already be built into ReadableStream, 
 * but it's currently not so this should help tide over til
 * js runtimes support async callbacks for ReadableStreams.
 * 
 * @param stream ReadableStream to convert into an async callback
 */
export function getCallbackStream<T = Uint8Array>(stream: ReadableStream<T>) {
  const reader = stream.getReader();
  let tuple: ReadableStreamDefaultReadResult<T>;
  return async function () {
    try {
      tuple = await reader.read();
      if (!tuple.done) return tuple;
    } finally {
      if (tuple.done) reader.releaseLock();
    }

    return { done: true } as ReadableStreamDefaultReadDoneResult;
  }
}