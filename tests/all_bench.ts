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

Deno.bench("textDecoderArrayRunner", { group: "array" }, async () => {
  await textDecoderArrayRunner()
})
Deno.bench("textDecoderCustomCodePointAtArrayRunner", { group: "array" }, async () => {
  await textDecoderCustomCodePointAtArrayRunner()
})
Deno.bench("textDecoderComplexArrayRunner", { group: "array" }, async () => {
  await textDecoderComplexArrayRunner()
})
Deno.bench("asCodePointsBufferWindowArrayRunner", { group: "array" }, async () => {
  await asCodePointsBufferWindowArrayRunner()
})


Deno.bench("textDecoderIteratorRunner", { group: "iterator" }, async () => {
  await textDecoderIteratorRunner()
})
Deno.bench("textDecoderComplexIteratorRunner", { group: "iterator" }, async () => {
  await textDecoderComplexIteratorRunner()
})
Deno.bench("textDecoderCustomCodePointAtIteratorRunner", { group: "iterator" }, async () => {
  await textDecoderCustomCodePointAtIteratorRunner()
})
Deno.bench("asCodePointsBufferWindowIteratorRunner", { group: "iterator" }, async () => {
  await asCodePointsBufferWindowIteratorRunner()
})


Deno.bench("textDecoderCallbackRunner", { group: "callback" }, async () => {
  await textDecoderCallbackRunner()
})
Deno.bench("textDecoderComplexCallbackRunner", { group: "callback" }, async () => {
  await textDecoderComplexCallbackRunner()
})
Deno.bench("textDecoderCustomCodePointAtCallbackRunner", { group: "callback" }, async () => {
  await textDecoderCustomCodePointAtCallbackRunner()
})
Deno.bench("textDecoderCustomIteratorCallbackRunner", { group: "callback" }, async () => {
  await textDecoderCustomIteratorCallbackRunner()
})
Deno.bench("asCodePointsBufferWindowCallbackRunner", { group: "callback" }, async () => {
  await asCodePointsBufferWindowCallbackRunner()
})