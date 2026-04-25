// Central color palette for the workshop UI.
// Import as: import { C } from "./colors.js";
//
// All hex values in component files should reference this palette.
// Data files (src/data/) use module-specific accent colors and are exempt.

export const C = {
  // --- Backgrounds ---
  bgBase:       "#0a0a0f",  // app root background
  bgCard:       "#111118",  // card / surface
  bgCode:       "#0d0d16",  // CodeBlock background
  bgCodeHeader: "#111128",  // CodeBlock header strip

  // --- Borders ---
  border:       "#1e1e2e",  // primary border
  borderMid:    "#2a2a3a",  // mid-weight border (quiz buttons, etc.)
  borderLight:  "#3a3a4a",  // light border

  // --- Text scale (light → dim) ---
  textPrimary:  "#e8e8f0",  // headings, active labels
  textBody:     "#9999bb",  // body / content text
  textMuted:    "#888899",  // secondary labels
  textSecondary:"#666688",  // tertiary / helper text
  textDim:      "#555577",  // sidebar labels, disabled
  textFaint:    "#444466",  // Q-number labels, very muted
  textCode:     "#7777aa",  // inline code / pre blocks
  textSubtle:   "#c8c8e0",  // slightly dimmed from primary (sidebar module titles)
  textGhost:    "#333355",  // near-invisible labels (step numbers, arrows)
  bgDeep:       "#0f0f18",  // deeper background (learning path dropdown)

  // --- Accent colors ---
  orange:       "#e8622a",  // primary accent (logo, CTAs)
  blue:         "#5b8dee",  // interface / navigation module
  sky:          "#38bdf8",  // bpy / Python accent
  green:        "#44d9a2",  // success / completion
  yellow:       "#fbbf24",  // strings in CodeBlock
  orangeAlt:    "#fb923c",  // numbers in CodeBlock
  purple:       "#c084fc",  // keywords in CodeBlock
  purpleLight:  "#a78bfa",  // workflow guide accent
  red:          "#f47272",  // error / wrong answer

  // --- Semi-transparent variants (used in borders/backgrounds with alpha) ---
  greenAlpha:   "#44d9a240",
  redAlpha:     "#f4727240",
  blueAlpha:    "#5b8dee40",
};
