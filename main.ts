// news-image-20261123 entry (Node 22, standard library only).
// The image is entry.png beside this file: a front page summing up the
// world's news of Monday 23 November 2026. The program copies it to
// /output/entry.png, byte for byte, so the judge sees exactly those bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = join(here, 'entry.png');
const dst = join(out, 'entry.png');

// The file is named entry.png but may hold JPEG bytes (the rules tell
// PNG and JPEG apart by their first bytes), so accept either magic: the
// 8-byte PNG signature or the 3-byte JPEG start-of-image marker.
const head = readFileSync(src).subarray(0, 8);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47
  && head[4] === 0x0d && head[5] === 0x0a && head[6] === 0x1a && head[7] === 0x0a;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) throw new Error('entry.png is neither PNG nor JPEG by its first bytes');

mkdirSync(out, { recursive: true });
copyFileSync(src, dst);

// Verify the copy is byte-identical in size, so the judge sees exactly
// the bytes this program was given.
const srcSize = statSync(src).size;
const dstSize = statSync(dst).size;
if (srcSize !== dstSize) throw new Error(`copy size mismatch: ${srcSize} vs ${dstSize}`);
console.log(`copied entry.png (${isPng ? 'PNG' : 'JPEG'}, ${srcSize} bytes) to ${dst}`);
