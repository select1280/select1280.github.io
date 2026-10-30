import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { journalPreview } from '../scripts/journal-preview.mjs';

const source=await fs.readFile(new URL('../src/pages/journal.html',import.meta.url),'utf8');
const preview=journalPreview(source);
assert.equal([...preview.matchAll(/class="log-preview"/g)].length,3);
assert.ok(preview.includes('journal.html#toolbox'));
for(const [,id] of preview.matchAll(/href="journal.html#([^"]+)"/g))assert.ok(source.includes(`id="${id}"`));
assert.ok(journalPreview(source.replace('讓工具箱解決一些日常小事','重新整理工具箱')).includes('重新整理工具箱'));
console.log('通過：首頁三篇日誌預覽、連結目標與內容同步。');
