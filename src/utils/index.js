// Shared utilities, constants, and style objects used across components.
import { C } from "../utils/colors.js";

// Converts a hex color string to "r,g,b" for use in rgba() expressions.
// e.g. hexToRgb(C.orange) → "232,98,42"
export const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

// Converts **text** markers to inline <strong> HTML.
// Used with dangerouslySetInnerHTML — input is always from our own content strings, not user data.
export const applyBold = (str) =>
  str.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.textPrimary}">$1</strong>`);


export const INLINE_CODE_STYLE = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  lineHeight: 1.7,
  color: C.textCode,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid #1e1e2e",
  borderRadius: 6,
  padding: "12px 16px",
  margin: "12px 0",
  overflowX: "auto",
  whiteSpace: "pre",
  display: "block",
};


// Returns background/border/color for a quiz answer button based on its state.
// Priority order matters: correctness is shown only after the question is answered (done).
export const getQuizOptionStyles = (done, isSelected, isCorrect) => {
  if (!done && isSelected) return { bg: "rgba(91,141,238,0.1)", border: C.blueAlpha, color: C.textPrimary };
  if (done && isCorrect)   return { bg: "rgba(68,217,162,0.08)", border: C.greenAlpha, color: C.green };
  if (done && isSelected)  return { bg: "rgba(244,114,114,0.08)", border: C.redAlpha, color: C.red };
  return { bg: "transparent", border: C.borderMid, color: C.textMuted };
};


// Regex for Python syntax highlighting. Match groups (used in CodeBlock.jsx):
//   m[1] — strings (single/double/triple-quoted)
//   m[2] — bpy.* API calls
//   m[3] — keywords (import, for, if, in, return, True, False, None)
//   m[4] — numbers
//   m[5] — function calls (word followed by open paren)
//   m[6] — punctuation (=, commas, brackets)
// Reset lastIndex before each use — the /g flag makes it stateful.
export const PYTHON_HIGHLIGHT_RE =
  /("""[\s\S]*?"""|'[^']*'|"[^"]*")|(bpy\.\w+(?:\.\w+)*)|(import\s+\w+|for\s|if\s|in\s|return\s|True|False|None)|(\b\d+\.?\d*\b)|(\b\w+\s*(?=\())|([=,\[\]{}():])/g;

