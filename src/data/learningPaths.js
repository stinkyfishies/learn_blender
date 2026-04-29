// Learning paths and tab definitions
// Modules are referenced by slug (toSlug(title)) — never by array index.
// Adding or reordering modules in index.js requires no changes here.

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
      { slug: "mental-model",          note: "Foundation" },
      { slug: "interface-navigation",  note: "Navigation basics" },
      { slug: "bpy-with-ai-assist",   note: "Python setup" },
      { slug: "enhancing-blender",     note: "Configure your environment" },
      { slug: "mesh-primitives",       note: "Building geometry" },
      { slug: "edit-mode-topology",    note: "Editing topology" },
      { slug: "uv-unwrapping",         note: "UV maps for image textures" },
      { slug: "modifiers",             note: "Non-destructive ops" },
      { slug: "materials-shading",     note: "Shading" },
      { slug: "lighting",              note: "Lighting your scene" },
      { slug: "build-this",            note: "First projects" },
      { slug: "rendering",             note: "Rendering" },
      { slug: "procedural-textures",   note: "Procedural textures" },
    ],
  },
  {
    emoji: "🎬", title: "Motion & Animation", shortTitle: "Animation",
    desc: "Bring scenes to life with keyframes, physics, and procedural motion.",
    modules: [
      { slug: "mental-model",          note: "Foundation" },
      { slug: "interface-navigation",  note: "Navigation" },
      { slug: "bpy-with-ai-assist",   note: "Python setup" },
      { slug: "mesh-primitives",       note: "Geometry" },
      { slug: "edit-mode-topology",    note: "Topology" },
      { slug: "uv-unwrapping",         note: "UV maps for textured assets" },
      { slug: "modifiers",             note: "Modifiers" },
      { slug: "geometry-nodes",        note: "Procedural animation" },
      { slug: "materials-shading",     note: "Shading" },
      { slug: "lighting",              note: "Lighting" },
      { slug: "build-this",            note: "First projects" },
      { slug: "physics-simulation",    note: "Physics & simulation" },
      { slug: "rendering",             note: "Rendering" },
    ],
  },
  {
    emoji: "🧬", title: "Procedural Art", shortTitle: "Procedural",
    desc: "Use Geometry Nodes and shaders to generate complex outputs from simple rules.",
    modules: [
      { slug: "mental-model",          note: "Foundation" },
      { slug: "bpy-with-ai-assist",   note: "Python setup" },
      { slug: "modifiers",             note: "Modifiers" },
      { slug: "geometry-nodes",        note: "Geometry Nodes: core tool" },
      { slug: "materials-shading",     note: "Shading" },
      { slug: "lighting",              note: "Lighting" },
      { slug: "rendering",             note: "Rendering" },
      { slug: "procedural-textures",   note: "Procedural textures" },
    ],
  },
  {
    emoji: "🐍", title: "AI-Assisted Coding", shortTitle: "AI-Assisted",
    desc: "Learn just enough Blender to direct AI confidently. Focus on vocabulary and bpy.",
    modules: [
      { slug: "mental-model",          note: "Mental model: start here" },
      { slug: "bpy-with-ai-assist",   note: "bpy environment: do this second" },
      { slug: "modifiers",             note: "Modifiers via code" },
      { slug: "geometry-nodes",        note: "Geometry Nodes via code" },
      { slug: "materials-shading",     note: "Materials via code" },
      { slug: "rendering",             note: "Headless rendering" },
      { slug: "procedural-textures",   note: "Procedural textures via code" },
    ],
  },
];


export { TABS, LEARNING_PATHS };
