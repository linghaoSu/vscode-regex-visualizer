// Parallel set in TypeScript — same patterns, typed bindings.

const plain: RegExp = /foo/;
const caseInsensitive: RegExp = /hello/i;

const hexColor: RegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const slug: RegExp = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseTag(input: string): { tag: string; attrs: string } | null {
  const tag = /<([a-z][\w-]*)(\s[^>]*)?>/i;
  const m = input.match(tag);
  return m ? { tag: m[1], attrs: (m[2] ?? '').trim() } : null;
}

const templateLiteralInside = `pattern: ${/abc/.source}`;

const arrowArgs = (s: string) => s.replace(/\s+/g, ' ').trim();

export { arrowArgs, parseTag };
