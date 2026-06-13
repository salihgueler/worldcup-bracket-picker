import { createRequire } from "node:module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `aws-blocks/client.js` (auto-generated) imports
// `@aws-blocks/bb-realtime/mock-middleware`, but that package is installed
// nested under `@aws-blocks/blocks` rather than hoisted to the top level, so
// Vite can't resolve it from the workspace-local client. Resolve the nested
// location dynamically (respects the package's exports map) and alias it.
const require = createRequire(import.meta.url);
const blocksEntry = require.resolve("@aws-blocks/blocks");
const marker = "@aws-blocks/blocks";
const blocksPkgDir = blocksEntry.slice(
  0,
  blocksEntry.indexOf(marker) + marker.length,
);
const realtimeMockMiddleware = require.resolve(
  "@aws-blocks/bb-realtime/mock-middleware",
  {
    paths: [blocksPkgDir],
  },
);
// The Agent BB persists conversation sessions via FileBucket, so the generated
// client also imports the file-bucket middleware. Same nesting problem — alias
// it to its resolved location under @aws-blocks/blocks.
const fileBucketMiddleware = require.resolve(
  "@aws-blocks/bb-file-bucket/middleware",
  {
    paths: [blocksPkgDir],
  },
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    conditions: ["browser"],
    alias: {
      "@aws-blocks/bb-realtime/mock-middleware": realtimeMockMiddleware,
      "@aws-blocks/bb-file-bucket/middleware": fileBucketMiddleware,
    },
  },
  build: {
    outDir: "dist",
  },
});
