// Static content for the home screen sections.
// Kept separate from App.jsx so the UI logic stays clean and copy is easy to update.

export const LEARNING_METHOD_CARDS = [
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
];

export const HOW_TO_USE_STEPS = [
  {
    label: "Go in any order",
    desc: "Jump to whatever is relevant to what you're building right now. The sidebar is a menu, not a curriculum. The Your Paths suggestions are just that: suggestions.",
  },
  {
    label: "Each module is self-contained",
    desc: "Every module has its own framing, sections, bpy code, and quiz. You don't need to have read anything else to get value from any single module.",
  },
  {
    label: "Toggle the 🐍 bpy switch",
    desc: "Turn it on to see how the UI concepts in any section map to Python. This is the bridge to AI-assisted coding: it shows you the vocabulary to use when prompting.",
  },
  {
    label: "Use the quiz to check your mental model",
    desc: "The quiz at the bottom of each module is a recall assist, not a gate. If something surprises you, re-read the relevant section.",
  },
  {
    label: "Use the Outcomes tab as a reference",
    desc: "The Outcomes tab is an index of Blender's possibility space: start from what you want to make, find which system applies. Use it anytime.",
  },
];

export const TIME_ALLOCATION = [
  {
    label: "Concept pass",
    time: "~5.5 hrs",
    note: "Reading only, all 14 modules",
    colorKey: "blue",
  },
  {
    label: "With exercises",
    time: "~11 hrs",
    note: "Doing the workshops in Blender",
    colorKey: "purple",
  },
  {
    label: "Per session",
    time: "1–2 modules",
    note: "Recommended pace",
    colorKey: "orange",
  },
];

export const CAPABILITIES = [
  "Fluent in Blender's vocabulary - you can read documentation, watch tutorials, and follow technical discussions without getting lost in terminology",
  "Able to look at any 3D scene, render, or effect and name the systems involved: which modifiers, shaders, light types, and simulation domains produced it",
  "Know which Blender tool or system to reach for given any creative goal without having to try every option by hand",
  "Understand the non-destructive workflow: when to stay live, when to apply, and how to structure a scene for future editability",
  "Ready to AI-assisted: you can describe what you want in precise Blender terms, interpret the Python that comes back, and debug it using bpy knowledge",
  "Equipped to self-direct further learning because you have a map of the territory, you know exactly which gaps remain to fill",
];
