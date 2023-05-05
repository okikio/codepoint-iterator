import { getIterableStream } from "../iterable.ts";
import { getCallbackStream } from "./_callbacks.ts";
import { asCodePointsBufferWindowArray, textDecoderArray, textDecoderComplexArray, textDecoderCustomCodePointAtArray } from "./_arrays.ts";
import { asCodePointsBufferWindowCallback, textDecoderCallback, textDecoderComplexCallback, textDecoderCustomCodePointAtCallback, textDecoderCustomIteratorCallback } from "./_callbacks.ts";
import { asCodePointsBufferWindowIterator, textDecoderComplexIterator, textDecoderCustomCodePointAtIterator, textDecoderIterator } from "./_iterators.ts";

export function createResponse(textLen = 100_000, sliceLen = 5_000) {
  return new Response(
    new ReadableStream({
      start(controller) {
        const txt = `:root { --px: 100px } .c\\\u{1F914} { width: var(--px); color: red; } /* \u{1F914}\u{1F914}\u{1F914} .pta-\\\u{1F914} { color: blue; } */`;
        const buffer = new TextEncoder().encode(
          txt.repeat(textLen)
        ); 
        
        const len = buffer.length - sliceLen;
        for (let i = sliceLen; i < len; i += sliceLen) {
          controller.enqueue(buffer.slice(i - sliceLen, i));
        }
        controller.enqueue(buffer.slice(len));
        controller.close();
      }
    })
  );
}

/**
 * Arrays
 */
export async function textDecoderArrayRunner() {
  const response = createResponse();
  return await textDecoderArray(
    getIterableStream(response.body!)
  );
}
export async function textDecoderCustomCodePointAtArrayRunner() {
  const response = createResponse();
  return await textDecoderCustomCodePointAtArray(
    getIterableStream(response.body!)
  );
}
export async function textDecoderComplexArrayRunner() {
  const response = createResponse();
  return await textDecoderComplexArray(
    getIterableStream(response.body!)
  );
}
export async function asCodePointsBufferWindowArrayRunner() {
  const response = createResponse();
  return await asCodePointsBufferWindowArray(
    getIterableStream(response.body!)
  );
}

/**
 * Iterators
 */
export async function textDecoderIteratorRunner() {
  const response = createResponse();
  const arr: number[] = [];
  for await (const codePoint of textDecoderIterator(
    getIterableStream(response.body!)
  )) {
    arr.push(codePoint)
  }
  return arr;
}
export async function textDecoderComplexIteratorRunner() {
  const response = createResponse();
  const arr: number[] = [];
  for await (const codePoint of textDecoderComplexIterator(
    getIterableStream(response.body!)
  )) {
    arr.push(codePoint)
  }
  return arr;
}
export async function textDecoderCustomCodePointAtIteratorRunner() {
  const response = createResponse();
  const arr: number[] = [];
  for await (const codePoint of textDecoderCustomCodePointAtIterator(
    getIterableStream(response.body!)
  )) {
    arr.push(codePoint)
  }
  return arr;
}
export async function asCodePointsBufferWindowIteratorRunner() {
  const response = createResponse();
  const arr: number[] = [];
  for await (const codePoint of asCodePointsBufferWindowIterator(
    getIterableStream(response.body!)
  )) {
    arr.push(codePoint)
  }
  return arr;
}

/**
 * Callbacks
 */
export async function textDecoderCallbackRunner() {
  const response = createResponse();
  const arr: number[] = [];
  await textDecoderCallback(
    getIterableStream(response.body!),
    (codePoint) => arr.push(codePoint)
  )
  return arr;
}
export async function textDecoderComplexCallbackRunner() {
  const response = createResponse();
  const arr: number[] = [];
  await textDecoderComplexCallback(
    getIterableStream(response.body!),
    (codePoint) => arr.push(codePoint)
  )
  return arr;
}
export async function textDecoderCustomCodePointAtCallbackRunner() {
  const response = createResponse();
  const arr: number[] = [];
  await textDecoderCustomCodePointAtCallback(
    getIterableStream(response.body!),
    (codePoint) => arr.push(codePoint)
  )
  return arr;
}
export async function textDecoderCustomIteratorCallbackRunner() {
  const response = createResponse();
  const arr: number[] = [];
  const next = getCallbackStream(response.body!)
  await textDecoderCustomIteratorCallback(
    next,
    (codePoint) => arr.push(codePoint)
  )
  return arr;
}
export async function asCodePointsBufferWindowCallbackRunner() {
  const response = createResponse();
  const arr: number[] = [];
  await asCodePointsBufferWindowCallback(
    getIterableStream(response.body!), 
    (codePoint) => arr.push(codePoint)
  )
  return arr;
}