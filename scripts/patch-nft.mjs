import fs from "node:fs";
import path from "node:path";

// 1. Patch nf3 trace.mjs if present
const nf3TracePath = path.resolve(process.cwd(), "node_modules/nf3/dist/_chunks/trace.mjs");
if (fs.existsSync(nf3TracePath)) {
  try {
    let content = fs.readFileSync(nf3TracePath, "utf-8");
    if (content.includes('import { nodeFileTrace } from "@vercel/nft";')) {
      content = content.replace(
        'import { nodeFileTrace } from "@vercel/nft";',
        'import * as _nftModule from "@vercel/nft"; const nodeFileTrace = _nftModule.nodeFileTrace || _nftModule.default?.nodeFileTrace || _nftModule.default || _nftModule;'
      );
      fs.writeFileSync(nf3TracePath, content, "utf-8");
      console.log("✔ Patched nf3/dist/_chunks/trace.mjs for ESM/CommonJS compatibility");
    }
  } catch (err) {
    console.warn("Notice: could not patch nf3:", err.message);
  }
}

// 2. Patch @vercel/nft out/index.js if present
const nftIndexPath = path.resolve(process.cwd(), "node_modules/@vercel/nft/out/index.js");
if (fs.existsSync(nftIndexPath)) {
  try {
    let content = fs.readFileSync(nftIndexPath, "utf-8");
    if (!content.includes("module.exports.nodeFileTrace =")) {
      content += '\nif (typeof node_file_trace_1 !== "undefined") { exports.nodeFileTrace = node_file_trace_1.nodeFileTrace; module.exports.nodeFileTrace = node_file_trace_1.nodeFileTrace; }\n';
      fs.writeFileSync(nftIndexPath, content, "utf-8");
      console.log("✔ Patched @vercel/nft/out/index.js for ESM named export compatibility");
    }
  } catch (err) {
    console.warn("Notice: could not patch @vercel/nft:", err.message);
  }
}
