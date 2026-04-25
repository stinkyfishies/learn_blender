// Learning paths and tab definitions

const TABS = [
  { id: "content", label: "📖 Lessons", mobileLabel: "📖" },
  { id: "outcomes", label: "🎯 Outcomes", mobileLabel: "🎯" },
  { id: "quickref", label: "⌨️ Quick Ref", mobileLabel: "⌨️" },
];

const LEARNING_PATHS = [
  {
    emoji: "🖼️", title: "Still Images", shortTitle: "Still Images",
    desc: "Model, light, and render compelling 3D images. No animation required.",
    modules: [
      { idx: 0, note: "Foundation" },
      { idx: 1, note: "Navigation basics" },
      { idx: 2, note: "Python setup" },
      { idx: 3, note: "Configure your environment" },
      { idx: 4, note: "Building geometry" },
      { idx: 5, note: "Editing topology" },
      { idx: 6, note: "Non-destructive ops" },
      { idx: 8, note: "Shading" },
      { idx: 9, note: "Lighting your scene" },
      { idx: 13, note: "Rendering" },
      { idx: 14, note: "Procedural textures" },
    ],
  },
  {
    emoji: "🎬", title: "Motion & Animation", shortTitle: "Animation",
    desc: "Bring scenes to life with keyframes, physics, and procedural motion.",
    modules: [
      { idx: 0, note: "Foundation" },
      { idx: 1, note: "Navigation" },
      { idx: 2, note: "Python setup" },
      { idx: 4, note: "Geometry" },
      { idx: 5, note: "Topology" },
      { idx: 6, note: "Modifiers" },
      { idx: 7, note: "Procedural animation" },
      { idx: 8, note: "Shading" },
      { idx: 9, note: "Lighting" },
      { idx: 12, note: "Physics & simulation" },
      { idx: 13, note: "Rendering" },
    ],
  },
  {
    emoji: "🧬", title: "Procedural Art", shortTitle: "Procedural",
    desc: "Use Geometry Nodes and shaders to generate complex outputs from simple rules.",
    modules: [
      { idx: 0, note: "Foundation" },
      { idx: 2, note: "Python setup" },
      { idx: 6, note: "Modifiers" },
      { idx: 7, note: "Geometry Nodes: core tool" },
      { idx: 8, note: "Shading" },
      { idx: 9, note: "Lighting" },
      { idx: 13, note: "Rendering" },
      { idx: 14, note: "Procedural textures" },
    ],
  },
  {
    emoji: "🐍", title: "AI-Assisted Coding", shortTitle: "AI-Assisted",
    desc: "Learn just enough Blender to direct AI confidently. Focus on vocabulary and bpy.",
    modules: [
      { idx: 0, note: "Mental model: start here" },
      { idx: 2, note: "bpy environment: do this second" },
      { idx: 6, note: "Modifiers via code" },
      { idx: 7, note: "Geometry Nodes via code" },
      { idx: 8, note: "Materials via code" },
      { idx: 13, note: "Headless rendering" },
      { idx: 14, note: "Procedural textures via code" },
    ],
  },
];


export { TABS, LEARNING_PATHS };
