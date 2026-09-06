# Fret Viz

A guitar fretboard visualizer. Pick a tuning, a root note, and a set of
notes, and it draws them onto a fretboard image (as note names or as
scale-degree intervals).

Live at **https://skafandras.lt** (root `/` is intentionally a blank
black page; the app itself lives at [`/frets`](https://skafandras.lt/frets)).

## Stack

- **Backend**: ASP.NET Core 8 (`web-api/`), serving a JSON API and the
  static frontend. Fretboard images are rendered server-side with
  [SixLabors.ImageSharp](https://github.com/SixLabors/ImageSharp) over a
  background image (`web-api/images/fretboard-large.png`).
- **Frontend**: React, loaded via CDN with in-browser Babel
  (`web-api/wwwroot`) — no build step or bundler. It's a tiny two-route
  SPA with a hand-rolled router (`window.history` + `popstate`):
  - `/` — blank black page, no content or navigation.
  - `/frets` — the actual visualizer. Only reachable by URL; there's no
    link to it from `/`. Direct loads/refreshes work via an ASP.NET
    Core SPA fallback route (`MapFallbackToFile("index.html")` in
    `Program.cs`).
- **Tests**: `tests/` — xUnit tests for the music-theory logic in
  `web-api/FluentApi`.

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

### API

`POST /fretboard/image` — returns a `data:image/png;base64,...` string.

```json
{
  "tuning": [0, 5, 10, 3, 7, 0],
  "notes": [0, 4, 7],
  "root": 0,
  "value": "interval"
}
```

Notes/tuning/root are integers 0–11 (`0 = E, 1 = F, 2 = F#/Gb, ...`).
`value` is `"note"` or `"interval"`.

## Docker

```bash
docker build -f web-api/Dockerfile -t fret-viz .
docker run -p 8080:8080 fret-viz
```

The container installs `fonts-dejavu-core` so ImageSharp has a font
available for drawing note labels (the code falls back through
DejaVu Sans → Tahoma → Liberation Sans → Arial, whichever is present,
so it also works unmodified on a Windows dev machine, which has Tahoma
but not DejaVu Sans).

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

- `SixLabors.ImageSharp` 3.1.5 has known advisories (GHSA-2cmq-823j-5qj8,
  GHSA-rxmq-m78w-7wmc) flagged by Dependabot. Not yet upgraded.
