import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { renderRegexSvg } from '../src/regex-renderer';

function decodeDataUrl(url: string): string {
  const prefix = 'data:image/svg+xml;base64,';
  expect(url.startsWith(prefix)).toBe(true);
  return Buffer.from(url.slice(prefix.length), 'base64').toString('utf8');
}

describe('renderRegexSvg', () => {
  it('produces an svg with non-zero dimensions for a simple literal', async () => {
    const url = await renderRegexSvg('/foo/');
    const svg = decodeDataUrl(url);

    const width = Number((svg.match(/<svg[^>]*\swidth="(\d+(?:\.\d+)?)"/) ?? [])[1]);
    const height = Number((svg.match(/<svg[^>]*\sheight="(\d+(?:\.\d+)?)"/) ?? [])[1]);

    expect(width).toBeGreaterThan(20);
    expect(height).toBeGreaterThan(20);
  }, 15_000);

  it('produces an svg for a complex pattern', async () => {
    const url = await renderRegexSvg('/^(\\d{3})-(\\d{4})$/i');
    const svg = decodeDataUrl(url);

    const width = Number((svg.match(/<svg[^>]*\swidth="(\d+(?:\.\d+)?)"/) ?? [])[1]);
    expect(width).toBeGreaterThan(50);
  }, 15_000);
});
