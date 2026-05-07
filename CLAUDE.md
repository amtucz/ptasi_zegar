# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ptasi Zegar** ("Bird Clock") is a single-file Polish dawn-chorus web app (`ptasi_zegar.html`). It shows which bird is singing at the current time of day, plays audio recordings, and animates a sky gradient that matches the time. No build system, no dependencies, no bundler — everything runs directly in the browser.

## Development

Open `ptasi_zegar.html` directly in a browser. There are no build steps, tests, or linting tools configured.

To preview changes during editing, use a local HTTP server (required for audio and fetch calls to work without CORS issues):

```
python -m http.server 8080
# then open http://localhost:8080/ptasi_zegar.html
```

## Architecture

The entire app lives in one file with three parts: `<style>`, HTML markup, and a `<script>` block at the end.

### Data

`BIRDS` (line 264) — array of 20 bird objects, each with:
- `time` — when the bird sings (HH:MM, range 03:00–10:30)
- `namePl`, `nameLat` — Polish and Latin names
- `desc`, `where` — display text
- `audioFile` — filename on Wikimedia Commons (OGG or MP3)
- `wikiPl`, `wikiEn` — Wikipedia article titles for photo lookup
- `color` — hex accent color used throughout the UI

### Core Logic Flow

1. `init()` bootstraps everything on `DOMContentLoaded`, then re-runs `findCurrentBird()` every 60 seconds.
2. `findCurrentBird()` walks the sorted `BIRDS` array and returns whichever bird's `time` is ≤ current minutes-since-midnight.
3. `renderBird(bird, isCurrent)` is the central update function — it sets all DOM text, triggers `setSvgFor()`, `loadPhotoViaApi()`, and `setAudio()`, and applies the bird's color accent via CSS variable `--bird-accent`.
4. `renderTimeline()` and `renderDayMap()` rebuild their respective UI sections on every 60s tick. Both use `data-id="nameLat@time"` as a composite key to identify items.

### External Data Sources

- **Audio**: streamed directly from `https://commons.wikimedia.org/wiki/Special:FilePath/<audioFile>`. If the browser doesn't support OGG, `getMp3Url()` queries the Wikimedia API for an MP3 derivative.
- **Photos**: fetched from the Wikipedia REST API (`/api/rest_v1/page/summary/<title>`), tried in Polish first then English.

### Visual Systems

- **Sky gradient**: `updateSky(h)` maps the hour (0–24) to three CSS variables (`--sky-1/2/3`) and a `--stars` opacity. Called every second via `updateClock()`.
- **Bird accent color**: `getBirdAccent(hex)` brightens dark colors to ensure readable contrast, then sets `--bird-accent` on `documentElement`.
- **SVGs**: `birdSvg(bird)` dispatches to `woodpeckerSvg()`, `magpieSvg()`, or `genericBirdSvg()` based on Latin name.
- **Background image**: a large base64-encoded JPEG is embedded directly in the CSS `body::before` rule.

### Key DOM IDs

`clock`, `date`, `sky`, `birdName`, `birdLatin`, `birdTime`, `birdTimeLabel`, `birdDesc`, `birdWhere`, `plateSvg`, `platePhoto`, `plateCaption`, `playerTitle`, `playerStatus`, `playBtn`, `progressBar`, `timeline`, `dayMapTrack`, `dayMapHours`, `linkXC`, `linkWiki`, `audio`.
