import React from "react";
import { applyBold, INLINE_CODE_STYLE } from "../utils/index.js";

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
            <span style={{ color: "#555577", flexShrink: 0, fontWeight: 700 }}>
              ›
            </span>
            <span
              style={{ fontSize: 13.5, lineHeight: 1.7, color: "#9999bb" }}
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
      flushList(i);
      elements.push(<div key={i} style={{ height: 6 }} />);
    } else if (/^[-•]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-•]\s+/, ""));
    } else if (/^>\s+/.test(line)) {
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
            color: "#666688",
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
            color: "#9999bb",
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
