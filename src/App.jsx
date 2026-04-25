import React, { useState, useEffect, useRef } from "react";
import modules from "./data/modules/index.js";
import outcomes from "./data/outcomes.jsx";
import { TABS, LEARNING_PATHS } from "./data/learningPaths.js";
import { hexToRgb } from "./utils/index.js";
import KeybindChip from "./components/KeybindChip.jsx";
import SectionLabel from "./components/SectionLabel.jsx";
import renderContent from "./components/renderContent.jsx";
import Quiz from "./components/Quiz.jsx";
import CodeBlock from "./components/CodeBlock.jsx";


export default function BlenderWorkshop() {
  const [activeModule, setActiveModule] = useState(null); // null = home
  const [completedModules, setCompletedModules] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [activeTab, setActiveTab] = useState("content");
  const [showPython, setShowPython] = useState(false);
  const [openPath, setOpenPath] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollToSection, setScrollToSection] = useState(null);
  const contentRef = useRef(null);

  // Scroll content area back to top whenever the active module changes.
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeModule]);

  // Scroll to a specific section when scrollToSection is set.
  // The 100ms delay lets the module render complete before scrollIntoView fires —
  // without it the target element may not be in the DOM yet.
  // Callers set expandedSections before setting scrollToSection so the section is open.
  useEffect(() => {
    if (scrollToSection === null) return;
    const el = document.querySelector(`[data-section-id="${scrollToSection}"]`);
    if (el && contentRef.current) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    setScrollToSection(null);
  }, [scrollToSection]);

  // Track viewport width for mobile layout switching (breakpoint: 768px).
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const mod = activeModule !== null ? modules[activeModule] : null;
  const progress = Math.round((completedModules.size / modules.length) * 100);

  const toggleSection = (i) => {
    setExpandedSections((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const markComplete = () => {
    setCompletedModules((prev) => new Set([...prev, activeModule]));
    if (activeModule < modules.length - 1) {
      setActiveModule(activeModule + 1);
      setExpandedSections({ 0: true });
    }
  };

  const goHome = () => {
    setActiveModule(null);
    setActiveTab("content");
    setSidebarOpen(false);
  };


  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: "'Inter', sans-serif",
        background: "#0a0a0f",
        color: "#e8e8f0",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }
        * { box-sizing: border-box; }
        @keyframes bpy-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0.0); background: rgba(56,189,248,0.06); }
          50% { box-shadow: 0 0 0 6px rgba(56,189,248,0.0); background: rgba(56,189,248,0.14); }
        }
        @keyframes bpy-snake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(3px); }
          75% { transform: translateX(-3px); }
        }
      `}</style>

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 10,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          background: "rgba(13,13,20,0.98)",
          borderRight: "1px solid #1e1e2e",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 20,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
              }
            : {}),
        }}
      >
        {/* Logo */}
        <div
          onClick={goHome}
          style={{
            padding: "24px 20px 16px",
            borderBottom: "1px solid #1e1e2e",
            cursor: "pointer",
          }}
        >
          <SectionLabel text="WORKSHOP FOR AI-ASSISTED CODERS" color="#e8622a" size={9} mb={4} />
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            Blender <span style={{ color: "#e8622a" }}>5.1</span>
          </div>
        </div>

        {/* Progress */}
        <div
          style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e" }}
        >
          <SectionLabel text="PROGRESS" size={9} mb={6} />
          <div
            style={{
              height: 3,
              background: "#1e1e2e",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #e8622a, #5b8dee)",
                borderRadius: 2,
                transition: "width 0.5s",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#e8622a",
              marginTop: 5,
            }}
          >
            {completedModules.size}/{modules.length} modules · {progress}%
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "0 16px 8px" }}>
          <input
            type="text"
            placeholder="Search modules, sections..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e1e2e",
              borderRadius: 6,
              padding: "7px 10px",
              fontSize: 12,
              color: "#c8c8e0",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          />
          {searchQuery.trim().length > 1 && (() => {
            const q = searchQuery.trim().toLowerCase();
            const results = [];
            modules.forEach((m, mi) => {
              if (m.title.toLowerCase().includes(q)) {
                results.push({ moduleIdx: mi, sectionIdx: null, label: m.title, sub: "Module", color: m.color, emoji: m.emoji });
              }
              m.sections.forEach((s, si) => {
                const inTitle = s.title.toLowerCase().includes(q);
                const inContent = s.content && s.content.toLowerCase().includes(q);
                if (inTitle || inContent) {
                  results.push({ moduleIdx: mi, sectionIdx: si, label: s.title, sub: m.title, color: m.color, emoji: m.emoji });
                }
              });
            });
            if (results.length === 0) return (
              <div style={{ fontSize: 11, color: "#444466", padding: "8px 4px" }}>No results</div>
            );
            return (
              <div style={{ marginTop: 6, maxHeight: 300, overflowY: "auto" }}>
                {results.map((r, ri) => (
                  <div
                    key={ri}
                    onClick={() => {
                      setActiveModule(r.moduleIdx);
                      setActiveTab("content");
                      setSidebarOpen(false);
                      setSearchQuery("");
                      if (r.sectionIdx !== null) {
                        setExpandedSections(prev => ({ ...prev, [r.sectionIdx]: true }));
                        setScrollToSection(r.sectionIdx);
                      } else {
                        setExpandedSections({ 0: true });
                      }
                    }}
                    style={{
                      padding: "6px 8px",
                      cursor: "pointer",
                      borderRadius: 4,
                      marginBottom: 2,
                      background: "rgba(255,255,255,0.03)",
                      borderLeft: `2px solid ${r.color}`,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#c8c8e0", fontWeight: 600 }}>{r.emoji} {r.label}</div>
                    <div style={{ fontSize: 10, color: "#555577", marginTop: 1 }}>{r.sub}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {/* Home */}
          <div
            onClick={goHome}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 20px",
              cursor: "pointer",
              borderLeft: `3px solid ${activeModule === null ? "#e8622a" : "transparent"}`,
              background:
                activeModule === null ? "rgba(232,98,42,0.08)" : "transparent",
              transition: "all 0.15s",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>
              🏠
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: activeModule === null ? "#e8e8f0" : "#888899",
                }}
              >
                Overview
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: "#444466",
                  letterSpacing: 1,
                }}
              >
                START HERE
              </div>
            </div>
          </div>
          <div
            style={{ height: 1, background: "#1e1e2e", margin: "4px 20px 8px" }}
          />
          {modules.map((m, i) => (
            <div
              key={m.id}
              onClick={() => {
                setActiveModule(i);
                setExpandedSections({ 0: true });
                setActiveTab("content");
                setSidebarOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 20px",
                cursor: "pointer",
                borderLeft: `3px solid ${i === activeModule ? m.color : "transparent"}`,
                background:
                  i === activeModule
                    ? `rgba(${hexToRgb(m.color)},0.08)`
                    : "transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>
                {m.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: i === activeModule ? "#e8e8f0" : "#888899",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.title}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: "#444466",
                    letterSpacing: 1,
                  }}
                >
                  {m.tag}
                </div>
              </div>
              {completedModules.has(i) && (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#44d9a2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "#0a0a0f",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ko-fi */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1e1e2e", marginTop: "auto" }}>
          <a
            href="https://ko-fi.com/stinkyfishies"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #2a2a3a",
              borderRadius: 8,
              color: "#666688",
              fontSize: 12,
              textDecoration: "none",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 15 }}>☕</span>
            Buy me a coffee
          </a>
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: isMobile ? "0 12px" : "0 32px",
            borderBottom: "1px solid #1e1e2e",
            display: "flex",
            alignItems: "center",
            gap: 0,
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#888899",
                fontSize: 20,
                cursor: "pointer",
                padding: "12px 12px 12px 0",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ☰
            </button>
          )}
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: isMobile ? "12px 10px" : "14px 20px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? (mod ? mod.color : "#e8622a") : "transparent"}`,
                color: activeTab === tab.id ? "#e8e8f0" : "#555577",
                cursor: "pointer",
                fontSize: isMobile ? 18 : 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: isMobile ? 0 : 1,
                transition: "all 0.15s",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {isMobile ? tab.mobileLabel : tab.label}
            </button>
          ))}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingRight: 4,
            }}
          >
            <div
              onClick={() => setShowPython((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: showPython
                  ? "rgba(56,189,248,0.12)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${showPython ? "#38bdf8" : "#3a3a4a"}`,
                borderRadius: 8,
                padding: "4px 10px 4px 8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 13 }}>🐍</span>
              {!isMobile && (
                <span
                  style={{
                    fontSize: 12,
                    color: showPython ? "#38bdf8" : "#aaaacc",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: 1,
                    transition: "color 0.2s",
                    fontWeight: showPython ? 700 : 400,
                  }}
                >
                  bpy
                </span>
              )}
              <div
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: showPython ? "rgba(56,189,248,0.25)" : "#2a2a3a",
                  border: `1px solid ${showPython ? "#38bdf8" : "#3a3a4a"}`,
                  position: "relative",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: showPython ? 20 : 3,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: showPython ? "#38bdf8" : "#666688",
                    transition: "all 0.2s",
                  }}
                />
              </div>
            </div>
          </div>
          {isMobile && (
            <a
              href="https://ko-fi.com/stinkyfishies"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 18,
                textDecoration: "none",
                padding: "12px 4px 12px 8px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ☕
            </a>
          )}
        </div>

        {/* Learning Paths sticky bar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "0 16px", borderBottom: "1px solid #1e1e2e",
            background: "#0a0a0f",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#444466", letterSpacing: 2, paddingRight: 8, borderRight: "1px solid #1e1e2e", marginRight: 4, whiteSpace: "nowrap" }}>YOUR PATH</span>
            {LEARNING_PATHS.map((path, pi) => (
              <button
                key={pi}
                onClick={() => setOpenPath(openPath === pi ? null : pi)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "8px 10px",
                  background: openPath === pi ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  borderBottom: `2px solid ${openPath === pi ? "#e8622a" : "transparent"}`,
                  color: openPath === pi ? "#e8e8f0" : "#555577",
                  cursor: "pointer", fontSize: 11, fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "nowrap", transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 13 }}>{path.emoji}</span>
                {!isMobile && <span>{path.shortTitle}</span>}
              </button>
            ))}
          </div>

          {/* Dropdown */}
          {openPath !== null && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
              background: "#0f0f18", border: "1px solid #2a2a3a",
              borderTop: "none", borderRadius: "0 0 10px 10px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              maxHeight: 340, overflowY: "auto",
            }}>
              <div style={{ padding: "10px 20px 6px", borderBottom: "1px solid #1a1a28" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0" }}>{LEARNING_PATHS[openPath].emoji} {LEARNING_PATHS[openPath].title}</div>
                <div style={{ fontSize: 11, color: "#555577", marginTop: 2 }}>{LEARNING_PATHS[openPath].desc}</div>
              </div>
              {LEARNING_PATHS[openPath].modules.map((m, mi) => (
                <div
                  key={mi}
                  onClick={() => { setActiveModule(m.idx); setExpandedSections({ 0: true }); setActiveTab("content"); setOpenPath(null); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 20px",
                    borderBottom: mi < LEARNING_PATHS[openPath].modules.length - 1 ? "1px solid #12121c" : "none",
                    cursor: "pointer", transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#333355", width: 18, flexShrink: 0 }}>{String(mi + 1).padStart(2, "0")}</div>
                  <span style={{ fontSize: 15, width: 22, textAlign: "center", flexShrink: 0 }}>{modules[m.idx].emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#c8c8e0" }}>{modules[m.idx].title}</div>
                    <div style={{ fontSize: 11, color: "#555577" }}>{m.note}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#333355" }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? "20px 16px" : "32px",
          }}
        >
          {/* ── OUTCOMES TAB ── */}
          {activeTab === "outcomes" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#e8622a",
                    letterSpacing: 3,
                    marginBottom: 6,
                  }}
                >
                  DECISION GUIDE
                </div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  What Do You Want to Make?
                </div>
                <div style={{ fontSize: 13, color: "#666688", marginTop: 4 }}>
                  Find your goal → learn which Blender tools and workflow apply
                </div>
              </div>

              {outcomes.map((group) => (
                <div key={group.category} style={{ marginBottom: 32 }}>
                  <SectionLabel text={group.category.toUpperCase()} />
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {group.items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#111118",
                          border: "1px solid #1e1e2e",
                          borderRadius: 10,
                          padding: "14px 18px",
                          display: "grid",
                          gridTemplateColumns: "1fr 1.4fr auto",
                          gap: 16,
                          alignItems: "start",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#e8e8f0",
                              marginBottom: 2,
                            }}
                          >
                            {item.goal}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9999bb",
                            lineHeight: 1.6,
                          }}
                        >
                          {item.approach}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                            justifyContent: "flex-end",
                          }}
                        >
                          {item.tools.map((tool, j) => (
                            <span
                              key={j}
                              style={{
                                background: "rgba(91,141,238,0.12)",
                                border: "1px solid rgba(91,141,238,0.2)",
                                borderRadius: 4,
                                padding: "2px 8px",
                                fontSize: 10,
                                color: "#5b8dee",
                                fontFamily: "'JetBrains Mono', monospace",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── QUICK REF TAB ── */}
          {activeTab === "quickref" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#e8622a",
                    letterSpacing: 3,
                    marginBottom: 6,
                  }}
                >
                  REFERENCE
                </div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  Shortcuts & Controls
                </div>
                <div style={{ fontSize: 13, color: "#666688", marginTop: 4 }}>
                  Mac trackpad primary. Keyboard wherever possible.
                </div>
              </div>

              {/* Mac trackpad callout */}
              <div
                style={{
                  marginBottom: 24,
                  padding: 16,
                  background: "rgba(91,141,238,0.08)",
                  border: "1px solid rgba(91,141,238,0.2)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#5b8dee",
                    marginBottom: 8,
                  }}
                >
                  Mac Trackpad Setup (do this first)
                </div>
                <div
                  style={{ fontSize: 12, color: "#888899", lineHeight: 1.7 }}
                >
                  Edit → Preferences → Input:
                  <br />✅{" "}
                  <strong style={{ color: "#e8e8f0" }}>
                    Emulate 3 Button Mouse
                  </strong>{" "}
                  → Option+drag = middle mouse
                  <br />✅{" "}
                  <strong style={{ color: "#e8e8f0" }}>Emulate Numpad</strong> →
                  number row = view shortcuts
                  <br />✅{" "}
                  <strong style={{ color: "#e8e8f0" }}>
                    Use Multi-Touch Trackpad
                  </strong>{" "}
                  → 2-finger drag = orbit, Shift+2-finger = pan, pinch = zoom
                </div>
              </div>

              {/* Workflow Guides */}
              {(() => {
                const guides = [
                  {
                    title: "Set up Blender",
                    color: "#5b8dee",
                    steps: [
                      { label: "Configure Mac trackpad", moduleIdx: 1, sectionIdx: 0 },
                      { label: "Editor layout & workspaces", moduleIdx: 1, sectionIdx: 2 },
                      { label: "Built-in add-ons to enable", moduleIdx: 3, sectionIdx: 0 },
                      { label: "Recommended preferences", moduleIdx: 3, sectionIdx: 3 },
                    ],
                  },
                  {
                    title: "Set up IDE for AI-Assist",
                    color: "#38bdf8",
                    steps: [
                      { label: "What you actually need", moduleIdx: 2, sectionIdx: 0 },
                      { label: "External editor: VS Code or Zed", moduleIdx: 2, sectionIdx: 7 },
                      { label: "Give your AI Blender context", moduleIdx: 2, sectionIdx: 8 },
                      { label: "Organise your project", moduleIdx: 2, sectionIdx: 9 },
                      { label: "Version control (git)", moduleIdx: 2, sectionIdx: 10 },
                    ],
                  },
                  {
                    title: "AI-Assisted Coding Workflow",
                    color: "#a78bfa",
                    steps: [
                      { label: "The coding loop", moduleIdx: 2, sectionIdx: 1 },
                      { label: "Scripting workspace layout", moduleIdx: 2, sectionIdx: 3 },
                      { label: "Finding operator names", moduleIdx: 2, sectionIdx: 4 },
                      { label: "Debugging scripts", moduleIdx: 2, sectionIdx: 5 },
                      { label: "Mini workshop: first bpy script", moduleIdx: 2, sectionIdx: 11 },
                    ],
                  },
                ];
                return (
                  <div style={{ marginBottom: 24 }}>
                    <SectionLabel text="WORKFLOW GUIDES" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {guides.map((guide) => (
                        <div key={guide.title} style={{ background: "#111118", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: guide.color, marginBottom: 10 }}>{guide.title}</div>
                          {guide.steps.map((step, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setActiveModule(step.moduleIdx);
                                setActiveTab("content");
                                setExpandedSections(prev => ({ ...prev, [step.sectionIdx]: true }));
                                setTimeout(() => setScrollToSection(step.sectionIdx), 80);
                              }}
                              style={{ display: "flex", alignItems: "baseline", gap: 6, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
                            >
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#333355", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                              <span style={{ fontSize: 12, color: "#7777aa", lineHeight: 1.4 }}
                                onMouseEnter={e => e.currentTarget.style.color = guide.color}
                                onMouseLeave={e => e.currentTarget.style.color = "#7777aa"}
                              >{step.label}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  {
                    title: "Viewport (Trackpad)",
                    keys: [
                      { keys: ["2-finger drag"], desc: "Orbit" },
                      { keys: ["Shift", "2-finger drag"], desc: "Pan" },
                      { keys: ["Pinch"], desc: "Zoom" },
                      { keys: ["Numpad ."], desc: "Frame selected" },
                      { keys: ["1 / 3 / 7"], desc: "Front / Right / Top" },
                      { keys: ["5"], desc: "Ortho ↔ Perspective" },
                      { keys: ["0"], desc: "Camera view" },
                      { keys: ["`"], desc: "View pie menu" },
                      { keys: ["Z"], desc: "Shading pie menu" },
                      { keys: ["Alt", "Z"], desc: "X-Ray toggle" },
                    ],
                  },
                  {
                    title: "Object Mode",
                    keys: [
                      { keys: ["Shift", "A"], desc: "Add object" },
                      { keys: ["G / R / S"], desc: "Grab / Rotate / Scale" },
                      {
                        keys: ["X / Y / Z"],
                        desc: "Constrain to axis (after G/R/S)",
                      },
                      { keys: ["Shift", "D"], desc: "Duplicate (own copy)" },
                      { keys: ["Alt", "D"], desc: "Linked duplicate" },
                      { keys: ["Ctrl", "J"], desc: "Join objects" },
                      { keys: ["H"], desc: "Hide selection" },
                      { keys: ["Alt", "H"], desc: "Unhide all" },
                      { keys: ["X"], desc: "Delete menu" },
                      { keys: ["F3"], desc: "Search any operator" },
                    ],
                  },
                  {
                    title: "Edit Mode",
                    keys: [
                      { keys: ["Tab"], desc: "Enter / exit Edit Mode" },
                      {
                        keys: ["1 / 2 / 3"],
                        desc: "Vertex / Edge / Face select",
                      },
                      { keys: ["Alt", "Click"], desc: "Select edge/face loop" },
                      { keys: ["O"], desc: "Proportional Editing" },
                      { keys: ["E"], desc: "Extrude" },
                      { keys: ["I"], desc: "Inset faces" },
                      { keys: ["Ctrl", "R"], desc: "Loop cut" },
                      { keys: ["Ctrl", "B"], desc: "Bevel" },
                      { keys: ["K"], desc: "Knife tool" },
                      { keys: ["M"], desc: "Merge vertices" },
                    ],
                  },
                  {
                    title: "General",
                    keys: [
                      { keys: ["Ctrl", "Z"], desc: "Undo (Cmd+Z)" },
                      {
                        keys: ["Ctrl", "Shift", "Z"],
                        desc: "Redo (Cmd+Shift+Z)",
                      },
                      { keys: ["N"], desc: "Sidebar panel" },
                      { keys: ["Ctrl", "Space"], desc: "Maximize editor" },
                      { keys: ["F12"], desc: "Render" },
                      { keys: ["F11"], desc: "Show last render" },
                      { keys: ["Ctrl", "S"], desc: "Save file" },
                      { keys: ["Ctrl", "Shift", "S"], desc: "Save As" },
                      { keys: ["F4"], desc: "File menu" },
                      { keys: ["Ctrl", "Alt", "Q"], desc: "Quad view" },
                    ],
                  },
                ].map((group) => (
                  <div
                    key={group.title}
                    style={{
                      background: "#111118",
                      border: "1px solid #1e1e2e",
                      borderRadius: 10,
                      padding: 18,
                    }}
                  >
                    <SectionLabel text={group.title.toUpperCase()} mb={10} />
                    {group.keys.map((k, i) => (
                      <KeybindChip key={i} {...k} />
                    ))}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "rgba(232,98,42,0.08)",
                  border: "1px solid rgba(232,98,42,0.2)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e8622a",
                    marginBottom: 6,
                  }}
                >
                  F3: Your Most Important Shortcut
                </div>
                <div
                  style={{ fontSize: 12, color: "#888899", lineHeight: 1.6 }}
                >
                  Press <strong style={{ color: "#e8e8f0" }}>F3</strong>{" "}
                  anywhere in Blender to search every operator by name. If you
                  know what you want but not where it lives: F3 finds it. This
                  is how you navigate Blender when AI-assisted coding: describe what
                  you want, search for it.
                </div>
              </div>
            </div>
          )}

          {/* ── HOME / LANDING PAGE ── */}
          {activeModule === null && activeTab === "content" && (
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              {/* Hero */}
              <div
                style={{
                  marginBottom: 48,
                  paddingBottom: 40,
                  borderBottom: "1px solid #1e1e2e",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    color: "#e8622a",
                    letterSpacing: 3,
                    marginBottom: 20,
                  }}
                >
                  BLENDER 5.1 WORKSHOP FOR AI-ASSISTED CODERS
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: 20,
                  }}
                >
                  Learn the language,
                  <br />
                  <span style={{ color: "#e8622a" }}>know what's possible.</span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#888899",
                    lineHeight: 1.8,
                    maxWidth: 560,
                  }}
                >
                  You don't need to master Blender. You need to think in it. This workshop gives you the vocabulary, the mental model, the outcome→tool map and everything else you need to direct AI and get extraordinary results.
                </div>
              </div>

              {/* POV */}
              <div style={{ marginBottom: 40 }}>
                <SectionLabel text="THE LEARNING METHOD" mb={16} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      icon: "🗺️",
                      title: "Possibility space first",
                      body: "Each module maps what exists and what it's for before drilling into how to use it. You learn the territory before you learn the roads.",
                    },
                    {
                      icon: "🎯",
                      title: "Outcome → tool thinking",
                      body: "The Outcomes tab inverts the learning: start from what you want to make, then find which Blender system applies. That's how AI-assisted coding works in practice.",
                    },
                    {
                      icon: "🐍",
                      title: "UI maps to code",
                      body: "Every section has a Python/bpy equivalent. Toggle it on (top right of page) to see how each knob in Blender's interface maps to a line of code you can generate or modify.",
                    },
                    {
                      icon: "🎯",
                      title: "Self-assessment, not grades",
                      body: "Each module ends with a short quiz. This quiz is not about gates or scores, but simply a motivated self-learner's recall assist.",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      style={{
                        background: "#111118",
                        border: "1px solid #1e1e2e",
                        borderRadius: 10,
                        padding: "16px 18px",
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 8 }}>
                        {card.icon}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#e8e8f0",
                          marginBottom: 6,
                        }}
                      >
                        {card.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#777799",
                          lineHeight: 1.65,
                        }}
                      >
                        {card.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to use */}
              <div
                style={{
                  marginBottom: 40,
                  background: "#111118",
                  border: "1px solid #1e1e2e",
                  borderRadius: 10,
                  padding: "22px 24px",
                }}
              >
                <SectionLabel text="HOW TO USE THIS WORKSHOP" mb={16} />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {[
                    {
                      step: "→",
                      label: "Go in any order",
                      desc: "Jump to whatever is relevant to what you're building right now. The sidebar is a menu, not a curriculum. The Your Paths suggestions are just that: suggestions.",
                    },
                    {
                      step: "→",
                      label: "Each module is self-contained",
                      desc: "Every module has its own framing, sections, bpy code, and quiz. You don't need to have read anything else to get value from any single module.",
                    },
                    {
                      step: "→",
                      label: "Toggle the 🐍 bpy switch",
                      desc: "Turn it on to see how the UI concepts in any section map to Python. This is the bridge to AI-assisted coding: it shows you the vocabulary to use when prompting.",
                    },
                    {
                      step: "→",
                      label: "Use the quiz to check your mental model",
                      desc: "The quiz at the bottom of each module is a recall assist, not a gate. If something surprises you, re-read the relevant section.",
                    },
                    {
                      step: "→",
                      label: "Use the Outcomes tab as a reference",
                      desc: "The Outcomes tab is an index of Blender's possibility space: start from what you want to make, find which system applies. Use it anytime.",
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      style={{ display: "flex", gap: 16, alignItems: "start" }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: "#e8622a",
                          flexShrink: 0,
                          paddingTop: 1,
                          width: 24,
                        }}
                      >
                        {s.step}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#e8e8f0",
                            marginBottom: 3,
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: "#777799",
                            lineHeight: 1.65,
                          }}
                        >
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time table */}
              <div style={{ marginBottom: 40 }}>
                <SectionLabel text="TIME ALLOCATION" mb={16} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  {[
                    {
                      label: "Concept pass",
                      time: "~5.5 hrs",
                      note: "Reading only, all 14 modules",
                      color: "#5b8dee",
                    },
                    {
                      label: "With exercises",
                      time: "~11 hrs",
                      note: "Doing the workshops in Blender",
                      color: "#c084fc",
                    },
                    {
                      label: "Per session",
                      time: "1–2 modules",
                      note: "Recommended pace",
                      color: "#e8622a",
                    },
                  ].map((t) => (
                    <div
                      key={t.label}
                      style={{
                        background: "#111118",
                        border: `1px solid ${t.color}30`,
                        borderRadius: 10,
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: t.color,
                          marginBottom: 4,
                        }}
                      >
                        {t.time}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#e8e8f0",
                          marginBottom: 4,
                        }}
                      >
                        {t.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#555577" }}>
                        {t.note}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#555577",
                    lineHeight: 1.6,
                    padding: "0 4px",
                  }}
                >
                  Modules 7 (Geometry Nodes) and 12 (Physics) are the most
                  conceptually dense: each deserves its own session. Module 2
                  (bpy Setup) is short but high-value if you plan to AI-assisted.
                </div>
              </div>

              {/* Capabilities */}
              <div
                style={{
                  marginBottom: 40,
                  background: "rgba(68,217,162,0.04)",
                  border: "1px solid rgba(68,217,162,0.15)",
                  borderRadius: 10,
                  padding: "22px 24px",
                }}
              >
                <SectionLabel text="AFTER COMPLETING ALL MODULES" color="#44d9a2" mb={16} />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    "Fluent in Blender's vocabulary - you can read documentation, watch tutorials, and follow technical discussions without getting lost in terminology",
                    "Able to look at any 3D scene, render, or effect and name the systems involved: which modifiers, shaders, light types, and simulation domains produced it",
                    "Know which Blender tool or system to reach for given any creative goal without having to try every option by hand",
                    "Understand the non-destructive workflow: when to stay live, when to apply, and how to structure a scene for future editability",
                    "Ready to AI-assisted: you can describe what you want in precise Blender terms, interpret the Python that comes back, and debug it using bpy knowledge",
                    "Equipped to self-direct further learning because you have a map of the territory, you know exactly which gaps remain to fill",
                  ].map((cap, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: 12, alignItems: "start" }}
                    >
                      <span
                        style={{
                          color: "#44d9a2",
                          flexShrink: 0,
                          fontSize: 13,
                          paddingTop: 1,
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#9999bb",
                          lineHeight: 1.6,
                        }}
                      >
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Paths hint */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#e8622a", letterSpacing: 3, marginBottom: 6 }}>LEARNING PATHS</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>What do you want to make?</div>
                <div style={{ fontSize: 13, color: "#666688", lineHeight: 1.7 }}>Use the path selector above: always visible at the top: to pick a goal and get a recommended module sequence. You can access all modules in any order at any time.</div>
              </div>

              {/* CTA */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: 40,
                }}
              >
                <button
                  onClick={() => {
                    setActiveModule(0);
                    setExpandedSections({ 0: true });
                  }}
                  style={{
                    padding: "14px 36px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #e8622a, #c84a1a)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    boxShadow: "0 4px 24px rgba(232,98,42,0.35)",
                  }}
                >
                  Start Module 1: Mental Model →
                </button>
              </div>

            </div>
          )}

          {/* ── CONTENT TAB ── */}
          {activeTab === "content" && activeModule !== null && (
            <div>
              {/* Module header */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 36 }}>{mod.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        color: mod.color,
                        letterSpacing: 3,
                        marginBottom: 4,
                      }}
                    >
                      {mod.tag} · MODULE {mod.id}/{modules.length}
                    </div>
                    <div
                      style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}
                    >
                      {mod.title}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#888899",
                    lineHeight: 1.6,
                    borderLeft: `3px solid ${mod.color}`,
                    paddingLeft: 14,
                    marginLeft: 2,
                  }}
                >
                  {mod.intro}
                </div>
              </div>

              {/* bpy toggle nudge — only on bpy module when toggle is off */}
              {mod.id === 3 && !showPython && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    borderRadius: 10,
                    border: "1px solid #38bdf8",
                    marginBottom: 20,
                    animation: "bpy-pulse 2s ease-in-out infinite",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPython(true)}
                >
                  <span style={{ fontSize: 26, animation: "bpy-snake 1.2s ease-in-out infinite" }}>🐍</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8", marginBottom: 2 }}>
                      Enable the bpy toggle before reading this module
                    </div>
                    <div style={{ fontSize: 12, color: "#557799" }}>
                      Every section has a Python equivalent. The toggle is in the top bar. Click here to enable it now.
                    </div>
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "#38bdf8",
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                  }}>
                    ENABLE →
                  </div>
                </div>
              )}

              {/* Sections */}
              {mod.sections.map((section, i) => (
                <div
                  key={i}
                  data-section-id={i}
                  style={{
                    marginBottom: 12,
                    background: section.isWorkshop
                      ? `rgba(${hexToRgb(mod.color)},0.05)`
                      : "#111118",
                    border: `1px solid ${section.isWorkshop ? mod.color + "40" : "#1e1e2e"}`,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    onClick={() => toggleSection(i)}
                    style={{
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: section.isWorkshop ? mod.color : "#e8e8f0",
                      }}
                    >
                      {section.title}
                    </div>
                    <div
                      style={{
                        color: "#555577",
                        fontSize: 16,
                        transition: "transform 0.2s",
                        transform: expandedSections[i]
                          ? "rotate(180deg)"
                          : "none",
                      }}
                    >
                      ▾
                    </div>
                  </div>

                  {expandedSections[i] && (
                    <div
                      style={{
                        padding: "4px 18px 18px",
                        borderTop: "1px solid #1e1e2e",
                      }}
                    >
                      {renderContent(section.content)}
                      {showPython && section.pythonCode && (
                        <CodeBlock code={section.pythonCode} />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Quiz */}
              {mod.quiz && mod.quiz.length > 0 && (
                <Quiz
                  key={activeModule}
                  questions={mod.quiz}
                  moduleId={activeModule}
                />
              )}

              {/* Navigation buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid #1e1e2e",
                }}
              >
                <button
                  onClick={() => {
                    if (activeModule > 0) {
                      setActiveModule(activeModule - 1);
                      setExpandedSections({ 0: true });
                    }
                  }}
                  disabled={activeModule === 0}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid #2a2a3a",
                    background: "transparent",
                    color: activeModule === 0 ? "#333344" : "#888899",
                    cursor: activeModule === 0 ? "not-allowed" : "pointer",
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  ← Previous
                </button>

                <button
                  onClick={markComplete}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: completedModules.has(activeModule)
                      ? "rgba(68,217,162,0.15)"
                      : `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)`,
                    color: completedModules.has(activeModule)
                      ? "#44d9a2"
                      : "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    boxShadow: completedModules.has(activeModule)
                      ? "none"
                      : `0 4px 20px ${mod.color}40`,
                  }}
                >
                  {completedModules.has(activeModule)
                    ? "✓ Completed"
                    : activeModule === modules.length - 1
                      ? "🎉 Complete Course!"
                      : "Mark Complete & Continue →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "10px 24px",
          borderTop: "1px solid #1a1a28",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#333355",
            letterSpacing: 1,
          }}>
            © 2026 Dee Dee — All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
}
