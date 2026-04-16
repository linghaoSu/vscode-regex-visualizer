import type { TextDocument } from 'vscode';
import { Range } from 'vscode';

export interface RegexMatch {
  regex: RegExp;
  regexStr: string;
  range: Range;
}

// Source: https://github.com/chrmarti/vscode-regex/blob/41062efe8aa5113e8902742ae270e090a3de5c5e/src/extension.ts#L14
// Capped per-line scan (MAX_LINE_LENGTH) bounds the worst-case backtracking.
// eslint-disable-next-line regexp/no-super-linear-backtracking
export const REGEX_PATTERN = /(^|[\s()={},:?;])(\/((?:\\\/|\[[^\]]*\]|[^/])+)\/([gimuy]*))([\s()={},:?;]|$)/g;

const MAX_LINE_LENGTH = 1000;

export function findRegexes(document: TextDocument): RegexMatch[] {
  const matches: RegexMatch[] = [];

  for (let line = 0; line < document.lineCount; line++) {
    const text = document.lineAt(line).text.slice(0, MAX_LINE_LENGTH);
    REGEX_PATTERN.lastIndex = 0;

    let m: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((m = REGEX_PATTERN.exec(text)) !== null) {
      const regex = safeRegex(m[3], m[4]);
      if (!regex) {
        continue;
      }

      const start = m.index + m[1].length;
      const end = start + m[2].length;

      matches.push({
        regex,
        regexStr: regex.toString(),
        range: new Range(line, start, line, end),
      });
    }
  }

  return matches;
}

function safeRegex(pattern: string, flags: string): RegExp | undefined {
  try {
    return new RegExp(pattern, flags);
  }
  catch {
    return undefined;
  }
}
