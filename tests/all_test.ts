import {
  asCodePointsBufferWindowArrayRunner,
  asCodePointsBufferWindowCallbackRunner,
  asCodePointsBufferWindowIteratorRunner,
  textDecoderArrayRunner,
  textDecoderCallbackRunner,
  textDecoderComplexArrayRunner,
  textDecoderComplexCallbackRunner,
  textDecoderComplexIteratorRunner,
  textDecoderCustomCodePointAtArrayRunner,
  textDecoderCustomCodePointAtCallbackRunner,
  textDecoderCustomCodePointAtIteratorRunner,
  textDecoderCustomIteratorCallbackRunner,
  textDecoderIteratorRunner,
} from "./_runners.ts";

import { assertEquals } from "https://deno.land/std@0.208.0/testing/asserts.ts";

const BaselineResults: number[] = await textDecoderIteratorRunner();
Deno.test("textDecoderArrayRunner", async () => {
  assertEquals(BaselineResults, await textDecoderArrayRunner())
})
Deno.test("textDecoderCustomCodePointAtArrayRunner", async () => {
  assertEquals(BaselineResults, await textDecoderCustomCodePointAtArrayRunner())
})
Deno.test("textDecoderComplexArrayRunner", async () => {
  assertEquals(BaselineResults, await textDecoderComplexArrayRunner())
})
Deno.test("asCodePointsBufferWindowArrayRunner", async () => {
  assertEquals(BaselineResults, await asCodePointsBufferWindowArrayRunner())
})



Deno.test("textDecoderIteratorRunner", async () => {
  assertEquals(BaselineResults, await textDecoderIteratorRunner())
})
Deno.test("textDecoderComplexIteratorRunner", async () => {
  assertEquals(BaselineResults, await textDecoderComplexIteratorRunner())
})
Deno.test("textDecoderCustomCodePointAtIteratorRunner", async () => {
  assertEquals(BaselineResults, await textDecoderCustomCodePointAtIteratorRunner())
})
Deno.test("asCodePointsBufferWindowIteratorRunner", async () => {
  assertEquals(BaselineResults, await asCodePointsBufferWindowIteratorRunner())
})



Deno.test("textDecoderCallbackRunner", async () => {
  assertEquals(BaselineResults, await textDecoderCallbackRunner())
})
Deno.test("textDecoderComplexCallbackRunner", async () => {
  assertEquals(BaselineResults, await textDecoderComplexCallbackRunner())
})
Deno.test("textDecoderCustomCodePointAtCallbackRunner", async () => {
  assertEquals(BaselineResults, await textDecoderCustomCodePointAtCallbackRunner())
})
Deno.test("textDecoderCustomIteratorCallbackRunner", async () => {
  assertEquals(BaselineResults, await textDecoderCustomIteratorCallbackRunner())
})
Deno.test("asCodePointsBufferWindowCallbackRunner", async () => {
  assertEquals(BaselineResults, await asCodePointsBufferWindowCallbackRunner())
})