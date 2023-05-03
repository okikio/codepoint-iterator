import { asCodePoints } from "../mod.ts";

Deno.bench("asCodePoints - benchmark", () => {
  const iterable = (async function* () {
    yield new Uint8Array([0x61, 0xC3, 0xA9, 0xE0, 0xA4, 0xB9, 0xF0, 0x9F, 0x98, 0x82]);
  })();
  const result: number[] = [];
  (async () => {
    for await (const codePoint of asCodePoints(iterable)) {
      result.push(codePoint);
    }
  })();
});