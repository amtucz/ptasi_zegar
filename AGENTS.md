# AGENTS.md

Guidance for Codex and other coding agents working in this repository.

## Project Overview

This is a static Polish nature-sound web app. There is no package manager,
build system, framework, bundler, lint configuration, or automated test setup.
The app runs directly in the browser from HTML files.

Main entry points:

- `index.html` - current public GitHub Pages entry point, with tabs for birds,
  insects, frogs, and amphibians. Treat this as the broader/current variant
  unless the user asks specifically for `ptasi_zegar.html`.
- `ptasi_zegar.html` - original single-file "Ptasi Zegar" dawn-chorus app.

Supporting assets:

- `dzwieki/` - local audio files and `CREDITS.txt` for Xeno-canto recordings.
- `tlo.jpg` - background image loaded by the main HTML file.
- `LICENCJA.md` - licensing and attribution notes.

## Development

Open an HTML file directly in a browser for a quick preview. For realistic
previewing, especially audio playback and `fetch()` calls, serve the directory
over HTTP:

```powershell
python -m http.server 8080
```

Then open one of:

```text
http://localhost:8080/
http://localhost:8080/ptasi_zegar.html
```

Run the lightweight static smoke test after meaningful edits:

```powershell
node tools/smoke-test.mjs
```

Also verify UI changes manually in a browser. Check the relevant HTML file
through the local HTTP server, including audio playback, tab switching,
timeline interaction, external links, and image loading.

## Architecture

Each app is a single HTML file split into:

1. CSS in a `<style>` block.
2. Static HTML markup.
3. Vanilla JavaScript in a `<script>` block near the end.

Important data structures:

- `BIRDS` - bird schedule and display data.
- `INSECTS` - insect data in `index.html`.
- `FROGS` - frog and amphibian data in `index.html`.

Typical item fields include:

- `time` or `timeOfDay` - timing/grouping information.
- `namePl`, `nameLat` - Polish and Latin names.
- `desc`, `where` - display copy.
- `audioFile` - Wikimedia Commons filename, full URL, or local `dzwieki/` path.
- `wikiPl`, `wikiEn` - Wikipedia article titles for photo lookup.
- `color` - accent color used in the UI.

Core flow in the bird view:

1. `init()` runs on `DOMContentLoaded`.
2. `updateClock()` updates time and sky variables every second.
3. `findCurrentBird()` selects the latest bird whose scheduled time is less
   than or equal to the current time.
4. `renderBird()` updates DOM text, SVG/photo, audio, links, and accent color.
5. `renderTimeline()` and `renderDayMap()` rebuild the schedule UI.

`index.html` adds shared helpers for audio wiring, photo loading, tab
switching, and species-list rendering.

## External Data Sources

- Audio can be streamed from Wikimedia Commons via
  `https://commons.wikimedia.org/wiki/Special:FilePath/...`.
- If OGG is unsupported, the code may query the Wikimedia API for MP3
  derivatives.
- Photos are fetched from the Wikipedia REST API, usually Polish first and then
  English fallback.
- Some local files in `dzwieki/` come from Xeno-canto and carry CC BY-NC-SA
  attribution requirements. Preserve or update credits when changing audio.
- `index.html` does not include a visitor badge; avoid adding third-party
  tracking widgets without an explicit request.

## Editing Guidelines

- Keep changes scoped to the requested HTML file and related assets.
- Prefer the existing single-file, vanilla JS style. Do not introduce a build
  system or dependency unless the user explicitly asks for it.
- Preserve Polish UI text and existing naming conventions.
- When adding or changing species data, keep object fields consistent with the
  surrounding array and update attribution/licensing files if audio sources
  change.
- Avoid embedding large base64 assets in HTML; prefer existing local files such
  as `tlo.jpg`.
- Do not remove licensing notes, source links, or attribution text.

## Manual Verification Checklist

For meaningful UI changes, verify:

- The target HTML page loads from the local HTTP server.
- The clock and sky background update.
- Current species selection renders correctly.
- Audio play/pause and progress work.
- Wikipedia photos load or fail gracefully.
- Timeline/species list clicks update the feature panel.
- `index.html` tabs switch correctly.
- The page remains usable on a narrow viewport.
