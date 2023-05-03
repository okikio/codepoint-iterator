import { asCodePointsIteratorBench, TextDecoderIteratorBench, TextDecoderCallbackBench, TextDecoderCallbackBench2, TextDecoderCallbackBench3, asCodePointsCallbackBench, TextDecoderArrayBench, TextDecoderArrayBench2, asCodePointsArrayBench } from "./_utils.ts";

Deno.bench("asCodePoints Array benchmark", async () => {
  await asCodePointsArrayBench();
});

Deno.bench("TextDecoder Array benchmark", async () => {
  await TextDecoderArrayBench();
});

Deno.bench("TextDecoder Array 2 benchmark", async () => {
  await TextDecoderArrayBench2();
});

Deno.bench("asCodePoints Iterator benchmark", async () => {
  await asCodePointsIteratorBench();
});

Deno.bench("TextDecoder Iterator benchmark", async () => {
  await TextDecoderIteratorBench();
});

Deno.bench("asCodePoints Callback benchmark", async () => {
  const array = [];
  await asCodePointsCallbackBench((codePoint) => {
    array.push(codePoint);
  });
});

Deno.bench("TextDecoder Callback benchmark", async () => {
  const array = []
  await TextDecoderCallbackBench((codePoint) => {
    array.push(codePoint);
  });
});

Deno.bench("TextDecoder Callback 2 benchmark", async () => {
  const array = []
  await TextDecoderCallbackBench2((codePoint) => {
    array.push(codePoint);
  });
});

// Deno.bench("TextDecoder Callback 3 benchmark", async () => {
//   const array = []
//   await TextDecoderCallbackBench3((codePoint) => {
//     array.push(codePoint);
//   });
// });