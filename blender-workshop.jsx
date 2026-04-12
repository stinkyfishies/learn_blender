import { useState } from "react";

// Utility: hex color → "r,g,b" string for rgba()
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

const modules = [
  {
    id: 1,
    emoji: "🧠",
    title: "Mental Model",
    tag: "FOUNDATION",
    color: "#e8622a",
    intro: "Before touching anything: understand how Blender thinks. Its architecture shapes every decision — why modes exist, why nothing is 'just a file', and how to reason about what's possible.",
    sections: [
      {
        title: "Blender's Data Architecture",
        content: `Blender organizes everything as **datablocks** — reusable, linkable chunks of data. Understanding this unlocks how the whole system fits together.

- **Object** — A container in 3D space with position, rotation, scale. Does not hold geometry itself.
- **Mesh / Curve / Volume / Armature** — The actual data that an Object references. Multiple objects can share one mesh (instances).
- **Material** — Applied to material slots on a mesh. One object can have many materials.
- **Scene** — The stage: which objects exist, camera, frame range.
- **World** — Environment lighting, background, atmosphere.
- **Collection** — A folder/group of objects. Objects can belong to multiple collections.

Key insight: because objects and meshes are separate, you can duplicate an object with **Alt+D** (linked duplicate — same mesh data, different transform) vs **Shift+D** (full copy). This matters enormously for scene performance.`
      },
      {
        title: "Modes: Why They Exist",
        content: `Blender uses **modes** to expose different toolsets on the same object. You're always in one mode at a time:

- **Object Mode** — Manage the scene: move, duplicate, link, organize. The default mode.
- **Edit Mode** — Reshape the mesh at vertex/edge/face level. Tab toggles here.
- **Sculpt Mode** — Push/pull geometry like digital clay. High polygon counts.
- **Weight Paint** — Define per-vertex bone influence (for rigging/animation).
- **Vertex Paint / Texture Paint** — Paint color or texture directly onto the mesh surface.
- **Particle Edit** — Comb, trim, and style hair/fur particles.

**Ctrl+Tab** — Mode pie menu (access any mode from any mode)

The same object looks completely different depending on which mode you're in — this is intentional, not confusing. Each mode is a specialized lens.`
      },
      {
        title: "Non-Destructive vs Destructive Workflow",
        content: `**Non-destructive**: changes are instructions layered on top of the original — fully reversible, tweakable, removable.
**Destructive**: permanently modifies the underlying mesh data.

Non-destructive tools:
- **Modifier Stack** — Subdivision, Bevel, Boolean, Array, Mirror, etc. Remove or reorder any time.
- **Geometry Nodes** — Procedural generation via a node graph. Always live, always editable.
- **Shape Keys** — Store different mesh "poses" without destroying the base shape.
- **Constraints** — Control object behavior (copy location, track to, limit rotation).
- **Drivers** — Link any value to any other value via an expression or variable.
- **Materials / Shaders** — Never burn into the mesh; always swappable.

Destructive: applying a modifier, sculpting directly, manual vertex editing, applying shape keys.

**Golden rule**: stay non-destructive as long as possible. Apply modifiers only when exporting, hitting a technical limit, or when you're 100% done with that step.`
      },
      {
        title: "The Properties Panel — Your Control Center",
        content: `The right-side Properties Editor contains all settings, organized by icon. Knowing which icon = what domain is essential:

- 🎬 **Render** — Engine (Cycles/EEVEE), sampling, denoising
- 🖼️ **Output** — Resolution, frame range, output path, file format
- 🌍 **World** — Background color, HDRI environment, ambient occlusion
- 👁️ **View Layer** — Render passes, light groups
- 📐 **Object** — Exact transform values, visibility, instancing
- 🔧 **Modifier** — The modifier stack
- ⚡ **Particles** — Particle/hair systems
- 🔒 **Constraints** — Object constraints
- 📊 **Object Data** — Mesh-specific: UV maps, vertex colors, normals
- 🎨 **Material** — Material slots, shader assignment
- 🖼️ **Texture** — Texture slots (legacy, mostly for displacement/brushes)

**N** (in viewport) — Toggle the sidebar panel (Item, Tool, View tabs). Shows exact transform of selected object.`
      },
      {
        title: "Collections & Scene Organization",
        content: `**Collections** are Blender's folder system, visible in the Outliner (top-right by default).

- Objects can belong to multiple collections simultaneously
- Collections can be toggled visible/renderable/selectable as a group
- **Instance Collections** — Drag a collection into the viewport as a single instanced object. Duplicate it with Alt+D for zero memory cost.
- **File → Link** — Reference a collection from another .blend file, non-destructively. The foundation of production pipelines.
- **File → Append** — Copy data from another .blend into your current file (destructive import).

The Outliner also shows the full datablock tree. Right-click any item for options. Drag to reparent.`
      },
      {
        title: "🔨 Mini Workshop: Read the Scene",
        isWorkshop: true,
        content: `Open any Blender scene (default or downloaded) and map it to what you now know:

1. Open the **Outliner** — identify which Collections exist, which Objects are in them
2. Click an object → check the **Properties panel** → what Modifiers does it have? What Materials?
3. Press **Tab** → you're in Edit Mode on that object's mesh. Press **Tab** again to return.
4. Press **Ctrl+Tab** → browse through modes. Notice how the toolbar changes.
5. Press **N** → look at the Item tab. See the exact location/rotation/scale.
6. Click on a different icon in the Properties Editor — find the Modifier stack, the Material slots.

✅ Goal: Be able to answer "what is this scene made of?" for any .blend file`
      }
    ]
  },
  {
    id: 2,
    emoji: "🧭",
    title: "Interface & Navigation",
    tag: "MAC TRACKPAD",
    color: "#5b8dee",
    intro: "Blender was designed around a 3-button mouse but works great on Mac trackpad once configured. Three settings unlock everything — do these first.",
    sections: [
      {
        title: "First: Configure Blender for Mac Trackpad",
        content: `**Edit → Preferences → Input** — enable these three settings:

1. ✅ **Emulate 3 Button Mouse** — Maps Option+click to middle mouse button (orbit). Essential.
2. ✅ **Emulate Numpad** — Maps the top number row (1–0) to numpad view shortcuts. Essential if you don't have a numpad.
3. ✅ **Allow Mouse Selection With Trackpad Gesture** (if shown) — gesture-aware selection

Then under the **Trackpad** section (same Preferences page):
- ✅ **Use Multi-Touch Trackpad** — enables pinch-to-zoom and two-finger pan natively

Save these preferences: **Hamburger menu (☰) → Save Preferences** so they persist across launches.`
      },
      {
        title: "Viewport Navigation (Trackpad-First)",
        content: `Once configured, your primary navigation controls:

**Option+drag** — Orbit (rotate the view around the scene)
**Two-finger drag** — Pan (slide the view left/right/up/down)
**Pinch (two-finger)** — Zoom in/out
**Period (.)** — Frame the selected object(s) — instantly centers view on your selection
**Home** — Frame everything in the scene

Keyboard view shortcuts (with Emulate Numpad ON):
**1** — Front view (looking down -Y axis)
**3** — Right side view
**7** — Top view (looking down -Z)
**Ctrl+1 / 3 / 7** — Opposite views (Back, Left, Bottom)
**5** — Toggle Perspective ↔ Orthographic
**0** — Camera view (what your render will see)
**~ (backtick)** — View pie menu: access all views at once`
      },
      {
        title: "Editor Layout & Workspaces",
        content: `Every panel in Blender is an **editor** — any area can be any editor type. Change it via the icon at the top-left corner of any panel.

Most important editors:
- **3D Viewport** — Your main working area
- **Shader Editor** — Node-based material building
- **Geometry Node Editor** — Procedural modeling/generation
- **Compositor** — Post-process renders with nodes
- **Timeline / Graph Editor / NLA Editor** — Animation
- **UV Editor** — UV unwrapping
- **Outliner** — Scene hierarchy and datablock tree
- **Properties** — All settings organized by icon

**Workspaces** (tabs along the top bar): Blender ships with Layout, Modeling, Sculpting, Shading, Animation, Rendering, Compositing. Each is a saved editor arrangement. Create your own with the + button.

**Split an editor**: hover over an edge → right-click → Split. Merge: drag a corner.`
      },
      {
        title: "The Most Useful Navigation Shortcuts",
        content: `**F3** — Operator search. Type any Blender feature by name and run it. The single most powerful shortcut — if you know what you want but not where it lives, F3 finds it.

**Ctrl+Space** — Maximize the hovered editor (full screen). Press again to restore.

**N** — Toggle the N-Panel sidebar (Item, Tool, View, and addon panels)
**T** — Toggle the left toolbar (tool icons)

**Ctrl+Alt+Q** — Quad view (four viewports: top, front, right, perspective). Toggle off the same way.

**Z** — Shading pie menu: Wireframe, Solid, Material Preview, Rendered. Essential for quickly switching how you see the scene.

**Alt+Z** — Toggle X-Ray mode (see through the mesh — critical for selecting hidden geometry)

**F11** — Show last render (if you've rendered anything)`
      },
      {
        title: "Selection on Mac",
        content: `Blender 5.1 defaults to **left-click select** (matches Mac conventions).

**Click** — Select single item
**Shift+Click** — Add/remove from selection
**Cmd+Click** — (same as Shift in most contexts)
**B** — Box select: drag a rectangle
**C** — Circle select: paint with a brush (scroll to resize, right-click to exit)
**Ctrl+I** — Invert selection
**A** — Select all / deselect all (toggle)
**Alt+A** — Deselect all

In Edit Mode, selection works on whichever element type is active:
**1** — Vertex select mode
**2** — Edge select mode
**3** — Face select mode
**Alt+Click** — Select an entire edge loop (one of the most important shortcuts in modeling)`
      }
    ]
  },
  {
    id: 3,
    emoji: "🧊",
    title: "Mesh Primitives",
    tag: "OBJECT MODE",
    color: "#60a5fa",
    intro: "Every 3D model starts from a primitive. These are the raw materials. What matters is knowing what each one gives you topologically — not just what it looks like.",
    sections: [
      {
        title: "What Primitives Give You",
        content: `**Shift+A → Mesh** — The add menu. Every object in your scene starts here.

Primitives and their structural value:
- **Cube** — 6 quads, 8 verts, 12 edges. Perfect base for box-modeling anything boxy. Workhorse.
- **UV Sphere** — Latitude/longitude topology. Good for planets, eyes, balls. Poles are messy for animation.
- **Ico Sphere** — Triangulated sphere. Even distribution across surface — better for sculpting and subdivision.
- **Cylinder** — Flat ends + loop-based sides. Cups, cans, columns, limbs, any tube shape.
- **Cone** — Pointed top. Arrow tips, teeth, spikes, horns.
- **Torus** — Donut topology. Rings, tunnels, life preservers, cables bent into circles.
- **Plane** — Single quad face. Floor, wall, starting point for many models, cards for hair/leaves.
- **Circle** — Edges only, no fill. Boundary for extrusion, profile for Screw modifier.
- **Grid** — Subdivided plane. Terrain, cloth sims, displacement maps.
- **Monkey (Suzanne)** — Blender's test subject. Use her for shading and lighting experiments.`
      },
      {
        title: "The Operator Panel (F9)",
        content: `When you add a primitive, a panel appears at the **bottom-left** of the viewport. This is your one chance to set initial parameters before the operator locks in.

**Click the panel or press F9** to expand it:
- **Vertices / Segments** — Controls mesh density. More = smoother, heavier.
- **Radius / Size** — Initial dimensions.
- **Generate UVs** — Auto-create a UV map. Turn this on — it costs nothing and saves time later.
- **Align to View** — Face the current camera direction. Useful when adding on a specific axis.
- **Location / Rotation** — Exact initial placement.

⚠️ This panel disappears the moment you perform any other action. It is a one-time window. If you miss it, use Ctrl+Z and re-add.`
      },
      {
        title: "Curves & Surfaces (Non-Mesh Primitives)",
        content: `**Shift+A → Curve** gives you a different data type — mathematically smooth paths, not polygon meshes.

- **Bezier** — Handles for smooth curves. Great for paths, logos, cables, motion paths.
- **NURBS** — Weighted control points. Smooth surfaces, automotive design.
- **Path** — A simple spline. Use as a motion path for animation or a spine for Curve modifier.

Curves can be converted to meshes (**Object → Convert → Mesh**) or used directly with the **Curve modifier** to deform other objects along them.

**Shift+A → Surface** — NURBS surface patches. Rarely used for modeling, but understand they exist.

Key curve settings (Properties → Object Data → Geometry):
- **Bevel → Depth** — Give the curve a round cross-section (instant pipe/tube)
- **Bevel → Object** — Use a custom shape as the cross-section
- **Fill Mode** — Whether the curve end caps are filled`
      },
      {
        title: "🔨 Mini Workshop: Know Your Topology",
        isWorkshop: true,
        content: `Add one of each primitive and turn on **Edit Mode (Tab)** to inspect its geometry. What you're learning: what you get before you do anything.

1. Add a **UV Sphere** → Tab → see the pole pinching at top/bottom
2. Add an **Ico Sphere** → Tab → see the uniform triangle distribution
3. Add a **Cylinder** → Tab → 3 (face select) → click the top cap → it's one n-gon face (important: n-gons cause shading issues if subdivided)
4. Add a **Torus** → Tab → notice how it's made of edge loops — great for ring topology
5. Add a **Curve → Bezier** → Tab → see the control points and handles → G to move one

✅ Goal: Given a target shape, immediately know which primitive to start from`
      }
    ]
  },
  {
    id: 4,
    emoji: "✏️",
    title: "Edit Mode & Topology",
    tag: "CORE MODELING",
    color: "#44d9a2",
    intro: "Edit Mode is where real modeling happens. You're operating on the mesh's actual geometry — vertices, edges, faces. Topology (how geometry is connected) determines everything: how the mesh deforms, subdivides, and renders.",
    sections: [
      {
        title: "Selection Modes & Essential Navigation",
        content: `In Edit Mode press Tab (or Ctrl+Tab) to enter from Object Mode.

Switch selection type:
**1** — Vertex select (points)
**2** — Edge select (lines)
**3** — Face select (polygons)

Selecting:
**Alt+Click** — Select an entire edge/face loop. One of the most powerful selection tools.
**Ctrl+Click** — Select shortest path between two elements
**B** — Box select
**C** — Circle select (paint with brush, scroll to resize, right-click to exit)
**Ctrl+I** — Invert selection
**L** — Select linked (hover over a mesh island and press L to select it all)

**Alt+Z** — Toggle X-Ray (lets you select through the mesh, not just surface)

Proportional Editing:
**O** — Toggle Proportional Editing — transforms fall off smoothly around selected verts. Press O while transforming to adjust falloff radius with scroll wheel. Essential for organic shaping.`
      },
      {
        title: "Core Transform Tools",
        content: `**G** — Grab (move). Then X/Y/Z to constrain to an axis. Type a number for exact distance.
**R** — Rotate. Then X/Y/Z to constrain. Type a number for exact degrees.
**S** — Scale. Then X/Y/Z to constrain. Type a number for exact factor.

Axis constraint tricks:
- **Shift+X** — Move on the YZ plane (constrain to everything EXCEPT X)
- **G → X → 2 → Enter** — Move exactly 2 units along X
- **R → Z → 90** — Rotate exactly 90° around Z axis

The most important modeling operations:
**E** — Extrude selected (pull new geometry out from selection)
**I** — Inset faces (shrink a face inward, creating a border frame)
**Ctrl+R** — Loop Cut: add an edge loop running around the mesh. Scroll to add more cuts.
**K** — Knife tool: draw freehand cuts across faces
**F** — Fill: create a face or edge between selected elements
**M** — Merge vertices (to center, to cursor, to last selected, by distance)
**Ctrl+B** — Bevel: chamfer edges or vertices. Scroll to add segments.
**Ctrl+M** — Mirror selected across an axis`
      },
      {
        title: "Topology Concepts That Matter",
        content: `**Topology** = how geometry is connected. Good topology:
- Deforms cleanly for animation
- Subdivides smoothly with Subdivision Surface modifier
- Shades without artifacts

Key concepts:
- **Quads** — 4-sided faces. Always prefer quads. They subdivide predictably and shade cleanly.
- **Tris (triangles)** — Acceptable in static meshes, problematic in animated ones. Avoid on curved surfaces.
- **N-gons** — 5+ sided faces. Cause shading artifacts when subdivided. Acceptable only on flat, non-subdivided areas.
- **Edge loops** — A ring of connected edges that runs around the mesh. The backbone of good topology. Alt+Click selects them.
- **Edge rings** — The edges connecting two parallel loops. Ctrl+Alt+Click selects them.
- **Poles** — Vertices where more or fewer than 4 edges meet. 3-edge poles (stars) and 5-edge poles are sometimes necessary but should be placed carefully.

**Ctrl+Alt+Shift+M** — Select Non-Manifold (broken geometry: holes, internal faces, flipped normals). Use this to diagnose mesh problems.`
      },
      {
        title: "Normals & Shading",
        content: `**Normals** are vectors pointing outward from each face, telling Blender which direction is "outside." They control shading.

Common normal issues and fixes:
- **Flipped normals** — Face looks dark or inverted. Fix: Select all → **Mesh → Normals → Recalculate Outside** (Shift+N)
- **Flat vs Smooth shading** — Right-click object → Shade Smooth (or Shade Auto Smooth). Smooth shading interpolates normals across a face; Flat shows each face as a distinct polygon.
- **Auto Smooth** — In Object Data Properties → Normals: set an angle threshold. Edges sharper than the angle show as hard; others as smooth. Best of both worlds.
- **Weighted Normals modifier** — Computes normals based on face area. Keeps hard-surface objects looking clean after boolean operations.

Overlay: **Viewport Overlays → Face Orientation** — Blue = outward-facing, Red = inward. All blue = healthy mesh.`
      },
      {
        title: "🔨 Mini Workshop: Box-Model a Mug",
        isWorkshop: true,
        content: `A classic that exercises most core Edit Mode tools:

1. **Shift+A → Cylinder** (32 vertices in F9)
2. **Tab** into Edit Mode → **3** (face select)
3. Click the **top face** → **I** to inset (drag to about 0.1 units)
4. **E** to extrude downward → pull inside to hollow it out
5. **A** to select all → **Ctrl+R** on the side wall → add a loop cut at mid-height
6. Back in **Object Mode** → **Shift+A → Torus** for the handle
7. Scale/position the torus → **S → X** to flatten it → place against the mug side
8. Select both → **Ctrl+J** to join into one object

The goal isn't a perfect mug. The goal is to use I, E, Ctrl+R, and Ctrl+J in context.

✅ Goal: Understand that complex shapes are just primitives + Edit Mode operations`
      }
    ]
  },
  {
    id: 5,
    emoji: "🔧",
    title: "Modifiers",
    tag: "NON-DESTRUCTIVE",
    color: "#c084fc",
    intro: "Modifiers are Blender's superpower — non-destructive operations stacked on top of your base mesh. Stack them, reorder them, toggle them. The original is always safe until you Apply.",
    sections: [
      {
        title: "The Modifier Stack",
        content: `**Properties → 🔧 Modifier tab** — Add and manage modifiers here.

The stack processes **top to bottom**. Order matters dramatically:
- Subdivision Surface before Bevel: the bevel gets subdivided (smooth result)
- Bevel before Subdivision Surface: the subdivision gets beveled (sharp, then smoothed)

For each modifier:
- **👁 Eye icon** — Toggle viewport visibility
- **🎬 Camera icon** — Toggle render visibility
- **Apply** — Burns the result permanently into the mesh (destructive, often irreversible)
- **Duplicate** — Copy the modifier with same settings

Keep modifiers unapplied until: you need to sculpt on the subdivided mesh, you're exporting, or you need to manually edit the resulting geometry.`
      },
      {
        title: "Generate Modifiers — Shape Creators",
        content: `These modifiers create or grow geometry:

**Subdivision Surface** — The most-used modifier. Smooths by subdividing geometry.
- Catmull-Clark: smooth organic shapes (levels 2–3 usually sufficient)
- Simple: subdivide without smoothing (for displacement maps)
- Use **Ctrl+E → Mark Crease** on edges to keep them sharp while subdividing

**Mirror** — Model one half, get full symmetry. Set the axis, enable Clipping (verts snap at center seam).

**Array** — Duplicate in a pattern: fixed count, fit to length, or fit to curve. Stack multiple Arrays for 2D/3D grids.

**Bevel** — Procedurally round edges. Set Angle Limit to only bevel edges above a degree threshold. Far more flexible than manual beveling.

**Solidify** — Add thickness to any flat surface: walls, fabric, panels, paper.

**Screw** — Revolve a profile around an axis: bottles, vases, springs, columns.

**Boolean** — Use one object to cut/join/intersect another. See Module 9 for detail.

**Weld** — Merge vertices within a distance threshold. Essential after Booleans.

**Remesh** — Rebuild the entire mesh surface with uniform topology (Voxel or Quad modes). Key for sculpt prep.`
      },
      {
        title: "Deform Modifiers — Shape Changers",
        content: `These modify existing geometry without adding or removing it:

**Simple Deform** — Twist, Bend, Taper, or Stretch along an axis. Controlled by an angle or factor. Great for stylized shapes.

**Lattice** — Deform a mesh using a cage object. Edit the cage → the mesh follows. Non-destructive squash and stretch.

**Curve** — Deform a mesh along a Bezier/NURBS curve. Roads, pipes, roller coasters, any along-path shape.

**Displace** — Use a texture (Noise, Image, etc.) to push vertices along normals. Instant terrain, wrinkles, knurling.

**Smooth / Laplacian Smooth** — Relax geometry (reduce bumps) without subdividing. Good for cleaning up sculpts.

**Shrinkwrap** — Snap a mesh onto the surface of another object. Key for retopology.

**Cast** — Push the mesh toward a sphere, cube, or cylinder shape. Good for rounding things out.

**Wave** — Animate a ripple/wave across the surface. Physics-lite animation.`
      },
      {
        title: "Modifier Recipes for Common Goals",
        content: `Hard surface object with rounded edges:
→ Model base mesh → Bevel modifier (Angle limit ~30°) → Subdivision Surface (level 2)

Symmetrical organic shape:
→ Model one half → Mirror modifier (Clipping on) → Subdivision Surface → Sculpt

Fabric or thin material:
→ Model flat surface → Solidify modifier → Subdivision Surface

Repeating pattern (fence, chain, stairs):
→ Model one unit → Array modifier (fit to curve or fixed count)

Terrain or landscape:
→ Add Grid (high density) → Displace modifier + Noise/Musgrave texture

Procedural pipe/cable following a path:
→ Bezier curve for the path → Cylinder for cross-section → Curve modifier on cylinder → curve object as the target`
      },
      {
        title: "🔨 Mini Workshop: Procedural Vase",
        isWorkshop: true,
        content: `Build a vase using zero manual sculpting — pure modifiers:

1. **Shift+A → Mesh → Circle** (16 vertices)
2. **Tab → Edit Mode** → select all → **E** to extrude upward repeatedly, pulling verts in/out to shape a profile
3. Back in **Object Mode** → **Add → Modifier → Screw** — instant vase shape!
4. **Add → Modifier → Solidify** — give it wall thickness (0.02–0.05)
5. **Add → Modifier → Subdivision Surface** (level 2) — smooth it
6. Optional: **Add → Modifier → Simple Deform → Twist** — twist the vase body

Explore: change the Screw angle (360° = full closed, less = open spiral), change Screw axis.

✅ Goal: Understand that complex shapes = simple profiles + stacked modifiers`
      }
    ]
  },
  {
    id: 6,
    emoji: "🔷",
    title: "Geometry Nodes",
    tag: "PROCEDURAL GENERATION",
    color: "#38bdf8",
    intro: "Geometry Nodes is Blender's procedural modeling system — a visual node graph that generates, modifies, and instances geometry without touching the mesh directly. Think of it as programming in Blender. It's fully non-destructive and animatable.",
    sections: [
      {
        title: "What Geometry Nodes Is For",
        content: `Geometry Nodes (GN) lets you define geometry through rules rather than by hand. The results are:
- Fully non-destructive — the node graph is always editable
- Instantly animatable — any value can be driven by time, a driver, or another node
- Instancing-friendly — generate thousands of objects with near-zero memory cost

When to reach for Geometry Nodes:
- Any **repeated or distributed** geometry (trees in a forest, bolts on a panel, bricks on a wall)
- **Procedural shapes** that would take too long to model manually
- **Rule-based generation** where parameters should be tweakable
- **Hair and fur** (Blender 4.x+ uses GN for the hair system)
- **Simulation** (Blender 4.1+ Simulation Zones run physics inside GN)
- **Anything you want to animate that isn't keyframeable with standard tools**

Access: Select an object → **Properties → Modifier → Add → Geometry Nodes**. This creates a GN modifier and opens the Geometry Node Editor.`
      },
      {
        title: "Core Concepts: Fields, Instances, Attributes",
        content: `**Fields** — Values that vary per-element. Instead of one number, a field is a function evaluated at each vertex/edge/face/instance. This is what makes "distribute across a surface" possible — the position field gives each point's location.

**Instances** — Lightweight references to geometry placed at many locations. An instance doesn't copy the mesh — it points to the original. 10,000 trees as instances use almost no extra memory. Key nodes:
- **Instance on Points** — Place a geometry (or collection) at every point in a point cloud
- **Realize Instances** — Convert instances to actual mesh data (necessary before some operations)

**Attributes** — Named data stored per-element (vertex, edge, face, instance). Position, normal, ID, custom names. You can create, read, and write attributes. They flow through the graph.

**Domains** — Where attributes live: Vertex, Edge, Face, Face Corner, Spline, Instance. Nodes can transfer data between domains.`
      },
      {
        title: "Key Node Categories",
        content: `All accessed via **Shift+A** in the Geometry Node Editor:

**Geometry**:
- **Join Geometry** — Merge multiple geometry streams into one
- **Transform Geometry** — Move/rotate/scale geometry in the graph
- **Merge by Distance** — Weld close vertices (like the Weld modifier)
- **Subdivide Mesh** — Subdivide inside the graph

**Instances**:
- **Instance on Points** — The workhorse distribution node
- **Rotate Instances** — Randomize rotation per instance
- **Scale Instances** — Randomize scale per instance
- **Collection Info** — Bring a collection into the graph as instancable geometry

**Point**:
- **Distribute Points on Faces** — Scatter points across a surface (random or Poisson disk)
- **Points to Vertices** — Convert a point cloud to a mesh

**Mesh Primitives** — Create cubes, spheres, cylinders inside the graph without scene objects

**Utilities**:
- **Random Value** — Generate random floats/vectors/integers/booleans per-element
- **Math** — Every math operation you need
- **Mix** — Blend between two values by a factor
- **Map Range** — Remap a value from one range to another (like lerp + clamp)

**Input**:
- **Position** — The world position of each element (a field)
- **Index** — The integer index of each element
- **Named Attribute** — Read a custom attribute by name`
      },
      {
        title: "Simulation Zones (Blender 4.1+)",
        content: `**Simulation Zones** let you run iterative (frame-by-frame) simulation logic inside Geometry Nodes. This means you can write custom physics, growth algorithms, or state machines — entirely in nodes.

Structure:
- **Simulation Input** node → process geometry for one frame → **Simulation Output** node
- Whatever geometry flows through the zone is "remembered" and passed to the next frame
- You can read the previous frame's state and use it to compute the next

What this unlocks:
- Custom particle systems with GN-controlled behavior
- Growth/spread simulations (fire spread, crystal growth)
- Agent-based motion
- Reaction-diffusion patterns
- Any iterative process

This is advanced but understanding it exists changes what you think is possible.`
      },
      {
        title: "Hair System (Geometry Nodes Based)",
        content: `As of Blender 4.x, the new hair system is built on Geometry Nodes. Hair is a **Curves** object — each strand is a spline.

**Object → Add → Curve → Empty Hair** — starts a hair object parented to a mesh (the mesh acts as the base surface).

In the **Hair Curves** context:
- Use sculpt brushes to style hair (comb, cut, smooth, clump)
- Hair is instanced as actual strand geometry at render time

In Geometry Nodes, you can procedurally generate hair by:
- Distributing points on the surface
- Creating curves at those points with defined length/direction
- Adding noise for variation

Key nodes for hair: **Distribute Points on Faces**, **Curve Line**, **Set Curve Normal**, **Noise Texture** (for random variation), **Resample Curve** (for render resolution).`
      },
      {
        title: "🔨 Mini Workshop: Scatter Objects on a Surface",
        isWorkshop: true,
        content: `The foundational GN workflow — place objects procedurally on a mesh:

1. **Shift+A → Mesh → Grid** — your ground plane (scale it up: S → 5)
2. **Shift+A → Mesh → Ico Sphere** — the object you'll scatter. Scale small (S → 0.1). Keep it in scene.
3. Select the **Grid** → Properties → Modifier → Add → **Geometry Nodes**
4. In the node editor, **Shift+A → Point → Distribute Points on Faces** — place it between Group Input and Group Output. Connect: Geometry → Mesh, Geometry → Geometry.
5. **Shift+A → Instances → Instance on Points** — connect: Points → Points, output Instances → Geometry.
6. **Shift+A → Input → Object Info** — set the Object to your Ico Sphere. Connect: Geometry → Instance (on Instance on Points).

You now have hundreds of spheres scattered on the grid — procedurally.

7. Add **Rotate Instances** node after Instance on Points → connect a **Random Value** (Vector) to Rotation for random rotation.

✅ Goal: Understand the Distribute → Instance → Modify pipeline — the foundation of 80% of GN work`
      }
    ]
  },
  {
    id: 7,
    emoji: "🎨",
    title: "Materials & Shading",
    tag: "SURFACE APPEARANCE",
    color: "#f472b6",
    intro: "Materials define what an object is made of — metal, glass, skin, rubber, cloth. The Shader Editor is a node graph where you can build any surface appearance. Blender 5.1 uses both Cycles and EEVEE Next, each with full Principled BSDF support.",
    sections: [
      {
        title: "Principled BSDF — The Universal Shader",
        content: `The **Principled BSDF** node handles nearly every real-world material in one node. Key parameters:

**Base Color** — The fundamental color or texture of the surface.
**Metallic** — 0 = dielectric (plastic, wood, skin), 1 = metal. Use 0 or 1, not in-between — real materials are one or the other.
**Roughness** — 0 = mirror-smooth, 1 = completely matte. Most surfaces: 0.3–0.8. Metals often 0.1–0.4.
**IOR (Index of Refraction)** — How much light bends through transparent materials. Glass: 1.45, Water: 1.33, Diamond: 2.42.
**Transmission Weight** — 0 = opaque, 1 = fully transmissive (glass, water). EEVEE needs Screen Space Refraction enabled.
**Coat Weight / Coat Roughness** — A clearcoat layer on top (car paint, lacquered wood).
**Sheen Weight** — Soft retroreflective sheen (fabric, velvet, skin at grazing angles).
**Emission Color + Strength** — Makes the surface glow and emit light.
**Alpha** — Transparency (set Blend Mode in Material Settings to Alpha Blend or Alpha Clip).
**Subsurface Weight** — Light scatters below the surface (skin, wax, marble). Set Subsurface Radius for color bleed.`
      },
      {
        title: "The Shader Editor",
        content: `Open: **Workspace → Shading tab** or split any panel → Shader Editor.

Every material is a node graph. The minimum: **Principled BSDF → Material Output (Surface)**.

Adding textures — connect to inputs:
- **Shift+A → Texture → Image Texture** → Color → Base Color (loads a real image file)
- **Shift+A → Texture → Noise Texture** → Fac → Roughness (procedural variation)
- For bump: Image Texture → **Normal Map** node → Normal → Normal input

Essential utility nodes:
- **ColorRamp** — Remap a grayscale range to any colors or values. Plug noise → ColorRamp → Base Color for instant organic color variation.
- **Mix Color / Mix Shader** — Blend two colors or two complete shaders.
- **Fresnel** — More reflective at grazing angles. Physically correct, adds realism.
- **Texture Coordinate** — Controls how textures map: UV (uses UV map), Object (texture fixed to object), Generated (auto), World (fixed in world space).
- **Mapping** — Translate/rotate/scale a texture coordinate. Plug Texture Coordinate → Mapping → Texture.`
      },
      {
        title: "EEVEE Next vs Cycles — Material Considerations",
        content: `**Cycles** (path-traced) renders materials with physically accurate light simulation. All Principled BSDF features work. Slower but ground-truth accurate.

**EEVEE Next** (real-time path-traced, default in Blender 4.2+) is dramatically improved over classic EEVEE:
- Supports true reflections and refractions
- Path-tracing option for higher quality
- Real-time global illumination
- Shadow casting from all light types
- Subsurface scattering support

EEVEE Next caveats vs Cycles:
- Caustics are limited (light focusing through glass)
- Very dense volumes may differ
- Ray count is limited for real-time performance

For most use cases (product shots, architectural viz, motion graphics), EEVEE Next now produces results that were previously Cycles-only, in a fraction of the render time.

Shader nodes that are Cycles-only: some advanced volume shaders, true caustics paths. Everything else is compatible.`
      },
      {
        title: "Material Recipes for Common Surfaces",
        content: `**Brushed metal**:
→ Metallic: 1.0 | Roughness: 0.4 | Base Color: medium grey
→ Add Noise Texture → Map Range (0.3–0.5) → Roughness for variation

**Polished chrome**:
→ Metallic: 1.0 | Roughness: 0.05 | Base Color: light grey (#CCCCCC)

**Glass**:
→ Transmission Weight: 1.0 | Roughness: 0.0 | IOR: 1.45
→ In EEVEE: Material Settings → enable Screen Space Refraction

**Worn painted plastic**:
→ Base Color: color of paint | Roughness: 0.6 | Metallic: 0
→ Second material slot: bare plastic (Roughness: 0.8, darker)
→ Mix using an edge wear mask (Pointiness from Geometry node)

**Skin (basic)**:
→ Subsurface Weight: 0.3 | Subsurface Radius: warm red tones | Roughness: 0.5
→ Add Noise Texture → slight Base Color variation

**Emissive neon**:
→ Emission Color: bright saturated color | Strength: 5–20
→ Combine with Bloom in post-processing (Compositor or EEVEE Bloom)`
      },
      {
        title: "🔨 Mini Workshop: 3 Materials, 3 Surfaces",
        isWorkshop: true,
        content: `Create three spheres. Apply one material each. Your goal: see how 2–3 parameters completely define material identity.

**Polished metal sphere**: Metallic 1.0, Roughness 0.1, Base Color dark grey
**Matte rubber sphere**: Metallic 0, Roughness 0.9, Base Color saturated orange
**Glass sphere**: Transmission Weight 1.0, Roughness 0, IOR 1.45

Then experiment:
- Change roughness on the metal from 0.1 to 0.5 — see how it shifts from chrome to brushed
- Add a ColorRamp between a Noise Texture and Base Color on the rubber sphere
- Set the glass sphere's Base Color to a slight blue tint

✅ Goal: Understand that Principled BSDF sliders = material identity`
      }
    ]
  },
  {
    id: 8,
    emoji: "💡",
    title: "Lighting",
    tag: "ILLUMINATION",
    color: "#fbbf24",
    intro: "Lighting is half the art. The same object in bad lighting looks terrible. Blender 5.1 with EEVEE Next gives you cinema-grade lighting in real time.",
    sections: [
      {
        title: "Light Types and When to Use Each",
        content: `**Point Light** — Omnidirectional bulb. Light radiates in all directions from a single point. Candles, bulbs, glowing orbs.

**Sun** — Parallel rays from an infinite distance. Consistent across the entire scene; position doesn't matter, only rotation. Outdoor daylight, large directional light sources. Casts parallel shadows.

**Spot** — Cone of light. Stage lights, flashlights, headlights. Controls: Spot Size (cone angle), Blend (hard vs soft edge).

**Area** — Rectangular or disc light source. Softest shadows, most photorealistic. Simulates windows, softboxes, diffuse panels. Larger = softer shadows. Requires higher power values (500W–5000W typical).

**HDRI (World Environment)** — A 360° photograph used as both background and light source. Instantly realistic environmental lighting. Found in: **World Properties → Surface → Background → Environment Texture**. Download free HDRIs from Poly Haven.`
      },
      {
        title: "Key Light Settings",
        content: `For any light object:
- **Power (W)** — Intensity. Area lights need much higher values than Point lights for equivalent brightness.
- **Color** — Warm (3200K orange) key + cool (7000K blue) fill = cinematic look.
- **Radius / Size** — Larger radius = softer shadows. This is the most impactful realism setting.
- **Spread** (Area lights) — How wide the light spreads from the surface.

**Three-Point Lighting (the classic setup)**:
1. **Key Light** — Primary light, positioned 45° above and to one side. Bright.
2. **Fill Light** — Softer, from the opposite side. Reduces harsh shadows. ~30–50% of key power.
3. **Rim / Back Light** — Behind the subject, creates a highlight edge that separates it from the background.

**Light Linking** (Blender 4.1+):
In the **Light Properties → Light Linking panel**, specify exactly which objects a light affects. One light can illuminate the subject but not the background. Essential for controlled product and portrait lighting.`
      },
      {
        title: "HDRI Lighting Setup",
        content: `HDRI is the fastest path to realistic environment lighting:

1. **World Properties → Surface → Background**
2. Click **Color → Environment Texture**
3. Click **Open** → load any .hdr or .exr file
4. Add a **Texture Coordinate** (Object) + **Mapping** node to rotate the HDRI
5. Change World **Strength** to adjust overall brightness

Controlling HDRI appearance:
- **Rotation** — Rotate the environment to change where the light hits from
- **World Strength** — Global exposure of the environment
- **Background visibility** — Uncheck "Show Background" in Render Properties if you want the HDRI for light only, not visible as background

Combining HDRI + additional lights: the HDRI provides ambient/fill, your placed lights add controlled highlights and shadows. Best of both approaches.`
      },
      {
        title: "🔨 Mini Workshop: Light Your Subject",
        isWorkshop: true,
        content: `Using any object (your mug, Suzanne, or a simple sphere):

1. Delete the default light
2. **Shift+A → Light → Area** — position above and to the left (key light). Power: 500W, Size: 1m.
3. Add another Area light from the opposite side. Power: 150W (fill light).
4. Add a Point or Area light behind — rim light for edge definition.
5. Switch viewport shading to Rendered: **Z → Rendered** (or click the sphere icon top-right)

Compare the difference between:
- Flat single overhead light
- 3-point setup
- Replacing all lights with just an HDRI

Observe: how does shadow softness change with light size? How does light color temperature affect mood?

✅ Goal: Be able to diagnose why a render looks bad — and fix it with lighting`
      }
    ]
  },
  {
    id: 9,
    emoji: "🏛️",
    title: "Sculpt Mode",
    tag: "ORGANIC MODELING",
    color: "#34d399",
    intro: "Sculpt Mode is digital clay. Push and pull geometry with brushes to create organic forms — characters, creatures, terrain, abstract shapes. The approach to topology here is completely different from Edit Mode.",
    sections: [
      {
        title: "Topology Approaches for Sculpting",
        content: `Before sculpting, you need enough geometry to work with. Three approaches:

**Dyntopo (Dynamic Topology)** — Blender adds and removes geometry on-the-fly as you sculpt. Enable in the Sculpt header or N panel. Great for early exploration — you can pull out a horn or ear without pre-subdividing. Downsides: chaotic topology, slow at high detail.

**Multires Modifier** — Stacks subdivision levels while keeping the lower levels editable. Add the Multiresolution modifier → Subdivide several times → sculpt at high level → the base form at level 0 is unchanged. Best for production sculpts. Subdivision levels 4–7 for character work.

**Remesh** — Rebuilds the entire mesh with uniform topology. In Sculpt Mode header: **Remesh** with a Voxel Size setting. Use this to re-even topology after Dyntopo gets too messy. Also available as the **Remesh modifier** for non-destructive use.

Typical workflow: rough form with Dyntopo → Remesh to clean topology → Multires for fine detail.`
      },
      {
        title: "Core Sculpt Brushes",
        content: `**Draw** — Push geometry outward (Ctrl = inward). The basic brush. Use for adding volume anywhere.
**Clay / Clay Strips** — Build material up like adding clay slabs. Flatter stroke than Draw. Great for primary forms.
**Smooth** — Hold **Shift** with any brush to smooth instantly. The most used secondary action.
**Inflate** — Puff geometry outward in all directions uniformly. Good for lips, cheeks, puffiness.
**Crease** — Create a sharp indented line. Wrinkles, muscle lines, panel seams.
**Pinch** — Pull geometry toward the brush center. Sharpens edges and ridges.
**Flatten** — Press geometry against a plane. Rocks, bone planes, flat-faced organic forms.
**Grab** — Move large chunks of mesh together. Rough posing, pulling out limbs.
**Snake Hook** — Pull out tendrils of geometry as you drag. Tentacles, horns, hair locks. Only works without Dyntopo (or with it at low count).
**Elastic Deform** — Pushes nearby geometry naturally, simulates tissue. Posing organic forms.

**F** — Resize brush (drag)
**Shift+F** — Change strength (drag)
**Ctrl+drag** — Invert brush direction (push → pull)`
      },
      {
        title: "Masks & Face Sets",
        content: `**Masking** — Paint areas you want to protect from sculpting.

**M** — Mask brush (paint mask onto surface)
**Alt+M** — Clear mask
**Ctrl+I** — Invert mask (what was protected becomes sculptable, and vice versa)
**Ctrl+Click** — Fill mask on a Face Set

**Face Sets** — Color-coded regions of the mesh. Each face set can be isolated, hidden, or sculpted independently.
- **Ctrl+W** — Create face set from masked area
- **H** — Hide unmasked face sets (isolate the active face set)
- **Alt+H** — Reveal all hidden face sets
- Right-click on a face set color to rename/select

Use Face Sets to: isolate a head from a body for sculpting, protect finished areas while working on others, drive procedural effects in Geometry Nodes.`
      },
      {
        title: "🔨 Mini Workshop: Sculpt a Rock",
        isWorkshop: true,
        content: `Rocks are ideal first sculpts — they're irregular by nature, so mistakes look intentional:

1. **Shift+A → Ico Sphere** (subdivisions: 3 in F9)
2. Add a **Multiresolution modifier** → Subdivide 3–4 times
3. Enter **Sculpt Mode**
4. **Grab brush** — pull out 3–4 irregular protrusions to break the perfect sphere
5. **Clay Strips** — build up flat rocky faces
6. **Flatten brush** — create some flat facets; rocks have these
7. **Crease brush** — add sharp cracks and crevices
8. **Shift** (Smooth) — wherever things look too pointy or unnatural
9. **Draw + Ctrl** — push in some pits and cavities

Duplicate it (Shift+D), use Grab to reshape differently — instant rock cluster.

✅ Goal: Organic results in under 10 minutes. Sculpting is fast once you stop being precious.`
      }
    ]
  },
  {
    id: 10,
    emoji: "📐",
    title: "Boolean & Hard Surface",
    tag: "PRECISION MODELING",
    color: "#60a5fa",
    intro: "Hard surface modeling covers anything manufactured: machines, architecture, vehicles, electronics. The core technique is combining precise primitives using Boolean operations, then refining with bevels and subdivision.",
    sections: [
      {
        title: "Boolean Operations",
        content: `The **Boolean modifier** uses one object (the cutter) to modify another (the target):

- **Union** — Combine two objects into one merged solid
- **Difference** — Subtract one object from another. Carves holes, cuts recesses.
- **Intersect** — Keep only the overlapping volume between two objects

**Workflow:**
1. Select the base (target) object
2. **Properties → Modifier → Boolean**
3. Set operation type
4. Set the Cutter object in the Object field
5. **H** to hide the cutter — the cut remains live and non-destructive
6. Apply when done, or keep live for future adjustment

After a Boolean, always add a **Weld modifier** to clean up near-zero-distance vertices left by the operation.

**Exact solver** vs **Fast solver**: Exact is more accurate (use for complex overlapping cuts). Fast is quicker for simple operations.

**Bool Tool addon** (enable in Preferences → Add-ons): adds Ctrl+Minus for quick difference boolean, Ctrl+Plus for union. Faster workflow.`
      },
      {
        title: "Hard Surface Shading Techniques",
        content: `The challenge: subdivision smooths everything, but hard surface objects need both smooth curved areas and sharp mechanical edges.

**The standard hard surface stack:**
1. Model base shape with edge loops placed for control
2. **Bevel modifier** — round all edges above an angle threshold (Limit Method: Angle, ~30°). Use segments: 2–3 for a sharp highlight.
3. **Subdivision Surface modifier** — smooth the curved areas, keep sharp edges beveled
4. **Weighted Normals modifier** — compute normals based on face area. Keeps flat areas shading flat even with micro-bevels.

**Edge Creases (Ctrl+E → Edge Crease in Edit Mode)** — Tell the Subdivision Surface modifier to keep specific edges sharp without beveling them. Good for internal detail you want crisp.

**Bevel Weight** — Per-edge control over how much the Bevel modifier affects each edge. Mark via Ctrl+E → Edge Bevel Weight. Lets you have some edges fully beveled and others untouched.

**Shade Auto Smooth** (Object right-click) — Set a degree threshold. Edges sharper than the threshold show as hard; gentler ones shade smooth. No geometry needed.`
      },
      {
        title: "The Box Cutter Workflow",
        content: `The dominant hard surface approach for industrial/sci-fi assets:

1. Start with a **Cube** — your base panel, hull, or body
2. Add **Boolean cutters**: other cubes, cylinders, custom shapes — for recesses, holes, vents, panels
3. Keep all cutters live and hidden (H) so you can adjust any cut at any time
4. Add **Bevel modifier** with Angle limit for edge highlights
5. Add **Subdivision Surface** for final smoothing
6. Add **Weighted Normals** for shading correctness

The key insight: you never manually model the holes, recesses, or panel lines. They're all boolean cuts.

**Recommended addons** for professional hard surface work:
- **HardOps** — Boolean management, shading tools, workflow shortcuts
- **BoxCutter** — Interactive boolean drawing directly in the viewport
- **MESHmachine** — Edge flow and bevel management after booleans`
      },
      {
        title: "🔨 Mini Workshop: Sci-Fi Wall Panel",
        isWorkshop: true,
        content: `Create a wall panel like you'd see on a spaceship — using only booleans:

1. **Shift+A → Plane** → scale up (S → 3) → **Solidify modifier** (thickness 0.05)
2. Add **Bevel modifier** (Limit Method: Angle, width: 0.02, segments: 2)
3. Add **Subdivision Surface** (level 1)

Now add cuts:
4. **Shift+A → Cube** → scale flat (S → Z → 0.02) → position on the panel surface
5. Select the panel → **Boolean → Difference** → pick the flat cube → you have a recess
6. **H** to hide the cutter
7. **Shift+A → Cylinder** → scale tiny (S → 0.05) → copy several times for screw holes → Boolean each

Add an Area light at a low grazing angle to show the surface detail dramatically.

✅ Goal: A complex-looking panel built entirely from primitive booleans`
      }
    ]
  },
  {
    id: 11,
    emoji: "⚡",
    title: "Physics & Simulation",
    tag: "DYNAMICS",
    color: "#fb923c",
    intro: "Blender includes several simulation systems for dynamics, fabric, fluids, fire, smoke, and particles. Each is its own domain. Knowing which system handles which problem is the skill.",
    sections: [
      {
        title: "Rigid Body Simulation",
        content: `**Properties → Physics → Rigid Body** — Makes objects fall, collide, bounce, and stack under simulated gravity.

Two roles:
- **Active** — The object participates in the simulation, is affected by gravity and collisions
- **Passive** — A static collider (floor, walls). Other objects bounce off it.

Key settings:
- **Mass** — Heavier objects have more momentum
- **Friction** — How much objects slide vs grip
- **Bounciness (Restitution)** — How elastic collisions are (0 = dead stop, 1 = perfect bounce)
- **Collision Shape** — How Blender approximates the object for collision: Box, Sphere, Convex Hull, Mesh. Use Convex Hull or Mesh for complex shapes.

**Scene → Rigid Body World → Cache** — Bake the simulation to frames so it plays back reliably.
**Ctrl+A** — Apply the simulation result as keyframes if you need to edit the baked motion.

Use for: falling objects, breaking things, stacking simulations, pinball physics, dominos.`
      },
      {
        title: "Cloth Simulation",
        content: `**Properties → Physics → Cloth** — Simulates fabric: draping, colliding with objects, responding to wind.

Key settings:
- **Vertex Mass** — How heavy the fabric is. Light = floaty, heavy = stiff.
- **Stiffness → Tension/Compression/Shear** — How much the cloth resists stretching and shearing. Low = silky, High = canvas.
- **Bending** — Resistance to folding. Low = silk, High = cardboard.
- **Self Collision** — Prevents cloth from passing through itself (computationally expensive).
- **Collision** — Enable on the objects the cloth should land on (Properties → Physics → Collision).

**Pinning**: Select vertices in Edit Mode → assign to a Vertex Group. In Cloth → Shape → Pin Group, use that group. Those vertices stay fixed while the rest simulates.

Use for: draped tablecloths, clothing on a character, flags, curtains, falling fabric.

**Bake**: Properties → Physics → Cloth → Cache → Bake. Always bake before rendering.`
      },
      {
        title: "Fluid & Gas Simulation (Mantaflow)",
        content: `Blender uses **Mantaflow** for both liquid and gas (smoke/fire) simulations. Both use a **Domain** object + **Flow** objects + optional **Effectors**.

Setup:
1. Create a box → **Properties → Physics → Fluid → Domain** (this is the simulation volume)
2. Create the source (emitter) → **Properties → Physics → Fluid → Flow**
3. Set Domain type: **Liquid** or **Gas**

**Liquid (water)**: Resolution determines quality (64–128 for preview, 256+ for final). Enable **Mesh** in Domain settings for a smooth liquid surface. Add **Diffuse** particles for spray/foam.

**Gas (fire/smoke)**: Set Flow type to Fire+Smoke or just Smoke. Add a **Vorticity** value for turbulent, swirling smoke. Use the **Noise modifier** (in Domain settings) for fine detail. Render smoke with **Cycles** for best results (volumetric rendering).

**Effectors**: objects that redirect fluid flow (obstacles). Add them via Physics → Fluid → Effector.

Cache and bake before rendering. Gas sims especially benefit from baking to disk.`
      },
      {
        title: "Particles, Hair & Force Fields",
        content: `**Properties → Particles → Add** — Particle systems for emission and hair.

**Emitter particles**: Objects born at a surface, move through space, die.
- **Emission**: count, start/end frame, lifetime
- **Physics**: Newtonian (gravity, drag), Keyed (follow another particle), Boids (flocking AI)
- **Render**: render as Object, Collection, or geometry (dots, halos)

**Hair particles** (legacy): generate strands from a surface. Controlled with Particle Edit mode. The **new hair system** uses Geometry Nodes (see Module 6) and is preferred in Blender 4.x+.

**Force Fields** (Shift+A → Force Field):
- **Wind** — Constant directional push
- **Turbulence** — Random chaotic movement
- **Vortex** — Spiral/spinning force
- **Magnetic** — Attract/repel based on particle charge
- **Gravity / Force** — Point gravity well or constant force

Force fields affect particles, cloth, soft body, and rigid bodies. Layer multiple fields for complex motion.

**Soft Body** (Physics → Soft Body): elastic, bouncy deformation. Objects squish and jiggle. Use for bouncy logos, jello, organic squash and stretch.`
      },
      {
        title: "🔨 Mini Workshop: Falling Cubes",
        isWorkshop: true,
        content: `The quickest way to see simulation working:

1. **Shift+A → Plane** — scale large (S → 5). **Properties → Physics → Rigid Body → Passive** (this is the floor).
2. **Shift+A → Cube** — position 3 units above the plane. **Physics → Rigid Body → Active**.
3. Duplicate the cube (Shift+D) 5–10 times, scatter randomly above the plane at different heights.
4. Press **Space** (or the play button in the Timeline) — the cubes fall and pile up.
5. Try: change Bounciness on a cube to 0.8 and watch it bounce.
6. Add **Shift+A → Force Field → Wind** — point it sideways. The cubes now drift.

✅ Goal: See that simulation is a system of parameters — not keyframes — and understand how to compose it`
      }
    ]
  },
  {
    id: 12,
    emoji: "🎬",
    title: "Rendering",
    tag: "OUTPUT",
    color: "#a78bfa",
    intro: "Rendering converts your 3D scene into a final image or animation. Blender 5.1 has two main renderers: Cycles (path-traced, physically accurate) and EEVEE Next (real-time path-traced, dramatically faster). Knowing when to use each is the key decision.",
    sections: [
      {
        title: "Cycles vs EEVEE Next — When to Use Each",
        content: `**Cycles** — Physically accurate path tracing.
- Simulates true light: reflections, refractions, caustics (light through glass), subsurface scattering, volumetrics
- Slower: seconds to minutes per frame on GPU, much longer on CPU
- Use when: photorealistic output is the goal, caustics are required, subsurface skin is critical
- GPU rendering available: CUDA/OptiX (NVIDIA), Metal (Mac). Enable in **Preferences → System → Cycles Render Devices**.

**EEVEE Next** (Blender 4.2+) — Real-time path-traced renderer.
- Near-instant feedback in the viewport
- Supports: true reflections, refractions, volumetrics, subsurface scattering, global illumination
- Significantly faster than Cycles for animation
- Some limitations vs Cycles: fewer light bounces, limited caustics, lighter volumetric detail
- Use when: motion graphics, stylized work, animation with tight deadlines, real-time previsualization

**Workbench** — Technical renderer for clay renders, studio presentation. No materials, just form.

In Blender 5.1, for most non-caustics work, EEVEE Next produces competitive results to Cycles at a fraction of the time.`
      },
      {
        title: "Key Render Settings",
        content: `**Render Properties (🎬 icon)**:
- **Render Engine** — Cycles / EEVEE Next / Workbench
- **Samples** — How many light paths to trace per pixel (Cycles). More = less noise, more time. 128–256 for preview, 512–2048 for final.
- **Denoising** — Enable! AI denoising (OptiX on NVIDIA, OpenImageDenoise for CPU) removes noise at low sample counts. Use **Render Denoising** for final, **Viewport Denoising** for preview.
- **Light Paths** (Cycles) — Number of bounces for each ray type. Defaults are fine; reduce Transmission/Volume bounces to speed up glass-heavy scenes.

**Output Properties (🖼️ icon)**:
- **Resolution X/Y** — Image size in pixels. Common: 1920×1080 (FHD), 3840×2160 (4K).
- **Frame Range** — Start/end frame for animation renders.
- **Frame Rate** — 24fps (film), 25fps (PAL), 30fps (NTSC/web), 60fps (game/slow-mo).
- **Output Path** — Where to save frames. Use // for relative to the .blend file.
- **File Format** — PNG (lossless, single frames), JPEG (lossy), OpenEXR (HDR data, multi-pass, essential for compositing).

**F12** — Render current frame
**Ctrl+F12** — Render animation (all frames in range)
**F11** — Show last rendered image`
      },
      {
        title: "Render Passes & the Compositor",
        content: `Instead of rendering a single flat image, Blender can output **render passes**: separate layers for shadows, reflections, diffuse, specular, depth, normals, etc.

Enable passes: **View Layer Properties → Passes** — check what you need.

Output to **OpenEXR Multilayer** format to preserve all passes in one file.

**The Compositor** (Workspace → Compositing tab or open Compositor editor):
- A node graph for post-processing rendered images
- Runs after the render, on the 2D image
- Key nodes: **Render Layers** (your passes as input), **Color Balance**, **Glare** (bloom/streaks/glow), **Lens Distortion**, **Blur**, **Mix**, **Vignette** (using Ellipse Mask)
- Can combine multiple render layers, apply color grading, add depth of field, all non-destructively

**Viewport Compositor** (Blender 4.x+): apply compositor effects live in the 3D viewport. Instant visual feedback without a full render.

The Compositor is what separates a raw render from a finished image.`
      },
      {
        title: "Camera Settings That Matter",
        content: `Select the camera → **Object Data Properties (🎬 camera icon)**:

- **Focal Length** — Longer = telephoto (compressed perspective, good for portraits). Shorter = wide angle (distorted, dramatic). 50mm ≈ human eye. 85–135mm = portrait. 24mm = wide architectural.
- **Sensor Size** — Affects depth of field and perspective. Full Frame (36mm) is the default.
- **Depth of Field → F-Stop** — Lower = more blur (shallow depth of field). Higher = everything sharp. Enable DoF, set Focus Object or Distance.
- **Clip Start/End** — The near and far range where Blender renders. Adjust for very small or very large scenes.
- **Camera Type** — Perspective (default), Orthographic (no perspective, technical drawings), Panoramic (360° equirectangular for VR).

**Numpad 0** — Enter camera view
**N → View → Lock Camera to View** — Navigate freely and the camera follows. Disable when done.
**Ctrl+Alt+0** — Snap the camera to current viewport.`
      },
      {
        title: "🔨 Mini Workshop: First Beauty Render",
        isWorkshop: true,
        content: `Take any object and render it in a way you'd actually want to show someone:

1. Switch to **Cycles** in Render Properties
2. Samples: 128, enable **Denoising** (OpenImageDenoise)
3. **World Properties → Environment Texture** — load any HDRI
4. **Shift+A → Mesh → Plane** — large plane below object as floor. Add material → enable **Shadow Catcher** (Material → Settings → Shadow Mode: Shadow Catcher) — floor shows only shadows, not itself.
5. **Numpad 0** — camera view. Press N → View → Lock Camera to View, navigate to a good angle.
6. **F12** — render.

Experiment: switch the same setup to EEVEE Next. Compare quality vs render time.

✅ Goal: A render you'd show someone — with shadows, environment, proper camera`
      }
    ]
  },
  {
    id: 13,
    emoji: "🌊",
    title: "Procedural Textures",
    tag: "ADVANCED SHADING",
    color: "#818cf8",
    intro: "Procedural textures are generated mathematically — no image files, infinite resolution, no tiling, fully animatable. Combined with the Shader Editor, they can describe almost any surface.",
    sections: [
      {
        title: "Core Texture Nodes",
        content: `All found via **Shift+A → Texture** in the Shader Editor:

**Noise Texture** — The fundamental organic texture. Parameters: Scale (zoom level), Detail (complexity layers), Roughness (sharpness of detail), Distortion (warp the noise itself). The foundation of most procedural materials.

**Voronoi Texture** — Cell-based patterns. Distance to Edge mode = cracked earth, ceramic, skin pores. Smooth F1 = soft cellular blobs. Randomness controls how regular the cells are.

**Wave Texture** — Concentric rings or parallel stripes. Bands vs Rings type. Add Distortion for wood grain. Phase Offset can animate it.

**Musgrave Texture** — Fractal noise with more layers and control than basic Noise. Great for terrain height maps, cloud patterns.

**Magic Texture** — Colorful, swirling psychedelic patterns. Depth and Distortion controls. Underrated for abstract surfaces and trippy effects.

**Brick Texture** — Procedural bricks with mortar. Control width, height, offset, mortar size. Can mix with other textures for realistic variation.

**Gradient Texture** — Simple linear/radial/spherical gradient. Often used as a factor for mixing or masking.`
      },
      {
        title: "Connecting Textures to Materials",
        content: `The key connectors between textures and the Principled BSDF:

**ColorRamp** — Remap any grayscale value (0–1) to any set of colors. The most versatile node. Plug Noise → ColorRamp → Base Color for instant rock/lava/organic color.

**Bump node** — Simulate surface detail from a height map without moving geometry. Fast, works in Cycles and EEVEE. Height → Bump → Normal input.

**Displacement node** — Actually moves vertices based on texture (requires Cycles + Material → Settings → Displacement: Both). Much more expensive than Bump but geometrically correct.

**Mix node** — Blend two colors/textures by a Factor. Use another texture as the Factor for organic blending (e.g., blend clean grass and muddy grass by a Noise-driven mask).

**Texture Coordinate + Mapping** — Always pair these when using procedural textures. Texture Coordinate (Object) + Mapping (translate/rotate/scale) controls how the texture maps to the surface. Object coordinates mean the texture moves with the object — useful for predictable results.

**Math / Map Range** — Transform the 0–1 output of a texture into any numeric range. Essential for routing texture outputs to non-color inputs like Roughness, Metallic, Emission Strength.`
      },
      {
        title: "Procedural Material Recipes",
        content: `**Rock / Stone**:
→ Noise (Scale 6, Detail 8) → ColorRamp (greys with brown) → Base Color
→ Same Noise → Bump → Normal (for surface detail)
→ Second Noise → Map Range → Roughness (0.5–0.9 variation)

**Wood grain**:
→ Wave Texture (Rings, Distortion 2.0) → ColorRamp (light brown to dark brown) → Base Color
→ Noise texture → Distortion input of Wave for organic grain imperfection

**Rust / Worn metal**:
→ Base metal: Metallic 1, Roughness 0.2
→ Voronoi (Distance to Edge, Scale 15) + Noise → Mix → drives a mask between metal and rust (orange, Metallic 0, Roughness 0.9)
→ Mask also drives Roughness variation

**Lava / Molten**:
→ Noise → ColorRamp: black (cooled) with orange/white cracks → Base Color
→ Same ColorRamp → Emission Strength (bright only in the cracks)

**Stylized water**:
→ Wave Texture → Bump for ripples
→ Transmission 1, Roughness 0.1, IOR 1.33, blue-tinted Base Color`
      },
      {
        title: "🔨 Mini Workshop: Procedural Planet",
        isWorkshop: true,
        content: `Build a planet with zero image textures — everything procedural:

1. **Shift+A → UV Sphere** (64 segments in F9)
2. Apply a **Subdivision Surface** (level 2) → Enter **Shader Editor**
3. Add a **Noise Texture** (Scale: 5, Detail: 8, Roughness: 0.6)
4. Add a **ColorRamp**: deep blue on left, add stops for green, tan, white (poles) — position them like elevation bands
5. Connect: Noise → ColorRamp → Base Color
6. Add a second **Noise** (different Scale) → **Bump** → Normal

For an atmosphere rim:
7. Add a **Fresnel** node (IOR: 1.3)
8. **Emission** node: color = light blue, Strength: 3
9. **Mix Shader**: Factor from Fresnel, Shader 1 = Principled BSDF, Shader 2 = Emission
10. Mix Shader → Material Output

Animate: right-click the **W offset** on the Noise Texture → Insert Keyframe at frame 1 and frame 250 with different values. Planet rotates procedurally.

✅ Goal: A convincing planet with atmosphere, zero image files, and an animated surface`
      }
    ]
  }
];

const outcomes = [
  {
    category: "Shape & Form",
    items: [
      { goal: "Organic creature or character", approach: "Sculpt Mode (Dyntopo for exploration → Remesh → Multires for detail). Retopologize with Shrinkwrap modifier.", tools: ["Sculpt Mode", "Multiresolution", "Remesh", "Shrinkwrap modifier"] },
      { goal: "Hard surface / mechanical object", approach: "Edit Mode box-modeling + Boolean modifier for cuts + Bevel modifier for edge highlights + Subdivision Surface.", tools: ["Edit Mode", "Boolean modifier", "Bevel modifier", "Subdivision Surface"] },
      { goal: "Terrain or landscape", approach: "Grid + Displace modifier with Musgrave/Noise texture. Or Geometry Nodes with noise-driven height.", tools: ["Grid", "Displace modifier", "Geometry Nodes", "Musgrave Texture"] },
      { goal: "Repeated / instanced objects (forest, crowd, bricks)", approach: "Geometry Nodes: Distribute Points on Faces → Instance on Points. Near-zero memory cost.", tools: ["Geometry Nodes", "Instance on Points", "Distribute Points on Faces"] },
      { goal: "Rope, cable, pipe following a path", approach: "Bezier curve for the path + cylinder with Curve modifier following it. Or GN with Curve to Mesh.", tools: ["Bezier Curve", "Curve modifier", "Geometry Nodes"] },
      { goal: "Symmetrical model", approach: "Model one half in Edit Mode with Mirror modifier (Clipping on). Apply modifier to merge when done.", tools: ["Mirror modifier", "Edit Mode"] },
      { goal: "Vase, bottle, column (revolved profile)", approach: "Draw the profile as a curve or mesh → Screw modifier revolves it around an axis.", tools: ["Screw modifier", "Curve"] },
      { goal: "Hair, fur, feathers", approach: "New Hair system (Geometry Nodes based): Add → Curve → Empty Hair. Style with hair sculpt brushes.", tools: ["Hair Curves", "Geometry Nodes", "Particle Edit"] },
    ]
  },
  {
    category: "Surface & Appearance",
    items: [
      { goal: "Photorealistic material (metal, glass, skin)", approach: "Principled BSDF with correct Metallic/Roughness/IOR values. Add Noise-driven Roughness variation for realism.", tools: ["Principled BSDF", "Shader Editor", "Noise Texture"] },
      { goal: "Procedural texture (no image files)", approach: "Shader Editor: Noise/Voronoi/Wave → ColorRamp → Principled BSDF inputs.", tools: ["Noise Texture", "Voronoi Texture", "ColorRamp"] },
      { goal: "Worn, aged, or dirt-layered surface", approach: "Two material layers (clean + worn) mixed by a procedural mask. Pointiness from Geometry node for edge wear.", tools: ["Shader Editor", "Mix Shader", "Geometry node (Pointiness)"] },
      { goal: "Animated texture / dissolve effect", approach: "Drive a ColorRamp or Mix Factor with a Noise Texture that animates over time (keyframe the W offset).", tools: ["ColorRamp", "Noise Texture", "Drivers"] },
    ]
  },
  {
    category: "Environment & Lighting",
    items: [
      { goal: "Outdoor daylight scene", approach: "Sun light for directional shadows + HDRI environment for sky color. Rotate HDRI to match sun direction.", tools: ["Sun Light", "HDRI (World)"] },
      { goal: "Indoor studio / product lighting", approach: "3-point area light setup (key + fill + rim). Shadow Catcher plane for ground shadow.", tools: ["Area Light", "Shadow Catcher", "Light Linking"] },
      { goal: "Cinematic mood lighting", approach: "One strong warm key (orange/amber), one soft cool fill (blue), HDRI for ambient. Strong contrast.", tools: ["Area Light", "HDRI", "Light Linking"] },
      { goal: "Neon / glowing light in EEVEE", approach: "Emissive material on object + EEVEE Bloom (Render Properties → Bloom). Adjust Bloom Threshold and Intensity.", tools: ["Emission shader", "EEVEE Bloom", "Compositor Glare node"] },
    ]
  },
  {
    category: "Animation & Motion",
    items: [
      { goal: "Object animation (position, rotation, scale)", approach: "Insert keyframes (I key) in Object Mode. Edit curves in Graph Editor. Non-linear blending in NLA Editor.", tools: ["Keyframes", "Graph Editor", "NLA Editor"] },
      { goal: "Character animation with a skeleton", approach: "Armature object → rigging (parent mesh to armature with automatic weights) → pose in Pose Mode → keyframe.", tools: ["Armature", "Weight Paint", "Pose Mode", "Graph Editor"] },
      { goal: "Procedural / parametric animation", approach: "Geometry Nodes with frame-driven inputs. Or Drivers linking object properties to time/other values.", tools: ["Geometry Nodes", "Drivers", "Graph Editor"] },
      { goal: "Camera fly-through or orbit", approach: "Keyframe camera transforms. Or: Follow Path constraint (camera follows a Bezier curve). Or: camera shake with Noise modifier in Graph Editor.", tools: ["Camera keyframes", "Follow Path constraint", "Graph Editor Noise modifier"] },
    ]
  },
  {
    category: "VFX & Simulation",
    items: [
      { goal: "Falling, stacking, or breaking objects", approach: "Rigid Body simulation. Active objects = dynamic. Passive = static colliders. Fracture with Cell Fracture addon.", tools: ["Rigid Body", "Cell Fracture addon"] },
      { goal: "Cloth, fabric, flags", approach: "Cloth simulation. Pin vertex groups keep parts fixed. Add Collision physics to surrounding objects.", tools: ["Cloth simulation", "Vertex Groups", "Collision physics"] },
      { goal: "Water or liquid", approach: "Mantaflow fluid simulation. Domain object (Liquid type) + Flow emitter object. Mesh the domain for visible water surface.", tools: ["Mantaflow Fluid", "Domain", "Flow object"] },
      { goal: "Fire and smoke", approach: "Mantaflow Gas simulation (Domain: Gas type). Flow type: Fire+Smoke. Add Noise modifier to domain for detail. Render with Cycles.", tools: ["Mantaflow Gas", "Volumetric rendering", "Cycles"] },
      { goal: "Particle explosion or spray", approach: "Emitter particle system: emit many particles with short lifetime, high initial velocity, Force Field for wind/turbulence.", tools: ["Particle system", "Force Fields", "Emitter"] },
    ]
  },
  {
    category: "Rendering & Output",
    items: [
      { goal: "Photorealistic still image", approach: "Cycles renderer. High samples (512+) + OIDN denoising. Area lights or HDRI. Compositor for color grade.", tools: ["Cycles", "Denoising", "Compositor"] },
      { goal: "Fast animation render", approach: "EEVEE Next. Bake lighting where needed. Lower samples with EEVEE's near-instant frame times.", tools: ["EEVEE Next", "Light Probes"] },
      { goal: "Stylized / non-photorealistic render", approach: "EEVEE Next with Toon shader or custom shader. Or Grease Pencil (2D lines in 3D space). Or Freestyle (line rendering).", tools: ["EEVEE Next", "Shader Editor", "Grease Pencil", "Freestyle"] },
      { goal: "Compositing / color grading after render", approach: "Render to OpenEXR Multilayer. Use Compositor: Render Layers → Color Balance → Glare → Output.", tools: ["Compositor", "OpenEXR", "Color Balance node", "Glare node"] },
      { goal: "360° / VR render", approach: "Camera Type: Panoramic → Equirectangular. Resolution: 4096×2048 or higher. Render with Cycles.", tools: ["Panoramic Camera", "Cycles", "Equirectangular"] },
    ]
  }
];

const quickRefs = [
  { keys: ["Shift", "A"], desc: "Add object / node" },
  { keys: ["Tab"], desc: "Toggle Object ↔ Edit Mode" },
  { keys: ["Ctrl", "Tab"], desc: "Mode pie menu" },
  { keys: ["G"], desc: "Grab / move" },
  { keys: ["R"], desc: "Rotate" },
  { keys: ["S"], desc: "Scale" },
  { keys: ["G / R / S", "→ X/Y/Z"], desc: "Constrain transform to axis" },
  { keys: ["E"], desc: "Extrude" },
  { keys: ["I"], desc: "Inset faces" },
  { keys: ["Ctrl", "R"], desc: "Loop cut" },
  { keys: ["Ctrl", "B"], desc: "Bevel edges" },
  { keys: ["K"], desc: "Knife tool" },
  { keys: ["F"], desc: "Fill face / edge" },
  { keys: ["M"], desc: "Merge vertices" },
  { keys: ["Alt", "Click"], desc: "Select edge/face loop" },
  { keys: ["Alt", "Z"], desc: "Toggle X-Ray mode" },
  { keys: ["O"], desc: "Toggle Proportional Editing" },
  { keys: ["F12"], desc: "Render current frame" },
  { keys: ["Ctrl", "F12"], desc: "Render animation" },
  { keys: ["F11"], desc: "Show last render" },
  { keys: ["0"], desc: "Camera view (Numpad/Emulated)" },
  { keys: ["5"], desc: "Toggle Ortho ↔ Perspective" },
  { keys: ["1 / 3 / 7"], desc: "Front / Right / Top view" },
  { keys: ["."], desc: "Frame selected object" },
  { keys: ["Option", "drag"], desc: "Orbit viewport (trackpad)" },
  { keys: ["Pinch"], desc: "Zoom (trackpad)" },
  { keys: ["2-finger drag"], desc: "Pan viewport (trackpad)" },
  { keys: ["Z"], desc: "Shading pie menu" },
  { keys: ["H"], desc: "Hide selection" },
  { keys: ["Alt", "H"], desc: "Unhide all" },
  { keys: ["Ctrl", "Z"], desc: "Undo (Cmd+Z on Mac)" },
  { keys: ["Ctrl", "Shift", "Z"], desc: "Redo (Cmd+Shift+Z on Mac)" },
  { keys: ["X"], desc: "Delete menu" },
  { keys: ["Ctrl", "J"], desc: "Join objects" },
  { keys: ["P"], desc: "Separate mesh (Edit Mode)" },
  { keys: ["F3"], desc: "Operator / feature search" },
  { keys: ["N"], desc: "Toggle sidebar (N panel)" },
  { keys: ["Ctrl", "Space"], desc: "Maximize editor panel" },
  { keys: ["Ctrl", "Alt", "Q"], desc: "Quad view (4 viewports)" },
  { keys: ["Alt", "D"], desc: "Linked duplicate (shares mesh)" },
  { keys: ["Shift", "D"], desc: "Full duplicate (own copy)" },
];

const KeybindChip = ({ keys, desc }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
  }}>
    <div style={{ display: "flex", gap: 4, flexShrink: 0, flexWrap: "wrap", maxWidth: 180 }}>
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
          boxShadow: "0 2px 0 rgba(0,0,0,0.4)",
          whiteSpace: "nowrap"
        }}>{k}</span>
      ))}
    </div>
    <span style={{ fontSize: 12, color: "#9999bb" }}>{desc}</span>
  </div>
);

const applyBold = (str) =>
  str.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8e8f0">$1</strong>');

const renderContent = (text) => {
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];

  const flushList = (key) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${key}`} style={{ margin: "4px 0", padding: 0, listStyle: "none" }}>
        {listBuffer.map((item, idx) => (
          <li key={idx} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
            <span style={{ color: "#555577", flexShrink: 0, fontWeight: 700 }}>›</span>
            <span
              style={{ fontSize: 13.5, lineHeight: 1.7, color: "#9999bb" }}
              dangerouslySetInnerHTML={{ __html: applyBold(item) }}
            />
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    if (!line.trim()) {
      flushList(i);
      elements.push(<div key={i} style={{ height: 6 }} />);
    } else if (/^[-•]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-•]\s+/, ""));
    } else {
      flushList(i);
      elements.push(
        <p
          key={i}
          style={{ fontSize: 13.5, lineHeight: 1.7, color: "#9999bb", marginBottom: 2 }}
          dangerouslySetInnerHTML={{ __html: applyBold(line) }}
        />
      );
    }
  });

  flushList("end");
  return elements;
};

export default function BlenderWorkshop() {
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [activeTab, setActiveTab] = useState("content");

  const mod = modules[activeModule];
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

  const tabs = [
    { id: "content", label: "📖 Lessons" },
    { id: "outcomes", label: "🎯 Outcomes" },
    { id: "quickref", label: "⌨️ Quick Ref" },
  ];

  return (
    <div style={{
      display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif",
      background: "#0a0a0f", color: "#e8e8f0", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');
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
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#e8622a", letterSpacing: 3, marginBottom: 4 }}>WORKSHOP</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Blender <span style={{ color: "#e8622a" }}>5.1</span></div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555577", marginTop: 2 }}>Mac Trackpad · Vibe-Code Ready</div>
        </div>

        {/* Progress */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#555577", letterSpacing: 2, marginBottom: 6 }}>PROGRESS</div>
          <div style={{ height: 3, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #e8622a, #5b8dee)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#e8622a", marginTop: 5 }}>
            {completedModules.size}/{modules.length} modules · {progress}%
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "8px 0" }}>
          {modules.map((m, i) => (
            <div
              key={m.id}
              onClick={() => { setActiveModule(i); setExpandedSections({ 0: true }); setActiveTab("content"); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 20px", cursor: "pointer",
                borderLeft: `3px solid ${i === activeModule ? m.color : "transparent"}`,
                background: i === activeModule ? `rgba(${hexToRgb(m.color)},0.08)` : "transparent",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{m.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: i === activeModule ? "#e8e8f0" : "#888899", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.title}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#444466", letterSpacing: 1 }}>{m.tag}</div>
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? mod.color : "transparent"}`,
                color: activeTab === tab.id ? "#e8e8f0" : "#555577",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 1,
                transition: "all 0.15s",
                textTransform: "uppercase"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>

          {/* ── OUTCOMES TAB ── */}
          {activeTab === "outcomes" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#e8622a", letterSpacing: 3, marginBottom: 6 }}>DECISION GUIDE</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>What Do You Want to Make?</div>
                <div style={{ fontSize: 13, color: "#666688", marginTop: 4 }}>Find your goal → learn which Blender tools and workflow apply</div>
              </div>

              {outcomes.map((group) => (
                <div key={group.category} style={{ marginBottom: 32 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555577", letterSpacing: 2, marginBottom: 12 }}>
                    {group.category.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {group.items.map((item, i) => (
                      <div key={i} style={{
                        background: "#111118",
                        border: "1px solid #1e1e2e",
                        borderRadius: 10,
                        padding: "14px 18px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1.4fr auto",
                        gap: 16,
                        alignItems: "start"
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0", marginBottom: 2 }}>{item.goal}</div>
                        </div>
                        <div style={{ fontSize: 12, color: "#9999bb", lineHeight: 1.6 }}>{item.approach}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
                          {item.tools.map((tool, j) => (
                            <span key={j} style={{
                              background: "rgba(91,141,238,0.12)",
                              border: "1px solid rgba(91,141,238,0.2)",
                              borderRadius: 4,
                              padding: "2px 8px",
                              fontSize: 10,
                              color: "#5b8dee",
                              fontFamily: "'JetBrains Mono', monospace",
                              whiteSpace: "nowrap"
                            }}>{tool}</span>
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
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#e8622a", letterSpacing: 3, marginBottom: 6 }}>REFERENCE</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>Shortcuts & Controls</div>
                <div style={{ fontSize: 13, color: "#666688", marginTop: 4 }}>Mac trackpad primary. Keyboard wherever possible.</div>
              </div>

              {/* Mac trackpad callout */}
              <div style={{
                marginBottom: 24, padding: 16,
                background: "rgba(91,141,238,0.08)",
                border: "1px solid rgba(91,141,238,0.2)",
                borderRadius: 10
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5b8dee", marginBottom: 8 }}>Mac Trackpad Setup (do this first)</div>
                <div style={{ fontSize: 12, color: "#888899", lineHeight: 1.7 }}>
                  Edit → Preferences → Input:<br />
                  ✅ <strong style={{ color: "#e8e8f0" }}>Emulate 3 Button Mouse</strong> → Option+drag = orbit<br />
                  ✅ <strong style={{ color: "#e8e8f0" }}>Emulate Numpad</strong> → number row = view shortcuts<br />
                  ✅ <strong style={{ color: "#e8e8f0" }}>Use Multi-Touch Trackpad</strong> → pinch = zoom, 2-finger drag = pan
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  {
                    title: "Viewport (Trackpad)", keys: [
                      { keys: ["Option", "drag"], desc: "Orbit" },
                      { keys: ["2-finger drag"], desc: "Pan" },
                      { keys: ["Pinch"], desc: "Zoom" },
                      { keys: ["."], desc: "Frame selected" },
                      { keys: ["1 / 3 / 7"], desc: "Front / Right / Top" },
                      { keys: ["5"], desc: "Ortho ↔ Perspective" },
                      { keys: ["0"], desc: "Camera view" },
                      { keys: ["~"], desc: "View pie menu" },
                      { keys: ["Z"], desc: "Shading pie menu" },
                      { keys: ["Alt", "Z"], desc: "X-Ray toggle" },
                    ]
                  },
                  {
                    title: "Object Mode", keys: [
                      { keys: ["Shift", "A"], desc: "Add object" },
                      { keys: ["G / R / S"], desc: "Grab / Rotate / Scale" },
                      { keys: ["X / Y / Z"], desc: "Constrain to axis (after G/R/S)" },
                      { keys: ["Shift", "D"], desc: "Duplicate (own copy)" },
                      { keys: ["Alt", "D"], desc: "Linked duplicate" },
                      { keys: ["Ctrl", "J"], desc: "Join objects" },
                      { keys: ["H"], desc: "Hide selection" },
                      { keys: ["Alt", "H"], desc: "Unhide all" },
                      { keys: ["X"], desc: "Delete menu" },
                      { keys: ["F3"], desc: "Search any operator" },
                    ]
                  },
                  {
                    title: "Edit Mode", keys: [
                      { keys: ["Tab"], desc: "Enter / exit Edit Mode" },
                      { keys: ["1 / 2 / 3"], desc: "Vertex / Edge / Face select" },
                      { keys: ["Alt", "Click"], desc: "Select edge/face loop" },
                      { keys: ["O"], desc: "Proportional Editing" },
                      { keys: ["E"], desc: "Extrude" },
                      { keys: ["I"], desc: "Inset faces" },
                      { keys: ["Ctrl", "R"], desc: "Loop cut" },
                      { keys: ["Ctrl", "B"], desc: "Bevel" },
                      { keys: ["K"], desc: "Knife tool" },
                      { keys: ["M"], desc: "Merge vertices" },
                    ]
                  },
                  {
                    title: "General", keys: [
                      { keys: ["Ctrl", "Z"], desc: "Undo (Cmd+Z)" },
                      { keys: ["Ctrl", "Shift", "Z"], desc: "Redo (Cmd+Shift+Z)" },
                      { keys: ["N"], desc: "Sidebar panel" },
                      { keys: ["Ctrl", "Space"], desc: "Maximize editor" },
                      { keys: ["F12"], desc: "Render" },
                      { keys: ["F11"], desc: "Show last render" },
                      { keys: ["Ctrl", "S"], desc: "Save file" },
                      { keys: ["Ctrl", "Shift", "S"], desc: "Save As" },
                      { keys: ["F4"], desc: "File menu" },
                      { keys: ["Ctrl", "Alt", "Q"], desc: "Quad view" },
                    ]
                  },
                ].map(group => (
                  <div key={group.title} style={{
                    background: "#111118",
                    border: "1px solid #1e1e2e",
                    borderRadius: 10,
                    padding: 18
                  }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555577", letterSpacing: 2, marginBottom: 10 }}>{group.title.toUpperCase()}</div>
                    {group.keys.map((k, i) => <KeybindChip key={i} {...k} />)}
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 16, padding: 16,
                background: "rgba(232,98,42,0.08)",
                border: "1px solid rgba(232,98,42,0.2)",
                borderRadius: 10
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8622a", marginBottom: 6 }}>F3 — Your Most Important Shortcut</div>
                <div style={{ fontSize: 12, color: "#888899", lineHeight: 1.6 }}>
                  Press <strong style={{ color: "#e8e8f0" }}>F3</strong> anywhere in Blender to search every operator by name. If you know what you want but not where it lives — F3 finds it. This is how you navigate Blender when vibe-coding: describe what you want, search for it.
                </div>
              </div>
            </div>
          )}

          {/* ── CONTENT TAB ── */}
          {activeTab === "content" && (
            <div>
              {/* Module header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 36 }}>{mod.emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
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
                  background: section.isWorkshop ? `rgba(${hexToRgb(mod.color)},0.05)` : "#111118",
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
                    fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 600
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
                    fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700,
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
