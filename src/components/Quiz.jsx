import React, { useState } from "react";
import { getQuizOptionStyles } from "../utils/index.js";

const Quiz = ({ questions, moduleId }) => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  // Reset when module changes
  const key = moduleId;

  const pick = (qi, oi) => {
    if (answers[qi] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
    setRevealed((prev) => ({ ...prev, [qi]: true }));
  };

  const reset = () => {
    setAnswers({});
    setRevealed({});
  };

  const answered = Object.keys(answers).length;
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div
      style={{ marginTop: 32, borderTop: "1px solid #1e1e2e", paddingTop: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#555577",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            SELF-ASSESSMENT
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e8f0" }}>
            Quick Check
          </div>
        </div>
        {answered > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color:
                  answered === questions.length
                    ? correct === questions.length
                      ? "#44d9a2"
                      : "#fbbf24"
                    : "#666688",
              }}
            >
              {answered === questions.length
                ? `${correct}/${questions.length} correct`
                : `${answered}/${questions.length} answered`}
            </span>
            <button
              onClick={reset}
              style={{
                background: "transparent",
                border: "1px solid #2a2a3a",
                borderRadius: 6,
                padding: "4px 10px",
                color: "#555577",
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              reset
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((q, qi) => {
          const picked = answers[qi];
          const done = picked !== undefined;
          const isRight = picked === q.answer;
          return (
            <div
              key={qi}
              style={{
                background: "#111118",
                border: `1px solid ${done ? (isRight ? "#44d9a240" : "#f4727240") : "#1e1e2e"}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#e8e8f0",
                  fontWeight: 600,
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#444466",
                    marginRight: 8,
                  }}
                >
                  Q{qi + 1}
                </span>
                {q.q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, oi) => {
                  const isSelected = picked === oi;
                  const isCorrect = oi === q.answer;
                  const { bg, border, color } = getQuizOptionStyles(done, isSelected, isCorrect);
                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: 7,
                        border: `1px solid ${border}`,
                        background: bg,
                        color,
                        cursor: done ? "default" : "pointer",
                        fontSize: 12.5,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.5,
                        transition: "all 0.12s",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          marginRight: 8,
                          opacity: 0.5,
                        }}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {done && !isRight && q.explanation && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 12px",
                    background: "rgba(68,217,162,0.05)",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#666688",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: "#44d9a2", fontWeight: 700 }}>→ </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Quiz;
