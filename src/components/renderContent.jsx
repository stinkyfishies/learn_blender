import React from "react";
import { applyBold, INLINE_CODE_STYLE } from "../utils/index.js";
import { C } from "../utils/colors.js";

// Parses section content strings into React elements.
// Supports a minimal markdown-like syntax:
//   **text**          → bold (white)
//   - item / • item   → styled bullet list
//   >> text           → tip callout (sky-blue, "TIP" label)
//   !! text           → trap callout (orange, "COMMON TRAP" label)
//   > text            → callout block (indented, italic)
//   ```               → fenced code block (monospace, starts/ends with ```)
//   ##tree/##endtree  → directory tree block (same style as code block)
//   blank line        → vertical spacer
//   anything else     → paragraph
//
// Buffers are used for list and block types that span multiple lines.
// Each flush call emits the buffered lines as a single element and clears the buffer.
const renderContent = (text) => {
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];
  let treeBuffer = [];
  let inTree = false;

  const flushList = (key) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul
        key={`ul-${key}`}
        style={{ margin: "4px 0", padding: 0, listStyle: "none" }}
      >
        {listBuffer.map((item, idx) => (
          <li key={idx} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
            <span style={{ color: C.textDim, flexShrink: 0, fontWeight: 700 }}>
              ›
            </span>
            <span
              style={{ fontSize: 13.5, lineHeight: 1.7, color: C.textBody }}
              dangerouslySetInnerHTML={{ __html: applyBold(item) }}
            />
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  let codeBuffer = [];
  let inCode = false;

  const flushCode = (key) => {
    if (codeBuffer.length === 0) return;
    elements.push(<pre key={`code-${key}`} style={INLINE_CODE_STYLE}>{codeBuffer.join("\n")}</pre>);
    codeBuffer = [];
  };

  const flushTree = (key) => {
    if (treeBuffer.length === 0) return;
    elements.push(<pre key={`tree-${key}`} style={INLINE_CODE_STYLE}>{treeBuffer.join("\n")}</pre>);
    treeBuffer = [];
  };

  lines.forEach((line, i) => {
    // Fenced code block toggle (``` opens and closes)
    if (line.trim() === "```") {
      if (inCode) {
        flushCode(i);
        inCode = false;
      } else {
        flushList(i);
        inCode = true;
      }
      return;
    }
    if (inCode) {
      codeBuffer.push(line);
      return;
    }
    // Directory tree block (##tree / ##endtree)
    if (line.trim() === "##tree") {
      flushList(i);
      inTree = true;
      return;
    }
    if (line.trim() === "##endtree") {
      flushTree(i);
      inTree = false;
      return;
    }
    if (inTree) {
      treeBuffer.push(line);
      return;
    }
    if (!line.trim()) {
      // Blank line: flush any open list, emit a small spacer
      flushList(i);
      elements.push(<div key={i} style={{ height: 6 }} />);
    } else if (/^[-•]\s+/.test(line)) {
      // Bullet list item: buffered until a blank line or non-list line
      listBuffer.push(line.replace(/^[-•]\s+/, ""));
    } else if (/^>>\s+/.test(line)) {
      // Tip / insight callout: positive, sky-blue treatment
      flushList(i);
      elements.push(
        <div
          key={i}
          style={{
            borderLeft: `3px solid ${C.sky}`,
            background: "rgba(56,189,248,0.06)",
            borderRadius: "0 6px 6px 0",
            padding: "10px 14px",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: 2,
              color: C.sky,
              marginBottom: 5,
            }}
          >
            TIP
          </div>
          <div
            style={{ fontSize: 12.5, lineHeight: 1.6, color: C.textBody }}
            dangerouslySetInnerHTML={{ __html: applyBold(line.replace(/^>>\s+/, "")) }}
          />
        </div>,
      );
    } else if (/^!!\s+/.test(line)) {
      // Trap callout: visually distinct from regular callouts
      flushList(i);
      elements.push(
        <div
          key={i}
          style={{
            borderLeft: `3px solid ${C.orange}`,
            background: "rgba(232,98,42,0.06)",
            borderRadius: "0 6px 6px 0",
            padding: "10px 14px",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: 2,
              color: C.orange,
              marginBottom: 5,
            }}
          >
            COMMON TRAP
          </div>
          <div
            style={{ fontSize: 12.5, lineHeight: 1.6, color: C.textBody }}
            dangerouslySetInnerHTML={{ __html: applyBold(line.replace(/^!!\s+/, "")) }}
          />
        </div>,
      );
    } else if (/^>\s+/.test(line)) {
      // Callout / blockquote line
      flushList(i);
      elements.push(
        <div
          key={i}
          style={{
            borderLeft: "2px solid #2a2a3a",
            paddingLeft: 12,
            marginTop: 4,
            marginBottom: 6,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: C.textSecondary,
            fontStyle: "italic",
          }}
          dangerouslySetInnerHTML={{ __html: applyBold(line.replace(/^>\s+/, "")) }}
        />,
      );
    } else {
      flushList(i);
      elements.push(
        <p
          key={i}
          style={{
            fontSize: 13.5,
            lineHeight: 1.7,
            color: C.textBody,
            marginBottom: 2,
          }}
          dangerouslySetInnerHTML={{ __html: applyBold(line) }}
        />,
      );
    }
  });

  flushList("end");
  return elements;
};


export default renderContent;
