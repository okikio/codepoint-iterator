import { assertEquals } from "https://deno.land/std@0.115.0/testing/asserts.ts";
import { getIterableStream } from "../iterable.ts";

Deno.test("getIterableStream - converts ReadableStream into async iterable", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array([1, 2, 3]));
      controller.enqueue(new Uint8Array([4, 5, 6]));
      controller.close();
    },
  });

  const result: number[] = [];
  for await (const value of getIterableStream(stream)) {
    result.push(...value);
  }

  assertEquals(result, [1, 2, 3, 4, 5, 6]);
});
