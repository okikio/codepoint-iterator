import { asCodePointsBench, TextDecoderBench } from "./utils.ts";
import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";

const TextDecoderResults: number[] = await TextDecoderBench();
const asCodePointsResults: number[] = await asCodePointsBench(); 

Deno.test("test", () => {
  console.log(TextDecoderResults, asCodePointsResults)
  assertEquals(TextDecoderResults, asCodePointsResults);
});