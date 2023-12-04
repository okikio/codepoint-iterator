import { assertEquals } from "https://deno.land/std@0.208.0/testing/asserts.ts";
import { asCodePointsIterator, asCodePointsCallback } from "../mod.ts";

Deno.test("asCodePoints Iterator - converts utf-8 filled Uint8Array's into code points", async () => {
  const iterable = (async function* () {
    yield new Uint8Array([0x61, 0xC3, 0xA9, 0xE0, 0xA4, 0xB9, 0xF0, 0x9F, 0x98, 0x82]);
  })();

  const result: number[] = [];
  for await (const codePoint of asCodePointsIterator(iterable)) {
    result.push(codePoint);
  }

  assertEquals(result, [0x61, 0xE9, 0x939, 0x1F602]);
});


Deno.test("asCodePoints Callback - converts utf-8 filled Uint8Array's into code points", async () => {
  const iterable = (async function* () {
    yield new Uint8Array([0x61, 0xC3, 0xA9, 0xE0, 0xA4, 0xB9, 0xF0, 0x9F, 0x98, 0x82]);
  })();

  const result: number[] = [];
  await asCodePointsCallback(iterable, (codePoint) => {
    result.push(codePoint);
  })

  assertEquals(result, [0x61, 0xE9, 0x939, 0x1F602]);
});