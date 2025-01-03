const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outfile: "./dist/bundle.js",
    platform: "node", // Target Node.js
    external: ["net", "path"], // Exclude Node.js built-ins
  })
  .catch(() => process.exit(1));
