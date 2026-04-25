// Shared utilities and constants


// Utility: hex color → "r,g,b" string for rgba()
export const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

export const applyBold = (str) =>
  str.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8e8f0">$1</strong>');


export const INLINE_CODE_STYLE = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  lineHeight: 1.7,
  color: "#7777aa",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid #1e1e2e",
  borderRadius: 6,
  padding: "12px 16px",
  margin: "12px 0",
  overflowX: "auto",
  whiteSpace: "pre",
  display: "block",
};


export const getQuizOptionStyles = (done, isSelected, isCorrect) => {
  if (!done && isSelected) return { bg: "rgba(91,141,238,0.1)", border: "#5b8dee40", color: "#e8e8f0" };
  if (done && isCorrect)   return { bg: "rgba(68,217,162,0.08)", border: "#44d9a240", color: "#44d9a2" };
  if (done && isSelected)  return { bg: "rgba(244,114,114,0.08)", border: "#f4727240", color: "#f47272" };
  return { bg: "transparent", border: "#2a2a3a", color: "#888899" };
};


export const PYTHON_HIGHLIGHT_RE =
  /("""[\s\S]*?"""|'[^']*'|"[^"]*")|(bpy\.\w+(?:\.\w+)*)|(import\s+\w+|for\s|if\s|in\s|return\s|True|False|None)|(\b\d+\.?\d*\b)|(\b\w+\s*(?=\())|([=,\[\]{}():])/g;

