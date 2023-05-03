import { asCodePointsBench, TextDecoderBench } from "./_utils.ts";

Deno.bench("asCodePoints benchmark", async () => {
  await asCodePointsBench();
});

Deno.bench("TextDecoder benchmark", async () => { 
  await TextDecoderBench();
});

