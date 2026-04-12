# Blender 5.1 Workshop

A bespoke single-page learning app for Blender, designed for someone who wants to **navigate the possibility space** — understand the vocabulary, the tools, and the outcome→workflow mapping — without needing to memorize every keybind. Designed for Mac trackpad users who will vibe-code (AI-assisted scripting) rather than manually operate Blender in depth.

**Live:** https://stinkyfishies.github.io/learn_blender/

---

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/learn_blender/

## Building

```bash
npm run build      # outputs to dist/
npm run preview    # preview the build locally
```

---

## GitHub Pages Deployment

Deploys automatically on every push to `main` via GitHub Actions.

**One-time setup** (do this once in the GitHub repo settings):

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any commit to `main` — the workflow builds and deploys automatically

The workflow lives at `.github/workflows/deploy.yml`. It:
- Installs dependencies with `npm ci`
- Runs `vite build` (outputs to `dist/`)
- Uploads `dist/` as a Pages artifact
- Deploys via the official `actions/deploy-pages` action

The `base: '/learn_blender/'` in `vite.config.js` must match the repository name for asset paths to resolve correctly on GitHub Pages.

---

## Project Architecture

### File structure

```
blender-workshop.jsx   — the entire app (single file)
main.jsx               — React root mount point
index.html             — Vite entry HTML
vite.config.js         — Vite config (base path for GitHub Pages)
package.json           — dependencies: React 18, Vite 6, @vitejs/plugin-react
.github/workflows/
  deploy.yml           — GitHub Actions: build + deploy to Pages on push to main
```

### Single-file architecture

The entire app lives in `blender-workshop.jsx`. It contains:

1. **`hexToRgb(hex)`** — utility: converts hex color to `"r,g,b"` string for use in `rgba()`.

2. **`modules[]`** — array of 13 module objects. Each module has:
   ```js
   {
     id: Number,
     emoji: String,
     title: String,
     tag: String,          // short label shown in sidebar (e.g. "CORE MODELING")
     color: String,        // hex color for accent
     intro: String,        // one-paragraph framing shown at top of module
     sections: [
       {
         title: String,
         content: String,  // markdown-ish text (see Content Format below)
         isWorkshop: Boolean  // optional — styles the section as a hands-on exercise
       }
     ]
   }
   ```

3. **`outcomes[]`** — data for the Outcomes tab. Array of category groups:
   ```js
   {
     category: String,
     items: [
       {
         goal: String,      // what the user wants to achieve
         approach: String,  // which workflow/technique to use
         tools: String[]    // tool name tags displayed as chips
       }
     ]
   }
   ```

4. **`quickRefs[]`** — array of `{ keys: String[], desc: String }` for the Quick Reference tab.

5. **`KeybindChip`** — renders a keyboard shortcut row (key chips + description).

6. **`applyBold(str)`** — converts `**text**` to `<strong>` HTML.

7. **`renderContent(text)`** — renders module section content. Handles:
   - `- item` or `• item` lines → styled list items with `›` prefix
   - `**bold**` → `<strong>` via `applyBold`
   - Blank lines → spacer divs
   - All other lines → paragraph elements

8. **`BlenderWorkshop`** — the root component. State:
   - `activeModule` — which module is shown (index into `modules[]`)
   - `completedModules` — Set of completed module indices
   - `expandedSections` — object mapping section index → boolean
   - `activeTab` — `"content"` | `"outcomes"` | `"quickref"`

---

## Content Format (for `section.content`)

Content strings use a minimal markdown-ish syntax parsed by `renderContent`:

```
**bold text**           → highlighted in white
- list item             → styled bullet with › prefix
• list item             → same as above
blank line              → vertical spacer between paragraphs
anything else           → paragraph text in muted color
```

There is no heading support within content — use section titles for that. Keep content conceptual and outcome-oriented, not step-by-step procedural.

---

## Design Principles (important for AI agents)

The app is opinionated about **what kind of learning it supports**:

1. **Concept-first, not keybind-first.** The goal is understanding what exists and when to use it — not memorizing shortcuts. Keybinds are secondary context, not the lead.

2. **Outcome → tool mapping.** Every topic should be framed as "given this goal, here's which Blender system applies." The Outcomes tab is the purest expression of this.

3. **Mac trackpad primary.** Navigation instructions always lead with trackpad gestures (Option+drag, pinch, 2-finger pan), keyboard shortcuts secondary. Never write "middle mouse button" without the Option+drag equivalent.

4. **Blender 5.1 accuracy.** Use current terminology:
   - EEVEE Next (not "EEVEE" or "EEVEE 2.0")
   - Transmission Weight (not "Transmission" — renamed in Principled BSDF v2)
   - New hair system = Geometry Nodes based (not legacy particle hair)
   - Simulation Zones in GN (available 4.1+)
   - Light Linking (available 4.1+)

5. **Non-destructive workflow bias.** Always mention the non-destructive approach first. Flag when something is destructive (applying a modifier, sculpting directly).

6. **No speculative content.** Don't add modules or sections that aren't real Blender features or workflows. If a feature is version-specific, note the version.

---

## Adding a New Module

1. Append an object to `modules[]` with a new `id` (increment from last), unique `color`, appropriate `tag`.
2. Write 3–5 sections: 2–3 concept sections + 1 "Recipes / When to use" section + 1 `isWorkshop: true` hands-on section.
3. Add relevant outcomes to `outcomes[]` under the appropriate category (or create a new category).
4. Add any new essential shortcuts to `quickRefs[]`.

## Adding an Outcome

Append to the relevant category in `outcomes[]`:
```js
{
  goal: "Plain language description of what the user wants",
  approach: "Which workflow/technique, and why. 1-2 sentences.",
  tools: ["Tool Name", "Modifier Name", "System Name"]
}
```

Keep `goal` user-facing (what they want), not Blender-jargon (what the tool is called).

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^18.3.1 | UI |
| react-dom | ^18.3.1 | DOM rendering |
| vite | ^6.0.0 | Build tool + dev server |
| @vitejs/plugin-react | ^4.3.4 | JSX transform + Fast Refresh |

No other dependencies. No routing library, no state management library, no CSS framework. All styles are inline.
