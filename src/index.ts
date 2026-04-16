import type { ExtensionContext, TextEditor } from 'vscode';
import { MarkdownString, OverviewRulerLane, window, workspace } from 'vscode';
import { EXT_NAME } from './ext';
import { Log } from './log';
import { findRegexes } from './regex-detector';
import { renderRegexSvg } from './regex-renderer';

const THROTTLE_MS = 500;

export function activate(context: ExtensionContext) {
  Log.info(`${EXT_NAME} activated!`);

  const decorationType = window.createTextEditorDecorationType({
    borderWidth: '0 0 1px 0',
    borderStyle: 'dashed',
    borderRadius: '3px',
    overviewRulerColor: 'blue',
    overviewRulerLane: OverviewRulerLane.Right,
    light: { borderColor: 'darkblue' },
    dark: { borderColor: 'lightblue' },
  });
  context.subscriptions.push(decorationType);

  let pending: NodeJS.Timer | undefined;
  let generation = 0;

  async function updateDecorations(editor: TextEditor | undefined) {
    if (!editor) {
      return;
    }

    const myGen = ++generation;
    const matches = findRegexes(editor.document);

    const decorations = await Promise.all(matches.map(async (m) => {
      const dataUrl = await renderRegexSvg(m.regexStr);
      const hover = new MarkdownString(
        `<img src="${dataUrl}" /><br/>[Open in the browser](https://regexper.com/#${encodeURIComponent(m.regexStr)})`,
      );
      hover.isTrusted = true;
      hover.supportHtml = true;
      return { range: m.range, hoverMessage: hover };
    }));

    // Drop stale results if another update has started or the editor changed.
    if (myGen !== generation || window.activeTextEditor !== editor) {
      return;
    }

    editor.setDecorations(decorationType, decorations);
  }

  function scheduleUpdate(editor: TextEditor | undefined, throttle: boolean) {
    if (pending) {
      clearTimeout(pending);
      pending = undefined;
    }
    if (throttle) {
      pending = setTimeout(() => updateDecorations(editor), THROTTLE_MS);
    } else {
      updateDecorations(editor);
    }
  }

  scheduleUpdate(window.activeTextEditor, false);

  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(editor => scheduleUpdate(editor, false)),
    workspace.onDidChangeTextDocument((event) => {
      const editor = window.activeTextEditor;
      if (editor && event.document === editor.document) {
        scheduleUpdate(editor, true);
      }
    }),
  );
}

export function deactivate() {
  Log.info(`${EXT_NAME} deactivated!`);
}
