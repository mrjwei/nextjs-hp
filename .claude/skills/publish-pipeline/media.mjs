// Shrink media the pipeline has just copied into public/, before it is committed.
// Every deployment stores its own copy of public/, so every byte here is kept once
// per retained deployment. Run it only on the repo copies: the vault originals are
// never touched.
//
//   images (.png .jpg .jpeg .webp, static .gif): auto-rotated, capped at MAX_WIDTH px
//     wide, recompressed in place under the same file name. A PNG is palette-quantized
//     (libimagequant, dithered) only when that saves 30%+, else losslessly recompressed.
//     A file that doesn't get smaller is left as it was.
//   animated .gif and other video (.mp4 .mov .m4v): converted to VP9 .webm (same base
//     name, capped at MAX_WIDTH px wide), and the original is deleted.
//   .webm, .svg and anything else: left as they are.
//
// Prints one TSV line per file: <input>  <output>  <KB before>  <KB after>.
// When <output> differs from <input> (a GIF that became .webm), the post uses <output>,
// written with the video markup in stages/publish.md step 3.
//
// Needs sharp (a devDependency: run `npm install` once) and ffmpeg (for video).
// Usage: node .claude/skills/publish-pipeline/media.mjs public/<folder>/<file>...
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const MAX_WIDTH = 2000;
const IMAGE = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const VIDEO = new Set([".gif", ".mp4", ".mov", ".m4v"]);

const kb = (bytes) => Math.round(bytes / 1024);

async function shrinkImage(file, ext) {
  const input = fs.readFileSync(file);
  const meta = await sharp(input).metadata();
  const resize = meta.autoOrient?.width ?? meta.width;
  const base = () => {
    // rotate() bakes in the EXIF orientation, since metadata is stripped on output.
    let img = sharp(input).rotate();
    if (resize > MAX_WIDTH) img = img.resize({ width: MAX_WIDTH, kernel: "lanczos3" });
    return img;
  };

  let output;
  if (ext === ".png") {
    const lossless = await base().png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer();
    const palette = await base().png({ palette: true, quality: 90, effort: 10, dither: 1.0, compressionLevel: 9 }).toBuffer();
    output = palette.length < 0.7 * lossless.length ? palette : lossless;
  } else if (ext === ".jpg" || ext === ".jpeg") {
    output = await base().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else if (ext === ".webp") {
    output = await base().webp({ quality: 82, effort: 6 }).toBuffer();
  } else {
    output = await base().gif({ effort: 10 }).toBuffer();
  }

  if (output.length < input.length) fs.writeFileSync(file, output);
  return { out: file, before: input.length, after: Math.min(output.length, input.length) };
}

function toWebm(file) {
  const out = path.join(path.dirname(file), `${path.basename(file, path.extname(file))}.webm`);
  const before = fs.statSync(file).size;
  execFileSync(
    "ffmpeg",
    [
      "-v", "error", "-y", "-i", file,
      // Even dimensions (yuv420p needs them), at most MAX_WIDTH wide.
      "-vf", `scale='trunc(min(${MAX_WIDTH},iw)/2)*2':-2:flags=lanczos`,
      "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1",
      "-pix_fmt", "yuv420p", "-an", out,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  fs.rmSync(file);
  return { out, before, after: fs.statSync(out).size };
}

let failed = false;
for (const file of process.argv.slice(2)) {
  const ext = path.extname(file).toLowerCase();
  try {
    let result;
    if (ext === ".gif") {
      const { pages = 1 } = await sharp(file, { animated: true, limitInputPixels: false }).metadata();
      result = pages > 1 ? toWebm(file) : await shrinkImage(file, ext);
    } else if (VIDEO.has(ext)) {
      result = toWebm(file);
    } else if (IMAGE.has(ext)) {
      result = await shrinkImage(file, ext);
    } else {
      const size = fs.statSync(file).size;
      result = { out: file, before: size, after: size };
    }
    console.log([file, result.out, kb(result.before), kb(result.after)].join("\t"));
  } catch (err) {
    failed = true;
    console.error(`media.mjs: ${file}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
