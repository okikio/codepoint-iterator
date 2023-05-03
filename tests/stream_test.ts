import { asCodePointsIteratorBench, TextDecoderIteratorBench, TextDecoderCallbackBench, TextDecoderCallbackBench2, TextDecoderCallbackBench3, asCodePointsCallbackBench, TextDecoderArrayBench, TextDecoderArrayBench2, asCodePointsArrayBench } from "./_utils.ts";
import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";

// Deno.test("Stress test high throughput streams", async () => {
//   const TextDecoderResults: number[] = await TextDecoderIteratorBench();
//   const asCodePointsResults: number[] = await asCodePointsIteratorBench();
//   const asCodePointsResults2: number[] = await asCodePointsArrayBench(); 

//   console.log(TextDecoderResults, asCodePointsResults)
//   assertEquals(TextDecoderResults, asCodePointsResults);
//   assertEquals(asCodePointsResults, asCodePointsResults2);
// });

Deno.test("TextDecoder Callback 3 benchmark", async () => {
  const TextDecoderResults: number[] = await TextDecoderIteratorBench();
  const array: number[] = []

  await TextDecoderCallbackBench2((codePoint) => {
    array.push(codePoint);
  });
  console.log(TextDecoderResults, array)
  assertEquals(TextDecoderResults, array);
});

// Deno.bench("asCodePoints Array benchmark", async () => {
//   await asCodePointsArrayBench();
// });

// Deno.bench("TextDecoder Array benchmark", async () => {
//   await TextDecoderArrayBench();
// });

// Deno.bench("TextDecoder Array 2 benchmark", async () => {
//   await TextDecoderArrayBench2();
// });

// Deno.bench("asCodePoints Iterator benchmark", async () => {
//   await asCodePointsIteratorBench();
// });

// Deno.bench("TextDecoder Iterator benchmark", async () => {
//   await TextDecoderIteratorBench();
// });

// Deno.bench("asCodePoints Callback benchmark", async () => {
//   const array = [];
//   await asCodePointsCallbackBench((codePoint) => {
//     array.push(codePoint);
//   });
// });

// Deno.bench("TextDecoder Callback benchmark", async () => {
//   const array = []
//   await TextDecoderCallbackBench((codePoint) => {
//     array.push(codePoint);
//   });
// });

// Deno.bench("TextDecoder Callback 2 benchmark", async () => {
//   const array = []
//   await TextDecoderCallbackBench2((codePoint) => {
//     array.push(codePoint);
//   });
// });