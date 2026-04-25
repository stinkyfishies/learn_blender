import React, { useState } from "react";
import { getQuizOptionStyles } from "../utils/index.js";
import { C } from "../utils/colors.js";

// moduleId is passed as the React `key` on this component by the parent (App.jsx).
// When the key changes (user navigates to a new module), React unmounts and remounts,
// which resets answers and revealed state without any explicit reset logic needed here.
const Quiz = ({ questions, moduleId }) => {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  const pick = (qi, oi) => {
    if (answers[qi] !== undefined) return; // ignore clicks after the question is answered
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
              color: C.textDim,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            SELF-ASSESSMENT
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>
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
                      ? C.green
                      : C.yellow
                    : C.textSecondary,
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
                color: C.textDim,
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
                background: C.bgCard,
                border: `1px solid ${done ? (isRight ? C.greenAlpha : C.redAlpha) : C.border}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: C.textPrimary,
                  fontWeight: 600,
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: C.textFaint,
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
                    color: C.textSecondary,
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: C.green, fontWeight: 700 }}>→ </span>
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
