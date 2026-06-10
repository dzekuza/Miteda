# Miteda Design System

Miteda is a **community & property-management platform** for residential
buildings — a digital front desk for an apartment block. The product recreated
here is the resident/manager **dashboard** ("Pagrindinis"), where a household
sees building notices, discussions and direct messages, an events calendar,
their utility bills, and the building's digital keys (stairway / parking codes,
common-area Wi-Fi). The interface ships in **Lithuanian** (the source building
is "Kalnų Terasos") with English section headings.

The brand voice is **calm, neighbourly and practical** — it lowers the friction
of shared living. The visual world is **warm and tactile**: off-white paper-like
surfaces, a fresh signal green, a deep evergreen navigation rail, and a single
warm orange reserved for things that need attention.

## Sources
- **Figma:** `miteda.fig` (attached). Page "Page-1" → frames **Dashboard**
  (`node 1:1598`) and **Auto-Layout** (the component sheet, `node 1:572`-area).
  Top fonts: Tomato Grotesk Medium/Regular. Icon set: **Phosphor**.
- **Uploaded fonts:** `TomatoGrotesk-Light.otf`, `BCNovaticaCYR-Regular.otf`.
- **Uploaded logo:** `logomit.svg` → `assets/miteda-logo*.svg` + `miteda-mark.svg`.

---

## CONTENT FUNDAMENTALS

How Miteda writes:

- **Voice & person.** Speaks *to* the resident, warmly and directly — "Here is
  what's happening in Kalnų Terasos today." It uses *you*/implied-you, never
  corporate "we". Management is referred to in the third person ("Latest
  announcements from management").
- **Tone.** Plain, reassuring, low-drama. Even an outage is stated factually:
  "Hot water off from 9:00 to 14:00 due to scheduled maintenance." No
  exclamation marks, no hype.
- **Casing.** Section headings are **Title Case** ("Notice Board", "Upcoming
  Events", "Digital Keys", "New messages" — note the last is sentence case;
  both occur, Title Case dominates for panels). Body copy is sentence case.
  Category badges are Title Case single words ("Urgent", "Rules", "Cleaning",
  "Topic").
- **Language.** Navigation and in-product nouns are Lithuanian (Pagrindinis,
  Defektai, Nuotraukos, Paslaugų sutartys, Kontaktai, Tvarkaraštis, Skelbimų
  lenta, Naujienos, Bendruomenė, Remonto darbai). Content cards mix Lithuanian
  context with English headings. Preserve Lithuanian diacritics (ų, č, ė, š).
- **Numbers & meta.** Terse, dot-separated: "52 replies · 3.2 views",
  "16:30 · Stairwell A", "€84.40". Dates are long-form US-style: "June 25, 2026".
- **Emoji:** none. Status and category are carried by **color + a short word**,
  never an emoji.
- **Vibe:** a tidy building noticeboard, digitised — calm, communal, dependable.

---

## VISUAL FOUNDATIONS

- **Color.** A warm near-neutral system. Canvas is warm grey `#EEEDEB`; cards
  are paper-white `#FFFEFC`. Ink is near-black `#030302` stepping down through
  warm greys. **Signal green `#78BF3E`** is the brand action/positive color;
  **evergreen `#092D1A`** is the navigation/dark surface; **orange `#FF601B`**
  is the *only* alert color (urgent notices, unread, overdue). A soft **pink
  `#FDB3CA`** dots calendar/schedule events. Greens and oranges also appear as
  low-opacity tints (8–25%) for fills and selected states. See `tokens/colors.css`.
- **Type.** One neo-grotesk, **Tomato Grotesk**, across the whole product. A
  compact functional scale — the UI lives at **12 / 14 / 16**, with **20** for
  section headings and **24** for the view title. Weights are **400 (Regular)**
  and **500 (Medium)**; Medium carries every title, label and emphasised number.
  Letter-spacing tightens slightly (-0.01em) on headings. See `tokens/typography.css`.
- **Spacing.** A **4px base**. Dashboard cards sit on a **24px gap/padding**
  rhythm; inner notice cards use 16–18px. Generous whitespace; nothing is cramped.
- **Backgrounds.** Flat warm fills — **no photographic imagery, no gradients on
  the canvas**. The one gradient in the system is the subtle orange wash on
  urgent/unread cards (`--orange-soft → --orange-faint`, top→bottom). No textures
  or patterns. The header uses a **warm glass** treatment: `rgba(255,254,252,0.9)`
  + `backdrop-filter: blur(50px)`.
- **Corner radii.** Soft and consistent: **24px** for primary cards & the header,
  **16px** for inner/nested cards, **12px** for inputs & icon buttons, **8px**
  for chips, and **fully round (pill)** for buttons, badges, switches and avatars.
- **Cards.** Paper-white, deeply rounded (24), with a **barely-there** shadow
  (`--shadow-xs`, ~4% black) or just a hairline (`--line-100`). Depth is quiet —
  the system leans on color and the glass header, not heavy elevation.
- **Borders & lines.** Hairlines in warm grey (`#F2F0EE` / `#E4E3E0`), usually
  rendered as `inset 0 0 0 1px` box-shadows so they don't affect layout. Dividers
  are 1px `--line-100`.
- **Shadows.** A restrained 4-step scale (xs→lg), all soft and low-opacity
  (4–12% black). Reserve `md`/`lg` for popovers and dialogs.
- **Buttons.** Pills. `primary` = evergreen fill, white text; `accent` = signal
  green fill; `secondary` = white with a hairline ring (the everyday button);
  `ghost` = chromeless. Sizes 32 / 40 / 48.
- **Icon buttons.** 12px-radius squares (44px in the header) with a faint ink
  fill; an orange 6px dot marks unread.
- **Hover / press.** Hover = a gentle `brightness(0.95–0.96)` darken (and a
  shadow lift on interactive cards). Press = `scale(0.98)`. Nav rows lighten with
  a translucent white/green fill. Transitions are short (**120–180ms**) on an
  ease-standard curve; calendar/knob movement uses an ease-out. No bounces, no
  long or looping animation.
- **Transparency & blur.** Used sparingly and purposefully: the glassy header,
  translucent green on the active nav row, low-opacity signal tints. Imagery is
  N/A (the product uses none); avatars fall back to initials.
- **Layout rules.** Fixed 256px evergreen sidebar; scrolling work area with a
  sticky glass header; a two-column content grid (flexible main + ~372px aside).

---

## ICONOGRAPHY

- **System:** **Phosphor Icons**, *regular* (outline) weight at ~20px — confirmed
  from the Figma component names (House, DoorOpen, Wrench, Wallet, CalendarDots,
  ChatCircle, CaretDown, QrCode, WifiHigh, CarProfile, Key, Copy, Check, Plus,
  ArrowUpRight, ListBullets, Circle, BuildingOffice…). Stroke is even and rounded.
- **Delivery:** load the Phosphor **webfont** from CDN and use class strings —
  `<i class="ph ph-house">`. Add the **bold** stylesheet too where a heavier glyph
  is needed (the checkbox check uses `ph-bold ph-check`):
  ```html
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css" />
  ```
  Components accept icons as Phosphor class strings (`iconLeft="ph ph-plus"`).
- **Substitution flag:** the Figma file embeds Phosphor as a custom component
  library (vector geometry wasn't cleanly extractable), so we use the official
  Phosphor webfont — visually identical to the source. If you need the exact
  embedded glyphs as SVGs, ask and we'll export them from Figma.
- **Emoji / unicode:** not used. The mid-dot "·" is used as a textual separator
  in meta lines. Status is color + word, not glyph.
- **Logo:** `assets/miteda-logo-dark.svg` (dark wordmark, for light surfaces),
  `assets/miteda-logo-light.svg` (white wordmark, for the evergreen sidebar /
  dark), `assets/miteda-mark.svg` (the green checker mark alone). The mark is a
  pixel-like cluster of rounded green squares.

---

## FONT SUBSTITUTION — please read

Only the **Light** master of Tomato Grotesk was supplied, but the product is
set in **Regular (400)** and **Medium (500)**. The system maps the supplied
file across the 400–600 range so the **real letterforms render everywhere**;
the browser synthesises the heavier weights until proper binaries are provided.
**To make this pixel-perfect, please upload `Tomato Grotesk Regular` and
`Tomato Grotesk Medium`.** `BC Novatica CYR` is registered as a secondary
display face (`--font-display`) but the dashboard does not currently use it —
confirm where it belongs (logo? marketing?) and we'll wire it in.

---

## INDEX / MANIFEST

Root
- `styles.css` — global entry (import-only). Link this one file.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `fonts/` — `TomatoGrotesk-Light.otf`, `BCNovaticaCYR-Regular.otf`.
- `assets/` — `miteda-logo.svg` (original), `miteda-logo-dark.svg`,
  `miteda-logo-light.svg`, `miteda-mark.svg`.
- `readme.md` (this file) · `SKILL.md` (Agent-Skill manifest).

Components (`window.MitedaDesignSystem_acc833`)
- `buttons/` — **Button**, **IconButton**, **SegmentedControl**
- `forms/` — **Input**, **Switch**, **Checkbox**
- `feedback/` — **Badge**
- `display/` — **Card**, **Avatar**, **KeyRow**
- `navigation/` — **SidebarItem**

Each component directory has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`,
and a `@dsCard` HTML specimen.

UI kits
- `ui_kits/dashboard/` — the resident dashboard ("Pagrindinis"). See its README.

Foundation cards
- `guidelines/` — Brand, Colors, Type, Spacing specimen cards (Design System tab).
