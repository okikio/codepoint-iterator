// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.34.0/mod.ts";
import { basename, join, extname } from "https://deno.land/std@0.186.0/path/mod.ts";

async function* listFilesInDirectory(directoryPath: string) {
  try {
    for await (const dirEntry of Deno.readDir(directoryPath)) {
      if (dirEntry.isFile) {
        yield dirEntry.name;
      }
    }
  } catch (error) {
    console.error(`Error listing files in directory: ${error}`);
  }
}

async function renameFile(oldPath: string, newPath: string) {
  try {
    await Deno.rename(oldPath, newPath);
    console.log(`File successfully renamed from ${oldPath} to ${newPath}`);
  } catch (error) {
    console.error(`Error renaming file: ${error}`);
  }
}

async function copyFiles(sourceDir: string, destDir: string) {
  try {
    // Iterate over the files in the source directory
    for await (const name of listFilesInDirectory(sourceDir)) {
      // Construct the source and destination file paths
      const sourcePath = `${sourceDir}/${name}`;
      const destPath = `${destDir}/${name}`;

      // Copy the file from the source to the destination
      await Deno.copyFile(sourcePath, destPath);
      console.log(`Copied file: ${sourcePath} -> ${destPath}`);
    }
  } catch (error) {
    console.error(`Error copying files: ${error}`);
  }
}

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
    "unpkg": "./dist/mod.mjs",
    "module": "./dist/mod.mjs",
    "main": "./dist/mod.cjs",
    "types": "./dist/mod.d.ts",
    "browser": "./dist/mod.mjs",
    "directories": {
      "dist": "./dist",
      "src": "./src"
    },
    "files": [
      "dist",
      "src"
    ],
    "exports": {
      ".": {
        "import": {
          "types": "./dist/mod.d.ts",
          "default": "./dist/mod.mjs"
        },
        "require": {
          "types": "./dist/mod.d.ts",
          "default": "./dist/mod.cjs"
        },
        "default": {
          "types": "./dist/mod.d.ts",
          "default": "./dist/mod.mjs"
        },
      },
      "./src": "./src/*",
      "./package.json": "./package.json"
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

    const newDistDir = "./dist/dist";

    try {
      await Deno.mkdir(newDistDir, { recursive: true })
      console.log(`Created ${newDistDir}`)
    } catch (e) { /* empty */ }

    const oldEsmDir = "./dist/esm";
    const oldCjsDir = "./dist/script";
    const oldTypesDir = "./dist/types";

    for await (const name of listFilesInDirectory(oldEsmDir)) {
      const ext = extname(name)
      if (ext === ".js") {
        const oldPath = join(oldEsmDir, name)
        const newPath = join(newDistDir, basename(name, ext) + ".mjs")
        await renameFile(oldPath, newPath);
      }
    }

    for await (const name of listFilesInDirectory(oldCjsDir)) {
      const ext = extname(name)
      if (ext === ".js") {
        const oldPath = join(oldCjsDir, name)
        const newPath = join(newDistDir, basename(name, ext) + ".cjs")
        await renameFile(oldPath, newPath);
      }
    }

    await copyFiles(oldTypesDir, newDistDir)

    for await (const name of listFilesInDirectory(newDistDir)) {
      if (["mod.mjs", "mod.cjs", "mod.d.ts"].includes(name)) {
        const ext = name.replace("mod", "");

        const srcPath = join(newDistDir, name);
        const destPath = join(newDistDir, "index" + ext);
        await Deno.copyFile(
          srcPath,
          destPath
        )
        console.log(`Copied file: ${srcPath} -> ${destPath}`);
      }
    }

    try {
      const dirs = [oldEsmDir, oldCjsDir, oldTypesDir]
      await Promise.allSettled(
        dirs.map(x => Deno.remove(x, { recursive: true }))
      )

      for (const x of dirs) {
        console.log(`Deleted file: ${x}`);
      }
    } catch (e) { /* empty */ }
  },
});