<p align="center">
  <img src="./resources/icon.png" width="96" alt="Regex Visualizer" />
</p>

<h1 align="center">Regex Visualizer</h1>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=linghaosu.regex-visualizer"><img src="https://img.shields.io/visual-studio-marketplace/v/linghaosu.regex-visualizer.svg?color=eee&amp;label=VS%20Code%20Marketplace&amp;logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=linghaosu.regex-visualizer"><img src="https://img.shields.io/visual-studio-marketplace/i/linghaosu.regex-visualizer.svg?color=eee&amp;label=installs" alt="Installs" /></a>
</p>

Hover over a regular expression literal in any source file and get an inline railroad-diagram preview — no leaving the editor, no copy-paste to an online tool.

<p align="center">
  <img width="763" alt="Hover preview" src="https://github.com/linghaoSu/vscode-regex-visualizer/assets/56526981/614e9505-a40a-42f9-952c-a1fadd9c8a06" />
</p>

## Usage

1. Open a file that contains a JavaScript-style regex literal (`/pattern/flags`).
2. Hover the cursor over the literal — the railroad diagram renders inside the hover tooltip.
3. Click **Open in the browser** in the tooltip to open the same expression on [regexper.com](https://regexper.com/) for deeper inspection.

Rendered diagrams are cached per session, so the same pattern renders instantly on subsequent hovers.

## Install

- **VS Code Marketplace:** search for *Regex Visualizer*, or install [`linghaosu.regex-visualizer`](https://marketplace.visualstudio.com/items?itemName=linghaosu.regex-visualizer).
- **Open VSX:** the same identifier is published to the Open VSX registry (best-effort).

## Development

Requires Node.js ≥ 20 and pnpm ≥ 10.

```bash
pnpm install
pnpm dev        # tsup watch
# Press F5 in VS Code to launch an Extension Development Host with sourcemap breakpoints.
```

Common scripts:

| Script | Purpose |
| ------ | ------- |
| `pnpm build` | One-shot build to `dist/`. |
| `pnpm check` | `typecheck` + `lint`. |
| `pnpm test` | Run Vitest suites. |
| `pnpm release` | Tag a stable release (bumpp + changelogen). |
| `pnpm release:pre` | Tag a `-beta.x` prerelease. |

Pushing a `v*` tag to GitHub triggers the release workflow, which packages a VSIX, creates a GitHub Release, and publishes to the VS Code Marketplace (and Open VSX, if `OVSX_PAT` is configured). Tags containing a pre-id suffix (e.g. `v0.1.0-beta.0`) are published with the `--pre-release` flag automatically.

## Credits

- Regex-to-railroad rendering is derived from [regexper-static](https://gitlab.com/javallone/regexper-static).
- Regex literal detection logic is adapted from [chrmarti/vscode-regex](https://github.com/chrmarti/vscode-regex/blob/41062efe8aa5113e8902742ae270e090a3de5c5e/src/extension.ts#L14).

## License

[MIT](./LICENSE) License © 2023
