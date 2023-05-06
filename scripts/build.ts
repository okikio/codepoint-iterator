// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.34.0/mod.ts";

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
  skipSourceOutput: false,
  packageManager: "pnpm",
  package: {
    // package.json properties
    "name": "codepoint-iterator",
    "type": "module",
    "sideEffects": false, 
    "access": "public",
    "version": Deno.args[0]?.replace(/^v/, "") ?? "0.0.0",
    "description": "Fast uint8array to utf-8 codepoint iterator for streams and array buffers by @okikio & @jonathantneal",
    "license": "MIT",
    "repository": {
      "type": "git",
      "url": "https://github.com/okikio/codepoint-iterator.git"
    },
    "unpkg": "./esm/mod.js",
    "browser": "./esm/mod.js",
    "directories": {
      "esm": "./esm",
      "script": "./script",
      "types": "./types",
      "src": "./src"
    },
    "files": [
      "esm",
      "script",
      "types",
      "src"
    ],
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
      "streams",
      "iterable-callback",
      "codepoint-array"
    ],
    "author": {
      "name": "Okiki Ojo",
      "email": "hey@okikio.dev",
      "url": "https://okikio.dev"
    },
    "bugs": {
      "url": "https://github.com/okikio/codepoint-iterator/issues"
    },
    "homepage": "https://github.com/okikio/codepoint-iterator",
  },
  compilerOptions: {
    lib: ["dom", "dom.iterable", "es2022"]
  },
  async postBuild() {
    // steps to run after building and before running the tests
    await Promise.all([
      Deno.copyFile("LICENSE", "dist/LICENSE"),
      Deno.copyFile("README.md", "dist/README.md"),
    ])
  },
});