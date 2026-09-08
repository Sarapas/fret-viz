# Fret Viz

A guitar fretboard visualizer. Pick a tuning, a root note, and a set of
notes, and it draws them onto a fretboard image (as note names or as
scale-degree intervals).

Live at **https://skafandras.lt** (root `/` is intentionally a blank
black page; the app itself lives at [`/frets`](https://skafandras.lt/frets)).

## Stack

- **Backend**: ASP.NET Core 8 (`web-api/`) is just a static file host
  now — it serves `wwwroot` and has no fretboard-related API surface.
  (`web-api/FluentApi` is a separate, older music-theory library used
  only by the test suite; it's unrelated to the visualizer itself.)
- **Frontend**: React, loaded via CDN with in-browser Babel
  (`web-api/wwwroot`) — no build step or bundler. It's a tiny two-route
  SPA with a hand-rolled router (`window.history` + `popstate`):
  - `/` — blank black page, no content or navigation.
  - `/frets` — the actual visualizer. Only reachable by URL; there's no
    link to it from `/`. Direct loads/refreshes work via an ASP.NET
    Core SPA fallback route (`MapFallbackToFile("index.html")` in
    `Program.cs`).

  All fretboard drawing happens client-side on a `<canvas>`
  (`web-api/wwwroot/js/site.js`): it loads the background photo
  (`web-api/wwwroot/images/fretboard-large.png`), computes fret/string
  pixel positions and note/interval labels in JS, and draws circles +
  text directly onto the canvas, then displays it via
  `canvas.toDataURL()`. No network round-trip per render.
- **Tests**: `tests/` — xUnit tests for the music-theory logic in
  `web-api/FluentApi` (unrelated to the visualizer; currently broken —
  see Known issues).

## Local development

Requires the [.NET SDK](https://dotnet.microsoft.com/download) (8.0+).

```bash
dotnet run --project web-api
```

The app listens on `http://localhost:5297` by default (see
`web-api/Properties/launchSettings.json`). Static frontend files are
served straight from `web-api/wwwroot`, so editing HTML/CSS/JS there
takes effect on refresh without a rebuild; C# changes need the server
restarted.

Run tests with:

```bash
dotnet test tests/tests.csproj
```

(See Known issues — this currently fails to build, unrelated to the
visualizer.)

### Fretboard drawing math

`web-api/wwwroot/js/site.js` encodes notes/tuning/root as integers
0–11 (`0 = E, 1 = F, 2 = F#, ...`, see `NOTE_LABELS`/`NOTE_NAMES`).
Fret and string pixel positions are derived from constants
(`FRET_WIDTHS`, `STRING_TOP_OPEN`, etc.) reverse-engineered from the
background photo's geometry, replicating the integer-division
rounding the original server-side renderer used so the layout lines
up with the photo pixel-for-pixel.

## Docker

```bash
docker build -f web-api/Dockerfile -t fret-viz .
docker run -p 8080:8080 fret-viz
```

## Deployment

Hosted on [Render](https://render.com) as a Docker-based web service,
defined by [`render.yaml`](render.yaml) (a Render Blueprint). Render is
connected to this GitHub repo and auto-deploys on every push to
`master`.

Custom domain (`skafandras.lt`, registered on Hostinger) is wired up
as:

| Type  | Host  | Value                     |
|-------|-------|---------------------------|
| A     | `@`   | `216.24.57.1`             |
| CNAME | `www` | `fret-viz.onrender.com`   |

(Hostinger's nameservers must be set to its own default nameservers,
not a third-party/parking NS, for its DNS Zone Editor to actually
control the zone.)

## Known issues

- `tests/FluentApiTests.cs` doesn't compile: it references `ScaleGuide`,
  `NoteEnum`, `IntervalEnum` etc. from `web-api/FluentApi` without a
  `using` directive. This happens to work when a test file is lexically
  nested under the same namespace, but `FluentApiTests.cs` isn't — so
  the build fails with `CS0103`. Pre-existing, unrelated to the
  visualizer; not yet fixed.
