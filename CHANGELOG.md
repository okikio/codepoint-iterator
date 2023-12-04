## [1.1.0](https://github.com/okikio/codepoint-iterator/compare/v1.0.2...v1.1.0) (2023-12-4)


### Features

* export getIterableFromStream as alias for getIterableFromStream ([946f704](https://github.com/okikio/codepoint-iterator/commit/946f704974adab08c65e6b845fd3791901e774c6))


### Misc

* cleanup deno.lock file ([64277fe](https://github.com/okikio/codepoint-iterator/commit/64277fee0471eb8914d5cce52d7d6ac1393985c7))
* improve internal code docs ([a02643a](https://github.com/okikio/codepoint-iterator/commit/a02643abcf2c9763b71dc367f28d4b103a7dd5cf))
* improve the docs for codePointAt ([6c73b05](https://github.com/okikio/codepoint-iterator/commit/6c73b054ccdd92f59de62465a17eab8a21117fd0))
* switch out the benchmark results ([2a292a7](https://github.com/okikio/codepoint-iterator/commit/2a292a70de884edc5eae5b18c48bdd268a082092))
* update deps... ([88261b3](https://github.com/okikio/codepoint-iterator/commit/88261b3a1ef4fa1dc5999b11b524e43199156952))
* update package.json ([2fa5883](https://github.com/okikio/codepoint-iterator/commit/2fa5883b290fa4ba16a46cfe7f7ebb0719f347eb))
* update tests ([9b30650](https://github.com/okikio/codepoint-iterator/commit/9b30650171dd181170f57c12e901fcf63b4d8088))
* updated benchmark docs ([02b1fa0](https://github.com/okikio/codepoint-iterator/commit/02b1fa00f8e786a05413a41fe739b4adf9519940))
* use constants for bytesToCodePointFromBuffer ([d4c5ceb](https://github.com/okikio/codepoint-iterator/commit/d4c5cebf06b2fe59ab154d9151cf6ee89d5607da))


### Improvements

* improve perf of codePointAt ([f92a5c6](https://github.com/okikio/codepoint-iterator/commit/f92a5c6d2c6009e67eed98b14bc2c0eddada2af4))
* improve performance of getIterableStream ([2781888](https://github.com/okikio/codepoint-iterator/commit/2781888ef481bf8ba439560be5c2565643c20bae))
* use codePointAt instead of complex loop ([3138b46](https://github.com/okikio/codepoint-iterator/commit/3138b4678b96e2771918734c0831872961f6c863))


### Automation

* fix build script ([f0492ae](https://github.com/okikio/codepoint-iterator/commit/f0492ae6f2b230fcc0e1480afb1b9c6a295f66e6))
* upgrade devcontainer to v20 ([a12199c](https://github.com/okikio/codepoint-iterator/commit/a12199cf74fb4df611d89d3c9dff755802aa46e7))
* upgrade gh action workflow ([25423f8](https://github.com/okikio/codepoint-iterator/commit/25423f8bd890490e1d67fe1bd3a7db2f3ce7d081))

## [1.0.2](https://github.com/okikio/codepoint-iterator/compare/v1.0.1...v1.0.2) (2023-05-06)


### Bug Fixes

* renaming dnt's output files break imports ([f3d6201](https://github.com/okikio/codepoint-iterator/commit/f3d62019f9af132e3fffbd68b50217af1cad1cf1))

## [1.0.1](https://github.com/okikio/codepoint-iterator/compare/v1.0.0...v1.0.1) (2023-05-06)


### Improvements

* move all .d.ts, .mjs, .cjs into the same folder ([4373b73](https://github.com/okikio/codepoint-iterator/commit/4373b734d9872e50082d043a8754379b2892b684))


### Automation

* add manual trigger to test-and-benchmark.yml gh action ([2f9188d](https://github.com/okikio/codepoint-iterator/commit/2f9188d8b53f8535777f9a08375f955c9b71685a))
* fix test-and-benchmark ([ca61ff8](https://github.com/okikio/codepoint-iterator/commit/ca61ff8d87c92f6df11d254cc478444e928fe165))


### Misc

* add new examples ([550c2fd](https://github.com/okikio/codepoint-iterator/commit/550c2fda143f5e967d9d0f610b126736fb726cfe))
* add new examples + fix small issues in README ([2c19ff3](https://github.com/okikio/codepoint-iterator/commit/2c19ff3aa3f80a34d586a5b7f6befd048763b3d6))
* add new keywords to npm published package.json ([62edcc5](https://github.com/okikio/codepoint-iterator/commit/62edcc531c86dd1f210bd602f27b65575da8628f))
* move .gitpod.yml & .Dockerfile to root ([b2db216](https://github.com/okikio/codepoint-iterator/commit/b2db2160aafc76e71a2221c055b3eda9bc35b2ec))
* move .releaserc to root ([6450cde](https://github.com/okikio/codepoint-iterator/commit/6450cde3b69548528bc88229427f764b52999d57))
* move CHANGELOG.md to root ([919e00e](https://github.com/okikio/codepoint-iterator/commit/919e00e6f4763d86107a633d9ded001298fc9694))
* run semantic-release from root [skip ci] ([c40cda9](https://github.com/okikio/codepoint-iterator/commit/c40cda9c07e9cbc2709c8456a6e35a1aefa97483))
* run semantic-release from root [skip ci] ([17fabfc](https://github.com/okikio/codepoint-iterator/commit/17fabfc01f760650927d2b0fc22d356db3b580f9))

## 1.0.0 (2023-05-05)


### Features

* add asCodePoints ([fb87a75](https://github.com/okikio/codepoint-iterator/commit/fb87a75b0e273448d814b0e937a34c3d462260b7))
* add getIterableStream ([4eee4c7](https://github.com/okikio/codepoint-iterator/commit/4eee4c70b694c0f09883b262680536b41465a52b))
* add support for mod.ts for deno ([c078965](https://github.com/okikio/codepoint-iterator/commit/c078965139cace877caf9b66f531c4dc0e89583c))
* switch to using TextDecoder Iterators ([b23c219](https://github.com/okikio/codepoint-iterator/commit/b23c219f099790f8d7aa8dd694ac542da23b04b5))


### Bug Fixes

* fix missing `getCallbackStream` in `iterable.ts` file ([d1ff5a6](https://github.com/okikio/codepoint-iterator/commit/d1ff5a612ba75cec3c3331deea134dd7cacefc92))


### Improvements

* clean up the code ([9f096c7](https://github.com/okikio/codepoint-iterator/commit/9f096c77c77aee4d756d65baabaef7b117db99dd))
* faster codepoints ([895773c](https://github.com/okikio/codepoint-iterator/commit/895773cb7a194dee916225e76c769ce84185d379))
* move library to deno ([ad61893](https://github.com/okikio/codepoint-iterator/commit/ad61893d12d67ca5bcadf725949a93ae67ede53b))
* use deno ([c0711d7](https://github.com/okikio/codepoint-iterator/commit/c0711d7644054c12a19a6967026b4b003e0803c8))


### Misc

* ... ([a8d9ced](https://github.com/okikio/codepoint-iterator/commit/a8d9ced468dcc0bc5bc53a9ac6fd645834a19540))
* [skip ci] update deno.lock ([7a6dc28](https://github.com/okikio/codepoint-iterator/commit/7a6dc289d243eb50df69ed44bfa5c350b1cbec1e))
* add link to benchmark ([12b5d02](https://github.com/okikio/codepoint-iterator/commit/12b5d0227bbae7a448aea6ff1b1e686b61c36784))
* finalize examples ([01d05ea](https://github.com/okikio/codepoint-iterator/commit/01d05eac560e877ed19968d22075826677908184))
* finalize README ([ed6eaa9](https://github.com/okikio/codepoint-iterator/commit/ed6eaa9062a51970af0e9b43ff0afe08b1312c4d))
* get ready for publish ([505a210](https://github.com/okikio/codepoint-iterator/commit/505a21099669ae13ca891804334e3a1ed85c3199))
* prep for release ([33df1db](https://github.com/okikio/codepoint-iterator/commit/33df1db837ca44ca0757da88038e29874b97db27))
* run benchmarks ([39c3dbc](https://github.com/okikio/codepoint-iterator/commit/39c3dbcd44ca9956783d9fe8f7f6b63ff7a1de1d))
* WIP ([1fcaec7](https://github.com/okikio/codepoint-iterator/commit/1fcaec77e6f7cb8c9cbb1639725f115b01ef855b))
* WIP gitpod ([d55e1c9](https://github.com/okikio/codepoint-iterator/commit/d55e1c9ad9fd9562baa3703f4cbf80bad48b7afa))
* **WIP:** update the template README docs ([b63040f](https://github.com/okikio/codepoint-iterator/commit/b63040fcd6efbb5488f52bfe933095d49bd9d30e))


### Automation

* ... ([458a310](https://github.com/okikio/codepoint-iterator/commit/458a3104ae47fa50387e1a3448a5325bb43b2f5b))
* rename test.yml [skip ci] ([28883a0](https://github.com/okikio/codepoint-iterator/commit/28883a09d1d3eac75813f36a97020ca4c587c831))
