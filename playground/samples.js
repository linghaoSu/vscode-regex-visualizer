// Hover over any regex literal below to see the railroad diagram.
// Each line exercises a different grammar feature.

// ── Literals & flags ───────────────────────────────────────────────────────
const plain = /foo/;
const caseInsensitive = /hello/i;
const global = /spam/g;
const multilineSticky = /log/my;

// ── Character classes ──────────────────────────────────────────────────────
const hexDigits = /[0-9a-fA-F]+/;
const notVowel = /[^aeiou]/i;
const shorthand = /\d{3}-\w+/;

// ── Anchors ────────────────────────────────────────────────────────────────
const wholeLine = /^hello world$/m;
const wordBoundary = /\bcat\b/gi;

// ── Groups & captures ──────────────────────────────────────────────────────
const phone = /(\d{3})-(\d{3})-(\d{4})/;
const named = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const nonCapturing = /(?:https?:\/\/)?[\w.-]+\.[a-z]{2,}/i;

// ── Alternation ────────────────────────────────────────────────────────────
const pet = /cat|dog|bird|fish/i;

// ── Quantifiers ────────────────────────────────────────────────────────────
const optional = /colou?r/;
const repeat = /a{2,5}/;
const lazy = /<.+?>/g;

// ── Lookaround ─────────────────────────────────────────────────────────────
const priceAfter = /(?<=\$)\d+(\.\d{2})?/g;
const notFollowedBy = /foo(?!bar)/;

// ── Real-world ─────────────────────────────────────────────────────────────
const email = /^[\w.+-]+@[\w-]+\.[a-z.]{2,}$/i;
const semver = /^(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?(?:\+([\w.-]+))?$/;
const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/;
