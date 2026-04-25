import React from "react";

const KeybindChip = ({ keys, desc }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: 4,
        flexShrink: 0,
        flexWrap: "wrap",
        maxWidth: 180,
      }}
    >
      {keys.map((k, i) => (
        <span
          key={i}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            padding: "2px 7px",
            fontFamily: "monospace",
            fontSize: 11,
            color: "#e8e8f0",
            fontWeight: 700,
            boxShadow: "0 2px 0 rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {k}
        </span>
      ))}
    </div>
    <span style={{ fontSize: 12, color: "#9999bb" }}>{desc}</span>
  </div>
);


export default KeybindChip;
