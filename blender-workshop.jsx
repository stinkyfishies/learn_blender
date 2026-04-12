import { useState } from "react";

const modules = [
  {
    id: 1,
    emoji: "🧭",
    title: "Interface & Navigation",
    tag: "FOUNDATION",
    color: "#e8622a",
    intro: "Before touching a single object, you need to feel at home in Blender's 3D viewport. This is where everything lives.",
    sections: [
      {
        title: "The 3D Viewport",
        content: `The viewport is your canvas. Think of it as looking through a camera into a 3D world.

**Middle Mouse Button (MMB)** — Orbit around the scene
**Shift + MMB** — Pan (slide the view)
**Scroll Wheel** — Zoom in/out
**Numpad 1/3/7** — Front / Right / Top orthographic views
**Numpad 5** — Toggle Perspective ↔ Orthographic
**Numpad 0** — Camera view (what your render sees)
**~ (tilde)** — View pie menu (all directions at once)`
      },
      {
        title: "The Header Bar",
        content: `Every editor has a header. In the 3D viewport, you'll find:
- **Mode selector** (Object, Edit, Sculpt, etc.)
- **Viewport shading buttons** (Wireframe, Solid, Material, Rendered)
- **Overlay toggles** — show/hide helpers like grid, normals, face orientation`
      },
      {
        title: "🔨 Mini Workshop: Get Comfortable",
        isWorkshop: true,
        content: `1. Open Blender → you see the default cube, camera, light
2. **Orbit** around the cube using MMB drag
3. Press **Numpad 1** → front view. Press **Numpad 3** → right view. Press **Numpad 7** → top view
4. Press **Numpad 5** to switch to orthographic — notice the "Ortho" text top-left
5. Press **Numpad 0** — you're now looking through the camera
6. Press **Numpad 0** again to exit camera view
7. Press **~** and explore the pie menu

✅ Goal: Navigate to any view in under 2 seconds without thinking`
      }
    ]
  },
  {
    id: 2,
    emoji: "🧊",
    title: "Mesh Primitives",
    tag: "OBJECT MODE",
    color: "#5b8dee",
    intro: "Every complex 3D model starts from a simple shape. These are your raw materials — learn them cold.",
    sections: [
      {
        title: "Adding Objects",
        content: `**Shift + A** — The Add menu. This is your go-to shortcut forever.

**Mesh primitives available:**
- **Cube** — 6 faces, 8 vertices. The workhorse.
- **UV Sphere** — Smooth sphere with latitude/longitude topology. Good for balls, planets.
- **Ico Sphere** — Sphere made of triangles. Better for organic shapes, subdivision.
- **Cylinder** — Flat ends + curved side. Cups, pillars, legs.
- **Cone** — Pointed top. Arrows, hats, teeth.
- **Torus** — Donut shape. Rings, tubes, life preservers.
- **Plane** — Flat quad. Floors, walls, starting point for many models.
- **Circle** — Just edges, no faces. Path for extrusion.
- **Grid** — Subdivided plane. Terrain, fabric.
- **Monkey (Suzanne)** — Blender's mascot. Test subject for shading/lighting.`
      },
      {
        title: "Operator Panel (F9 / Bottom-left)",
        content: `When you add a primitive, a panel appears bottom-left. **Click it or press F9** to adjust:

- **Vertices** — How many segments (more = smoother, heavier)
- **Radius / Size** — Initial dimensions
- **Generate UVs** — Auto-create UV map (useful for texturing later)
- **Align to View** — Face the camera direction

⚠️ This panel disappears the moment you do anything else. It's a one-time chance to set base settings.`
      },
      {
        title: "🔨 Mini Workshop: Primitive Zoo",
        isWorkshop: true,
        content: `Create one of each primitive and explore F9 options:

1. **Shift+A → Mesh → UV Sphere** — In F9 panel, change segments to 8. See how it becomes faceted.
2. **Shift+A → Mesh → Cylinder** — Change vertices to 6. You now have a hexagonal prism.
3. **Shift+A → Mesh → Torus** — Adjust Major/Minor segments and radii.
4. **Shift+A → Mesh → Ico Sphere** — Change subdivisions from 2 to 1. See the icosahedron.
5. **Shift+A → Mesh → Monkey** — Just add Suzanne. She's there for you.

✅ Goal: Know every primitive and what its F9 options do`
      }
    ]
  },
  {
    id: 3,
    emoji: "✏️",
    title: "Edit Mode & Topology",
    tag: "CORE MODELING",
    color: "#44d9a2",
    intro: "Edit Mode is where real modeling happens. You're no longer moving whole objects — you're reshaping their DNA.",
    sections: [
      {
        title: "Entering Edit Mode",
        content: `**Tab** — Toggle Object Mode ↔ Edit Mode
**Ctrl+Tab** — Mode pie menu (all modes)

In Edit Mode you work with three selection types:
- **1** — Vertex select (points)
- **2** — Edge select (lines)  
- **3** — Face select (polygons)

**A** — Select all / deselect all
**Alt+A** — Deselect all
**B** — Box select (drag rectangle)
**C** — Circle select (paint with brush)
**Ctrl+I** — Invert selection`
      },
      {
        title: "The Holy Trinity: G, R, S",
        content: `These three shortcuts are Blender's heartbeat:

**G** — Grab (move)
**R** — Rotate
**S** — Scale

After pressing G/R/S, constrain to an axis:
- **X / Y / Z** — Lock to that axis
- **Shift+X/Y/Z** — Lock to the OTHER two axes (plane constraint)
- **Type a number** — Exact value (e.g. G → Z → 2 → Enter = move up exactly 2 units)

**Right-click or Escape** — Cancel the operation`
      },
      {
        title: "Essential Edit Mode Tools",
        content: `**E** — Extrude (pull out new geometry from selected)
**I** — Inset faces (shrink a face inward, creating a frame)
**Ctrl+R** — Loop Cut (add edge loops to subdivide)
**K** — Knife tool (draw cuts manually)
**F** — Fill (create a face between selected edges/verts)
**M** — Merge vertices
**Alt+M** — Merge to specific point
**Ctrl+B** — Bevel edges (round off sharp corners)
**Alt+Click** — Select an entire edge loop
**Ctrl+Click** — Select edge path between two points`
      },
      {
        title: "🔨 Mini Workshop: Model a Mug",
        isWorkshop: true,
        content: `A classic beginner project that uses most core tools:

1. **Shift+A → Cylinder** (32 vertices)
2. **Tab** to Edit Mode, **3** for face select
3. Click the **top face**, press **I** to inset (size ≈ 0.1)
4. Press **E** then **-Z** and drag — you're hollowing the inside
5. **A** to select all, **Ctrl+R** on the side — add a loop cut at mid-height
6. Back in **Object Mode**, add **Shift+A → Torus** for the handle
7. Scale/position the torus to align with the mug side
8. Select both → **Ctrl+J** to join into one object

✅ Goal: A recognizable mug using only primitives + Edit Mode`
      }
    ]
  },
  {
    id: 4,
    emoji: "🔧",
    title: "Modifiers",
    tag: "NON-DESTRUCTIVE",
    color: "#c084fc",
    intro: "Modifiers are superpowers. They change your mesh non-destructively — meaning the original is always preserved. Stack them, tweak them, remove them.",
    sections: [
      {
        title: "The Modifier Stack",
        content: `**Properties Panel → 🔧 wrench icon** — The modifier tab

Modifiers stack top-to-bottom. Order matters — a Subdivision before a Bevel gives different results than after.

**Apply** — Burns the modifier into the mesh permanently (can't undo easily)
**👁 Eye icon** — Toggle visibility in viewport
**🎬 Camera icon** — Toggle visibility in render`
      },
      {
        title: "Generate Modifiers (Shape-Creating)",
        content: `**Subdivision Surface** — Smooths mesh by subdividing geometry. The single most-used modifier.
  - Levels 0-6 (2-3 is usually enough)
  - Catmull-Clark = smooth organic shapes
  - Simple = subdivide without smoothing

**Bevel** — Rounds edges procedurally
  - Width, Segments, Profile controls
  
**Solidify** — Gives thickness to flat surfaces (great for walls, clothing)

**Screw** — Revolves a profile around an axis (lathe effect — bottles, vases)

**Array** — Duplicates objects in a pattern (fences, stairs, chains)

**Mirror** — Mirrors across an axis. Model half → get full symmetry automatically

**Boolean** — Use one object to cut/join/intersect another (carve holes, combine shapes)`
      },
      {
        title: "Deform Modifiers (Shape-Changing)",
        content: `**Simple Deform** — Twist, Bend, Taper, Stretch along an axis

**Lattice** — Deform with a cage (great for organic squishing)

**Curve** — Deform mesh along a curve path (roads, pipes, ribbons)

**Displace** — Use a texture to push vertices (instant terrain, wrinkles)

**Smooth / Laplacian Smooth** — Relax geometry without subdividing

**Shrinkwrap** — Snap mesh to the surface of another object`
      },
      {
        title: "🔨 Mini Workshop: Procedural Vase",
        isWorkshop: true,
        content: `Build a vase using zero manual sculpting:

1. **Shift+A → Mesh → Circle** (16 vertices)
2. **Tab → Edit Mode**, select all, **E** to extrude up several times, shaping a profile
3. **Tab back**, add **Screw modifier** — instant vase shape!
4. Add **Solidify modifier** — give it wall thickness
5. Add **Subdivision Surface** modifier (level 2) — smooth it out
6. Add **Simple Deform → Twist** — twist the vase slightly for elegance

Tweak the Screw angle (360° = closed, less = open spiral)

✅ Goal: Understand that complex shapes can come from simple profiles + modifiers`
      }
    ]
  },
  {
    id: 5,
    emoji: "💡",
    title: "Lighting",
    tag: "ILLUMINATION",
    color: "#fbbf24",
    intro: "A perfect model in bad lighting looks terrible. Light is half the art. Blender gives you cinema-grade tools.",
    sections: [
      {
        title: "Light Types",
        content: `**Point Light** — Omnidirectional bulb. Light in all directions from one point.

**Sun** — Parallel rays from infinite distance. Consistent shadows, good for outdoors. Direction matters, position doesn't.

**Spot** — Cone of light. Stage lighting, flashlights, headlights.
  - Spot Size = cone angle
  - Blend = soft vs hard cone edge

**Area** — Rectangular/disc light. Simulates windows, softboxes. Softest shadows, most photorealistic.

**HDRI (World)** — A 360° photograph used as environment lighting. Instantly realistic. Found in World Properties → Background → Environment Texture`
      },
      {
        title: "Key Light Settings",
        content: `For any light:
- **Power (Watts/W)** — Intensity. Area lights need much higher values (1000W+)
- **Color** — Warm vs cool. Warm key + cool fill = cinematic look
- **Radius/Size** — Larger = softer shadows. Critical for realism.

**Three-Point Lighting Setup (classic):**
1. **Key Light** — Main bright light, 45° above/side
2. **Fill Light** — Softer, opposite side, reduces harsh shadows
3. **Rim/Back Light** — Behind subject, creates separation from background`
      },
      {
        title: "🔨 Mini Workshop: Light Your Mug",
        isWorkshop: true,
        content: `Using your mug from Workshop 3 (or Suzanne):

1. Delete the default light
2. **Shift+A → Light → Area** — position above and to the left (the key light)
3. Set Power to 500W, Size to 1m — soft studio light
4. Add another Area light opposite side, Power 100W — fill light  
5. Add a Point light behind — rim light
6. Switch viewport shading to **Rendered** (Z key → Rendered, or top-right sphere icon)
7. In **World Properties**, change Background color to dark grey

Now try: replace both lights with just an HDRI
→ World Properties → Background → Environment Texture → pick any .hdr file

✅ Goal: See the dramatic difference lighting makes on the same object`
      }
    ]
  },
  {
    id: 6,
    emoji: "🎨",
    title: "Materials & Shading",
    tag: "SURFACE APPEARANCE",
    color: "#f472b6",
    intro: "Materials define what an object is made of — glass, metal, skin, rubber. The Shader Editor is a node-based system that gives you unlimited control.",
    sections: [
      {
        title: "Principled BSDF — The Universal Shader",
        content: `The **Principled BSDF** node handles almost every real-world material. Key parameters:

**Base Color** — The main color/texture
**Metallic** — 0 = non-metal, 1 = pure metal. Almost always use 0 or 1, not in-between.
**Roughness** — 0 = mirror-like, 1 = completely matte. Most surfaces are 0.3–0.8
**IOR (Index of Refraction)** — How light bends through transparent materials (glass = 1.45, water = 1.33)
**Transmission** — 0 = opaque, 1 = fully transparent (glass, water)
**Emission** — Makes the surface glow/emit light
**Alpha** — Transparency (needs Alpha Blend in material settings)`
      },
      {
        title: "The Shader Editor",
        content: `Open it: **Editor Type menu → Shader Editor** (or split viewport)

Node workflow:
- **Shader → Principled BSDF** connects to **Material Output**
- Add texture: **Shift+A → Texture → Image Texture** — connect Color → Base Color
- Add bump: **Shift+A → Texture → Image Texture** → **Normal Map node** → Normal input

**Essential node types:**
- **Image Texture** — Load a real texture image
- **Noise Texture** — Procedural random noise
- **Voronoi Texture** — Cell/crystal patterns
- **Wave Texture** — Stripes, wood grain
- **ColorRamp** — Remap values to colors
- **Mix Shader** — Blend two materials together
- **Fresnel** — More reflective at grazing angles (realistic!)`
      },
      {
        title: "🔨 Mini Workshop: 3 Materials Challenge",
        isWorkshop: true,
        content: `Create three spheres, apply one material each:

**Metal sphere:**
- Base Color: dark grey (#333)
- Metallic: 1.0
- Roughness: 0.1

**Rubber sphere:**
- Base Color: orange
- Metallic: 0.0
- Roughness: 0.9

**Glass sphere:**
- Base Color: white
- Metallic: 0.0
- Roughness: 0.0
- Transmission: 1.0
- IOR: 1.45
- (In Material settings → set Blend Mode to Alpha Blend)

✅ Goal: Understand how 2-3 sliders completely change material identity`
      }
    ]
  },
  {
    id: 7,
    emoji: "🏛️",
    title: "Sculpt Mode",
    tag: "ORGANIC MODELING",
    color: "#34d399",
    intro: "Sculpt Mode lets you push and pull geometry like digital clay. Perfect for organic shapes — characters, creatures, terrain.",
    sections: [
      {
        title: "Getting Started with Sculpting",
        content: `Switch to Sculpt Mode via the mode dropdown (or Ctrl+Tab)

**Requirements:** Your mesh needs enough geometry to sculpt into. Start with:
- A Ico Sphere with high subdivisions, OR
- Apply a Subdivision Surface modifier (level 4-6) before sculpting, OR
- Use **Remesh** in sculpt mode header to get uniform geometry

**Basic navigation:**
- **F** — Resize brush
- **Shift+F** — Change brush strength
- **Ctrl+drag** — Invert brush direction`
      },
      {
        title: "Core Sculpt Brushes",
        content: `**Draw** — Push geometry outward (or inward with Ctrl). The basic brush.
**Clay / Clay Strips** — Build up material like adding clay. Flatter, great for forms.
**Smooth (Shift)** — Hold Shift with any brush to smooth instantly.
**Inflate** — Puff up geometry evenly in all directions.
**Crease** — Create sharp indented lines.
**Pinch** — Sharpen edges, pull points together.
**Flatten** — Flatten bumpy areas to a plane.
**Grab** — Move large chunks of mesh. Great for posing.
**Snake Hook** — Pull out tendrils of geometry (tentacles, horns, hair strands).
**Mask (M)** — Paint a mask to protect areas from sculpting.
**Face Sets** — Color-coded regions you can isolate and sculpt separately.`
      },
      {
        title: "🔨 Mini Workshop: Rock Formation",
        isWorkshop: true,
        content: `Create a stylized rock — organic but achievable quickly:

1. **Shift+A → Ico Sphere**, subdivisions = 3
2. Apply **Subdivision Surface** modifier, level = 3 (gives ~6000 faces)
3. Enter **Sculpt Mode**
4. Use **Grab brush** to pull out 3-4 irregular bumps — make it lumpy
5. Use **Flatten brush** to create some flat facets (rocks have flat faces)
6. Use **Crease brush** to add cracks and crevices
7. Hold **Shift** and smooth any areas that look too sharp
8. Use **Draw brush** with Ctrl to push in some pits

For bonus points: duplicate it, Grab to reshape differently — instant rock cluster!

✅ Goal: Organic results in under 10 minutes. Sculpting is fast once you stop being precious.`
      }
    ]
  },
  {
    id: 8,
    emoji: "📐",
    title: "Boolean & Hard Surface",
    tag: "PRECISION MODELING",
    color: "#60a5fa",
    intro: "Hard surface modeling is for anything mechanical, architectural, or manufactured — where edges are sharp and shapes are precise.",
    sections: [
      {
        title: "Boolean Operations",
        content: `**Boolean modifier** uses one mesh to affect another:

- **Union** — Combine two objects into one merged shape
- **Difference** — Subtract one object from another (carve holes!)
- **Intersect** — Keep only the overlapping volume

**Workflow:**
1. Select the base object
2. Add **Boolean modifier**
3. Set operation type
4. Pick the "cutter" object in the Object field
5. Hide the cutter (H) — the cut is live/non-destructive
6. Apply when satisfied

**Pro tip:** Use Ctrl+NumpadMinus for quick boolean difference via the Bool Tool addon (enable in Preferences → Add-ons)`
      },
      {
        title: "Hard Surface Techniques",
        content: `**Bevel modifier** — Round all sharp edges. Set Angle Limit to only bevel sharper-than-X-degree edges.

**Edge Creases (Shift+E)** — Mark edges with crease value so Subdivision Surface keeps them sharp.

**Bevel Weight** — Control which edges bevel and how much via edge data.

**Weighted Normals modifier** — Keeps flat shading looking clean on beveled hard surface objects.

**The "Box Cutter" approach:**
1. Start with a cube
2. Add boolean cutters for windows, holes, vents
3. Add Bevel modifier for soft edge highlights
4. Add Subdivision Surface last`
      },
      {
        title: "🔨 Mini Workshop: Sci-Fi Panel",
        isWorkshop: true,
        content: `Create a wall panel like you'd see on a spaceship:

1. **Shift+A → Plane**, scale up (S → 3)
2. Add **Solidify modifier** (thickness 0.05)
3. Add **Bevel modifier** (width 0.02, segments 2)
4. Add **Subdivision Surface** (level 1)
5. Now add a **Cube**, scale thin and flat — position it ON the panel
6. Select panel → **Boolean → Difference** → pick the cube → you have an indent!
7. Repeat with cylinders (Shift+A → Cylinder, flatten with S→Z) for screw holes
8. Add an Area light at low angle to show the surface detail

✅ Goal: A sci-fi panel with indents, holes, and detail — using only booleans`
      }
    ]
  },
  {
    id: 9,
    emoji: "🎬",
    title: "Rendering",
    tag: "OUTPUT",
    color: "#fb923c",
    intro: "Rendering converts your 3D scene into a final image or animation. Blender has two main renderers — each with a different purpose.",
    sections: [
      {
        title: "Cycles vs Eevee",
        content: `**Cycles** (path-traced, realistic)
- Physically accurate light simulation
- Supports caustics, subsurface scattering, true reflections
- Slow to render but photorealistic
- Use for final product shots, stills, high-quality output
- GPU rendering available (CUDA/OptiX for NVIDIA, Metal for Mac)

**Eevee** (rasterized, real-time)
- Near-instant render, looks like a game engine
- Fake reflections (screen-space), limited shadows
- Great for motion graphics, stylized work, animations
- Use when speed matters more than physical accuracy

**Workbench** — Even simpler, for technical/clay renders`
      },
      {
        title: "Key Render Settings",
        content: `**Output Properties (printer icon):**
- Resolution X/Y — Image size in pixels
- Frame Range — For animations
- Output path — Where to save
- File Format — PNG (lossless), JPEG, EXR (HDR data)

**Render Properties (camera icon):**
- Samples — More = less noise but slower (Cycles: 128-512 for stills)
- Denoising — Enable! AI denoising dramatically cleans Cycles renders
- Light Paths — Control how many times light bounces

**F12** — Render current frame
**Ctrl+F12** — Render animation
**F11** — Show last render`
      },
      {
        title: "🔨 Mini Workshop: Your First Beauty Render",
        isWorkshop: true,
        content: `Take any object you've made and render it beautifully:

1. Switch to **Cycles** in Render Properties
2. Set Samples to 128, enable **Denoising** (OptiX or OpenImageDenoise)
3. Add an **HDRI** environment (World Properties → Environment Texture)
4. Add a **Plane** below your object as a floor
5. Select the floor plane → add a material → enable **Cycles → Shadow Catcher** checkbox
   (This makes the floor show only shadows, not itself)
6. In Camera view (Numpad 0), adjust framing
7. Press **F12**

For a product render feel:
- Use 3-point area light setup instead of HDRI
- Background color: pure white or dark grey
- Camera: low angle, slightly below subject

✅ Goal: A render you'd actually want to show someone`
      }
    ]
  },
  {
    id: 10,
    emoji: "🌊",
    title: "Procedural Textures",
    tag: "ADVANCED SHADING",
    color: "#a78bfa",
    intro: "Procedural textures are generated mathematically — no image files needed. They scale infinitely, never tile, and can animate. This is where Blender's shader system truly shines.",
    sections: [
      {
        title: "Core Texture Nodes",
        content: `All found via **Shift+A → Texture** in Shader Editor:

**Noise Texture** — Random organic variation. Scale (zoom), Detail (complexity), Roughness (sharpness), Distortion (warp)

**Voronoi Texture** — Cell patterns. Distance to Edge = cracked earth, ceramic tiles. Smooth F1 = soft cells.

**Wave Texture** — Concentric rings or stripes. Bands vs Rings. Add Distortion for wood grain effect.

**Musgrave Texture** — Multi-fractal noise. More complex than Noise. Great for terrain height maps.

**Magic Texture** — Colorful psychedelic patterns. Underrated for abstract effects.

**Brick Texture** — Procedural bricks with mortar control.`
      },
      {
        title: "Connecting Textures to Materials",
        content: `The key connector nodes:

**ColorRamp** — Remap a grayscale value to any color range. Plug noise → ColorRamp → Base Color = instant rock/lava/skin color variation.

**Bump node** — Fake surface detail from a grayscale texture. Doesn't change geometry, just changes how light hits.

**Displacement node** — Actually moves vertices based on texture (requires Material → Settings → Displacement: Both)

**Mix node** — Blend two colors/textures. Use a mask (another noise) as the Factor to blend naturally.

**Texture Coordinate + Mapping** — Control how textures map onto the surface. Object coordinates = texture moves with object.`
      },
      {
        title: "🔨 Mini Workshop: Procedural Planet",
        isWorkshop: true,
        content: `Create a planet using only procedural nodes — no image textures:

1. **Shift+A → UV Sphere** (subdivide to level 6 in F9)
2. Add a material, open **Shader Editor**
3. Add **Noise Texture** → Scale: 5, Detail: 8, Roughness: 0.6
4. Add **ColorRamp**: left stop = deep blue, add stops for green, brown, white
5. Connect Noise → ColorRamp → Base Color

For atmosphere glow:
6. Add a second **Emission** shader (Shift+A → Shader → Emission)
7. **Mix Shader**: Factor from **Fresnel** node (IOR: 1.3) 
8. Emission color = light blue, Strength = 2
9. Mix Shader → Material Output

Animate it: Select Noise Texture → right-click W value → Insert Keyframe at frame 1 and frame 250 with different values

✅ Goal: A convincing planet with zero image files`
      }
    ]
  }
];

const KeybindChip = ({ keys, desc }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
  }}>
    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
      {keys.map((k, i) => (
        <span key={i} style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 4,
          padding: "2px 7px",
          fontFamily: "monospace",
          fontSize: 11,
          color: "#e8e8f0",
          fontWeight: 700,
          boxShadow: "0 2px 0 rgba(0,0,0,0.4)"
        }}>{k}</span>
      ))}
    </div>
    <span style={{ fontSize: 12, color: "#9999bb" }}>{desc}</span>
  </div>
);

const renderContent = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8e8f0">$1</strong>');
    return (
      <p key={i} style={{
        fontSize: 13.5,
        lineHeight: 1.7,
        color: "#9999bb",
        marginBottom: 2
      }} dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
};

export default function BlenderWorkshop() {
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [activeTab, setActiveTab] = useState("content");

  const mod = modules[activeModule];
  const progress = Math.round((completedModules.size / modules.length) * 100);

  const toggleSection = (i) => {
    setExpandedSections(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const markComplete = () => {
    setCompletedModules(prev => new Set([...prev, activeModule]));
    if (activeModule < modules.length - 1) {
      setActiveModule(activeModule + 1);
      setExpandedSections({ 0: true });
    }
  };

  const quickRefs = [
    { keys: ["Shift","A"], desc: "Add object" },
    { keys: ["Tab"], desc: "Toggle Edit Mode" },
    { keys: ["G"], desc: "Grab / move" },
    { keys: ["R"], desc: "Rotate" },
    { keys: ["S"], desc: "Scale" },
    { keys: ["E"], desc: "Extrude" },
    { keys: ["I"], desc: "Inset faces" },
    { keys: ["Ctrl","R"], desc: "Loop cut" },
    { keys: ["Ctrl","B"], desc: "Bevel" },
    { keys: ["Alt","Click"], desc: "Select edge loop" },
    { keys: ["F12"], desc: "Render" },
    { keys: ["Numpad 0"], desc: "Camera view" },
    { keys: ["Numpad 5"], desc: "Toggle ortho/persp" },
    { keys: ["H"], desc: "Hide selection" },
    { keys: ["Alt","H"], desc: "Unhide all" },
    { keys: ["Ctrl","Z"], desc: "Undo" },
    { keys: ["X"], desc: "Delete menu" },
    { keys: ["Ctrl","J"], desc: "Join objects" },
    { keys: ["P"], desc: "Separate mesh" },
    { keys: ["M"], desc: "Move to collection" },
  ];

  return (
    <div style={{
      display: "flex", height: "100vh", fontFamily: "'Syne', sans-serif",
      background: "#0a0a0f", color: "#e8e8f0", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 260, flexShrink: 0,
        background: "rgba(13,13,20,0.98)",
        borderRight: "1px solid #1e1e2e",
        display: "flex", flexDirection: "column",
        overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#e8622a", letterSpacing: 3, marginBottom: 4 }}>WORKSHOP</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Blender <span style={{ color: "#e8622a" }}>3D</span></div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#555577", marginTop: 2 }}>Complete Modeling Course</div>
        </div>

        {/* Progress */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#555577", letterSpacing: 2, marginBottom: 6 }}>PROGRESS</div>
          <div style={{ height: 3, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #e8622a, #5b8dee)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#e8622a", marginTop: 5 }}>
            {completedModules.size}/{modules.length} modules · {progress}%
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "8px 0" }}>
          {modules.map((m, i) => (
            <div
              key={m.id}
              onClick={() => { setActiveModule(i); setExpandedSections({ 0: true }); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 20px", cursor: "pointer",
                borderLeft: `3px solid ${i === activeModule ? m.color : "transparent"}`,
                background: i === activeModule ? `${m.color}14` : "transparent",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{m.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: i === activeModule ? "#e8e8f0" : "#888899", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.title}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#444466", letterSpacing: 1 }}>{m.tag}</div>
              </div>
              {completedModules.has(i) && (
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#44d9a2", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "#0a0a0f", fontWeight: 700, flexShrink: 0
                }}>✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{
          padding: "0 32px",
          borderBottom: "1px solid #1e1e2e",
          display: "flex", alignItems: "center", gap: 0,
          flexShrink: 0
        }}>
          {["content", "quickref"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab ? mod.color : "transparent"}`,
                color: activeTab === tab ? "#e8e8f0" : "#555577",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Syne', sans-serif",
                letterSpacing: 1,
                transition: "all 0.15s",
                textTransform: "uppercase"
              }}
            >
              {tab === "content" ? "📖 Lessons" : "⌨️ Quick Reference"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>

          {activeTab === "quickref" ? (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#e8622a", letterSpacing: 3, marginBottom: 6 }}>REFERENCE</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>Essential Shortcuts</div>
                <div style={{ fontSize: 13, color: "#666688", marginTop: 4 }}>The shortcuts you'll use every single session</div>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 24
              }}>
                {[
                  { title: "Navigation", keys: quickRefs.slice(0, 5) },
                  { title: "Selection", keys: [
                    { keys: ["A"], desc: "Select all" },
                    { keys: ["Alt","A"], desc: "Deselect all" },
                    { keys: ["B"], desc: "Box select" },
                    { keys: ["C"], desc: "Circle select" },
                    { keys: ["Ctrl","I"], desc: "Invert selection" },
                  ]},
                  { title: "Edit Mode", keys: quickRefs.slice(5, 11) },
                  { title: "General", keys: quickRefs.slice(11) },
                ].map(group => (
                  <div key={group.title} style={{
                    background: "#111118",
                    border: "1px solid #1e1e2e",
                    borderRadius: 10,
                    padding: 18
                  }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#555577", letterSpacing: 2, marginBottom: 10 }}>{group.title.toUpperCase()}</div>
                    {group.keys.map((k, i) => <KeybindChip key={i} {...k} />)}
                  </div>
                ))}
              </div>

              {/* Tip box */}
              <div style={{
                marginTop: 24, padding: 18,
                background: "rgba(232,98,42,0.08)",
                border: "1px solid rgba(232,98,42,0.2)",
                borderRadius: 10
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8622a", marginBottom: 6 }}>💡 Pro Tip: The Pie Menu</div>
                <div style={{ fontSize: 12, color: "#888899", lineHeight: 1.6 }}>
                  Many Blender functions have Pie Menus accessible by holding a key. <strong style={{ color: "#e8e8f0" }}>~</strong> for viewport navigation,
                  <strong style={{ color: "#e8e8f0" }}> Z</strong> for shading modes, <strong style={{ color: "#e8e8f0" }}> Ctrl+Tab</strong> for mode switching.
                  They're faster than searching menus once memorized.
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Module header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 36 }}>{mod.emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 9,
                      color: mod.color, letterSpacing: 3, marginBottom: 4
                    }}>{mod.tag} · MODULE {mod.id}/{modules.length}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{mod.title}</div>
                  </div>
                </div>
                <div style={{
                  fontSize: 14, color: "#888899", lineHeight: 1.6,
                  borderLeft: `3px solid ${mod.color}`,
                  paddingLeft: 14, marginLeft: 2
                }}>{mod.intro}</div>
              </div>

              {/* Sections */}
              {mod.sections.map((section, i) => (
                <div key={i} style={{
                  marginBottom: 12,
                  background: section.isWorkshop ? `rgba(${mod.color === "#44d9a2" ? "68,217,162" : mod.color === "#e8622a" ? "232,98,42" : mod.color === "#5b8dee" ? "91,141,238" : mod.color === "#c084fc" ? "192,132,252" : mod.color === "#fbbf24" ? "251,191,36" : mod.color === "#f472b6" ? "244,114,182" : mod.color === "#34d399" ? "52,211,153" : mod.color === "#60a5fa" ? "96,165,250" : mod.color === "#fb923c" ? "251,146,60" : "167,139,250"},0.05)` : "#111118",
                  border: `1px solid ${section.isWorkshop ? mod.color + "40" : "#1e1e2e"}`,
                  borderRadius: 10,
                  overflow: "hidden"
                }}>
                  <div
                    onClick={() => toggleSection(i)}
                    style={{
                      padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: section.isWorkshop ? mod.color : "#e8e8f0" }}>
                      {section.title}
                    </div>
                    <div style={{ color: "#555577", fontSize: 16, transition: "transform 0.2s", transform: expandedSections[i] ? "rotate(180deg)" : "none" }}>▾</div>
                  </div>

                  {expandedSections[i] && (
                    <div style={{ padding: "4px 18px 18px", borderTop: "1px solid #1e1e2e" }}>
                      {renderContent(section.content)}
                    </div>
                  )}
                </div>
              ))}

              {/* Navigation buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e1e2e" }}>
                <button
                  onClick={() => { if (activeModule > 0) { setActiveModule(activeModule - 1); setExpandedSections({ 0: true }); } }}
                  disabled={activeModule === 0}
                  style={{
                    padding: "10px 20px", borderRadius: 8,
                    border: "1px solid #2a2a3a",
                    background: "transparent",
                    color: activeModule === 0 ? "#333344" : "#888899",
                    cursor: activeModule === 0 ? "not-allowed" : "pointer",
                    fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600
                  }}
                >← Previous</button>

                <button
                  onClick={markComplete}
                  style={{
                    padding: "10px 24px", borderRadius: 8,
                    border: "none",
                    background: completedModules.has(activeModule)
                      ? "rgba(68,217,162,0.15)"
                      : `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)`,
                    color: completedModules.has(activeModule) ? "#44d9a2" : "#fff",
                    cursor: "pointer",
                    fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    boxShadow: completedModules.has(activeModule) ? "none" : `0 4px 20px ${mod.color}40`
                  }}
                >
                  {completedModules.has(activeModule)
                    ? "✓ Completed"
                    : activeModule === modules.length - 1
                      ? "🎉 Complete Course!"
                      : "Mark Complete & Continue →"
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
