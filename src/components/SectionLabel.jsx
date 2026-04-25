import React from "react";

const SectionLabel = ({ text, color = "#555577", mb = 12, size = 10 }) => (
  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, color, letterSpacing: 2, marginBottom: mb }}>
    {text}
  </div>
);


export default SectionLabel;
