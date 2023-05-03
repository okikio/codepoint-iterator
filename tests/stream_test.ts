import { asCodePointsBench, TextDecoderBench } from "./_utils.ts";
import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";

Deno.test("Stress test high throughput streams", async () => {
  const TextDecoderResults: number[] = await TextDecoderBench();
  const asCodePointsResults: number[] = await asCodePointsBench(); 

  console.log(TextDecoderResults, asCodePointsResults)
  assertEquals(TextDecoderResults, asCodePointsResults);
});