# Lisa Wang — Portfolio

Design reference bundle for the portfolio site. Everything here is self-contained: open `index.html` (or `Portfolio.dc.html`) in a browser over a local server and the whole site runs — home, About, Content, Pinboard, and both case studies.

## What these files are

The `.dc.html` files are **design prototypes written in HTML**, not production source. They show the intended look, copy, responsive behavior, and interactions at full fidelity. They are **high-fidelity** — colors, type, spacing, and motion are final.

If you are rebuilding this in a real framework (Next.js, Astro, plain Vite, etc.), treat these as the spec: recreate the markup and styles in that framework's idioms rather than shipping the `.dc.html` files as-is. If you just want the site online quickly, they can also be served directly as static files.

## Running locally

These pages fetch a small runtime, so `file://` will not work. Serve the folder:

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a repo and push the contents of this `site/` folder to the repo root.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. `index.html` redirects to `Portfolio.dc.html`.

`.nojekyll` is already included — keep it, or GitHub Pages will skip `.image-slots.state.json` and every slot-based image will disappear.

## File map

| File | What it is |
| --- | --- |
| `index.html` | Redirect into the portfolio |
| `Portfolio.dc.html` | Home, Works, Content, About, Pinboard (single-page, view-switched) |
| `Triceratops Case Study.dc.html` | Triceratops case study |
| `CycleFind Case Study.dc.html` | CycleFind case study |
| `support.js` | Runtime that renders the `.dc.html` templates |
| `image-slot.js` | `<image-slot>` web component (drag-and-drop image placeholders) |
| `.image-slots.state.json` | **Required.** Holds the images dropped into every `<image-slot>` as base64 data URLs — experience logos, travel photos, Terrain Park carousel, EKHO/TikTok reel stills, CycleFind showcase. Without it those slots render empty. |
| `.nojekyll` | Tells GitHub Pages to serve dotfiles and skip Jekyll processing |
| `assets/` | Case study imagery, screen recordings, resume PDF |
| `uploads/` | Photos, tool logos, social screenshots, poster PDFs |

## Structure of a page

Each `.dc.html` has three parts:

1. `<x-dc>…</x-dc>` — the template. Plain HTML with inline styles, plus `{{ value }}` holes, `<sc-for list="{{ items }}" as="item">` loops, and `<sc-if value="{{ flag }}">` conditionals.
2. `<helmet>` at the top of the template — font links, `@keyframes`, body resets, and all `@media` rules.
3. `<script type="text/x-dc">` at the bottom — a `Component` class whose `renderVals()` returns every value the template reads (content arrays, handlers, computed styles).

All content lives in `renderVals()`: `projects`, `experience`, `travels`, `dances`, `bands` (Pinboard), `contentStats`, `ekhoTop`, `bpClips`, `fvPlan`, `tickets`, `carousel`. When porting, those arrays are your data model.

## Views (Portfolio.dc.html)

One page, five views toggled by state — `isHomeView`, `isAboutView`, `isContentView`, `isGraphicsView`, `isProjectView`.

- **Home** — hero (name, positioning line, status line), animated route SVG, boarding-pass card, CTA buttons, baggage-tag skill cards, Selected Work grid, gondola divider, animated "Designing & building with intention" headline.
- **Works** — project cards styled as lift tickets; each opens a case study.
- **Content** — top metrics grid, then one block per org (EKHO Dance, Personal TikTok, Foundverse, #include) with performance tables, reel grids, and carousels.
- **About** — bio, experience snowboards (draggable), skills logo row, Terrain Park carousel, Passport grid, Dance video grid.
- **Pinboard** — two bands of tacked-up poster cards, absolutely positioned on desktop, masonry columns on mobile.

## Design tokens

### Color

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#12314A` | Headings, primary text, borders |
| Teal | `#2F7A94` | Labels, accents, links |
| Blue | `#2C6FB5` | Emphasis, bullets, bold inline text |
| Sky 100 | `#A9D3E8` | Illustration fills, dashed routes |
| Sky 200 | `#7FD3E8` | Hover accents on dark |
| Sky 300 | `#C9E1EF` | Mountain silhouettes |
| Mist | `#EAF5FB` | Text on dark |
| Wash | `#F4FAFD` | Insight panels, light-on-dark text |
| Tint | `#E3F2F9` | Badge fill, ambient glow |
| Page | `#FCFCFB` | Default background |
| Paper | `#FAF7F2` | Pinboard background |
| Night | `#10222F` | Footer |
| Amber | `#F2A65A` | Footer lights, footer link hover |
| Blush | `#F9CDD1` | Headline highlight pill |
| Green | `#4CA96B` | Active-role dot, turtle |
| Body | `#3F5A70` | Paragraph text |
| Muted | `#9AA4AE`, `#7C8894`, `#A6AEB6` | Eyebrows, meta, table headers |
| Line | `#E6E9EC` | Card borders, dividers |
| Triceratops | `#2F6B4A` | Case study accent |
| CycleFind | `#7A1E3A` | Case study accent |

### Type

- **Space Grotesk** 400/500/600/700 — headings, names, numbers. Headings are 600 with `letter-spacing:-0.02em`.
- **IBM Plex Mono** 400/500 — eyebrows, meta, table cells, captions. Uppercase, `letter-spacing:0.14em–0.16em`.
- Both loaded from Google Fonts in each file's `<helmet>`.

Scale: h1 `clamp(32px,5vw,52px)`; hero h1 `clamp(40px,6.2vw,74px)`; h2 `clamp(28px,4vw,42px)`; section h2 `clamp(23px,3vw,32px)`; card h3 `clamp(20px,2.2vw,25px)`; body `16.5px/1.75`; dense body `14.5px/1.75`; mono labels `9–12.5px`.

### Spacing, radius, shadow

- Section padding: `clamp(64px,9vw,96px)` vertical, `clamp(20px,5vw,64px)` horizontal. Max widths 1140–1600px.
- Radii: cards 14–20px, image wells 6–12px, pills 100px.
- Card shadow: `0 1px 2px #12314A0D, 0 16px 38px -26px #12314A40`. Hover lifts to `0 22px 40px -20px #12314A88`.

### Motion

`@keyframes` in each `<helmet>`: `spinSlow`, `bobTag`, `floatChip`, `sparkle`, `driftCloud`, `liftSway`, `glowPulse`, `turtleBob`, `paddleA/B`, `headPeek`, `letterFloat`, `dashFlow`, `passFloat`, `flakeDrift`, `planeCross`, `swirlDraw`, `noteFloat`, `eqBar`, `beatPulse`, `ticker`, `glideSnow`, `trailFall`. Hover transitions are `0.2s–0.9s` on `cubic-bezier(0.22,0.8,0.2,1)`.

A custom snowflake cursor with a trailing-flake effect follows the pointer (`onMouseMove` → `setCursorRef` / `setTrailRef`); it swaps to a "View Case Study" pill over project cards. `cursor:none` is set on the root — restore a normal cursor if you drop this.

## Responsive

Two breakpoints, both defined in `<helmet>`:

- **≤860px** — hamburger nav replaces the link row; boarding pass collapses to one column with the photo capped at 330px; skill tags go 2-up; experience snowboards center with 19.5% side padding; tables tighten; About stacks (portrait moves above the bio, SF photo to the bottom); Passport and Dance go 2-up; Pinboard becomes a 2-column masonry flow; metrics and reel grids go 2-up; footer collapses to one column.
- **≤560px** — boarding-pass photo capped at 250px; Dance drops to 1-up; type and table columns tighten further.

Case study pages hide their sticky side nav below 860px (`[data-r="casenav"] nav`), keeping only the ← Home link.

Elements targeted by media queries carry `data-r="…"` hooks: `badge`, `burger`, `navlinks`, `pass`, `pass-stub`, `tags`, `tag`, `split`, `board`, `expwrap`, `table`, `stories`, `about`, `aboutpics`, `travels`, `dances`, `band`, `include`, `include-media`, `stats`, `clips`, `foot`, `footinner`, `footgrid`, `casenav`.

## Interactions

- **Nav** — view switching with hash-style scroll targets; `goToWork`, `goToContent`, `goToAbout`, `goToGraphics`, `goHomeRoot`, `goToEmail` (mailto).
- **Snowboards** — pointer-drag with spring-back (`startDrag`, `.dragboard`); clicking one jumps to that org in Content.
- **Dance cards** — click the still to swap in a YouTube iframe (`d.onPlay` sets `playingDance`).
- **Carousels** — horizontal scroll-snap tracks with prev/next buttons (`carouselPrev` / `carouselNext`, `data-carousel-track`).
- **Case studies** — scroll-spy side nav, a reading progress bar, and Before/After toggles that cross-fade two stacked `<img>` layers.
- **Reveal on scroll** — `setRef(id)` + `revealStyle(id)` fade sections in via IntersectionObserver.

## Assets

All imagery is the site owner's own work or personal photography, plus third-party product logos used as skill icons (Figma, CapCut, Photoshop, Illustrator, Canva, VS Code, Notion, Slack) — replace or credit those per their brand guidelines if that matters for your deployment. Videos in `assets/*.mp4` are screen recordings of the CycleFind prototype.

`<image-slot>` elements read their image from `.image-slots.state.json`, which stores each one as a base64 data URL keyed by slot id (`logo-include`, `travel-1`…`travel-8`, `wall-1`…`wall-13`, `ekho-clip-1`…`4`, `bp-clip-1`…`3`, `cf-final-map`, `tool-figma`). The file must sit next to the HTML and be served over HTTP — the component fetches it.

In a production rebuild, decode those data URLs into real image files and swap each `<image-slot>` for a plain `<img>`. The sidecar is ~1 MB of inline base64, which is fine for a static prototype but not for a shipped site.

## Things to decide when porting

- The `cursor:none` custom cursor is desktop-only flair; it has no touch equivalent.
- Content tables are wide; they currently shrink font size rather than scroll horizontally.
- The Pinboard's absolute positioning is hand-tuned per item (`top`, `left`, `w`, `rot` in the `bands` array) — a real masonry or grid layout would be more maintainable.
- Case study routing is currently separate HTML files linked by relative href.
