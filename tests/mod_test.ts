import { assertEquals } from "https://deno.land/std@0.115.0/testing/asserts.ts";
import { asCodePoints, bytesToCodePoint, getByteLength } from "../mod.ts";

Deno.test("getByteLength - returns the number of bytes required to represent a utf-8 character", () => {
  assertEquals(getByteLength(0x61), 1);
  assertEquals(getByteLength(0xC3), 2);
  assertEquals(getByteLength(0xE0), 3);
  assertEquals(getByteLength(0xF0), 4);
});

Deno.test("bytesToCodePoint - calculates code point from utf-8 bytes", () => {
  assertEquals(bytesToCodePoint(1, [0x61]), 0x61);
  assertEquals(bytesToCodePoint(2, [0xC3, 0xA9]), 0xE9);
  assertEquals(bytesToCodePoint(3, [0xE0, 0xA4, 0xB9]), 0x939);
  assertEquals(bytesToCodePoint(4, [0xF0, 0x9F, 0x98, 0x82]), 0x1F602);
});

Deno.test("asCodePoints - converts utf-8 filled Uint8Array's into code points", async () => {
  const iterable = (async function* () {
    yield new Uint8Array([0x61, 0xC3, 0xA9, 0xE0, 0xA4, 0xB9, 0xF0, 0x9F, 0x98, 0x82]);
  })();

  const result: number[] = [];
  for await (const codePoint of asCodePoints(iterable)) {
    result.push(codePoint);
  }

  assertEquals(result, [0x61, 0xE9, 0x939, 0x1F602]);
});
