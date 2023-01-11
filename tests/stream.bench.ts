import { asCodePointsBench, TextDecoderBench } from "./utils.ts";

Deno.bench("asCodePoints result", async () => {
  await asCodePointsBench();
});

Deno.bench("TextDecoder result", async () => { 
  await TextDecoderBench();
});


console.log("Cool") // hello

