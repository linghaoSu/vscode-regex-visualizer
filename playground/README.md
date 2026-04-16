# Playground

Sandbox files for manually testing **regex-visualizer** inside an Extension Development Host (EDH).

## How it runs

Pressing **F5** in the root project launches EDH with `--extensionDevelopmentPath` set to the repo and this folder opened as the active workspace — so the extension activates against these sample files immediately.

## What to try

- Hover any `/pattern/flags` literal in [`samples.js`](./samples.js) or [`samples.ts`](./samples.ts) to see the rendered railroad diagram.
- Edit a line while hovering elsewhere to verify that the debounced re-scan kicks in (500 ms throttle).
- Open the Output panel → **regex-visualizer** channel to see activation logs.

## Adding new cases

Drop any file the extension should scan here. The detector triggers on JavaScript-style regex literals preceded by whitespace or a code delimiter (`( = { , : ? ;` etc.), so standard source files work out of the box.
