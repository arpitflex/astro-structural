# Design system

The tokens in `tokens/` define the grid, type, color, spacing, and motion. `components/components.css` applies them to the `ag-*` classes.

Influences, in essence rather than in form: Dutch structural functionalism, where a single grid decides every position and size, the grid stays visible, and form follows the system. Also systems tooling and observability, where state is shown precisely and without decoration.

## Files and use

- `styles.css` imports the token files and component styles. `tokens/base.css` supplies element defaults when `<html>` has `class="ag"`.
- `tokens/colors.css`, `typography.css`, and `spacing.css` define the visual values. `tokens/fonts.css` loads self-hosted Archivo and Martian Mono.
- `components/components.css` defines every `ag-*` class; the Astro components in `src/components/` have no local styles. `guidelines/*.html` are browser-viewable reference cards.

Use tokens instead of repeating values. Set mono text with both `font: var(--type-mono)` and `font-stretch: var(--wdth-mono)`. Full-width grid items use `grid-column: var(--col-full)`.

## Foundations

- **Grid:** 12 equal columns, zero gutter, `--page-max` at 1200px, and a fluid `--page-margin`. `--line-grid` makes the columns visible. Text sits `--inset` (8px) from a column line; rules and lanes run line to line.
- **Sections:** a 2px `--rule-section` opens each section. Labels occupy columns 1–4 (`--col-label`); content occupies 5–12 (`--col-content`). Content bodies use an eight-column subgrid. `.ag-prose` spans its first six columns (`--col-prose`, about 64ch). Below 760px, labels and content stack and prose takes the full width.
- **Rules and spacing:** `--rule-item` opens an item with 1px ink; `--rule-row` separates rows with a faint hairline. Tiles have a rule and grid span, without cards, fills, shadows, or rounded corners. Spacing steps are 8, 16, 24, 40, 72, and 120px (`--gap-rule` through `--gap-section`). `--gap-tight` is 4px between mono lines; `--gap-inline` is 8px beside a mark or arrow. Mono rows use `--row-h` (40px).
- **Color:** `--bg` is paper, `--fg-1` primary ink, and `--fg-2` through `--fg-4` secondary text. `--heat-0` through `--heat-4` form the activity scale. `--now` is the interface accent for current or resolved states. Every color token has a `light-dark()` pair; `data-theme="light|dark"` on `<html>` pins a theme.
- **Type:** Archivo sets display text, titles, and prose. `--type-name` uses weight 700 and width 125%, with `--name-bearing` aligning its first letter to the grid; titles use weight 600 and body text 420. Martian Mono at width 87.5% sets labels, dates, captions, and code. Standard mono is 11/16; captions are 10/14. Letter spacing is zero.
- **Labels and marks:** interface text is lowercase; prose and document titles use sentence case. Dates use `14 aug 2026` or `14 aug`; reading time uses `12 min`. Use `·` within values, `—` between name parts, and →, ↗, ← for internal, external, and back links. The 8px `--mark` square signals the current state. Document kinds use 10×10 hairline glyphs: slashed square, branch, three rules, and a 2×2 grid for the all-items filter.

## Components

- **Page shell:** `.ag-meta` places identity in columns 1–4, navigation in 5–8, and theme controls in 9–12; `.ag-footer` follows the same divisions. Both become two rows below 600px. `.ag-name` uses the display type recipe across the grid.
- **Sections and content:** `.ag-section` places an action in the head at 10–12 or below the content at column 5. `.ag-tile` spans three or six columns; tile rows total 12. `.ag-postrow` and `.ag-linkrow` close with a hairline. `.ag-prose` insets text; quotes open with a 2px rule, while tables, code, and timelines reach the content column lines.
- **Code and activity:** `.ag-codeblock` pairs highlighted code with a language label and copy control. `.ag-commits` fits four weeks per page column, for 48 weeks total. Cells are square with `--commit-gap` (2px); five ink steps show intensity and `--now` marks today.
- **Time spans and events:** `.ag-trace` places labels in 1–4 and an eight-year lane in 5–12, one column per year. Filled spans show work, outlined spans study, and green the current span. Groups use native `<details>`; below 760px the lane moves under the label. `.ag-timeline` places time in the first prose column and events in the rest, with `--mark` nodes on the dividing line. Time stacks above events below 760px.

## Interaction

Links shift between ink and `--fg-3`; rows and tiles use `--hover`. Focus has a 2px ink outline with a 2px offset. `.ag-skip-link` appears on focus and targets `<main id="main">`. Hover changes use `--dur` (80ms) and linear easing. Cross-document view transitions fade the old page out in 80ms and settle the new page from 4px below in 140ms; the meta bar crossfades in place. Theme changes dissolve in 140ms. `prefers-reduced-motion` disables these animations.
