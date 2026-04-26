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
      { idx: 6, note: "UV maps for image textures" },
      { idx: 7, note: "Non-destructive ops" },
      { idx: 9, note: "Shading" },
      { idx: 10, note: "Lighting your scene" },
      { idx: 15, note: "Rendering" },
      { idx: 16, note: "Procedural textures" },
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
      { idx: 6, note: "UV maps for textured assets" },
      { idx: 7, note: "Modifiers" },
      { idx: 8, note: "Procedural animation" },
      { idx: 9, note: "Shading" },
      { idx: 10, note: "Lighting" },
      { idx: 14, note: "Physics & simulation" },
      { idx: 15, note: "Rendering" },
    ],
  },
  {
    emoji: "🧬", title: "Procedural Art", shortTitle: "Procedural",
    desc: "Use Geometry Nodes and shaders to generate complex outputs from simple rules.",
    modules: [
      { idx: 0, note: "Foundation" },
      { idx: 2, note: "Python setup" },
      { idx: 7, note: "Modifiers" },
      { idx: 8, note: "Geometry Nodes: core tool" },
      { idx: 9, note: "Shading" },
      { idx: 10, note: "Lighting" },
      { idx: 15, note: "Rendering" },
      { idx: 16, note: "Procedural textures" },
    ],
  },
  {
    emoji: "🐍", title: "AI-Assisted Coding", shortTitle: "AI-Assisted",
    desc: "Learn just enough Blender to direct AI confidently. Focus on vocabulary and bpy.",
    modules: [
      { idx: 0, note: "Mental model: start here" },
      { idx: 2, note: "bpy environment: do this second" },
      { idx: 7, note: "Modifiers via code" },
      { idx: 8, note: "Geometry Nodes via code" },
      { idx: 9, note: "Materials via code" },
      { idx: 15, note: "Headless rendering" },
      { idx: 16, note: "Procedural textures via code" },
    ],
  },
];


export { TABS, LEARNING_PATHS };
