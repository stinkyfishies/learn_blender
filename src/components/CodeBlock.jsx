import React from "react";
import { PYTHON_HIGHLIGHT_RE } from "../utils/index.js";
import { C } from "../utils/colors.js";

const CodeBlock = ({ code }) => {
  // Applies per-token syntax highlighting to a single line of Python.
  // Returns an array of colored <span> elements.
  // Match groups correspond to PYTHON_HIGHLIGHT_RE in utils/index.js.
  const highlight = (line) => {
    // Python comments: render the whole line as muted italic, no further tokenizing
    if (/^\s*#/.test(line))
      return (
        <span style={{ color: C.textDim, fontStyle: "italic" }}>{line}</span>
      );

    const tokens = [];
    PYTHON_HIGHLIGHT_RE.lastIndex = 0; // reset stateful /g regex before each line
    const re = PYTHON_HIGHLIGHT_RE;
    let last = 0, m;

    while ((m = re.exec(line)) !== null) {
      // Emit any unmatched text between the last token and this one
      if (m.index > last)
        tokens.push(
          <span key={last} style={{ color: C.textBody }}>
            {line.slice(last, m.index)}
          </span>,
        );
      if (m[1])        // strings (single/double/triple-quoted)
        tokens.push(
          <span key={m.index} style={{ color: C.yellow }}>
            {m[1]}
          </span>,
        );
      else if (m[2])   // bpy.* API calls
        tokens.push(
          <span key={m.index} style={{ color: C.sky }}>
            {m[2]}
          </span>,
        );
      else if (m[3])   // keywords
        tokens.push(
          <span key={m.index} style={{ color: C.purple }}>
            {m[3]}
          </span>,
        );
      else if (m[4])   // numbers
        tokens.push(
          <span key={m.index} style={{ color: C.orangeAlt }}>
            {m[4]}
          </span>,
        );
      else if (m[5])   // function calls
        tokens.push(
          <span key={m.index} style={{ color: C.green }}>
            {m[5]}
          </span>,
        );
      else             // punctuation (=, commas, brackets)
        tokens.push(
          <span key={m.index} style={{ color: C.textSecondary }}>
            {m[0]}
          </span>,
        );
      last = m.index + m[0].length;
    }
    if (last < line.length)
      tokens.push(
        <span key={last} style={{ color: C.textBody }}>
          {line.slice(last)}
        </span>,
      );
    return tokens;
  };

  return (
    <div
      style={{
        marginTop: 12,
        background: C.bgCode,
        border: "1px solid #2a2a4a",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          background: C.bgCodeHeader,
          borderBottom: "1px solid #2a2a4a",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: C.sky,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
          }}
        >
          🐍 bpy
        </span>
        <span
          style={{
            fontSize: 10,
            color: C.textFaint,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Python API equivalent
        </span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code
          .trim()
          .split("\n")
          .map((line, i) => (
            <div key={i}>{highlight(line)}</div>
          ))}
      </pre>
    </div>
  );
};


export default CodeBlock;
