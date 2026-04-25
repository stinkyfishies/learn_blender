# Blender 5.1 Workshop

A single-page learning app for Blender, designed for people who want to navigate the possibility space: vocabulary, tools, and outcome-to-workflow mapping. Aimed at Mac trackpad users doing AI-assisted scripting (vibe-coding) rather than deep manual operation.

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

**One-time setup:**

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any commit to `main` — the workflow builds and deploys automatically

The workflow lives at `.github/workflows/deploy.yml`. It installs dependencies, runs `vite build`, and deploys `dist/` via `actions/deploy-pages`.

The `base: '/learn_blender/'` in `vite.config.js` must match the repository name for asset paths to resolve correctly on GitHub Pages.

---

## Project Structure

```
src/
├── App.jsx                        root component: state, layout, render
├── components/
│   ├── CodeBlock.jsx              syntax-highlighted Python viewer
│   ├── Quiz.jsx                   self-assessment quiz
│   ├── KeybindChip.jsx            keyboard shortcut chip
│   ├── SectionLabel.jsx           reusable monospace section label
│   └── renderContent.jsx          markdown-like content parser
├── data/
│   ├── modules/
│   │   ├── index.js               aggregates all modules in order
│   │   ├── mentalModel.jsx
│   │   ├── interfaceNavigation.jsx
│   │   ├── bpyAIAssist.jsx
│   │   ├── enhancingBlender.jsx
│   │   ├── meshPrimitives.jsx
│   │   ├── editModeTopology.jsx
│   │   ├── modifiers.jsx
│   │   ├── geometryNodes.jsx
│   │   ├── materialsShading.jsx
│   │   ├── lighting.jsx
│   │   ├── sculptMode.jsx
│   │   ├── booleanHardSurface.jsx
│   │   ├── physicsSimulation.jsx
│   │   ├── rendering.jsx
│   │   └── proceduralTextures.jsx
│   ├── outcomes.jsx               data for the Outcomes tab
│   ├── learningPaths.js           TABS + LEARNING_PATHS constants
│   └── quickRefs.js               keybind reference data
└── utils/
    └── index.js                   shared utilities and constants

main.jsx                           React root mount
index.html                         Vite entry HTML
vite.config.js                     Vite config (base path for GitHub Pages)
CLAUDE.md                          AI assistant context for Blender scripting
```

---

## Data Shapes

### Module (`src/data/modules/*.jsx`)

```js
{
  id: Number,
  emoji: String,
  title: String,
  tag: String,           // short label shown in sidebar (e.g. "CORE MODELING")
  color: String,         // hex accent color
  intro: String,         // framing paragraph shown at top of module
  quiz: [
    {
      q: String,
      options: String[],
      answer: Number,    // index into options
      explanation: String,
    }
  ],
  sections: [
    {
      title: String,
      content: String,       // parsed by renderContent() — see Content Format
      pythonCode: String,    // optional — shown when Python toggle is on
      isWorkshop: Boolean,   // optional — styles section as hands-on exercise
    }
  ]
}
```

### Outcome (`src/data/outcomes.jsx`)

```js
{
  category: String,
  items: [
    {
      goal: String,      // plain-language description of what the user wants
      approach: String,  // which workflow/technique to use, 1-2 sentences
      tools: String[]    // tool name tags shown as chips
    }
  ]
}
```

---

## Content Format

Section `content` strings use a minimal syntax parsed by `renderContent()`:

```
**bold text**           → highlighted in white
- list item             → styled bullet with › prefix
> callout text          → highlighted callout block
blank line              → vertical spacer
##tree / ##endtree      → monospace tree block (for directory structures)
```fence```             → monospace code block (non-Python prose code)
anything else           → paragraph text
```

No heading support within content — use section titles for structure. Keep content conceptual and outcome-oriented, not step-by-step procedural.

---

## Adding a New Module

1. Create `src/data/modules/myModuleName.jsx` following the shape above.
2. Import and add it to `src/data/modules/index.js`.
3. Write 3-5 sections: concept sections + one "Recipes / When to use" + one `isWorkshop: true` hands-on section.
4. Add relevant outcomes to `src/data/outcomes.jsx` under the appropriate category.
5. Update learning path indices in `src/data/learningPaths.js` if the new module belongs in a path.

## Adding an Outcome

Append to the relevant category in `src/data/outcomes.jsx`:

```js
{
  goal: "Plain language description of what the user wants",
  approach: "Which workflow/technique, and why. 1-2 sentences.",
  tools: ["Tool Name", "Modifier Name", "System Name"]
}
```

Keep `goal` user-facing (what they want to achieve), not Blender-jargon (what the tool is called).

---

## Design Principles

1. **Concept-first, not keybind-first.** Understanding what exists and when to use it — not memorizing shortcuts.

2. **Outcome to tool mapping.** Every topic framed as: given this goal, here's which Blender system applies.

3. **Mac trackpad primary.** Navigation always leads with trackpad gestures. Never write "middle mouse button" without the trackpad equivalent.

4. **Blender 5.1 accuracy.** Current terminology only:
   - EEVEE Next (not "EEVEE" or "EEVEE 2.0")
   - Principled BSDF v2 parameter names (Base Color, Roughness, Metallic, IOR — Specular removed)
   - Hair = Geometry Nodes based (not legacy particle hair)
   - Simulation Zones in GN (4.1+)

5. **Non-destructive workflow bias.** Always mention the non-destructive approach first. Flag destructive operations explicitly.

6. **No em dashes.** Use colons, parentheses, or commas instead.

7. **No LLM writing patterns.** No rule-of-three lists, no dramatic short sentences, no filler affirmations, no summary closers.

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^18.3.1 | UI |
| react-dom | ^18.3.1 | DOM rendering |
| vite | ^6.0.0 | Build tool + dev server |
| @vitejs/plugin-react | ^4.3.4 | JSX transform + Fast Refresh |

No routing library, no state management library, no CSS framework. All styles are inline.
