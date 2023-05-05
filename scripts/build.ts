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
  packageManager: "pnpm",
  package: {
    // package.json properties
    "name": "codepoint-iterator",
    "type": "module",
    "sideEffects": false,
    "version": Deno.args[0]?.replace(/^v/, "") ?? "0.0.0",
    "description": "Fast uint8array to utf-8 codepoint iterator for streams and array buffers by @okikio & @jonathantneal",
    "license": "MIT",
    "repository": {
      "type": "git",
      "url": "https://github.com/okikio/codepoint-iterator.git"
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
      "url": "https://github.com/okikio/codepoint-iterator/issues"
    },
    "homepage": "https://github.com/okikio/codepoint-iterator",
    "devDependencies": {
      "@commitlint/cli": "^17.6.1",
      "@commitlint/config-conventional": "^17.6.1",
      "@semantic-release/changelog": "^6.0.3",
      "@semantic-release/commit-analyzer": "^9.0.2",
      "@semantic-release/git": "^10.0.1",
      "@semantic-release/github": "^8.0.7",
      "@semantic-release/release-notes-generator": "^11.0.1",
      "semantic-release": "^21.0.2"
    }
  },
  compilerOptions: {
    lib: ["dom", "dom.iterable", "es2022"]
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");
    Deno.copyFileSync(".releaserc.yml", "dist/.releaserc.yml");
    Deno.copyFileSync(".commitlintrc.yml", "dist/.commitlintrc.yml");
  },
});