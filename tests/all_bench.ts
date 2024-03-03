import {
  asCodePointsBufferWindowArrayRunner,
  asCodePointsBufferWindowCallbackRunner,
  asCodePointsBufferWindowIteratorRunner,

  ForAsCodePointsBufferWindowArrayRunner,
  ForAsCodePointsBufferWindowCallbackRunner,
  ForAsCodePointsBufferWindowIteratorRunner,
  ForTextDecoderArrayRunner,
  ForTextDecoderCallbackRunner,
  ForTextDecoderComplexArrayRunner,
  ForTextDecoderComplexCallbackRunner,
  ForTextDecoderComplexIteratorRunner,
  ForTextDecoderCustomCodePointAtArrayRunner,
  ForTextDecoderCustomCodePointAtCallbackRunner,
  ForTextDecoderCustomCodePointAtIteratorRunner,
  ForTextDecoderIteratorRunner,

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
Deno.bench("ForTextDecoderArrayRunner", { group: "array" }, async () => {
  await ForTextDecoderArrayRunner()
})
Deno.bench("textDecoderCustomCodePointAtArrayRunner", { group: "array" }, async () => {
  await textDecoderCustomCodePointAtArrayRunner()
})
Deno.bench("ForTextDecoderCustomCodePointAtArrayRunner", { group: "array" }, async () => {
  await ForTextDecoderCustomCodePointAtArrayRunner()
})
Deno.bench("textDecoderComplexArrayRunner", { group: "array" }, async () => {
  await textDecoderComplexArrayRunner()
})
Deno.bench("ForTextDecoderComplexArrayRunner", { group: "array" }, async () => {
  await ForTextDecoderComplexArrayRunner()
})
Deno.bench("asCodePointsBufferWindowArrayRunner", { group: "array" }, async () => {
  await asCodePointsBufferWindowArrayRunner()
})
Deno.bench("ForAsCodePointsBufferWindowArrayRunner", { group: "array" }, async () => {
  await ForAsCodePointsBufferWindowArrayRunner()
})


Deno.bench("textDecoderIteratorRunner", { group: "iterator" }, async () => {
  await textDecoderIteratorRunner()
})
Deno.bench("ForTextDecoderIteratorRunner", { group: "iterator" }, async () => {
  await ForTextDecoderIteratorRunner()
})
Deno.bench("textDecoderComplexIteratorRunner", { group: "iterator" }, async () => {
  await textDecoderComplexIteratorRunner()
})
Deno.bench("ForTextDecoderComplexIteratorRunner", { group: "iterator" }, async () => {
  await ForTextDecoderComplexIteratorRunner()
})
Deno.bench("textDecoderCustomCodePointAtIteratorRunner", { group: "iterator" }, async () => {
  await textDecoderCustomCodePointAtIteratorRunner()
})
Deno.bench("ForTextDecoderCustomCodePointAtIteratorRunner", { group: "iterator" }, async () => {
  await ForTextDecoderCustomCodePointAtIteratorRunner()
})
Deno.bench("asCodePointsBufferWindowIteratorRunner", { group: "iterator" }, async () => {
  await asCodePointsBufferWindowIteratorRunner()
})
Deno.bench("ForAsCodePointsBufferWindowIteratorRunner", { group: "iterator" }, async () => {
  await ForAsCodePointsBufferWindowIteratorRunner()
})



Deno.bench("textDecoderCallbackRunner", { group: "callback" }, async () => {
  await textDecoderCallbackRunner()
})
Deno.bench("ForTextDecoderCallbackRunner", { group: "callback" }, async () => {
  await ForTextDecoderCallbackRunner()
})
Deno.bench("textDecoderComplexCallbackRunner", { group: "callback" }, async () => {
  await textDecoderComplexCallbackRunner()
})
Deno.bench("ForTextDecoderComplexCallbackRunner", { group: "callback" }, async () => {
  await ForTextDecoderComplexCallbackRunner()
})
Deno.bench("textDecoderCustomCodePointAtCallbackRunner", { group: "callback" }, async () => {
  await textDecoderCustomCodePointAtCallbackRunner()
})
Deno.bench("ForTextDecoderCustomCodePointAtCallbackRunner", { group: "callback" }, async () => {
  await ForTextDecoderCustomCodePointAtCallbackRunner()
})
Deno.bench("textDecoderCustomIteratorCallbackRunner", { group: "callback" }, async () => {
  await textDecoderCustomIteratorCallbackRunner()
})
Deno.bench("asCodePointsBufferWindowCallbackRunner", { group: "callback" }, async () => {
  await asCodePointsBufferWindowCallbackRunner()
})
Deno.bench("ForAsCodePointsBufferWindowCallbackRunner", { group: "callback" }, async () => {
  await ForAsCodePointsBufferWindowCallbackRunner()
})