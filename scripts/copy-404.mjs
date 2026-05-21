import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const source = resolve(distDir, 'index.html');
const target = resolve(distDir, '404.html');

await copyFile(source, target);
console.log('Copied dist/index.html to dist/404.html');
