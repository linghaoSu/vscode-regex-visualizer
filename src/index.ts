import type { ExtensionContext, TextDocument } from 'vscode';
import { MarkdownString, OverviewRulerLane, Range, window, workspace } from 'vscode';
import { disposeSettingListener, initialSetting } from './settings';
import { Log } from './log';
import { EXT_NAME, mockDocument } from './constant';
import { svg64 } from './svg64';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Regexper from './regexp-visualizer/js/regexper.js';

mockDocument.body.innerHTML = `
<div id="regexp-render"><svg></svg></div>
<script type="text/html" id="svg-container-base">
        <div class="svg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            version="1.1">
            <defs>
              <style type="text/css">svg {
          background-color: #fff; }
        
        .root text,
        .root tspan {
          font: 12px Arial; }
        
        .root path {
          fill-opacity: 0;
          stroke-width: 2px;
          stroke: #000; }
        
        .root circle {
          fill: #6b6659;
          stroke-width: 2px;
          stroke: #000; }
        
        .anchor text, .any-character text {
          fill: #fff; }
        
        .anchor rect, .any-character rect {
          fill: #6b6659; }
        
        .escape text, .charset-escape text, .literal text {
          fill: #000; }
        
        .escape rect, .charset-escape rect {
          fill: #bada55; }
        
        .literal rect {
          fill: #dae9e5; }
        
        .charset .charset-box {
          fill: #cbcbba; }
        
        .subexp .subexp-label tspan,
        .charset .charset-label tspan,
        .match-fragment .repeat-label tspan {
          font-size: 10px; }
        
        .repeat-label {
          cursor: help; }
        
        .subexp .subexp-label tspan,
        .charset .charset-label tspan {
          dominant-baseline: text-after-edge; }
        
        .subexp .subexp-box {
          stroke: #908c83;
          stroke-dasharray: 6,2;
          stroke-width: 2px;
          fill-opacity: 0; }
        
        .quote {
          fill: #908c83; }
        </style>
            </defs>
            <metadata>
              <rdf:RDF>
                <cc:License rdf:about="http://creativecommons.org/licenses/by/3.0/">
                  <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
                  <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
                  <cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />
                  <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />
                  <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
                </cc:License>
              </rdf:RDF>
            </metadata>
          </svg>
        </div>
        <div class="progress">
          <div style="width:0;"></div>
        </div>
      </script>
`;
interface RegexMatch {
  document: TextDocument
  regex: RegExp
  range: Range
}

export function activate(context: ExtensionContext) {
  Log.info(`${EXT_NAME} activated! `);
  // start listening settings
  initialSetting();

  const smallNumberDecorationType = window.createTextEditorDecorationType({
    borderWidth: '0 0 1px 0',
    borderStyle: 'dashed',
    borderRadius: '3px',
    overviewRulerColor: 'blue',
    overviewRulerLane: OverviewRulerLane.Right,
    textDecoration: 'ababababa',
    before: {
      borderColor: '#f00',
    },
    after: {
      borderColor: '#00f',
    },
    light: {
      // this color will be used in light color themes
      borderColor: 'darkblue',
    },
    dark: {
      // this color will be used in dark color themes
      borderColor: 'lightblue',
    },
  });

  let activeEditor = window.activeTextEditor;
  const regEx = /(^|\s|[()={},:?;])(\/((?:\\\/|\[[^\]]*\]|[^/])+)\/([gimuy]*))(\s|[()={},:?;]|$)/g;

  async function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const matches = await findRegexes(activeEditor.document);

    activeEditor.setDecorations(smallNumberDecorationType, matches);
  }

  async function createRegexMatch(document: TextDocument, line: number, match: RegExpExecArray) {
    const regex = createRegex(match[3], match[4]);
    if (regex) {
      const regexStr = regex.toString();

      const regexper = new Regexper(mockDocument.body);

      await regexper.showExpression(regexStr.slice(1, -1));

      const svgParentContainer = regexper.svgContainer.querySelector('svg');

      svgParentContainer.removeChild(svgParentContainer.querySelector('metadata'));

      const originContent = svgParentContainer.outerHTML;
      const base64SVGStr = svg64(originContent);

      const result = base64SVGStr;

      const dom = `<img src="${result}" />`;
      const message = new MarkdownString(dom);

      message.isTrusted = true;
      message.supportHtml = true;

      return {
        document,
        regex,
        range: new Range(line, match.index + match[1].length, line, match.index + match[1].length + match[2].length),
        hoverMessage: message,
      };
    }
  }

  function createRegex(pattern: string, flags: string) {
    try {
      return new RegExp(pattern, flags);
    } catch (e) {
      // discard
    }
  }

  async function findRegexes(document: TextDocument) {
    const matches: RegexMatch[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      let match: RegExpExecArray | null;
      const regex = regEx;
      regex.lastIndex = 0;
      const text = line.text.substr(0, 1000);
      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(text))) {
        const result = await createRegexMatch(document, i, match);
        if (result) {
          matches.push(result);
        }
      }
    }
    return matches;
  }

  let timeout: NodeJS.Timer | undefined;

  function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (throttle) {
      timeout = setTimeout(updateDecorations, 500);
    } else {
      updateDecorations();
    }
  }

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  window.onDidChangeActiveTextEditor((editor) => {
    activeEditor = editor;
    if (editor) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  workspace.onDidChangeTextDocument((event) => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerUpdateDecorations(true);
    }
  }, null, context.subscriptions);
}

// process exit;
export function deactivate() {
  disposeSettingListener();

  Log.info(`${EXT_NAME} deactivate! `);
}
