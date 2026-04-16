import { baseHTMLContent, mockDocument } from './mock-dom';
// @ts-expect-error vendored regexper source has no types.
import Regexper from './regexp-visualizer/js/regexper.js';
import { svg64 } from './svg64';

const cache = new Map<string, string>();

// Regexper mutates a shared happy-dom instance, so concurrent renders would
// clobber each other. Serialize all work through this tail promise.
let tail: Promise<unknown> = Promise.resolve();

export async function renderRegexSvg(regexStr: string): Promise<string> {
  const cached = cache.get(regexStr);
  if (cached) {
    return cached;
  }

  const job = tail.then(() => renderUncached(regexStr));
  tail = job.catch(() => undefined);
  return job;
}

async function renderUncached(regexStr: string): Promise<string> {
  const cached = cache.get(regexStr);
  if (cached) {
    return cached;
  }

  mockDocument.body.innerHTML = baseHTMLContent;

  const regexper = new Regexper(mockDocument.body);
  await regexper.showExpression(regexStr);

  const svg = regexper.svgContainer.querySelector('svg');
  const metadata = svg.querySelector('metadata');
  if (metadata) {
    svg.removeChild(metadata);
  }

  const dataUrl = svg64(svg.outerHTML);
  cache.set(regexStr, dataUrl);
  return dataUrl;
}
