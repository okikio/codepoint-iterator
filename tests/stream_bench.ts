import { asCodePointsBench, asCodePointsBench2, TextDecoderBench } from "./_utils.ts";

Deno.bench("TextDecoder benchmark", async () => {
  await TextDecoderBench();
});

Deno.bench("asCodePoints benchmark", async () => {
  await asCodePointsBench();
});

Deno.bench("asCodePoints2 benchmark", async () => {
  await asCodePointsBench2();
});

