// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./dist");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./dist",
  shims: {
    // see JS docs for overview and more options
    deno: false,
  },
  typeCheck: true,
  test: false,
  packageManager: "pnpm",
  package: {
    // package.json properties
    "name": "utf8-uint8array",
    "type": "module",
    "sideEffects": false,
    "version": Deno.args[0],
    "description": "Fast uint8array to utf-8 codepoint iterator for streams and array buffers by @okikio & @jonathantneal",
    "license": "MIT",
    "repository": {
      "type": "git",
      "url": "https://github.com/okikio/utf8-uint8array.git"
    },
    "engines": {
      "node": ">=18"
    },
    "keywords": [
      "utf8",
      "uint8array",
      "streams",
      "iterable-streams",
      "codepoints",
      "tokenizer",
      "streams"
    ],
    "author": {
      "name": "Okiki Ojo",
      "email": "hey@okikio.dev",
      "url": "https://okikio.dev"
    },
    "bugs": {
      "url": "https://github.com/okikio/utf8-uint8array/issues"
    },
    "homepage": "https://github.com/okikio/utf8-uint8array"
  },
  compilerOptions: {
    lib: ["dom", "dom.iterable", "es2022"]
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");
  },
});