import React from "react";
import { C } from "../utils/colors.js";

const SectionLabel = ({ text, color = C.textDim, mb = 12, size = 10 }) => (
  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, color, letterSpacing: 2, marginBottom: mb }}>
    {text}
  </div>
);


export default SectionLabel;
