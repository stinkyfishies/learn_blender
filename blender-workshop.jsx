import React, { useState, useEffect } from "react";

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
    intro:
      "Before touching anything: understand how Blender thinks. Its architecture shapes every decision — why modes exist, why nothing is 'just a file', and how to reason about what's possible.",
    quiz: [
      {
        q: "An Object and its Mesh are separate datablocks. What does this allow you to do?",
        options: [
          "Change the mesh's color independently of the object",
          "Have multiple objects share the same mesh data with zero extra memory cost",
          "Apply modifiers to the mesh without affecting the object",
          "Move the mesh without moving the object",
        ],
        answer: 1,
        explanation:
          "Alt+D (linked duplicate) creates a new Object that references the same Mesh datablock. Thousands of instances, one mesh in memory.",
      },
      {
        q: "Which of these is NON-destructive in Blender?",
        options: [
          "Applying a Subdivision Surface modifier",
          "Sculpting directly on a mesh",
          "Adding a Mirror modifier to a mesh",
          "Using the Knife tool to cut geometry",
        ],
        answer: 2,
        explanation:
          "Adding a modifier leaves the original mesh data unchanged. Applying it, sculpting, or using the Knife permanently modifies the mesh.",
      },
      {
        q: "Which Properties panel tab contains the Modifier stack?",
        options: [
          "The 📐 Object tab (transform values)",
          "The 🔧 Modifier tab (wrench icon)",
          "The 📊 Object Data tab (mesh-specific settings)",
          "The 🎨 Material tab (shader assignment)",
        ],
        answer: 1,
        explanation:
          "The wrench icon (🔧) in the Properties panel opens the Modifier tab — where you add, reorder, and remove modifiers like Subdivision Surface, Mirror, and Boolean.",
      },
      {
        q: "What is a Collection in Blender?",
        options: [
          "A group of materials applied to one object",
          "A set of modifier presets",
          "A named group of objects that can be toggled, instanced, and linked",
          "A folder that stores .blend files on disk",
        ],
        answer: 2,
        explanation:
          "Collections are scene-level organisational containers. Objects can belong to multiple collections, and collections can be instanced as lightweight objects.",
      },
    ],
    sections: [
      {
        title: "Blender's Data Architecture",
        pythonCode: `import bpy

# Access the active scene
scene = bpy.context.scene

# All objects in the scene
for obj in bpy.data.objects:
    print(obj.name, obj.type)  # type: MESH, CURVE, ARMATURE, etc.

# An object and the mesh data it references
obj = bpy.context.active_object
mesh = obj.data  # bpy.types.Mesh — separate from the object

# Multiple objects sharing one mesh (linked duplicate)
bpy.ops.object.duplicate(linked=True)   # Alt+D equivalent
bpy.ops.object.duplicate(linked=False)  # Shift+D equivalent

# Access materials on an object
for slot in obj.material_slots:
    print(slot.material.name)

# Collections
for col in bpy.data.collections:
    print(col.name, [o.name for o in col.objects])`,
        content: `Blender organizes everything as **datablocks**: reusable, linkable chunks of data. Understanding this unlocks how the whole system fits together.

**Object**
The thing you select, move, rotate, and scale in the viewport. It has a position in the scene but no geometry of its own. It points to a Mesh, camera, or light that lives inside it.
> Example: when you click a cube and press G to move it, you are moving the Object, not the geometry.

**Mesh / Curve / Volume / Armature**
The actual geometry data that an Object points to. Multiple objects can share one mesh, which is how instances work.
> Example: a forest of 1,000 trees where every tree is a separate Object but all share the same Mesh. One tree in memory, 1,000 positions in the scene.

**Material**
Applied to slots on a mesh. One object can have many material slots, each covering different faces.
> Example: a car with a red paint material on the body and a black rubber material on the tyres. Two slots, one object.

**Scene**
The stage: which objects exist, the active camera, and the frame range for animation.
> Example: Scene 1 is your product shot setup, Scene 2 is an exploded view. Same .blend file, different arrangements.

**World**
Controls environment lighting, the background, and atmosphere.
> Example: swap the World shader to go from a sunny outdoor HDRI to a dark studio void without touching any lights.

**Collection**
A named group of objects. Objects can belong to multiple collections at once.
> Example: a Characters collection and a Props collection. Toggle the Props collection to hide everything in it in one click.

**Alt+D** creates a linked duplicate: a new Object pointing to the same Mesh. **Shift+D** makes a full independent copy. For large scenes, linked duplicates are dramatically more efficient.

##tree
.blend file
├── Scene
│   ├── Collection: Characters
│   │   └── Object: Hero
│   │       ├── Mesh: HeroBody
│   │       └── Material: RedPaint
│   ├── Collection: Props
│   │   └── Object: Table
│   │       ├── Mesh: TableTop
│   │       └── Material: WoodGrain
│   └── Camera
└── World
    └── HDRI Environment
##endtree`,
      },
      {
        title: "Modes: Why They Exist",
        pythonCode: `import bpy

# Switch the active object to a mode
bpy.ops.object.mode_set(mode='OBJECT')   # Object Mode
bpy.ops.object.mode_set(mode='EDIT')     # Edit Mode
bpy.ops.object.mode_set(mode='SCULPT')   # Sculpt Mode
bpy.ops.object.mode_set(mode='WEIGHT_PAINT')
bpy.ops.object.mode_set(mode='VERTEX_PAINT')
bpy.ops.object.mode_set(mode='TEXTURE_PAINT')

# Read the current mode
print(bpy.context.object.mode)  # returns e.g. 'OBJECT', 'EDIT'

# Context-safe check before switching
if bpy.context.object and bpy.context.object.type == 'MESH':
    bpy.ops.object.mode_set(mode='EDIT')`,
        content: `Blender uses **modes** to expose different toolsets on the same object. You are always in exactly one mode at a time. Press **Ctrl+Tab** to open the mode pie menu from anywhere.

**Object Mode**
The default. Manage the scene: move, duplicate, link, and organize objects.
> Example: selecting a cube and pressing G to drag it across the scene.

**Edit Mode**
Reshape the mesh at the vertex, edge, or face level. Press Tab to toggle in and out.
> Example: selecting a face on a cube and pressing E to extrude it into a new shape.

**Sculpt Mode**
Push and pull geometry like digital clay. Works best at high polygon counts.
> Example: smoothing a lumpy surface or adding a nose to a character head.

**Weight Paint**
Paint per-vertex bone influence. Used to control how a mesh bends when an armature moves.
> Example: painting the shoulder area so it follows the arm bone when the character raises their arm.

**Vertex Paint / Texture Paint**
Paint color or texture directly onto the mesh surface.
> Example: hand-painting rust patches onto a metal object without a separate image editor.

**Particle Edit**
Comb, trim, cut, and style hair or fur strands.
> Example: grooming a character's hair direction after generating it with a particle system.

Each mode is a specialized lens onto the same object. Switching modes does not change your geometry.`,
      },
      {
        title: "Non-Destructive vs Destructive Workflow",
        pythonCode: `import bpy

obj = bpy.context.active_object

# NON-DESTRUCTIVE: add a modifier (doesn't change mesh data)
mod = obj.modifiers.new(name="Subdivision", type='SUBSURF')
mod.levels = 2
mod.render_levels = 3

# Toggle modifier visibility
mod.show_viewport = True
mod.show_render = True

# DESTRUCTIVE: apply the modifier (bakes into mesh permanently)
bpy.ops.object.modifier_apply(modifier=mod.name)

# Non-destructive: add a shape key
obj.shape_key_add(name="Basis")
key = obj.shape_key_add(name="Smile")
key.value = 0.0  # 0.0 = off, 1.0 = fully applied

# Non-destructive: add a constraint
con = obj.constraints.new(type='COPY_LOCATION')
con.target = bpy.data.objects["Target"]`,
        content: `**Non-destructive** means your changes are instructions layered on top of the original geometry. You can remove, reorder, or tweak them at any point. **Destructive** means the underlying mesh data is permanently changed.

**Modifier Stack**
Operations like Subdivision, Bevel, Boolean, Array, and Mirror sit in a stack. Remove or reorder any time with no consequence.
> Example: add a Mirror modifier to model one half of a face, then remove it later to make the two sides independent.

**Geometry Nodes**
A node graph that generates or transforms geometry procedurally. Always live and always editable.
> Example: scatter 500 rocks across a terrain with a single node setup, then adjust density or size at any time.

**Shape Keys**
Store alternate mesh positions without touching the base shape. Blend between them with a slider.
> Example: a character's neutral face is the base, a smile is a shape key at value 1.0.

**Constraints**
Control how an object behaves relative to another, without moving it manually.
> Example: a camera that always points at a target object no matter where the target moves.

**Drivers**
Link any value to any other value using an expression.
> Example: pupil size that automatically shrinks as a light gets brighter.

**Materials and Shaders**
Never baked into the mesh. Always swappable or adjustable after the fact.

Destructive operations include: applying a modifier, sculpting directly on a mesh, manual vertex editing, and applying shape keys. Once done, there is no non-destructive path back.

Stay non-destructive as long as possible. Apply only when exporting, hitting a performance limit, or when a step is truly final. Throughout this workshop, each relevant module flags which operations are destructive and which are not, so you build the habit naturally as you go.`,
      },
      {
        title: "The Properties Panel — Your Control Center",
        pythonCode: `import bpy

obj = bpy.context.active_object

# 📐 Object properties (transform)
obj.location = (1.0, 0.0, 2.5)
obj.rotation_euler = (0, 0, 1.5708)  # 90° in radians
obj.scale = (1.0, 1.0, 1.0)

# 🔧 Modifier stack
for mod in obj.modifiers:
    print(mod.name, mod.type)

# 🎨 Material slots
for slot in obj.material_slots:
    print(slot.material.name if slot.material else "empty")

# 🌍 World settings
world = bpy.context.scene.world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[1].default_value = 1.0  # Strength

# 🎬 Render engine
bpy.context.scene.render.engine = 'CYCLES'  # or 'BLENDER_EEVEE_NEXT'

# 🖼️ Output resolution
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080`,
        content: `The Properties Editor runs down the right side of the screen. It is organized into tabs by icon, each covering a distinct domain. Knowing which tab holds what saves a lot of hunting.

🎬 **Render**
Engine selection (Cycles or EEVEE Next), sampling quality, and denoising settings.
> Example: switch from EEVEE to Cycles here when you need physically accurate light bounces.

🖼️ **Output**
Resolution, frame range, output folder, and file format for renders.
> Example: set resolution to 1920x1080 and output path to a folder before hitting render.

🌍 **World**
The background of the scene and its contribution to lighting. You can use a solid color, a gradient, or an HDRI (a 360° photograph of a real environment that also casts light and reflections into the scene).
> Example: drop an HDRI image here to instantly light the whole scene with realistic reflections, no lights required.

👁️ **View Layer**
Render passes and light groups. Used for compositing workflows.
> Example: enable the Shadow pass to adjust shadows independently in post.

📐 **Object**
Exact transform values, visibility flags, and instancing options for the selected object.
> Example: type a precise location value here instead of eyeballing it in the viewport.

🔧 **Modifier**
The modifier stack for the selected object. Add, reorder, and remove modifiers here.
> Example: this is where you add a Subdivision Surface or a Boolean modifier.

⚡ **Particles**
Particle and hair systems attached to the selected object.

🔒 **Constraints**
Object constraints that control how an object moves or orients relative to others.

📊 **Object Data**
Mesh-specific settings: UV maps, vertex color layers, normals, and custom attributes.
> Example: check UV maps here to see which ones exist before setting up a material.

🎨 **Material**
Material slots and shader assignment for the selected object.
> Example: add a new slot here to apply a second material to specific faces.

🖼️ **Texture**
Legacy texture slots. Mostly used for displacement maps and sculpt/paint brushes.

Press **N** in the viewport to open the sidebar panel. The Item tab shows the exact transform of whatever is selected.`,
      },
      {
        title: "Collections & Scene Organization",
        pythonCode: `import bpy

# Create a new collection and link to scene
col = bpy.data.collections.new("MyCollection")
bpy.context.scene.collection.children.link(col)

# Move an object into a collection
obj = bpy.context.active_object
col.objects.link(obj)
# Remove from previous collection (scene root)
bpy.context.scene.collection.objects.unlink(obj)

# Toggle collection visibility
bpy.context.layer_collection.children["MyCollection"].hide_viewport = True

# Instance a collection as an object (Collection Instance)
bpy.ops.object.collection_instance_add(collection="MyCollection")

# List all objects in a collection
for obj in bpy.data.collections["MyCollection"].objects:
    print(obj.name)`,
        content: `**Collections** are Blender's folder system, visible in the Outliner (top-right by default).

- Objects can belong to multiple collections simultaneously
- Collections can be toggled visible/renderable/selectable as a group
- **Instance Collections** — Drag a collection into the viewport as a single instanced object. Duplicate it with Alt+D for zero memory cost.
- **File → Link** — Reference a collection from another .blend file, non-destructively. The foundation of production pipelines.
- **File → Append** — Copy data from another .blend into your current file (destructive import).

The Outliner also shows the full datablock tree. Right-click any item for options. Drag to reparent.`,
      },
      {
        title: "🔨 Mini Workshop: Read the Scene",
        isWorkshop: true,
        pythonCode: `import bpy

# Print a full scene inventory — run this in Blender's Script editor
scene = bpy.context.scene
print(f"Scene: {scene.name}")
print(f"Frame range: {scene.frame_start} – {scene.frame_end}")
print(f"Engine: {scene.render.engine}")

for obj in scene.objects:
    mods = [m.type for m in obj.modifiers]
    mats = [s.material.name for s in obj.material_slots if s.material]
    print(f"  {obj.name} [{obj.type}] | mods: {mods} | mats: {mats}")`,
        content: `Open any Blender scene (default or downloaded) and map it to what you now know:

1. Open the **Outliner** — identify which Collections exist, which Objects are in them
2. Click an object → check the **Properties panel** → what Modifiers does it have? What Materials?
3. Press **Tab** → you're in Edit Mode on that object's mesh. Press **Tab** again to return.
4. Press **Ctrl+Tab** → browse through modes. Notice how the toolbar changes.
5. Press **N** → look at the Item tab. See the exact location/rotation/scale.
6. Click on a different icon in the Properties Editor — find the Modifier stack, the Material slots.

✅ Goal: Be able to answer "what is this scene made of?" for any .blend file`,
      },
    ],
  },
  {
    id: 2,
    emoji: "🐍",
    title: "bpy Setup & Vibe-Coding",
    tag: "PYTHON + WORKFLOW",
    color: "#38bdf8",
    intro:
      "Blender has a full Python API called bpy — every action you take in the UI has a Python equivalent. This module covers how to set up the environment, write and run scripts, debug them, and how this directly enables a vibe-coding workflow where you prompt an AI to generate Blender scripts.",
    quiz: [
      {
        q: "What is the fastest way to find the Python operator name for a menu action you just performed in Blender?",
        options: [
          "Search the bpy documentation online",
          "Check the Info Editor — it logs every operator call as a Python statement in real time",
          "Hover over the menu item and read the tooltip",
          "Look in Preferences → Add-ons",
        ],
        answer: 1,
        explanation:
          "The Info Editor records every action as executable Python. Perform the action manually, then copy the operator call from Info — this is the fastest way to discover operator names.",
      },
      {
        q: "You want to run a Python script that modifies your scene. Where do you run it inside Blender?",
        options: [
          "The Terminal / System Console only",
          "The Scripting workspace → Text Editor → Run Script (or the Python Console for one-liners)",
          "The Graph Editor's driver expression field",
          "You must install a Blender add-on first",
        ],
        answer: 1,
        explanation:
          "The Scripting workspace has a Text Editor (for full scripts) and a Python Console (for interactive one-liners). Both have access to the full bpy API and run in Blender's embedded Python interpreter.",
      },
      {
        q: "What is the Python Console's main advantage over the Text Editor for vibe-coding workflows?",
        options: [
          "It's faster to render from",
          "It supports auto-complete — type bpy.data. and Tab shows all available attributes interactively",
          "It runs scripts 10x faster",
          "It has syntax highlighting",
        ],
        answer: 1,
        explanation:
          "The Python Console has Tab auto-complete for the full bpy API. It's the fastest way to explore what's available on any bpy object without reading documentation.",
      },
      {
        q: "When an AI generates a bpy script for you, what's the most important first debugging step if it errors?",
        options: [
          "Re-prompt the AI immediately",
          "Read the full error in the Blender System Console or Info Editor — it gives the exact line and error type",
          "Restart Blender",
          "Delete the script and start over",
        ],
        answer: 1,
        explanation:
          "Blender's System Console (Window → Toggle System Console on Windows, launch from Terminal on Mac) shows the full Python traceback. The line number and error message are usually enough to identify the fix — or to give the AI precise feedback for a correction.",
      },
    ],
    sections: [
      {
        title: "Blender's Python Environment",
        pythonCode: `# Blender ships with its own Python interpreter — you don't install anything.
# Access it from: Scripting workspace (top workspace tabs)

import bpy
import sys

# See which Python version Blender is running
print(sys.version)

# bpy is always available — no import needed in the Python Console,
# but you do need 'import bpy' at the top of scripts in the Text Editor.

# The three main bpy namespaces you'll use constantly:
bpy.context   # what's currently selected/active in the UI
bpy.data      # all datablocks in the .blend file (objects, meshes, materials, etc.)
bpy.ops       # operators — the same actions as menu items and shortcuts

# Example: what is currently selected?
print(bpy.context.active_object)
print(bpy.context.selected_objects)`,
        content: `Blender ships with a **built-in Python 3 interpreter** — no separate installation required. The bpy module is always available and gives you programmatic access to everything in Blender.

The three namespaces you'll use constantly:
- **bpy.context** — What's currently selected, active, or visible. Changes as you click in the UI.
- **bpy.data** — All datablocks in the file: objects, meshes, materials, textures, node trees.
- **bpy.ops** — Operators. Every action in Blender's interface has an ops equivalent.

Access Python from:
- **Scripting workspace** (top tab bar) — opens a Text Editor + Python Console layout
- **Python Console** — interactive, with Tab auto-complete
- **Text Editor** — write full scripts, click Run Script (or Alt+P)
- **Driver expressions** — Python expressions inside animation drivers
- **Add-on scripts** — Python files Blender loads as plugins`,
      },
      {
        title: "The Scripting Workspace Layout",
        pythonCode: `# In the Python Console (interactive, one-liners):
# Type any bpy expression and press Enter — result shows immediately

>>> bpy.context.active_object
>>> bpy.context.active_object.location
>>> bpy.context.active_object.location.x = 5.0  # move it

# Tab auto-complete: type bpy.data. then press Tab
# → shows: actions, armatures, brushes, cameras, collections,
#           curves, fonts, grease_pencils, images, lights,
#           materials, meshes, node_groups, objects, scenes...

# In the Text Editor (full scripts):
import bpy

# Write your script, then: Text menu → Run Script, or Alt+P
# Errors appear in the Info Editor and System Console`,
        content: `The Scripting workspace (click the **Scripting** tab at the top of Blender) opens a pre-arranged layout:

- **Text Editor** (left) — write multi-line scripts. Alt+P to run. Has basic syntax highlighting.
- **Python Console** (bottom-left) — interactive REPL. Tab auto-complete on any bpy object. Best for exploration.
- **Info Editor** (top-right) — logs every UI action as a Python operator call in real time.
- **Properties + Outliner** — context for whatever you're scripting.

**The Info Editor is your most important learning tool.** Do anything in Blender's UI — add an object, change a modifier value, run a menu command — and the Info Editor records the exact Python statement that performed it. This is how you discover operator names without reading documentation.

To open the Info Editor: change any editor's type to **Info** via the editor type icon.`,
      },
      {
        title: "Finding Operator Names (The Info Method)",
        pythonCode: `# Step 1: Do the action manually in Blender's UI
# Step 2: Open the Info Editor
# Step 3: Copy the logged Python statement

# Example — you manually added a UV Sphere via Shift+A → Mesh → UV Sphere
# Info logs:
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, enter_editmode=False,
    align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))

# Example — you applied a Subdivision Surface modifier
bpy.ops.object.modifier_apply(modifier="Subdivision")

# Example — you set a material's roughness to 0.3
bpy.context.object.active_material.node_tree.nodes["Principled BSDF"].inputs[2].default_value = 0.3

# Hover method: hover over any UI element → tooltip shows the data path
# e.g. hover over Roughness slider: bpy.data.materials["Mat"].node_tree...
# Right-click any property → "Copy Data Path" → paste directly into a script`,
        content: `The fastest way to learn bpy operator names is the **Info Method**:

1. Do the action manually in Blender (add an object, apply a modifier, change a setting)
2. Open the **Info Editor** — it shows the exact Python call that just ran
3. Copy it into your script

This means you never need to guess operator names. Perform the action once in the UI, then automate it.

**Two other methods:**
- **Hover tooltips** — hover over any UI button or property field. The tooltip shows the Python data path (e.g. \`bpy.context.object.modifiers["Subdiv"].levels\`).
- **Right-click → Copy Data Path** — right-click any property → copies its full Python path to clipboard. Paste directly into a script.

Together these three methods mean you can discover the bpy path to any UI control in under 30 seconds — without reading the API documentation.`,
      },
      {
        title: "Debugging Scripts",
        pythonCode: `import bpy

# 1. Print debugging — the simplest approach
obj = bpy.context.active_object
print(f"Active object: {obj}")          # None if nothing selected
print(f"Type: {obj.type if obj else 'N/A'}")

# 2. Context guards — most errors are context failures
if bpy.context.active_object is None:
    raise RuntimeError("No active object — select something first")
if bpy.context.active_object.type != 'MESH':
    raise TypeError(f"Expected MESH, got {bpy.context.active_object.type}")
if bpy.context.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')  # auto-correct mode

# 3. Check operator context overrides (some ops need specific context)
# If you get "context is incorrect" error:
with bpy.context.temp_override(active_object=obj):
    bpy.ops.object.shade_smooth()

# 4. See the full traceback — run from System Console:
# Mac: open Terminal → /Applications/Blender.app/Contents/MacOS/Blender
# Windows: Window → Toggle System Console
# The full Python traceback prints there, not inside Blender's UI`,
        content: `Scripts fail for predictable reasons. Learn the patterns and you'll fix most errors in under a minute.

**Common error types:**

- **AttributeError: 'NoneType' has no attribute...** — you're operating on \`bpy.context.active_object\` but nothing is selected. Add a selection guard.
- **RuntimeError: Operator bpy.ops.X.y() context is incorrect** — the operator needs to be run in a specific mode or with specific context. Check what mode you're in.
- **KeyError: 'NodeName'** — a node with that name doesn't exist. Print \`tree.nodes.keys()\` to see what's actually there.
- **TypeError: expected MESH, got CURVE** — wrong object type. Check \`obj.type\` before operating.

**Where errors appear:**

- **Info Editor** — shows the error type but not always the full traceback
- **System Console** — the full Python traceback with line numbers. On Mac: launch Blender from Terminal (\`/Applications/Blender.app/Contents/MacOS/Blender\`). This is where serious debugging happens.
- **Text Editor** — errors highlight the failing line after running

**The single most useful debug line:** \`print(dir(obj))\` — prints every attribute and method on any bpy object. Use it when you don't know what's available.`,
      },
      {
        title: "Rendering from the Command Line",
        pythonCode: `# Run Blender headlessly from Terminal (no UI) — ideal for automation

# Render a single frame (frame 1) and save to /renders/
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend -o /renders/frame_ -f 1

# Render animation (frames 1–250)
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend -o /renders/frame_ -a

# Run a Python script on a .blend file without opening the UI
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend --python my_script.py

# Run a script that modifies the scene, then renders
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend --python setup.py -o /renders/ -f 1

# In the script, trigger render programmatically:
import bpy
bpy.context.scene.render.filepath = "/renders/output_"
bpy.context.scene.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(write_still=True)   # render current frame
bpy.ops.render.render(animation=True)     # render full animation`,
        content: `Blender can run entirely **without a GUI** — useful for batch rendering, automated scene generation, and CI/CD-style pipelines.

**Key flags:**
- \`-b\` or \`--background\` — headless mode (no window)
- \`-f N\` — render frame N
- \`-a\` — render full animation
- \`-o /path/\` — output directory
- \`--python script.py\` — run a Python script on the loaded scene
- \`-E ENGINE\` — set render engine (\`CYCLES\`, \`BLENDER_EEVEE_NEXT\`)
- \`-t N\` — use N threads for CPU rendering

**The vibe-coding pipeline this enables:**
1. AI generates a Python script that builds a scene
2. You run it headlessly: \`blender -b -P scene_builder.py -o /renders/ -f 1\`
3. No need to open Blender's UI at all

This is how automated 3D content generation works at scale — parametric scene scripts + headless renders, driven from any external system.`,
      },
      {
        title: "VS Code as an External Editor",
        pythonCode: `# Install the "Blender Development" extension by Jacques Lucke in VS Code
# It connects VS Code directly to a running Blender instance

# In VS Code: Cmd+Shift+P → "Blender: Start" → picks a Blender executable
# Then: Cmd+Shift+P → "Blender: Run Script" → runs current file in Blender

# The extension also provides:
# - bpy auto-complete in VS Code (via fake-bpy-module)
# - Real-time error feedback
# - Add-on development with hot-reload

# Install fake-bpy-module for auto-complete in VS Code (without running Blender):
# pip install fake-bpy-module-latest

# In your project: create a .vscode/settings.json
# {
#   "python.analysis.extraPaths": ["path/to/fake-bpy-module"]
# }

# Now VS Code knows the full bpy type hierarchy and auto-completes:
import bpy
obj = bpy.context.active_object  # VS Code knows this is bpy.types.Object
obj.modifiers.new(  # → auto-completes name, type parameters`,
        content: `For serious scripting, VS Code gives you a much better experience than Blender's built-in Text Editor.

**Setup:**
1. Install the **Blender Development** extension in VS Code (by Jacques Lucke)
2. Install **fake-bpy-module**: \`pip install fake-bpy-module-latest\` — gives VS Code full bpy type info and auto-complete without needing Blender running
3. Connect VS Code to a running Blender: **Cmd+Shift+P → Blender: Start**
4. Run any script into Blender: **Cmd+Shift+P → Blender: Run Script**

**What this gets you:**
- Full bpy auto-complete in VS Code (the entire API, typed)
- Inline documentation on hover for any bpy class or method
- Real-time error highlighting
- Edit the script in VS Code, run it in Blender instantly — much faster iteration than copy-pasting into Blender's Text Editor

**For vibe-coding:** VS Code is where you receive the AI-generated script, review it, make small edits, then run it into Blender with one command. The auto-complete also helps you understand what the generated code is doing.`,
      },
      {
        title: "The Vibe-Coding Loop",
        pythonCode: `# The complete vibe-coding workflow for Blender:

# 1. Know what you want (this workshop gives you the vocabulary)
goal = "Create a procedural rocky terrain with Cycles lighting and an HDRI"

# 2. Prompt an AI with precise Blender terminology
prompt = """
Write a bpy Python script that:
- Creates a Grid mesh (50x50 subdivisions, 20 units wide)
- Adds a Displace modifier with a Musgrave texture (scale 3.0, strength 2.0)
- Adds a Principled BSDF material with Noise-driven Base Color (grey/brown tones)
  and Roughness variation (0.4-0.8 range via Map Range node)
- Adds a 3-point Area light setup (key 800W warm, fill 200W cool, rim 300W)
- Sets the World to an HDRI environment (placeholder path)
- Sets the render engine to Cycles, 128 samples, OIDN denoising
- Renders to //render_output.png
"""

# 3. Receive the script — review for obvious issues
# 4. Run it: paste into Blender Text Editor → Alt+P
#    OR: blender -b -P generated_script.py

# 5. Read errors in System Console — feed back to AI with exact error message
error_feedback = "Line 34: KeyError: 'Principled BSDF' — the node was created with use_nodes=True but nodes weren't cleared first"

# 6. Iterate — usually 1-3 rounds to a working scene
# 7. Tweak parameters directly in bpy or via the UI`,
        content: `The vibe-coding loop with Blender has a specific shape, and this workshop is designed to make each step effective.

**The loop:**

1. **Describe what you want** — in precise Blender terms. "A procedural rocky terrain" is vague. "A Grid mesh with a Displace modifier driven by a Musgrave texture at scale 3, feeding into a Subdivision Surface at level 2, with a noise-driven roughness variation between 0.4 and 0.8" is a prompt that generates working code.

2. **Prompt with tool names** — the vocabulary from this workshop (modifier types, node names, bpy paths) is exactly what makes prompts accurate. The AI knows Blender's API precisely; your job is to give it the right terms.

3. **Run and read errors** — most generated scripts fail on first run due to context issues or API version differences. Copy the error from the System Console and feed it back to the AI with the exact message and line number.

4. **Iterate** — typically 1–3 rounds. After that, the scene is live in Blender and you can tweak parameters directly in the UI or in the script.

**What makes this workshop directly useful:**
- You know enough to describe any outcome in Blender vocabulary → better prompts
- You can read the generated script and understand what it's doing → spot obvious errors before running
- You know what context errors mean → fix or explain them to the AI quickly
- You understand the non-destructive stack → you can modify the generated scene sensibly`,
      },
      {
        title: "🔨 Mini Workshop: Your First bpy Script",
        isWorkshop: true,
        pythonCode: `import bpy

# This script builds a simple shaded sphere entirely from Python.
# Run it in: Scripting workspace → Text Editor → Alt+P

# Clear the default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Add a sphere
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1)
obj = bpy.context.active_object
obj.name = "MyFirstSphere"
bpy.ops.object.shade_smooth()

# Create a simple material
mat = bpy.data.materials.new("ProcMat")
mat.use_nodes = True
obj.data.materials.append(mat)
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.2, 0.5, 0.9, 1.0)
bsdf.inputs["Roughness"].default_value  = 0.3
bsdf.inputs["Metallic"].default_value   = 0.0

# Add a key light
bpy.ops.object.light_add(type='AREA', location=(3, -2, 4))
light = bpy.context.active_object
light.data.energy = 500
light.data.size   = 1.5

# Set Cycles, 64 samples, denoise
scene = bpy.context.scene
scene.render.engine  = 'CYCLES'
scene.cycles.samples = 64
scene.cycles.use_denoising = True

print("Scene built. Press F12 to render.")`,
        content: `Get your first bpy script running end-to-end:

**Part 1 — Use the Info Method**
1. Open the **Scripting workspace** (top tab)
2. Open the **Info Editor** (change one of the panels to Info type)
3. Add a UV Sphere via Shift+A → Mesh → UV Sphere
4. Change its Roughness in the material to 0.4
5. Look at what the Info Editor logged — that's the Python equivalent

**Part 2 — Run the Python script**
1. In the **Text Editor** (left panel of Scripting workspace), click **New**
2. Paste in the bpy code shown in the Python panel (toggle the 🐍 switch above)
3. Press **Alt+P** to run it
4. Watch the sphere appear in the viewport

**Part 3 — Deliberately break it and debug**
1. Remove the \`import bpy\` line — run it. Read the error.
2. Change \`"ProcMat"\` to an existing material name — see what happens.
3. Add \`print(dir(obj))\` anywhere — see every attribute available on the object.

✅ Goal: Run a script, read an error, understand where errors appear, and find your way back to working code`,
      },
    ],
  },
  {
    id: 3,
    emoji: "🧭",
    title: "Interface & Navigation",
    tag: "MAC TRACKPAD",
    color: "#5b8dee",
    intro:
      "Blender was designed around a 3-button mouse but works great on Mac trackpad once configured. Three settings unlock everything — do these first.",
    quiz: [
      {
        q: "After enabling 'Emulate 3 Button Mouse', what gesture replaces middle-mouse orbit?",
        options: [
          "Two-finger drag",
          "Three-finger swipe",
          "Option + drag",
          "Cmd + drag",
        ],
        answer: 2,
        explanation:
          "Option+drag emulates the middle mouse button, which Blender uses for orbiting the viewport.",
      },
      {
        q: "You want to run a Blender feature but can't find it in any menu. What's the fastest way?",
        options: [
          "Search the Blender documentation online",
          "Press F3 to open the operator search",
          "Check Preferences → Add-ons",
          "Right-click in the viewport",
        ],
        answer: 1,
        explanation:
          "F3 searches every available operator by name. Type what you want and run it directly — the core vibe-coding shortcut.",
      },
      {
        q: "What does pressing the Period (.) key do in the 3D viewport?",
        options: [
          "Opens the decimal input for precise transforms",
          "Frames the selected object(s) in the viewport",
          "Toggles orthographic mode",
          "Opens the pivot point menu",
        ],
        answer: 1,
        explanation:
          "Period frames/zooms to the selected object. Essential for quickly re-centering your view on what you're working on.",
      },
      {
        q: "What does the Z key open in the 3D viewport?",
        options: [
          "The zoom controls",
          "The undo history",
          "The shading pie menu (Wireframe, Solid, Material, Rendered)",
          "The scale tool",
        ],
        answer: 2,
        explanation:
          "Z opens the shading pie menu — a quick way to switch between how the scene looks without going to the toolbar.",
      },
    ],
    sections: [
      {
        title: "First: Configure Blender for Mac Trackpad",
        pythonCode: `import bpy

# Read/write Blender preferences via Python
prefs = bpy.context.preferences
inputs = prefs.inputs

# The three essential Mac trackpad settings
inputs.use_mouse_emulate_3_button = True   # Option+click = MMB (orbit)
inputs.use_numpad_as_ndof = False
inputs.use_emulate_numpad = True           # Number row = numpad views

# Save preferences so they persist
bpy.ops.wm.save_userpref()`,
        content: `**Edit → Preferences → Input** — enable these three settings:

1. ✅ **Emulate 3 Button Mouse** — Maps Option+click to middle mouse button (orbit). Essential.
2. ✅ **Emulate Numpad** — Maps the top number row (1–0) to numpad view shortcuts. Essential if you don't have a numpad.
3. ✅ **Allow Mouse Selection With Trackpad Gesture** (if shown) — gesture-aware selection

Then under the **Trackpad** section (same Preferences page):
- ✅ **Use Multi-Touch Trackpad** — enables pinch-to-zoom and two-finger pan natively

Save these preferences: **Hamburger menu (☰) → Save Preferences** so they persist across launches.`,
      },
      {
        title: "Viewport Navigation (Trackpad-First)",
        pythonCode: `import bpy

# Set the viewport to a specific view angle via Python
# (useful in scripts that set up a scene for the user)
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        region = area.spaces[0].region_3d
        # Look from front (same as Numpad 1)
        region.view_rotation.identity()

# Frame all objects (same as Home key)
bpy.ops.view3d.view_all(use_all_regions=False)

# Frame selected object (same as . key)
bpy.ops.view3d.view_selected()

# Set orthographic vs perspective
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        area.spaces[0].region_3d.view_perspective = 'ORTHO'  # or 'PERSP', 'CAMERA'`,
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
**~ (backtick)** — View pie menu: access all views at once`,
      },
      {
        title: "Editor Layout & Workspaces",
        pythonCode: `import bpy

# List all editor types in the current screen
for area in bpy.context.screen.areas:
    print(area.type)
# Common types: VIEW_3D, NODE_EDITOR, PROPERTIES, OUTLINER,
#   IMAGE_EDITOR, NLA_EDITOR, GRAPH_EDITOR, DOPESHEET_EDITOR

# Change an area to a different editor type
area = bpy.context.screen.areas[0]
area.type = 'NODE_EDITOR'

# Access the Shader Editor's node tree for active object
obj = bpy.context.active_object
if obj and obj.active_material:
    tree = obj.active_material.node_tree
    for node in tree.nodes:
        print(node.name, node.type)`,
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

**Split an editor**: hover over an edge → right-click → Split. Merge: drag a corner.`,
      },
      {
        title: "The Most Useful Navigation Shortcuts",
        pythonCode: `import bpy

# F3 equivalent: run any operator by its Python ID
# Find operator IDs by hovering over menu items and reading the tooltip
bpy.ops.mesh.subdivide(number_cuts=2)
bpy.ops.object.shade_smooth()
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY')

# Toggle X-Ray (Alt+Z) via Python
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        area.spaces[0].shading.show_xray = True

# Set shading mode (Z pie menu equivalent)
area.spaces[0].shading.type = 'SOLID'      # Solid
area.spaces[0].shading.type = 'MATERIAL'   # Material Preview
area.spaces[0].shading.type = 'RENDERED'   # Rendered`,
        content: `**F3** — Operator search. Type any Blender feature by name and run it. The single most powerful shortcut — if you know what you want but not where it lives, F3 finds it.

**Ctrl+Space** — Maximize the hovered editor (full screen). Press again to restore.

**N** — Toggle the N-Panel sidebar (Item, Tool, View, and addon panels)
**T** — Toggle the left toolbar (tool icons)

**Ctrl+Alt+Q** — Quad view (four viewports: top, front, right, perspective). Toggle off the same way.

**Z** — Shading pie menu: Wireframe, Solid, Material Preview, Rendered. Essential for quickly switching how you see the scene.

**Alt+Z** — Toggle X-Ray mode (see through the mesh — critical for selecting hidden geometry)

**F11** — Show last render (if you've rendered anything)`,
      },
      {
        title: "Selection on Mac",
        pythonCode: `import bpy

# Select objects by name
bpy.data.objects["Cube"].select_set(True)
bpy.context.view_layer.objects.active = bpy.data.objects["Cube"]

# Deselect all
bpy.ops.object.select_all(action='DESELECT')

# Select all
bpy.ops.object.select_all(action='SELECT')

# Select by type
bpy.ops.object.select_by_type(type='MESH')

# In Edit Mode — select all vertices
bpy.ops.mesh.select_all(action='SELECT')

# Select edge loops (Alt+Click equivalent — must be in EDGE select mode)
bpy.ops.mesh.loop_select(extend=False)

# Invert selection
bpy.ops.mesh.select_all(action='INVERT')

# Box select (programmatic, by location range)
bpy.ops.mesh.select_random(ratio=0.5)  # random % for procedural selection`,
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
**Alt+Click** — Select an entire edge loop (one of the most important shortcuts in modeling)`,
      },
    ],
  },
  {
    id: 4,
    emoji: "🧊",
    title: "Mesh Primitives",
    tag: "OBJECT MODE",
    color: "#60a5fa",
    intro:
      "Every 3D model starts from a primitive. These are the raw materials. What matters is knowing what each one gives you topologically — not just what it looks like.",
    quiz: [
      {
        q: "You want to sculpt a creature head. Which sphere primitive is the better starting point, and why?",
        options: [
          "UV Sphere — more vertices means more sculpting detail",
          "Ico Sphere — more uniform triangle distribution across the surface, better for subdivision and sculpting",
          "Plane — you can extrude into any shape",
          "Torus — ring topology works well for necks",
        ],
        answer: 1,
        explanation:
          "UV Sphere has messy pole pinching at the top/bottom which deforms badly under subdivision. Ico Sphere distributes geometry evenly — ideal for organic sculpting.",
      },
      {
        q: "You add a Cylinder and immediately want to change it to 6 sides (hexagonal). Where do you do this?",
        options: [
          "Properties → Object Data → Vertices",
          "The F9 operator panel that appears bottom-left after adding",
          "Edit Mode → Mesh → Change Vertices",
          "Modifier → Decimate",
        ],
        answer: 1,
        explanation:
          "The F9 operator panel (or click the bottom-left panel) lets you change the vertex count right after adding. It disappears the moment you do anything else.",
      },
      {
        q: "What data type does Shift+A → Curve → Bezier give you, and how does it differ from a Mesh?",
        options: [
          "A mesh made of curved edges — same as a mesh but pre-smoothed",
          "A mathematically smooth path defined by control points and handles, not polygons",
          "A modifier that curves an existing mesh",
          "A texture that creates a curved gradient",
        ],
        answer: 1,
        explanation:
          "Curves are a separate data type — defined by handles and control points, not vertices/edges/faces. They can be converted to mesh, or used directly (for pipes, paths, etc.) via the Curve modifier.",
      },
    ],
    sections: [
      {
        title: "What Primitives Give You",
        pythonCode: `import bpy

# Add primitives via Python (equivalent to Shift+A → Mesh)
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=32, ring_count=16)
bpy.ops.mesh.primitive_ico_sphere_add(radius=1, subdivisions=4)
bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=2, vertices=32)
bpy.ops.mesh.primitive_cone_add(radius1=1, radius2=0, depth=2)
bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.25,
                                   major_segments=48, minor_segments=12)
bpy.ops.mesh.primitive_plane_add(size=2)
bpy.ops.mesh.primitive_circle_add(radius=1, vertices=32, fill_type='NOTHING')
bpy.ops.mesh.primitive_grid_add(x_subdivisions=10, y_subdivisions=10, size=2)
bpy.ops.mesh.primitive_monkey_add(size=2)  # Suzanne`,
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
- **Monkey (Suzanne)** — Blender's test subject. Use her for shading and lighting experiments.`,
      },
      {
        title: "The Operator Panel (F9)",
        pythonCode: `import bpy

# The F9 panel settings are just keyword args on the operator.
# Pass them directly — no need to open F9 at all in scripting.

# UV Sphere with custom segment counts
bpy.ops.mesh.primitive_uv_sphere_add(
    segments=8,        # longitude divisions (low = faceted)
    ring_count=6,      # latitude divisions
    radius=1.0,
    calc_uvs=True,     # Generate UVs checkbox
    location=(0, 0, 0),
    rotation=(0, 0, 0)
)

# Cylinder with hexagonal cross-section
bpy.ops.mesh.primitive_cylinder_add(
    vertices=6,        # 6 = hexagonal prism
    radius=1.0,
    depth=2.0,
    calc_uvs=True
)

# Torus with custom radii and segments
bpy.ops.mesh.primitive_torus_add(
    major_radius=1.5,
    minor_radius=0.3,
    major_segments=32,
    minor_segments=8
)`,
        content: `When you add a primitive, a panel appears at the **bottom-left** of the viewport. This is your one chance to set initial parameters before the operator locks in.

**Click the panel or press F9** to expand it:
- **Vertices / Segments** — Controls mesh density. More = smoother, heavier.
- **Radius / Size** — Initial dimensions.
- **Generate UVs** — Auto-create a UV map. Turn this on — it costs nothing and saves time later.
- **Align to View** — Face the current camera direction. Useful when adding on a specific axis.
- **Location / Rotation** — Exact initial placement.

⚠️ This panel disappears the moment you perform any other action. It is a one-time window. If you miss it, use Ctrl+Z and re-add.`,
      },
      {
        title: "Curves & Surfaces (Non-Mesh Primitives)",
        pythonCode: `import bpy

# Add curve primitives
bpy.ops.curve.primitive_bezier_curve_add(radius=1, location=(0, 0, 0))
bpy.ops.curve.primitive_bezier_circle_add(radius=1)
bpy.ops.curve.primitive_nurbs_path_add(radius=1)

# Give a curve a round cross-section (instant pipe/tube)
obj = bpy.context.active_object
curve = obj.data  # bpy.types.Curve
curve.bevel_depth = 0.05        # thickness of the tube
curve.bevel_resolution = 4      # smoothness of the bevel circle
curve.fill_mode = 'FULL'        # cap the ends

# Use a custom object as the cross-section profile
curve.bevel_mode = 'OBJECT'
curve.bevel_object = bpy.data.objects["ProfileCurve"]

# Convert curve to mesh (destructive)
bpy.ops.object.convert(target='MESH')`,
        content: `**Shift+A → Curve** gives you a different data type — mathematically smooth paths, not polygon meshes.

- **Bezier** — Handles for smooth curves. Great for paths, logos, cables, motion paths.
- **NURBS** — Weighted control points. Smooth surfaces, automotive design.
- **Path** — A simple spline. Use as a motion path for animation or a spine for Curve modifier.

Curves can be converted to meshes (**Object → Convert → Mesh**) or used directly with the **Curve modifier** to deform other objects along them.

**Shift+A → Surface** — NURBS surface patches. Rarely used for modeling, but understand they exist.

Key curve settings (Properties → Object Data → Geometry):
- **Bevel → Depth** — Give the curve a round cross-section (instant pipe/tube)
- **Bevel → Object** — Use a custom shape as the cross-section
- **Fill Mode** — Whether the curve end caps are filled`,
      },
      {
        title: "🔨 Mini Workshop: Know Your Topology",
        isWorkshop: true,
        pythonCode: `import bpy

# Inspect topology of any mesh in Python
obj = bpy.context.active_object
mesh = obj.data

print(f"Vertices: {len(mesh.vertices)}")
print(f"Edges:    {len(mesh.edges)}")
print(f"Polygons: {len(mesh.polygons)}")

# Check for n-gons (faces with more than 4 verts — shading risk)
ngons = [p for p in mesh.polygons if len(p.vertices) > 4]
print(f"N-gons: {len(ngons)}")

# Check for triangles
tris = [p for p in mesh.polygons if len(p.vertices) == 3]
print(f"Triangles: {len(tris)}")`,
        content: `Add one of each primitive and turn on **Edit Mode (Tab)** to inspect its geometry. What you're learning: what you get before you do anything.

1. Add a **UV Sphere** → Tab → see the pole pinching at top/bottom
2. Add an **Ico Sphere** → Tab → see the uniform triangle distribution
3. Add a **Cylinder** → Tab → 3 (face select) → click the top cap → it's one n-gon face (important: n-gons cause shading issues if subdivided)
4. Add a **Torus** → Tab → notice how it's made of edge loops — great for ring topology
5. Add a **Curve → Bezier** → Tab → see the control points and handles → G to move one

✅ Goal: Given a target shape, immediately know which primitive to start from`,
      },
    ],
  },
  {
    id: 5,
    emoji: "✏️",
    title: "Edit Mode & Topology",
    tag: "CORE MODELING",
    color: "#44d9a2",
    intro:
      "Edit Mode is where real modeling happens. You're operating on the mesh's actual geometry — vertices, edges, faces. Topology (how geometry is connected) determines everything: how the mesh deforms, subdivides, and renders.",
    quiz: [
      {
        q: "What does Alt+Click do on an edge in Edit Mode?",
        options: [
          "Deletes the edge",
          "Selects the entire edge loop running around the mesh",
          "Adds a new edge loop",
          "Bevels the edge",
        ],
        answer: 1,
        explanation:
          "Alt+Click selects an edge loop — a ring of connected edges that runs around the mesh. One of the most powerful selection shortcuts in modeling.",
      },
      {
        q: "Why are quads (4-sided faces) preferred over triangles for most modeling?",
        options: [
          "Quads render faster in Cycles",
          "Quads subdivide predictably and shade cleanly; triangles cause shading artifacts on curved surfaces",
          "Blender can only import quad meshes",
          "Triangles use more memory than quads",
        ],
        answer: 1,
        explanation:
          "Quads subdivide cleanly and deform predictably for animation. Triangles on curved, subdivided surfaces produce visible shading artifacts.",
      },
      {
        q: "What does Proportional Editing (O) do when you move a vertex?",
        options: [
          "Moves only the selected vertex, nothing else",
          "Locks the transform to a proportional axis",
          "Makes the transform fall off smoothly to nearby unselected vertices within a radius",
          "Snaps the vertex to the nearest surface",
        ],
        answer: 2,
        explanation:
          "Proportional Editing creates a smooth falloff — like pulling fabric. Essential for organic shaping without selecting every vert individually.",
      },
      {
        q: "An object's faces are shading dark and look inside-out. What's most likely wrong?",
        options: [
          "The material is set to transparent",
          "The normals are flipped — faces are pointing inward instead of outward",
          "The object needs a Subdivision Surface modifier",
          "The viewport is in Wireframe mode",
        ],
        answer: 1,
        explanation:
          "Flipped normals make faces look dark because light isn't hitting the 'outside'. Fix with Mesh → Normals → Recalculate Outside (Shift+N in Edit Mode).",
      },
    ],
    sections: [
      {
        title: "Selection Modes & Essential Navigation",
        pythonCode: `import bpy
import bmesh

# Switch select mode (vertex=0, edge=1, face=2)
bpy.context.tool_settings.mesh_select_mode = (True, False, False)   # vertex
bpy.context.tool_settings.mesh_select_mode = (False, True, False)   # edge
bpy.context.tool_settings.mesh_select_mode = (False, False, True)   # face

# Toggle proportional editing
bpy.context.tool_settings.use_proportional_edit = True
bpy.context.tool_settings.proportional_edit_falloff = 'SMOOTH'
bpy.context.tool_settings.proportional_size = 1.0

# Work with mesh data directly via bmesh (the Edit Mode API)
obj = bpy.context.active_object
bm = bmesh.from_edit_mesh(obj.data)  # get bmesh from edit mode

# Select all vertices
for v in bm.verts:
    v.select = True

bmesh.update_edit_mesh(obj.data)  # push changes back`,
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
**O** — Toggle Proportional Editing — transforms fall off smoothly around selected verts. Press O while transforming to adjust falloff radius with scroll wheel. Essential for organic shaping.`,
      },
      {
        title: "Core Transform Tools",
        pythonCode: `import bpy
import bmesh

obj = bpy.context.active_object
bm = bmesh.from_edit_mesh(obj.data)

# Move selected verts by a vector (G → Z → 2 equivalent)
import mathutils
for v in bm.verts:
    if v.select:
        v.co += mathutils.Vector((0, 0, 2.0))

# Extrude selected faces and move up (E then Z)
bpy.ops.mesh.extrude_region_move(
    TRANSFORM_OT_translate={"value": (0, 0, 1.0)}
)

# Inset faces (I key)
bpy.ops.mesh.inset(thickness=0.1, depth=0.0)

# Loop cut (Ctrl+R) — adds edge loop with n cuts
bpy.ops.mesh.loopcut_slide(
    MESH_OT_loopcut={"number_cuts": 1},
    TRANSFORM_OT_edge_slide={"value": 0.0}
)

# Bevel edges (Ctrl+B)
bpy.ops.mesh.bevel(offset=0.1, segments=2, affect='EDGES')

# Merge vertices by distance (removes doubles)
bpy.ops.mesh.remove_doubles(threshold=0.001)

bmesh.update_edit_mesh(obj.data)`,
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
**Ctrl+M** — Mirror selected across an axis`,
      },
      {
        title: "Topology Concepts That Matter",
        pythonCode: `import bpy
import bmesh

obj = bpy.context.active_object
bm = bmesh.from_edit_mesh(obj.data)

# Check valence (number of edges per vertex) — find poles
for v in bm.verts:
    valence = len(v.link_edges)
    if valence != 4:
        print(f"Pole at vertex {v.index}: valence={valence}")
        v.select = True  # highlight poles

# Find non-manifold geometry (holes, flipped normals)
bpy.ops.mesh.select_non_manifold()

# Recalculate normals (fix flipped faces)
bpy.ops.mesh.normals_make_consistent(inside=False)

# Check for n-gons
for f in bm.faces:
    if len(f.verts) > 4:
        f.select = True  # highlight n-gons
        print(f"N-gon: face {f.index} has {len(f.verts)} verts")

bmesh.update_edit_mesh(obj.data)`,
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

**Ctrl+Alt+Shift+M** — Select Non-Manifold (broken geometry: holes, internal faces, flipped normals). Use this to diagnose mesh problems.`,
      },
      {
        title: "Normals & Shading",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Set smooth shading on entire object (right-click → Shade Smooth)
bpy.ops.object.shade_smooth()

# Set flat shading
bpy.ops.object.shade_flat()

# Auto smooth: smooth edges below angle threshold
bpy.ops.object.shade_smooth_by_angle(angle=0.523599)  # 30° in radians

# Add Weighted Normals modifier (keeps hard-surface shading clean)
mod = obj.modifiers.new("WeightedNormal", type='WEIGHTED_NORMAL')
mod.keep_sharp = True

# Read face normals from mesh data
mesh = obj.data
mesh.calc_normals_split()
for poly in mesh.polygons:
    print(f"Face {poly.index} normal: {poly.normal}")`,
        content: `**Normals** are vectors pointing outward from each face, telling Blender which direction is "outside." They control shading.

Common normal issues and fixes:
- **Flipped normals** — Face looks dark or inverted. Fix: Select all → **Mesh → Normals → Recalculate Outside** (Shift+N)
- **Flat vs Smooth shading** — Right-click object → Shade Smooth (or Shade Auto Smooth). Smooth shading interpolates normals across a face; Flat shows each face as a distinct polygon.
- **Auto Smooth** — In Object Data Properties → Normals: set an angle threshold. Edges sharper than the angle show as hard; others as smooth. Best of both worlds.
- **Weighted Normals modifier** — Computes normals based on face area. Keeps hard-surface objects looking clean after boolean operations.

Overlay: **Viewport Overlays → Face Orientation** — Blue = outward-facing, Red = inward. All blue = healthy mesh.`,
      },
      {
        title: "🔨 Mini Workshop: Box-Model a Mug",
        isWorkshop: true,
        pythonCode: `import bpy

# Full mug creation via Python
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()  # clear scene

# Add cylinder (the mug body)
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.5, depth=1.2)
mug = bpy.context.active_object
mug.name = "Mug"

# Enter edit mode and hollow it out
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.context.tool_settings.mesh_select_mode = (False, False, True)

# Select top face, inset, then extrude down
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.inset(thickness=0.05)
bpy.ops.mesh.extrude_region_move(
    TRANSFORM_OT_translate={"value": (0, 0, -1.1)}
)

bpy.ops.object.mode_set(mode='OBJECT')

# Add torus handle
bpy.ops.mesh.primitive_torus_add(
    major_radius=0.35, minor_radius=0.05,
    location=(0.55, 0, 0), rotation=(1.5708, 0, 0)
)
handle = bpy.context.active_object

# Join mug + handle
mug.select_set(True)
bpy.context.view_layer.objects.active = mug
bpy.ops.object.join()`,
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

✅ Goal: Understand that complex shapes are just primitives + Edit Mode operations`,
      },
    ],
  },
  {
    id: 6,
    emoji: "🔧",
    title: "Modifiers",
    tag: "NON-DESTRUCTIVE",
    color: "#c084fc",
    intro:
      "Modifiers are Blender's superpower — non-destructive operations stacked on top of your base mesh. Stack them, reorder them, toggle them. The original is always safe until you Apply.",
    quiz: [
      {
        q: "You add a Bevel modifier, then a Subdivision Surface modifier. The result looks different than Subdivision then Bevel. Why?",
        options: [
          "The modifiers have conflicting settings",
          "Modifier order matters — the stack processes top to bottom, so each modifier receives the output of the one above it",
          "Only one modifier can be active at a time",
          "You need to Apply the first modifier before adding the second",
        ],
        answer: 1,
        explanation:
          "Order is everything. Bevel → Subdivision means subdivision smooths the already-beveled edges. Subdivision → Bevel means the beveler operates on subdivided geometry. Completely different results.",
      },
      {
        q: "You want to model only the right half of a character and have the left appear automatically. Which modifier?",
        options: ["Array", "Mirror", "Solidify", "Screw"],
        answer: 1,
        explanation:
          "Mirror modifier reflects geometry across a chosen axis. Enable Clipping so vertices snap cleanly at the center seam. Model half, get the full mesh.",
      },
      {
        q: "What does the Displace modifier do?",
        options: [
          "Moves the entire object to a new location",
          "Uses a texture to push vertices outward along their normals",
          "Displaces the modifier stack order",
          "Creates a copy of the object at an offset",
        ],
        answer: 1,
        explanation:
          "Displace reads a grayscale texture and pushes vertices along their normals by the texture's value. The fastest way to make terrain, wrinkles, or surface detail.",
      },
      {
        q: "When should you Apply a modifier rather than leaving it in the stack?",
        options: [
          "Always apply immediately — live modifiers are slow",
          "Only when you need to sculpt on the result, export, or manually edit the modified geometry",
          "Whenever you save the file",
          "After rendering, to save memory",
        ],
        answer: 1,
        explanation:
          "Keep modifiers live as long as possible. Apply only when you need to do something the modifier stack can't support — like sculpting at the subdivided resolution.",
      },
    ],
    sections: [
      {
        title: "The Modifier Stack",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Add a modifier
mod = obj.modifiers.new(name="MySub", type='SUBSURF')

# Reorder modifiers (move to top)
bpy.ops.object.modifier_move_to_index(modifier=mod.name, index=0)

# Toggle visibility
mod.show_viewport = True
mod.show_render = False

# Duplicate a modifier
bpy.ops.object.modifier_copy(modifier=mod.name)

# Apply a modifier (destructive — burns into mesh)
bpy.ops.object.modifier_apply(modifier=mod.name)

# Remove a modifier without applying
obj.modifiers.remove(mod)

# List all modifiers in stack order
for m in obj.modifiers:
    print(m.name, m.type, "viewport:", m.show_viewport)`,
        content: `**Properties → 🔧 Modifier tab** — Add and manage modifiers here.

The stack processes **top to bottom**. Order matters dramatically:
- Subdivision Surface before Bevel: the bevel gets subdivided (smooth result)
- Bevel before Subdivision Surface: the subdivision gets beveled (sharp, then smoothed)

For each modifier:
- **👁 Eye icon** — Toggle viewport visibility
- **🎬 Camera icon** — Toggle render visibility
- **Apply** — Burns the result permanently into the mesh (destructive, often irreversible)
- **Duplicate** — Copy the modifier with same settings

Keep modifiers unapplied until: you need to sculpt on the subdivided mesh, you're exporting, or you need to manually edit the resulting geometry.`,
      },
      {
        title: "Generate Modifiers — Shape Creators",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Subdivision Surface
sub = obj.modifiers.new("Subdiv", 'SUBSURF')
sub.levels = 2
sub.render_levels = 3
sub.subdivision_type = 'CATMULL_CLARK'  # or 'SIMPLE'

# Mirror
mir = obj.modifiers.new("Mirror", 'MIRROR')
mir.use_axis[0] = True   # mirror on X
mir.use_clip = True      # clipping (verts snap at seam)

# Array
arr = obj.modifiers.new("Array", 'ARRAY')
arr.count = 5
arr.relative_offset_displace[0] = 1.1  # X spacing

# Solidify (add thickness to flat surface)
sol = obj.modifiers.new("Solidify", 'SOLIDIFY')
sol.thickness = 0.05

# Screw (revolve profile around axis)
scr = obj.modifiers.new("Screw", 'SCREW')
scr.angle = 6.2832   # 360° in radians (full revolution)
scr.steps = 32
scr.axis = 'Y'

# Boolean (cut/join/intersect with another object)
bl = obj.modifiers.new("Bool", 'BOOLEAN')
bl.operation = 'DIFFERENCE'  # 'UNION', 'DIFFERENCE', 'INTERSECT'
bl.object = bpy.data.objects["Cutter"]
bl.solver = 'EXACT'`,
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

**Boolean** — Use one object to cut/join/intersect another. See Module 11 for detail.

**Weld** — Merge vertices within a distance threshold. Essential after Booleans.

**Remesh** — Rebuild the entire mesh surface with uniform topology (Voxel or Quad modes). Key for sculpt prep.`,
      },
      {
        title: "Deform Modifiers — Shape Changers",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Simple Deform (twist, bend, taper, stretch)
sd = obj.modifiers.new("SimpleDeform", 'SIMPLE_DEFORM')
sd.deform_method = 'TWIST'   # 'BEND', 'TAPER', 'STRETCH'
sd.angle = 1.5708            # 90° in radians
sd.deform_axis = 'Z'

# Curve deform (follow a path)
cd = obj.modifiers.new("Curve", 'CURVE')
cd.object = bpy.data.objects["BezierCurve"]
cd.deform_axis = 'POS_Y'

# Displace (push verts by a texture)
disp = obj.modifiers.new("Displace", 'DISPLACE')
tex = bpy.data.textures.new("DisplaceTex", type='NOISE')
disp.texture = tex
disp.strength = 0.5
disp.direction = 'NORMAL'

# Shrinkwrap (snap mesh to another surface)
sw = obj.modifiers.new("Shrinkwrap", 'SHRINKWRAP')
sw.target = bpy.data.objects["TargetMesh"]
sw.wrap_method = 'NEAREST_SURFACEPOINT'

# Smooth
sm = obj.modifiers.new("Smooth", 'SMOOTH')
sm.factor = 0.5
sm.iterations = 3`,
        content: `These modify existing geometry without adding or removing it:

**Simple Deform** — Twist, Bend, Taper, or Stretch along an axis. Controlled by an angle or factor. Great for stylized shapes.

**Lattice** — Deform a mesh using a cage object. Edit the cage → the mesh follows. Non-destructive squash and stretch.

**Curve** — Deform a mesh along a Bezier/NURBS curve. Roads, pipes, roller coasters, any along-path shape.

**Displace** — Use a texture (Noise, Image, etc.) to push vertices along normals. Instant terrain, wrinkles, knurling.

**Smooth / Laplacian Smooth** — Relax geometry (reduce bumps) without subdividing. Good for cleaning up sculpts.

**Shrinkwrap** — Snap a mesh onto the surface of another object. Key for retopology.

**Cast** — Push the mesh toward a sphere, cube, or cylinder shape. Good for rounding things out.

**Wave** — Animate a ripple/wave across the surface. Physics-lite animation.`,
      },
      {
        title: "Modifier Recipes for Common Goals",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Recipe: hard surface with rounded edges
bev = obj.modifiers.new("Bevel", 'BEVEL')
bev.limit_method = 'ANGLE'
bev.angle_limit = 0.5236  # 30°
bev.width = 0.02
bev.segments = 2
sub = obj.modifiers.new("Subdiv", 'SUBSURF')
sub.levels = 2

# Recipe: terrain from a grid
bpy.ops.mesh.primitive_grid_add(x_subdivisions=50, y_subdivisions=50, size=10)
terrain = bpy.context.active_object
disp = terrain.modifiers.new("Displace", 'DISPLACE')
tex = bpy.data.textures.new("TerrainNoise", type='MUSGRAVE')
tex.musgrave_type = 'FBM'
tex.noise_scale = 2.0
disp.texture = tex
disp.strength = 1.5

# Recipe: array along a curve
bpy.ops.mesh.primitive_cube_add(size=0.2)
link_obj = bpy.context.active_object
arr = link_obj.modifiers.new("Array", 'ARRAY')
arr.fit_type = 'FIT_CURVE'
arr.curve = bpy.data.objects["PathCurve"]
cur = link_obj.modifiers.new("Curve", 'CURVE')
cur.object = bpy.data.objects["PathCurve"]`,
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
→ Bezier curve for the path → Cylinder for cross-section → Curve modifier on cylinder → curve object as the target`,
      },
      {
        title: "🔨 Mini Workshop: Procedural Vase",
        isWorkshop: true,
        pythonCode: `import bpy
import math

# Build the entire procedural vase in Python
bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.5, fill_type='NOTHING')
vase = bpy.context.active_object
vase.name = "Vase"

# Add Screw modifier — revolves the circle profile
scr = vase.modifiers.new("Screw", 'SCREW')
scr.angle = math.radians(360)
scr.steps = 32
scr.axis = 'Z'

# Add Solidify for wall thickness
sol = vase.modifiers.new("Solidify", 'SOLIDIFY')
sol.thickness = 0.03

# Smooth with Subdivision Surface
sub = vase.modifiers.new("Subdiv", 'SUBSURF')
sub.levels = 2
sub.subdivision_type = 'CATMULL_CLARK'

# Optional: twist the body
sd = vase.modifiers.new("Twist", 'SIMPLE_DEFORM')
sd.deform_method = 'TWIST'
sd.angle = math.radians(45)
sd.deform_axis = 'Z'`,
        content: `Build a vase using zero manual sculpting — pure modifiers:

1. **Shift+A → Mesh → Circle** (16 vertices)
2. **Tab → Edit Mode** → select all → **E** to extrude upward repeatedly, pulling verts in/out to shape a profile
3. Back in **Object Mode** → **Add → Modifier → Screw** — instant vase shape!
4. **Add → Modifier → Solidify** — give it wall thickness (0.02–0.05)
5. **Add → Modifier → Subdivision Surface** (level 2) — smooth it
6. Optional: **Add → Modifier → Simple Deform → Twist** — twist the vase body

Explore: change the Screw angle (360° = full closed, less = open spiral), change Screw axis.

✅ Goal: Understand that complex shapes = simple profiles + stacked modifiers`,
      },
    ],
  },
  {
    id: 7,
    emoji: "🔷",
    title: "Geometry Nodes",
    tag: "PROCEDURAL GENERATION",
    color: "#38bdf8",
    intro:
      "Geometry Nodes is Blender's procedural modeling system — a visual node graph that generates, modifies, and instances geometry without touching the mesh directly. Think of it as programming in Blender. It's fully non-destructive and animatable.",
    quiz: [
      {
        q: "What is a Field in Geometry Nodes?",
        options: [
          "A named input parameter on a node group",
          "A value that is evaluated per-element (per vertex, face, instance) rather than as a single constant",
          "A 2D texture used to drive geometry",
          "A node that stores multiple geometry outputs",
        ],
        answer: 1,
        explanation:
          "Fields are functions, not values. A Position field doesn't return one point — it returns the position of each element individually. This is what makes 'distribute across a surface' possible.",
      },
      {
        q: "You want to scatter 5,000 rocks across a terrain with near-zero memory cost. What's the GN approach?",
        options: [
          "Duplicate the rock object 5,000 times manually",
          "Use Array modifier with count 5000",
          "Distribute Points on Faces → Instance on Points, with the rock as the instance",
          "Export and reimport as a particle system",
        ],
        answer: 2,
        explanation:
          "Instances are lightweight references — 5,000 instances point to one rock mesh. Near-zero memory overhead vs 5,000 duplicates which would copy all geometry.",
      },
      {
        q: "What do Simulation Zones in Geometry Nodes allow you to do?",
        options: [
          "Simulate rendering performance before a final render",
          "Run per-frame iterative logic where each frame can read the previous frame's state",
          "Preview physics simulations faster",
          "Run geometry nodes only during simulation playback",
        ],
        answer: 1,
        explanation:
          "Simulation Zones pass state from frame to frame — the output of frame N becomes the input of frame N+1. This enables custom physics, growth algorithms, and any iterative process.",
      },
      {
        q: "What's the key difference between using GN for hair vs the legacy particle hair system?",
        options: [
          "GN hair is slower and only works in Cycles",
          "GN hair is Curves-based, fully procedural, and integrated with the node graph — the legacy system uses particles and is being phased out",
          "GN hair requires a GPU",
          "There is no difference — they produce identical results",
        ],
        answer: 1,
        explanation:
          "The new hair system (Blender 4.x+) treats each strand as a Curves object, which can be driven and styled procedurally in GN. Legacy particle hair is deprecated.",
      },
    ],
    sections: [
      {
        title: "What Geometry Nodes Is For",
        pythonCode: `import bpy

# Add a Geometry Nodes modifier to an object
obj = bpy.context.active_object
mod = obj.modifiers.new("GeoNodes", 'NODES')

# Create a new node group and assign it
ng = bpy.data.node_groups.new("MyGeoNodes", 'GeometryNodeTree')
mod.node_group = ng

# Add Group Input and Group Output (the minimum valid graph)
ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

input_node  = ng.nodes.new('NodeGroupInput')
output_node = ng.nodes.new('NodeGroupOutput')
input_node.location  = (-300, 0)
output_node.location = (300, 0)

# Connect input → output (pass-through, no changes yet)
ng.links.new(input_node.outputs[0], output_node.inputs[0])`,
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

Access: Select an object → **Properties → Modifier → Add → Geometry Nodes**. This creates a GN modifier and opens the Geometry Node Editor.`,
      },
      {
        title: "Core Concepts: Fields, Instances, Attributes",
        pythonCode: `import bpy

# Read a named attribute from a mesh via Python
obj = bpy.context.active_object
mesh = obj.data

# Access built-in attributes
mesh.attributes["position"]       # vertex positions (FLOAT_VECTOR on POINT domain)
mesh.attributes[".edge_verts"]    # edge connectivity

# Create a custom attribute
attr = mesh.attributes.new(name="my_weight", type='FLOAT', domain='POINT')
# domain options: 'POINT' (vertex), 'EDGE', 'FACE', 'CORNER', 'CURVE', 'INSTANCE'

# Write values to it
for i, val in enumerate(attr.data):
    val.value = i / len(attr.data)  # 0.0 → 1.0 gradient

# Read attribute values
for val in mesh.attributes["my_weight"].data:
    print(val.value)

# Geometry Nodes exposes attributes as named inputs/outputs
# Use "Named Attribute" node in GN to read "my_weight" as a field`,
        content: `**Fields** — Values that vary per-element. Instead of one number, a field is a function evaluated at each vertex/edge/face/instance. This is what makes "distribute across a surface" possible — the position field gives each point's location.

**Instances** — Lightweight references to geometry placed at many locations. An instance doesn't copy the mesh — it points to the original. 10,000 trees as instances use almost no extra memory. Key nodes:
- **Instance on Points** — Place a geometry (or collection) at every point in a point cloud
- **Realize Instances** — Convert instances to actual mesh data (necessary before some operations)

**Attributes** — Named data stored per-element (vertex, edge, face, instance). Position, normal, ID, custom names. You can create, read, and write attributes. They flow through the graph.

**Domains** — Where attributes live: Vertex, Edge, Face, Face Corner, Spline, Instance. Nodes can transfer data between domains.`,
      },
      {
        title: "Key Node Categories",
        pythonCode: `import bpy

ng = bpy.data.node_groups["MyGeoNodes"]
nodes = ng.nodes
links = ng.links

# Helper to add and position a node
def add_node(type_name, x=0, y=0):
    n = nodes.new(type_name)
    n.location = (x, y)
    return n

# Key node type names (use these strings with nodes.new())
# Geometry
join        = add_node('GeometryNodeJoinGeometry',         200,  0)
transform   = add_node('GeometryNodeTransform',            200, -200)
merge_dist  = add_node('GeometryNodeMergeByDistance',      200, -400)

# Points & Instances
distribute  = add_node('GeometryNodeDistributePointsOnFaces', -200, 100)
instance_on = add_node('GeometryNodeInstanceOnPoints',        0,   100)
rand_val    = add_node('FunctionNodeRandomValue',             -200, -100)
col_info    = add_node('GeometryNodeCollectionInfo',          -400, 100)

# Mesh primitives (create inside the graph, no scene object needed)
cube_prim   = add_node('GeometryNodeMeshCube',             -400, 200)

# Utilities
math_node   = add_node('ShaderNodeMath',                   0, -200)
map_range   = add_node('ShaderNodeMapRange',               0, -400)
mix_node    = add_node('ShaderNodeMix',                    0, -600)`,
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
- **Named Attribute** — Read a custom attribute by name`,
      },
      {
        title: "Simulation Zones (Blender 4.1+)",
        pythonCode: `import bpy

# Simulation zones are defined by two paired nodes in the graph:
# GeometryNodeSimulationInput and GeometryNodeSimulationOutput
# Everything wired between them runs per-frame, retaining state.

ng = bpy.data.node_groups["MyGeoNodes"]

sim_in  = ng.nodes.new('GeometryNodeSimulationInput')
sim_out = ng.nodes.new('GeometryNodeSimulationOutput')
sim_in.location  = (-100, 0)
sim_out.location = (300, 0)

# The simulation zone pair is linked automatically on creation.
# Wire geometry through: Group Input → Sim Input → [process] → Sim Output → Group Output

# Bake simulation from Python
bpy.ops.object.simulation_nodes_cache_bake(override={"selected_editable_objects": [bpy.context.active_object]})

# Clear baked simulation
bpy.ops.object.simulation_nodes_cache_delete()

# Set bake path
obj = bpy.context.active_object
mod = obj.modifiers["GeoNodes"]
# Bake path is set per modifier in the UI (Properties → Modifier → Bake)`,
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

This is advanced but understanding it exists changes what you think is possible.`,
      },
      {
        title: "Hair System (Geometry Nodes Based)",
        pythonCode: `import bpy

# Add a hair curves object parented to a mesh
surface = bpy.data.objects["Character_Head"]
bpy.ops.object.curves_empty_hair_add(surface_object=surface.name)
hair = bpy.context.active_object  # bpy.types.Curves object

# Read hair strand data
curves = hair.data  # bpy.types.Curves
print(f"Strands: {len(curves.curves)}")
print(f"Total points: {len(curves.points)}")

# Each strand has a slice of points
for curve in curves.curves:
    pts = curves.points[curve.first_point_index : curve.first_point_index + curve.points_length]
    for pt in pts:
        print(pt.position)

# Add a Geometry Nodes modifier to procedurally style hair
mod = hair.modifiers.new("HairGeoNodes", 'NODES')
# Then build the node graph to scatter, grow, and style strands`,
        content: `As of Blender 4.x, the new hair system is built on Geometry Nodes. Hair is a **Curves** object — each strand is a spline.

**Object → Add → Curve → Empty Hair** — starts a hair object parented to a mesh (the mesh acts as the base surface).

In the **Hair Curves** context:
- Use sculpt brushes to style hair (comb, cut, smooth, clump)
- Hair is instanced as actual strand geometry at render time

In Geometry Nodes, you can procedurally generate hair by:
- Distributing points on the surface
- Creating curves at those points with defined length/direction
- Adding noise for variation

Key nodes for hair: **Distribute Points on Faces**, **Curve Line**, **Set Curve Normal**, **Noise Texture** (for random variation), **Resample Curve** (for render resolution).`,
      },
      {
        title: "🔨 Mini Workshop: Scatter Objects on a Surface",
        isWorkshop: true,
        pythonCode: `import bpy

# Build the full scatter graph in Python
bpy.ops.mesh.primitive_grid_add(x_subdivisions=1, y_subdivisions=1, size=10)
ground = bpy.context.active_object

bpy.ops.mesh.primitive_ico_sphere_add(radius=0.1)
sphere = bpy.context.active_object
sphere.hide_set(True)  # hide from viewport (still available to GN)

# Add GN modifier to ground
mod = ground.modifiers.new("Scatter", 'NODES')
ng = bpy.data.node_groups.new("ScatterNodes", 'GeometryNodeTree')
mod.node_group = ng

# Setup interface
ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

n = ng.nodes
l = ng.links

inp  = n.new('NodeGroupInput');  inp.location  = (-600, 0)
out  = n.new('NodeGroupOutput'); out.location  = (600,  0)
dist = n.new('GeometryNodeDistributePointsOnFaces'); dist.location = (-300, 0)
inst = n.new('GeometryNodeInstanceOnPoints');        inst.location = (0,    0)
info = n.new('GeometryNodeObjectInfo');              info.location = (-300, -200)
info.inputs["Object"].default_value = sphere

dist.inputs["Density"].default_value = 5.0  # instances per m²

l.new(inp.outputs[0],  dist.inputs["Mesh"])
l.new(dist.outputs[0], inst.inputs["Points"])
l.new(info.outputs["Geometry"], inst.inputs["Instance"])
l.new(inst.outputs[0], out.inputs[0])`,
        content: `The foundational GN workflow — place objects procedurally on a mesh:

1. **Shift+A → Mesh → Grid** — your ground plane (scale it up: S → 5)
2. **Shift+A → Mesh → Ico Sphere** — the object you'll scatter. Scale small (S → 0.1). Keep it in scene.
3. Select the **Grid** → Properties → Modifier → Add → **Geometry Nodes**
4. In the node editor, **Shift+A → Point → Distribute Points on Faces** — place it between Group Input and Group Output. Connect: Geometry → Mesh, Geometry → Geometry.
5. **Shift+A → Instances → Instance on Points** — connect: Points → Points, output Instances → Geometry.
6. **Shift+A → Input → Object Info** — set the Object to your Ico Sphere. Connect: Geometry → Instance (on Instance on Points).

You now have hundreds of spheres scattered on the grid — procedurally.

7. Add **Rotate Instances** node after Instance on Points → connect a **Random Value** (Vector) to Rotation for random rotation.

✅ Goal: Understand the Distribute → Instance → Modify pipeline — the foundation of 80% of GN work`,
      },
    ],
  },
  {
    id: 8,
    emoji: "🎨",
    title: "Materials & Shading",
    tag: "SURFACE APPEARANCE",
    color: "#f472b6",
    intro:
      "Materials define what an object is made of — metal, glass, skin, rubber, cloth. The Shader Editor is a node graph where you can build any surface appearance. Blender 5.1 uses both Cycles and EEVEE Next, each with full Principled BSDF support.",
    quiz: [
      {
        q: "What does setting Metallic to 0.5 on the Principled BSDF produce?",
        options: [
          "A semi-metallic alloy material",
          "An unrealistic result — Metallic should almost always be 0 or 1, not in-between",
          "A brushed metal appearance",
          "A material halfway between plastic and chrome",
        ],
        answer: 1,
        explanation:
          "Real-world materials are either conductors (metals, Metallic=1) or dielectrics (everything else, Metallic=0). Values in between don't correspond to real materials and look wrong.",
      },
      {
        q: "What does the Roughness parameter control on Principled BSDF?",
        options: [
          "How rough the geometry surface is",
          "Whether the surface reflects light as a sharp mirror (0) or as a blurry matte (1)",
          "The amount of surface displacement",
          "How transparent the material is",
        ],
        answer: 1,
        explanation:
          "Roughness controls microsurface scattering. 0 = perfect mirror, 1 = completely diffuse matte. Most real surfaces fall between 0.3–0.8.",
      },
      {
        q: "You want rock-coloured variation that's organic and non-repeating, with no image texture. Which node combination works?",
        options: [
          "Image Texture → Color Mix",
          "Noise Texture → ColorRamp → Base Color",
          "Voronoi Texture → Bump → Normal",
          "Wave Texture → Fresnel → Emission",
        ],
        answer: 1,
        explanation:
          "Noise Texture generates infinite organic variation. ColorRamp remaps the 0–1 output to any set of colours. Connect to Base Color for instant procedural surface variation.",
      },
      {
        q: "What is the Fresnel node used for in a shader?",
        options: [
          "Controlling how transparent glass is at different angles",
          "Making surfaces more reflective at grazing angles — the physical phenomenon of edge highlights",
          "Generating a rainbow spectrum effect",
          "Setting the index of refraction for transmission",
        ],
        answer: 1,
        explanation:
          "Fresnel models how reflectivity increases at grazing angles — exactly what makes real surfaces like plastic and water look realistic. Use as a Mix Shader factor for physically correct blending.",
      },
    ],
    sections: [
      {
        title: "Principled BSDF — The Universal Shader",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Create and assign a new material
mat = bpy.data.materials.new(name="MyMaterial")
mat.use_nodes = True
obj.data.materials.append(mat)

# Get the Principled BSDF node
bsdf = mat.node_tree.nodes["Principled BSDF"]

# Key inputs — set via default_value on the input socket
bsdf.inputs["Base Color"].default_value        = (0.8, 0.2, 0.1, 1.0)  # RGBA
bsdf.inputs["Metallic"].default_value          = 0.0    # 0=dielectric, 1=metal
bsdf.inputs["Roughness"].default_value         = 0.5    # 0=mirror, 1=matte
bsdf.inputs["IOR"].default_value               = 1.45   # glass=1.45, water=1.33
bsdf.inputs["Transmission Weight"].default_value = 0.0  # 1.0 = fully transparent
bsdf.inputs["Emission Color"].default_value    = (1.0, 0.5, 0.0, 1.0)
bsdf.inputs["Emission Strength"].default_value = 0.0    # 0=off, >0=glowing
bsdf.inputs["Alpha"].default_value             = 1.0    # 0=transparent
bsdf.inputs["Coat Weight"].default_value       = 0.0    # clearcoat layer
bsdf.inputs["Sheen Weight"].default_value      = 0.0    # fabric/velvet retroreflection
bsdf.inputs["Subsurface Weight"].default_value = 0.0    # skin/wax light scatter`,
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
**Subsurface Weight** — Light scatters below the surface (skin, wax, marble). Set Subsurface Radius for color bleed.`,
      },
      {
        title: "The Shader Editor",
        pythonCode: `import bpy

mat = bpy.context.active_object.active_material
mat.use_nodes = True
tree = mat.node_tree
nodes = tree.nodes
links = tree.links

bsdf = nodes["Principled BSDF"]
out  = nodes["Material Output"]

# Add an Image Texture node and connect to Base Color
img_node = nodes.new('ShaderNodeTexImage')
img_node.location = (-300, 200)
img_node.image = bpy.data.images.load("/path/to/texture.png")
links.new(img_node.outputs["Color"], bsdf.inputs["Base Color"])

# Add a Noise Texture → drive Roughness variation
noise = nodes.new('ShaderNodeTexNoise')
noise.location = (-500, -100)
noise.inputs["Scale"].default_value   = 5.0
noise.inputs["Detail"].default_value  = 8.0
ramp = nodes.new('ShaderNodeValToRGB')   # ColorRamp
ramp.location = (-200, -100)
links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
links.new(ramp.outputs["Color"], bsdf.inputs["Roughness"])

# Add a Bump node for surface detail
bump = nodes.new('ShaderNodeBump')
bump.location = (-100, -300)
bump.inputs["Strength"].default_value = 0.5
links.new(noise.outputs["Fac"], bump.inputs["Height"])
links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# Texture Coordinate + Mapping (control UV projection)
tex_coord = nodes.new('ShaderNodeTexCoord'); tex_coord.location = (-800, 0)
mapping    = nodes.new('ShaderNodeMapping');  mapping.location    = (-600, 0)
links.new(tex_coord.outputs["UV"], mapping.inputs["Vector"])
links.new(mapping.outputs["Vector"], noise.inputs["Vector"])`,
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
- **Mapping** — Translate/rotate/scale a texture coordinate. Plug Texture Coordinate → Mapping → Texture.`,
      },
      {
        title: "EEVEE Next vs Cycles — Material Considerations",
        pythonCode: `import bpy

scene = bpy.context.scene

# Switch render engine
scene.render.engine = 'CYCLES'            # path-traced, accurate
scene.render.engine = 'BLENDER_EEVEE_NEXT'  # real-time path-traced

# Cycles: enable GPU rendering
prefs = bpy.context.preferences
cycles_prefs = prefs.addons['cycles'].preferences
cycles_prefs.compute_device_type = 'METAL'  # Mac GPU (or 'CUDA', 'OPTIX' on NVIDIA)
cycles_prefs.get_devices()
for device in cycles_prefs.devices:
    device.use = True  # enable all available devices
scene.cycles.device = 'GPU'

# Cycles sample settings
scene.cycles.samples = 256
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPENIMAGEDENOISE'  # or 'OPTIX' on NVIDIA

# EEVEE Next settings
eevee = scene.eevee
eevee.taa_render_samples = 64
eevee.use_gtao = True          # ambient occlusion
eevee.use_bloom = True         # bloom/glow effect

# Material: enable screen-space refraction (EEVEE glass)
mat = bpy.context.active_object.active_material
mat.use_screen_refraction = True
mat.blend_method = 'HASHED'    # for transparency: 'OPAQUE','CLIP','HASHED','BLEND'`,
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

Shader nodes that are Cycles-only: some advanced volume shaders, true caustics paths. Everything else is compatible.`,
      },
      {
        title: "Material Recipes for Common Surfaces",
        pythonCode: `import bpy

def make_material(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    return mat, mat.node_tree, bsdf

# Polished chrome
mat, tree, bsdf = make_material("Chrome")
bsdf.inputs["Base Color"].default_value  = (0.8, 0.8, 0.8, 1)
bsdf.inputs["Metallic"].default_value    = 1.0
bsdf.inputs["Roughness"].default_value   = 0.05

# Glass
mat, tree, bsdf = make_material("Glass")
bsdf.inputs["Transmission Weight"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.0
bsdf.inputs["IOR"].default_value = 1.45
mat.blend_method = 'HASHED'

# Emissive neon
mat, tree, bsdf = make_material("Neon")
bsdf.inputs["Emission Color"].default_value   = (0.0, 1.0, 0.8, 1)
bsdf.inputs["Emission Strength"].default_value = 10.0

# Skin (subsurface)
mat, tree, bsdf = make_material("Skin")
bsdf.inputs["Base Color"].default_value          = (0.9, 0.7, 0.6, 1)
bsdf.inputs["Subsurface Weight"].default_value   = 0.3
bsdf.inputs["Subsurface Radius"].default_value   = (1.0, 0.2, 0.1)
bsdf.inputs["Roughness"].default_value           = 0.5`,
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
→ Combine with Bloom in post-processing (Compositor or EEVEE Bloom)`,
      },
      {
        title: "🔨 Mini Workshop: 3 Materials, 3 Surfaces",
        isWorkshop: true,
        pythonCode: `import bpy

def add_sphere_with_mat(x, name, metallic, roughness, transmission=0, base_color=(0.8,0.8,0.8,1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.8, location=(x, 0, 0))
    obj = bpy.context.active_object
    obj.name = name
    bpy.ops.object.shade_smooth()
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value          = base_color
    bsdf.inputs["Metallic"].default_value            = metallic
    bsdf.inputs["Roughness"].default_value           = roughness
    bsdf.inputs["Transmission Weight"].default_value = transmission
    obj.data.materials.append(mat)

add_sphere_with_mat(-3, "Metal",  metallic=1.0, roughness=0.1, base_color=(0.3,0.3,0.3,1))
add_sphere_with_mat( 0, "Rubber", metallic=0.0, roughness=0.9, base_color=(0.9,0.4,0.1,1))
add_sphere_with_mat( 3, "Glass",  metallic=0.0, roughness=0.0, transmission=1.0)`,
        content: `Create three spheres. Apply one material each. Your goal: see how 2–3 parameters completely define material identity.

**Polished metal sphere**: Metallic 1.0, Roughness 0.1, Base Color dark grey
**Matte rubber sphere**: Metallic 0, Roughness 0.9, Base Color saturated orange
**Glass sphere**: Transmission Weight 1.0, Roughness 0, IOR 1.45

Then experiment:
- Change roughness on the metal from 0.1 to 0.5 — see how it shifts from chrome to brushed
- Add a ColorRamp between a Noise Texture and Base Color on the rubber sphere
- Set the glass sphere's Base Color to a slight blue tint

✅ Goal: Understand that Principled BSDF sliders = material identity`,
      },
    ],
  },
  {
    id: 9,
    emoji: "💡",
    title: "Lighting",
    tag: "ILLUMINATION",
    color: "#fbbf24",
    intro:
      "Lighting is half the art. The same object in bad lighting looks terrible. Blender 5.1 with EEVEE Next gives you cinema-grade lighting in real time.",
    quiz: [
      {
        q: "Which light type produces the softest shadows, and why?",
        options: [
          "Point — because it emits in all directions",
          "Sun — because it's infinitely far away",
          "Area — because it's a large surface emitter; larger size = softer shadows",
          "Spot — because of the Blend parameter",
        ],
        answer: 2,
        explanation:
          "Shadow softness is determined by apparent light source size. Area lights are physical surfaces — a 2m area light produces much softer shadows than a 0.1m point.",
      },
      {
        q: "An HDRI in the World settings does what?",
        options: [
          "Adds a background image that doesn't affect lighting",
          "Acts as both environment background and light source — a 360° photograph that illuminates the scene",
          "Only affects viewport display, not renders",
          "Creates a dome mesh around the scene",
        ],
        answer: 1,
        explanation:
          "HDRI (High Dynamic Range Image) provides realistic omnidirectional lighting from a real-world photograph. It's both the background you see and the light that hits your objects.",
      },
      {
        q: "In a 3-point lighting setup, what is the Fill Light for?",
        options: [
          "It fills the frame with light uniformly",
          "It's the primary key light, positioned in front",
          "It softens the harsh shadows created by the key light from the opposite side",
          "It creates a rim highlight on the back edge of the subject",
        ],
        answer: 2,
        explanation:
          "Fill light reduces contrast from the key light. It's placed on the opposite side at lower intensity — typically cool-toned vs a warm key. Without it, shadow areas go completely dark.",
      },
      {
        q: "You rotate a Sun light object in the scene. Its position is 100 units away from the subject. How does this affect the lighting?",
        options: [
          "Moving the sun closer makes it brighter",
          "Position has no effect — only rotation matters for Sun lights",
          "Moving it further makes shadows softer",
          "The sun must be within 10 units to cast shadows",
        ],
        answer: 1,
        explanation:
          "Sun lights simulate a light source at infinite distance. Their rays are perfectly parallel regardless of the object's position in the scene — only rotation determines the light direction.",
      },
    ],
    sections: [
      {
        title: "Light Types and When to Use Each",
        pythonCode: `import bpy
import math

# Add lights via Python
def add_light(name, type, location, energy, color=(1,1,1), size=0.5):
    bpy.ops.object.light_add(type=type, location=location)
    light = bpy.context.active_object
    light.name = name
    light.data.energy = energy
    light.data.color  = color
    if hasattr(light.data, 'shadow_soft_size'):
        light.data.shadow_soft_size = size
    return light

# Point light — omnidirectional bulb
add_light("KeyPoint", 'POINT', (3, -3, 5), energy=500)

# Sun light — parallel rays, position irrelevant, only rotation matters
sun = add_light("Sun", 'SUN', (0, 0, 10), energy=5)
sun.rotation_euler = (math.radians(45), 0, math.radians(30))

# Spot light — cone
spot = add_light("Spot", 'SPOT', (0, -5, 8), energy=1000)
spot.data.spot_size  = math.radians(45)   # cone angle
spot.data.spot_blend = 0.15               # soft edge (0=hard, 1=very soft)

# Area light — rectangular, softest shadows
area = add_light("KeyArea", 'AREA', (4, -2, 6), energy=800, size=2.0)
area.data.shape = 'RECTANGLE'  # 'SQUARE', 'RECTANGLE', 'DISK', 'ELLIPSE'
area.data.size  = 2.0
area.data.size_y = 1.0`,
        content: `**Point Light** — Omnidirectional bulb. Light radiates in all directions from a single point. Candles, bulbs, glowing orbs.

**Sun** — Parallel rays from an infinite distance. Consistent across the entire scene; position doesn't matter, only rotation. Outdoor daylight, large directional light sources. Casts parallel shadows.

**Spot** — Cone of light. Stage lights, flashlights, headlights. Controls: Spot Size (cone angle), Blend (hard vs soft edge).

**Area** — Rectangular or disc light source. Softest shadows, most photorealistic. Simulates windows, softboxes, diffuse panels. Larger = softer shadows. Requires higher power values (500W–5000W typical).

**HDRI (World Environment)** — A 360° photograph used as both background and light source. Instantly realistic environmental lighting. Found in: **World Properties → Surface → Background → Environment Texture**. Download free HDRIs from Poly Haven.`,
      },
      {
        title: "Key Light Settings",
        pythonCode: `import bpy
import math

light = bpy.context.active_object  # must be a light object
ld = light.data  # bpy.types.Light

# Universal settings
ld.energy = 500               # Watts (area lights need much higher)
ld.color  = (1.0, 0.85, 0.7) # warm key light
ld.shadow_soft_size = 1.0    # larger = softer shadows (Point/Sun/Spot)

# 3-point lighting setup via Python
import math

def three_point(subject_location=(0,0,0)):
    # Key light: bright, 45° upper-left
    bpy.ops.object.light_add(type='AREA', location=(4, -3, 5))
    key = bpy.context.active_object
    key.name = "Key"
    key.data.energy = 600
    key.data.size   = 1.5
    key.data.color  = (1.0, 0.9, 0.8)  # warm
    key.rotation_euler = (math.radians(50), 0, math.radians(45))

    # Fill light: soft, opposite side
    bpy.ops.object.light_add(type='AREA', location=(-4, -2, 3))
    fill = bpy.context.active_object
    fill.name = "Fill"
    fill.data.energy = 150
    fill.data.size   = 2.0
    fill.data.color  = (0.8, 0.9, 1.0)  # cool

    # Rim light: behind subject
    bpy.ops.object.light_add(type='AREA', location=(0, 4, 4))
    rim = bpy.context.active_object
    rim.name = "Rim"
    rim.data.energy = 300

three_point()`,
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
In the **Light Properties → Light Linking panel**, specify exactly which objects a light affects. One light can illuminate the subject but not the background. Essential for controlled product and portrait lighting.`,
      },
      {
        title: "HDRI Lighting Setup",
        pythonCode: `import bpy

world = bpy.context.scene.world
world.use_nodes = True
tree = world.node_tree
nodes = tree.nodes
links = tree.links

# Clear default nodes
nodes.clear()

# Build HDRI node graph
bg     = nodes.new('ShaderNodeBackground')
env    = nodes.new('ShaderNodeTexEnvironment')
tex_co = nodes.new('ShaderNodeTexCoord')
mapping = nodes.new('ShaderNodeMapping')
out    = nodes.new('ShaderNodeOutputWorld')

bg.location      = (200,  0)
env.location     = (-100, 0)
mapping.location = (-350, 0)
tex_co.location  = (-550, 0)
out.location     = (400,  0)

# Load HDRI file
env.image = bpy.data.images.load("/path/to/environment.hdr")

# Connect: TexCoord → Mapping → EnvTexture → Background → Output
links.new(tex_co.outputs["Generated"], mapping.inputs["Vector"])
links.new(mapping.outputs["Vector"],   env.inputs["Vector"])
links.new(env.outputs["Color"],        bg.inputs["Color"])
links.new(bg.outputs["Background"],   out.inputs["Surface"])

# Adjust brightness and rotation
bg.inputs["Strength"].default_value = 1.5
mapping.inputs["Rotation"].default_value[2] = 1.5708  # rotate HDRI 90°`,
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

Combining HDRI + additional lights: the HDRI provides ambient/fill, your placed lights add controlled highlights and shadows. Best of both approaches.`,
      },
      {
        title: "🔨 Mini Workshop: Light Your Subject",
        isWorkshop: true,
        pythonCode: `import bpy, math

# Delete all existing lights
bpy.ops.object.select_by_type(type='LIGHT')
bpy.ops.object.delete()

# Key area light
bpy.ops.object.light_add(type='AREA', location=(3, -2, 4))
key = bpy.context.active_object
key.data.energy = 500
key.data.size   = 1.0
key.rotation_euler = (math.radians(55), 0, math.radians(30))

# Fill area light
bpy.ops.object.light_add(type='AREA', location=(-3, -1, 2))
fill = bpy.context.active_object
fill.data.energy = 150
fill.data.size   = 2.0

# Rim light
bpy.ops.object.light_add(type='AREA', location=(0, 3, 3))
rim = bpy.context.active_object
rim.data.energy = 300

# Switch viewport to rendered mode
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        area.spaces[0].shading.type = 'RENDERED'`,
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

✅ Goal: Be able to diagnose why a render looks bad — and fix it with lighting`,
      },
    ],
  },
  {
    id: 10,
    emoji: "🏛️",
    title: "Sculpt Mode",
    tag: "ORGANIC MODELING",
    color: "#34d399",
    intro:
      "Sculpt Mode is digital clay. Push and pull geometry with brushes to create organic forms — characters, creatures, terrain, abstract shapes. The approach to topology here is completely different from Edit Mode.",
    quiz: [
      {
        q: "What is Dyntopo (Dynamic Topology) best used for?",
        options: [
          "Final production sculpts with clean topology",
          "Early exploration — it adds/removes geometry on the fly so you can pull out details without pre-subdividing",
          "Retopologising a sculpt for animation",
          "Baking normal maps",
        ],
        answer: 1,
        explanation:
          "Dyntopo is for messy exploration. It keeps adding triangles wherever you sculpt. The downside is chaotic topology — use it early, then Remesh before fine detail.",
      },
      {
        q: "Which sculpt brush pulls out tendrils of geometry as you drag?",
        options: ["Grab", "Inflate", "Snake Hook", "Elastic Deform"],
        answer: 2,
        explanation:
          "Snake Hook pulls geometry out as you drag, leaving a trail. Ideal for tentacles, horns, tails, and hair locks. Grab moves a chunk of mesh but doesn't elongate it.",
      },
      {
        q: "What does Remesh do to a sculpt?",
        options: [
          "Removes all geometry above a polygon limit",
          "Rebuilds the entire mesh surface with clean, uniform topology",
          "Applies all shape keys and resets the base mesh",
          "Smooths the entire mesh by one level",
        ],
        answer: 1,
        explanation:
          "Remesh discards the existing topology and rebuilds it uniformly — either as voxels or quads. Use it to clean up chaotic Dyntopo topology before adding fine detail with Multires.",
      },
      {
        q: "You want to sculpt fine detail on the face without affecting the body. What's the right tool?",
        options: [
          "Decrease brush size and be careful",
          "Apply a Subdivision Surface modifier first",
          "Paint a Mask on the body to protect it, then sculpt freely on the face",
          "Separate the face into its own object",
        ],
        answer: 2,
        explanation:
          "Masking paints a protected region. Masked vertices are locked — you can sculpt freely on the unmasked face without any risk of accidentally affecting the body.",
      },
    ],
    sections: [
      {
        title: "Topology Approaches for Sculpting",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Add Multiresolution modifier (non-destructive subdivision levels)
mod = obj.modifiers.new("Multires", 'MULTIRES')
# Subdivide 4 times (adds geometry for sculpting)
for _ in range(4):
    bpy.ops.object.multires_subdivide(modifier="Multires", mode='CATMULL_CLARK')

# Check current sculpt level
print(mod.sculpt_levels)   # current sculpt level
print(mod.total_levels)    # total available levels
# Change sculpt level (like moving the slider)
mod.sculpt_levels = 3

# Remesh — rebuild with uniform voxel topology
bpy.ops.object.voxel_remesh()  # uses scene remesh voxel size
obj.data.remesh_voxel_size = 0.01  # smaller = more detail, heavier

# Enable Dyntopo (dynamic topology) in Sculpt Mode
bpy.ops.object.mode_set(mode='SCULPT')
bpy.ops.sculpt.dynamic_topology_toggle()
bpy.context.scene.tool_settings.sculpt.detail_size = 12  # lower = finer detail`,
        content: `Before sculpting, you need enough geometry to work with. Three approaches:

**Dyntopo (Dynamic Topology)** — Blender adds and removes geometry on-the-fly as you sculpt. Enable in the Sculpt header or N panel. Great for early exploration — you can pull out a horn or ear without pre-subdividing. Downsides: chaotic topology, slow at high detail.

**Multires Modifier** — Stacks subdivision levels while keeping the lower levels editable. Add the Multiresolution modifier → Subdivide several times → sculpt at high level → the base form at level 0 is unchanged. Best for production sculpts. Subdivision levels 4–7 for character work.

**Remesh** — Rebuilds the entire mesh with uniform topology. In Sculpt Mode header: **Remesh** with a Voxel Size setting. Use this to re-even topology after Dyntopo gets too messy. Also available as the **Remesh modifier** for non-destructive use.

Typical workflow: rough form with Dyntopo → Remesh to clean topology → Multires for fine detail.`,
      },
      {
        title: "Core Sculpt Brushes",
        pythonCode: `import bpy

# Set the active sculpt brush by name
tool_settings = bpy.context.scene.tool_settings
sculpt = tool_settings.sculpt

# Switch brush (must be in Sculpt Mode)
bpy.ops.object.mode_set(mode='SCULPT')

# Set brush via name — all built-in brushes
bpy.ops.paint.brush_select(sculpt_tool='DRAW')       # Draw
bpy.ops.paint.brush_select(sculpt_tool='CLAY')       # Clay
bpy.ops.paint.brush_select(sculpt_tool='CLAY_STRIPS')
bpy.ops.paint.brush_select(sculpt_tool='SMOOTH')     # Smooth
bpy.ops.paint.brush_select(sculpt_tool='INFLATE')
bpy.ops.paint.brush_select(sculpt_tool='CREASE')
bpy.ops.paint.brush_select(sculpt_tool='PINCH')
bpy.ops.paint.brush_select(sculpt_tool='FLATTEN')
bpy.ops.paint.brush_select(sculpt_tool='GRAB')
bpy.ops.paint.brush_select(sculpt_tool='SNAKE_HOOK')
bpy.ops.paint.brush_select(sculpt_tool='ELASTIC_DEFORM')

# Adjust brush settings on the active brush
brush = tool_settings.sculpt.brush
brush.size          = 50     # radius in pixels (F key drags this)
brush.strength      = 0.5   # 0.0–1.0 (Shift+F drags this)
brush.direction     = 'ADD'  # 'ADD' = push out, 'SUBTRACT' = push in (Ctrl inverts)`,
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
**Ctrl+drag** — Invert brush direction (push → pull)`,
      },
      {
        title: "Masks & Face Sets",
        pythonCode: `import bpy

bpy.ops.object.mode_set(mode='SCULPT')
obj = bpy.context.active_object
mesh = obj.data

# Read sculpt mask values (per vertex, 0=unmasked, 1=fully masked)
if ".sculpt_mask" in mesh.attributes:
    mask_attr = mesh.attributes[".sculpt_mask"]
    for i, val in enumerate(mask_attr.data):
        print(f"vert {i}: mask={val.value:.2f}")

# Flood fill mask operations
bpy.ops.paint.mask_flood_fill(mode='VALUE', value=0.0)   # clear all mask
bpy.ops.paint.mask_flood_fill(mode='VALUE', value=1.0)   # mask everything
bpy.ops.paint.mask_flood_fill(mode='INVERT')             # invert mask

# Face sets — stored as integer attribute ".sculpt_face_set"
if ".sculpt_face_set" in mesh.attributes:
    fs_attr = mesh.attributes[".sculpt_face_set"]
    unique_sets = set(v.value for v in fs_attr.data)
    print(f"Face sets: {unique_sets}")`,
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

Use Face Sets to: isolate a head from a body for sculpting, protect finished areas while working on others, drive procedural effects in Geometry Nodes.`,
      },
      {
        title: "🔨 Mini Workshop: Sculpt a Rock",
        isWorkshop: true,
        pythonCode: `import bpy

# Set up a rock sculpting base
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1)
rock = bpy.context.active_object
rock.name = "Rock"

# Add Multiresolution and subdivide for sculpting
mod = rock.modifiers.new("Multires", 'MULTIRES')
for _ in range(3):
    bpy.ops.object.multires_subdivide(modifier="Multires", mode='CATMULL_CLARK')

# Enter sculpt mode
bpy.ops.object.mode_set(mode='SCULPT')

# Set brush to Grab for rough shaping
bpy.ops.paint.brush_select(sculpt_tool='GRAB')
brush = bpy.context.scene.tool_settings.sculpt.brush
brush.size     = 120
brush.strength = 0.8

# Programmatic sculpting is limited in Python — most sculpting
# is interactive. What you CAN do: drive mesh shape via vertex positions
# before entering sculpt mode.
bpy.ops.object.mode_set(mode='OBJECT')
import random, mathutils
mesh = rock.data
for v in mesh.vertices:
    noise = mathutils.noise.noise(v.co * 2.0)  # built-in Blender noise
    v.co += v.normal * noise * 0.3  # displace along normal

bpy.ops.object.mode_set(mode='SCULPT')`,
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

✅ Goal: Organic results in under 10 minutes. Sculpting is fast once you stop being precious.`,
      },
    ],
  },
  {
    id: 11,
    emoji: "📐",
    title: "Boolean & Hard Surface",
    tag: "PRECISION MODELING",
    color: "#60a5fa",
    intro:
      "Hard surface modeling covers anything manufactured: machines, architecture, vehicles, electronics. The core technique is combining precise primitives using Boolean operations, then refining with bevels and subdivision.",
    quiz: [
      {
        q: "What does a Boolean Difference operation do?",
        options: [
          "Merges two objects into one combined shape",
          "Subtracts the cutter object's volume from the base object",
          "Keeps only the overlapping volume between two objects",
          "Smooths the intersection between two objects",
        ],
        answer: 1,
        explanation:
          "Difference subtracts — like a cookie cutter. The cutter carves its shape out of the base. The cutter object is usually hidden after the operation, keeping the cut live and editable.",
      },
      {
        q: "Why add a Bevel modifier after Booleans on a hard surface object?",
        options: [
          "To fix the topology that Booleans break",
          "To add rounded edge highlights — without them, boolean cuts look unrealistically sharp",
          "To merge the cutter object permanently",
          "Bevel is required for Cycles to render hard edges correctly",
        ],
        answer: 1,
        explanation:
          "Real manufactured objects have micro-bevels on their edges — they catch light and reveal form. A Bevel modifier with Angle Limit adds these highlights procedurally without touching the mesh.",
      },
      {
        q: "What is the purpose of the Weld modifier after a Boolean operation?",
        options: [
          "It merges the cutter and base into one object",
          "It cleans up near-zero-distance duplicate vertices left by the Boolean solver",
          "It smooths the mesh around the boolean cut",
          "It applies the boolean permanently",
        ],
        answer: 1,
        explanation:
          "Boolean operations can leave coincident vertices (two verts in the exact same position) at cut edges. Weld merges vertices within a threshold distance, cleaning up the geometry.",
      },
      {
        q: "In the 'box cutter' hard surface workflow, why are boolean cutters kept hidden rather than deleted?",
        options: [
          "Hidden objects use less memory",
          "Keeping cutters alive means the boolean cut remains editable — move or reshape the cutter later to adjust the cut non-destructively",
          "Blender requires cutters to stay in the scene to render",
          "Deleted cutters would also delete the boolean modifier",
        ],
        answer: 1,
        explanation:
          "This is the core of non-destructive hard surface work. H hides the cutter but the Boolean modifier still references it. You can unhide it later, reshape it, and the cut updates automatically.",
      },
    ],
    sections: [
      {
        title: "Boolean Operations",
        pythonCode: `import bpy

# Boolean: cut a hole in a base object using a cutter
base   = bpy.data.objects["Base"]
cutter = bpy.data.objects["Cutter"]

# Add Boolean modifier to the base
bool_mod = base.modifiers.new("Bool", 'BOOLEAN')
bool_mod.operation = 'DIFFERENCE'   # 'UNION', 'DIFFERENCE', 'INTERSECT'
bool_mod.object    = cutter
bool_mod.solver    = 'EXACT'        # 'EXACT' (accurate) or 'FAST'

# Hide cutter from viewport (cut stays live/non-destructive)
cutter.hide_set(True)
cutter.hide_render = True

# Apply (destructive — burns cut into mesh permanently)
bpy.context.view_layer.objects.active = base
bpy.ops.object.modifier_apply(modifier="Bool")

# After boolean: add Weld to clean up near-zero-distance verts
weld = base.modifiers.new("Weld", 'WELD')
weld.merge_threshold = 0.001`,
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

**Bool Tool addon** (enable in Preferences → Add-ons): adds Ctrl+Minus for quick difference boolean, Ctrl+Plus for union. Faster workflow.`,
      },
      {
        title: "Hard Surface Shading Techniques",
        pythonCode: `import bpy
import bmesh

obj = bpy.context.active_object

# Standard hard surface modifier stack
bev = obj.modifiers.new("Bevel", 'BEVEL')
bev.limit_method  = 'ANGLE'
bev.angle_limit   = 0.5236   # 30° — only bevel sharp edges
bev.width         = 0.02
bev.segments      = 2
bev.profile       = 0.7      # roundness of the bevel profile

sub = obj.modifiers.new("Subdiv", 'SUBSURF')
sub.levels = 2

wn = obj.modifiers.new("WeightedNormal", 'WEIGHTED_NORMAL')
wn.keep_sharp = True

# Mark specific edges with crease (keep sharp through subdivision)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
# Apply crease to selected edges
bpy.ops.transform.edge_crease(value=1.0)  # 1.0 = fully sharp

bpy.ops.object.mode_set(mode='OBJECT')

# Auto Smooth shading (angle threshold)
bpy.ops.object.shade_smooth_by_angle(angle=0.523599)  # 30°`,
        content: `The challenge: subdivision smooths everything, but hard surface objects need both smooth curved areas and sharp mechanical edges.

**The standard hard surface stack:**
1. Model base shape with edge loops placed for control
2. **Bevel modifier** — round all edges above an angle threshold (Limit Method: Angle, ~30°). Use segments: 2–3 for a sharp highlight.
3. **Subdivision Surface modifier** — smooth the curved areas, keep sharp edges beveled
4. **Weighted Normals modifier** — compute normals based on face area. Keeps flat areas shading flat even with micro-bevels.

**Edge Creases (Ctrl+E → Edge Crease in Edit Mode)** — Tell the Subdivision Surface modifier to keep specific edges sharp without beveling them. Good for internal detail you want crisp.

**Bevel Weight** — Per-edge control over how much the Bevel modifier affects each edge. Mark via Ctrl+E → Edge Bevel Weight. Lets you have some edges fully beveled and others untouched.

**Shade Auto Smooth** (Object right-click) — Set a degree threshold. Edges sharper than the threshold show as hard; gentler ones shade smooth. No geometry needed.`,
      },
      {
        title: "The Box Cutter Workflow",
        pythonCode: `import bpy

def add_bool_cut(base, cutter_obj, operation='DIFFERENCE'):
    """Add a live boolean cut. Cutter stays hidden and editable."""
    mod = base.modifiers.new(f"Cut_{cutter_obj.name}", 'BOOLEAN')
    mod.operation = operation
    mod.object    = cutter_obj
    mod.solver    = 'EXACT'
    cutter_obj.hide_set(True)
    cutter_obj.hide_render = True
    return mod

# Build a sci-fi panel via box-cutter approach
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
panel = bpy.context.active_object
panel.scale = (2, 1.5, 0.08)
bpy.ops.object.transform_apply(scale=True)

# Add a recessed panel cut
bpy.ops.mesh.primitive_cube_add(size=0.5, location=(0.3, 0, 0.08))
cut1 = bpy.context.active_object
cut1.scale = (1.2, 0.6, 0.3)
bpy.ops.object.transform_apply(scale=True)
bpy.context.view_layer.objects.active = panel
add_bool_cut(panel, cut1)

# Add circular hole cuts
bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.5, location=(-0.6, 0.4, 0))
cut2 = bpy.context.active_object
bpy.context.view_layer.objects.active = panel
add_bool_cut(panel, cut2)

# Add surface modifier stack
panel.modifiers.new("Bevel", 'BEVEL').limit_method = 'ANGLE'
panel.modifiers.new("Subdiv", 'SUBSURF').levels = 1`,
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
- **MESHmachine** — Edge flow and bevel management after booleans`,
      },
      {
        title: "🔨 Mini Workshop: Sci-Fi Wall Panel",
        isWorkshop: true,
        pythonCode: `import bpy

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Base panel
bpy.ops.mesh.primitive_plane_add(size=3)
panel = bpy.context.active_object
panel.name = "SciFiPanel"

sol = panel.modifiers.new("Solidify", 'SOLIDIFY')
sol.thickness = 0.05

bev = panel.modifiers.new("Bevel", 'BEVEL')
bev.limit_method = 'ANGLE'
bev.width = 0.02; bev.segments = 2

panel.modifiers.new("Subdiv", 'SUBSURF').levels = 1

# Indent cut
bpy.ops.mesh.primitive_cube_add(size=0.8, location=(0, 0, 0.03))
indent = bpy.context.active_object
indent.scale = (2.0, 1.2, 0.1)
bpy.ops.object.transform_apply(scale=True)

bool_mod = panel.modifiers.new("Indent", 'BOOLEAN')
bool_mod.operation = 'DIFFERENCE'
bool_mod.object = indent
indent.hide_set(True)

# Screw hole
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.3, location=(1.1, 0.6, 0))
screw = bpy.context.active_object
for x, y in [(-1.1, 0.6), (1.1, -0.6), (-1.1, -0.6)]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.3, location=(x, y, 0))
    s = bpy.context.active_object
    bool_s = panel.modifiers.new(f"Hole_{x}", 'BOOLEAN')
    bool_s.operation = 'DIFFERENCE'
    bool_s.object = s
    s.hide_set(True)`,
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

✅ Goal: A complex-looking panel built entirely from primitive booleans`,
      },
    ],
  },
  {
    id: 12,
    emoji: "⚡",
    title: "Physics & Simulation",
    tag: "DYNAMICS",
    color: "#fb923c",
    intro:
      "Blender includes several simulation systems for dynamics, fabric, fluids, fire, smoke, and particles. Each is its own domain. Knowing which system handles which problem is the skill.",
    quiz: [
      {
        q: "In Rigid Body simulation, what is a Passive object?",
        options: [
          "An object that moves slowly due to high mass",
          "A static collider — it doesn't move but other active objects bounce off it",
          "An object that absorbs simulation forces without responding",
          "An object that has been baked and can't be changed",
        ],
        answer: 1,
        explanation:
          "Passive rigid bodies are immovable colliders — floors, walls, ramps. Active rigid bodies are dynamically simulated. Every simulation needs at least one passive collider or objects fall forever.",
      },
      {
        q: "What does a Pin Group do in Cloth simulation?",
        options: [
          "Pins the entire cloth to a fixed position",
          "Marks vertices that stay fixed during simulation while the rest simulates freely",
          "Prevents the cloth from self-colliding",
          "Locks the cloth modifier so it can't be changed",
        ],
        answer: 1,
        explanation:
          "Create a vertex group, assign the verts you want fixed (e.g. the top of a tablecloth), then set it as the Pin Group. Those verts won't move — everything else drapes naturally.",
      },
      {
        q: "In Mantaflow, what is the Domain object?",
        options: [
          "The object that emits fluid or smoke",
          "The bounding box that defines where the simulation exists — fluid/smoke cannot leave it",
          "The collision object that fluid bounces off",
          "The camera through which the simulation is rendered",
        ],
        answer: 1,
        explanation:
          "The Domain is the simulation volume. Everything inside it can participate in the sim. Make it large enough to contain the full effect — fluid that reaches the boundary gets clipped.",
      },
      {
        q: "You want fire and smoke. Which Mantaflow domain type and flow type do you use?",
        options: [
          "Domain: Liquid, Flow: Inflow",
          "Domain: Gas, Flow: Fire+Smoke or Fire",
          "Domain: Gas, Flow: Liquid",
          "Domain: Rigid, Flow: Smoke",
        ],
        answer: 1,
        explanation:
          "Gas domain handles volumetric effects — smoke, fire, explosions. Set the Flow object's type to Fire, Smoke, or Fire+Smoke. Liquid domain is for water-like simulations.",
      },
    ],
    sections: [
      {
        title: "Rigid Body Simulation",
        pythonCode: `import bpy

# Make an object a Rigid Body — Active (simulated)
obj = bpy.context.active_object
bpy.ops.rigidbody.object_add()
rb = obj.rigid_body
rb.type         = 'ACTIVE'   # 'ACTIVE' = simulated, 'PASSIVE' = static collider
rb.mass         = 1.0
rb.friction     = 0.5        # 0=frictionless, 1=grippy
rb.restitution  = 0.1        # bounciness (0=dead, 1=perfect bounce)
rb.collision_shape = 'CONVEX_HULL'  # 'BOX','SPHERE','CONVEX_HULL','MESH'

# Make a floor a Passive rigid body (static collider)
bpy.ops.mesh.primitive_plane_add(size=10)
floor = bpy.context.active_object
bpy.ops.rigidbody.object_add()
floor.rigid_body.type = 'PASSIVE'
floor.rigid_body.collision_shape = 'BOX'

# Set up the Rigid Body World
scene = bpy.context.scene
scene.rigidbody_world.enabled = True
scene.rigidbody_world.substeps_per_frame = 10  # accuracy
scene.rigidbody_world.solver_iterations   = 10

# Bake the simulation (cache it)
bpy.ops.ptcache.bake_all(bake=True)`,
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

Use for: falling objects, breaking things, stacking simulations, pinball physics, dominos.`,
      },
      {
        title: "Cloth Simulation",
        pythonCode: `import bpy

cloth_obj = bpy.context.active_object

# Add cloth physics
bpy.ops.object.modifier_add(type='CLOTH')
cloth = cloth_obj.modifiers["Cloth"].settings

# Key cloth settings
cloth.mass              = 0.3     # vertex mass (light=floaty, heavy=stiff)
cloth.tension_stiffness = 15.0   # resist stretching
cloth.compression_stiffness = 15.0
cloth.shear_stiffness   = 5.0    # resist shearing
cloth.bending_stiffness = 0.5    # resist folding (low=silk, high=cardboard)
cloth.use_self_collision = True  # prevent cloth passing through itself

# Pin a vertex group (those verts stay fixed during sim)
# First create a vertex group in Edit Mode and assign top verts to it
cloth.vertex_group_mass = "PinGroup"  # name of the vertex group

# Add Collision physics to objects the cloth should interact with
collider = bpy.data.objects["TableSurface"]
bpy.context.view_layer.objects.active = collider
bpy.ops.object.modifier_add(type='COLLISION')
collider.collision.thickness_outer = 0.01

# Bake
bpy.context.view_layer.objects.active = cloth_obj
bpy.ops.ptcache.bake_all(bake=True)`,
        content: `**Properties → Physics → Cloth** — Simulates fabric: draping, colliding with objects, responding to wind.

Key settings:
- **Vertex Mass** — How heavy the fabric is. Light = floaty, heavy = stiff.
- **Stiffness → Tension/Compression/Shear** — How much the cloth resists stretching and shearing. Low = silky, High = canvas.
- **Bending** — Resistance to folding. Low = silk, High = cardboard.
- **Self Collision** — Prevents cloth from passing through itself (computationally expensive).
- **Collision** — Enable on the objects the cloth should land on (Properties → Physics → Collision).

**Pinning**: Select vertices in Edit Mode → assign to a Vertex Group. In Cloth → Shape → Pin Group, use that group. Those vertices stay fixed while the rest simulates.

Use for: draped tablecloths, clothing on a character, flags, curtains, falling fabric.

**Bake**: Properties → Physics → Cloth → Cache → Bake. Always bake before rendering.`,
      },
      {
        title: "Fluid & Gas Simulation (Mantaflow)",
        pythonCode: `import bpy

# ── LIQUID SETUP ──
# 1. Domain object (the simulation volume)
bpy.ops.mesh.primitive_cube_add(size=3)
domain_obj = bpy.context.active_object
domain_obj.name = "FluidDomain"
bpy.ops.object.modifier_add(type='FLUID')
domain = domain_obj.modifiers["Fluid"].domain_settings
domain.domain_type       = 'LIQUID'
domain.resolution_max    = 64       # higher = more detail, much slower
domain.use_mesh          = True     # generate smooth liquid surface mesh
domain.use_spray         = True     # spray/foam particles

# 2. Flow object (the emitter)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.3, location=(0, 0, 1.2))
emitter = bpy.context.active_object
bpy.ops.object.modifier_add(type='FLUID')
flow = emitter.modifiers["Fluid"].flow_settings
flow.flow_type     = 'LIQUID'
flow.flow_behavior = 'INFLOW'  # continuous source ('INFLOW','OUTFLOW','GEOMETRY')

# ── GAS SETUP ──
bpy.ops.mesh.primitive_cube_add(size=3)
gas_domain = bpy.context.active_object
bpy.ops.object.modifier_add(type='FLUID')
gd = gas_domain.modifiers["Fluid"].domain_settings
gd.domain_type  = 'GAS'
gd.vorticity    = 0.1    # turbulence/swirling
gd.use_noise    = True   # high-detail noise

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, location=(0,0,0))
gas_src = bpy.context.active_object
bpy.ops.object.modifier_add(type='FLUID')
gf = gas_src.modifiers["Fluid"].flow_settings
gf.flow_type     = 'FIRE'  # 'SMOKE','FIRE','BOTH','LIQUID'
gf.flow_behavior = 'INFLOW'`,
        content: `Blender uses **Mantaflow** for both liquid and gas (smoke/fire) simulations. Both use a **Domain** object + **Flow** objects + optional **Effectors**.

Setup:
1. Create a box → **Properties → Physics → Fluid → Domain** (this is the simulation volume)
2. Create the source (emitter) → **Properties → Physics → Fluid → Flow**
3. Set Domain type: **Liquid** or **Gas**

**Liquid (water)**: Resolution determines quality (64–128 for preview, 256+ for final). Enable **Mesh** in Domain settings for a smooth liquid surface. Add **Diffuse** particles for spray/foam.

**Gas (fire/smoke)**: Set Flow type to Fire+Smoke or just Smoke. Add a **Vorticity** value for turbulent, swirling smoke. Use the **Noise modifier** (in Domain settings) for fine detail. Render smoke with **Cycles** for best results (volumetric rendering).

**Effectors**: objects that redirect fluid flow (obstacles). Add them via Physics → Fluid → Effector.

Cache and bake before rendering. Gas sims especially benefit from baking to disk.`,
      },
      {
        title: "Particles, Hair & Force Fields",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Add a particle system
bpy.ops.object.particle_system_add()
ps = obj.particle_systems[-1]
settings = ps.settings

# Emitter particle settings
settings.type            = 'EMITTER'  # or 'HAIR'
settings.count           = 1000
settings.frame_start     = 1
settings.frame_end       = 50
settings.lifetime        = 80        # frames each particle lives
settings.normal_factor   = 2.0       # initial velocity along normal
settings.factor_random   = 0.5       # velocity randomness

# Physics
settings.physics_type    = 'NEWTON'  # 'NEWTON','KEYED','BOIDS','FLUID'
settings.use_self_effect = False
settings.drag_factor     = 0.0

# Render particles as an instanced object
settings.render_type  = 'OBJECT'
settings.instance_object = bpy.data.objects["Debris"]

# Force Fields — create wind
bpy.ops.object.effector_add(type='WIND', location=(0, -3, 1))
wind = bpy.context.active_object
wind.field.strength   = 5.0
wind.field.flow       = 1.0

# Turbulence
bpy.ops.object.effector_add(type='TURBULENCE', location=(0, 0, 2))
turb = bpy.context.active_object
turb.field.strength = 2.0
turb.field.size     = 1.0`,
        content: `**Properties → Particles → Add** — Particle systems for emission and hair.

**Emitter particles**: Objects born at a surface, move through space, die.
- **Emission**: count, start/end frame, lifetime
- **Physics**: Newtonian (gravity, drag), Keyed (follow another particle), Boids (flocking AI)
- **Render**: render as Object, Collection, or geometry (dots, halos)

**Hair particles** (legacy): generate strands from a surface. Controlled with Particle Edit mode. The **new hair system** uses Geometry Nodes (see Module 7) and is preferred in Blender 4.x+.

**Force Fields** (Shift+A → Force Field):
- **Wind** — Constant directional push
- **Turbulence** — Random chaotic movement
- **Vortex** — Spiral/spinning force
- **Magnetic** — Attract/repel based on particle charge
- **Gravity / Force** — Point gravity well or constant force

Force fields affect particles, cloth, soft body, and rigid bodies. Layer multiple fields for complex motion.

**Soft Body** (Physics → Soft Body): elastic, bouncy deformation. Objects squish and jiggle. Use for bouncy logos, jello, organic squash and stretch.`,
      },
      {
        title: "🔨 Mini Workshop: Falling Cubes",
        isWorkshop: true,
        pythonCode: `import bpy
import random

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Floor (passive)
bpy.ops.mesh.primitive_plane_add(size=8)
floor = bpy.context.active_object
bpy.ops.rigidbody.object_add()
floor.rigid_body.type = 'PASSIVE'

# Spawn cubes with random positions
for i in range(10):
    x = random.uniform(-1.5, 1.5)
    y = random.uniform(-1.5, 1.5)
    z = random.uniform(2.0, 6.0)
    bpy.ops.mesh.primitive_cube_add(size=0.4, location=(x, y, z))
    cube = bpy.context.active_object
    cube.name = f"FallingCube_{i}"
    bpy.ops.rigidbody.object_add()
    cube.rigid_body.type        = 'ACTIVE'
    cube.rigid_body.restitution = 0.3
    cube.rigid_body.friction    = 0.6

# Ensure rigid body world exists
bpy.context.scene.rigidbody_world.enabled = True

# Add wind field
bpy.ops.object.effector_add(type='WIND', location=(0, -4, 2))
wind = bpy.context.active_object
wind.field.strength = 3.0
wind.rotation_euler[0] = 1.5708  # point sideways`,
        content: `The quickest way to see simulation working:

1. **Shift+A → Plane** — scale large (S → 5). **Properties → Physics → Rigid Body → Passive** (this is the floor).
2. **Shift+A → Cube** — position 3 units above the plane. **Physics → Rigid Body → Active**.
3. Duplicate the cube (Shift+D) 5–10 times, scatter randomly above the plane at different heights.
4. Press **Space** (or the play button in the Timeline) — the cubes fall and pile up.
5. Try: change Bounciness on a cube to 0.8 and watch it bounce.
6. Add **Shift+A → Force Field → Wind** — point it sideways. The cubes now drift.

✅ Goal: See that simulation is a system of parameters — not keyframes — and understand how to compose it`,
      },
    ],
  },
  {
    id: 13,
    emoji: "🎬",
    title: "Rendering",
    tag: "OUTPUT",
    color: "#a78bfa",
    intro:
      "Rendering converts your 3D scene into a final image or animation. Blender 5.1 has two main renderers: Cycles (path-traced, physically accurate) and EEVEE Next (real-time path-traced, dramatically faster). Knowing when to use each is the key decision.",
    quiz: [
      {
        q: "Your scene has light focusing through a glass lens creating a caustic pattern on the table. Which renderer handles this correctly?",
        options: [
          "EEVEE Next — it's faster so it can compute more effects",
          "Cycles — it physically traces light rays, including caustics",
          "Workbench — it's designed for optical effects",
          "Both render caustics identically",
        ],
        answer: 1,
        explanation:
          "Caustics require physically tracing light rays through refractive/reflective surfaces — something only path tracers like Cycles do correctly. EEVEE Next approximates many effects but not true caustics.",
      },
      {
        q: "What does enabling Denoising in Cycles allow you to do?",
        options: [
          "Render at full quality with zero noise regardless of sample count",
          "Use far fewer samples while still getting a clean result — AI removes remaining noise",
          "Denoise the audio track of an animation",
          "Remove compression artifacts from imported image textures",
        ],
        answer: 1,
        explanation:
          "Denoising (OIDN or OptiX) is a trained model that removes Monte Carlo noise from low-sample Cycles renders. 64 samples + denoising can rival 512 samples without it.",
      },
      {
        q: "You're rendering an animation of a motion graphic logo. Speed matters more than caustics. Which engine?",
        options: [
          "Cycles — it's the only production-quality renderer",
          "EEVEE Next — near-instant frames, still high quality for motion graphics",
          "Workbench — designed for animation",
          "They take the same time for animations",
        ],
        answer: 1,
        explanation:
          "EEVEE Next is a real-time path-traced renderer — frame times are orders of magnitude faster than Cycles for animation. For motion graphics, stylised work, and non-caustics scenes, it's the right choice.",
      },
      {
        q: "What is the Compositor in Blender used for?",
        options: [
          "Compositing multiple .blend files into one scene",
          "A node-based post-processing graph that runs on 2D rendered images — color grading, glare, depth of field, combining render passes",
          "Real-time mixing of audio and video tracks",
          "Merging multiple materials into one shader",
        ],
        answer: 1,
        explanation:
          "The Compositor processes rendered images as 2D data using nodes. It runs after the render and can apply color grading, bloom, lens effects, and combine separate render passes into a final image.",
      },
    ],
    sections: [
      {
        title: "Cycles vs EEVEE Next — When to Use Each",
        pythonCode: `import bpy

scene = bpy.context.scene

# Switch engine
scene.render.engine = 'CYCLES'             # path-traced
scene.render.engine = 'BLENDER_EEVEE_NEXT' # real-time path-traced
scene.render.engine = 'BLENDER_WORKBENCH'  # clay/technical

# Cycles: GPU on Apple Metal (Mac)
prefs = bpy.context.preferences
cprefs = prefs.addons['cycles'].preferences
cprefs.compute_device_type = 'METAL'
cprefs.get_devices()
for d in cprefs.devices: d.use = True
scene.cycles.device = 'GPU'

# Cycles: samples + denoising
scene.cycles.samples = 256
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPENIMAGEDENOISE'

# EEVEE Next
eevee = scene.eevee
eevee.taa_render_samples = 64
eevee.use_gtao            = True  # ambient occlusion
eevee.use_bloom           = True  # glow/bloom effect
eevee.use_ssr             = True  # screen space reflections

# Print current engine
print(f"Active engine: {scene.render.engine}")`,
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

In Blender 5.1, for most non-caustics work, EEVEE Next produces competitive results to Cycles at a fraction of the time.`,
      },
      {
        title: "Key Render Settings",
        pythonCode: `import bpy

scene = bpy.context.scene
render = scene.render

# Resolution
render.resolution_x          = 1920
render.resolution_y          = 1080
render.resolution_percentage = 100   # 50% = half resolution (fast preview)

# Frame range and FPS
scene.frame_start = 1
scene.frame_end   = 250
render.fps        = 24   # 24=film, 30=NTSC/web, 60=game

# Output
render.filepath      = "//renders/frame_"   # // = relative to .blend file
render.image_settings.file_format = 'PNG'   # 'PNG','JPEG','OPEN_EXR_MULTILAYER'
render.image_settings.color_depth = '16'    # bit depth for PNG/EXR

# Render a single frame
bpy.ops.render.render(write_still=True)     # F12 equivalent

# Render animation (all frames in range)
bpy.ops.render.render(animation=True)       # Ctrl+F12 equivalent

# Open last render in Image Editor
bpy.ops.render.view_show()                  # F11 equivalent`,
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
**F11** — Show last rendered image`,
      },
      {
        title: "Render Passes & the Compositor",
        pythonCode: `import bpy

# Enable render passes on the View Layer
vl = bpy.context.scene.view_layers["ViewLayer"]
vl.use_pass_diffuse_color   = True
vl.use_pass_shadow          = True
vl.use_pass_z               = True    # depth pass
vl.use_pass_normal          = True
vl.use_pass_combined        = True    # always on (the final beauty)

# Output to OpenEXR Multilayer (preserves all passes in one file)
render = bpy.context.scene.render
render.image_settings.file_format  = 'OPEN_EXR_MULTILAYER'
render.image_settings.color_depth  = '32'
render.image_settings.exr_codec    = 'ZIP'

# Access compositor nodes via Python
scene = bpy.context.scene
scene.use_nodes = True
tree  = scene.node_tree
nodes = tree.nodes
links = tree.links

nodes.clear()

rl  = nodes.new('CompositorNodeRLayers');    rl.location  = (-400, 0)
cb  = nodes.new('CompositorNodeColorBalance'); cb.location = (0,   0)
glare = nodes.new('CompositorNodeGlare');    glare.location = (250, 0)
comp = nodes.new('CompositorNodeComposite'); comp.location  = (500, 0)

glare.glare_type = 'BLOOM'
glare.threshold  = 0.8
glare.size       = 6

links.new(rl.outputs["Image"], cb.inputs["Image"])
links.new(cb.outputs["Image"], glare.inputs["Image"])
links.new(glare.outputs["Image"], comp.inputs["Image"])`,
        content: `Instead of rendering a single flat image, Blender can output **render passes**: separate layers for shadows, reflections, diffuse, specular, depth, normals, etc.

Enable passes: **View Layer Properties → Passes** — check what you need.

Output to **OpenEXR Multilayer** format to preserve all passes in one file.

**The Compositor** (Workspace → Compositing tab or open Compositor editor):
- A node graph for post-processing rendered images
- Runs after the render, on the 2D image
- Key nodes: **Render Layers** (your passes as input), **Color Balance**, **Glare** (bloom/streaks/glow), **Lens Distortion**, **Blur**, **Mix**, **Vignette** (using Ellipse Mask)
- Can combine multiple render layers, apply color grading, add depth of field, all non-destructively

**Viewport Compositor** (Blender 4.x+): apply compositor effects live in the 3D viewport. Instant visual feedback without a full render.

The Compositor is what separates a raw render from a finished image.`,
      },
      {
        title: "Camera Settings That Matter",
        pythonCode: `import bpy

if "Camera" not in bpy.data.objects:
    bpy.ops.object.camera_add(location=(7, -7, 5))
cam_obj  = bpy.data.objects["Camera"]
cam_data = cam_obj.data  # bpy.types.Camera

# Focal length — controls zoom and perspective distortion
cam_data.lens      = 85.0    # mm: 24=wide, 50=normal, 85=portrait, 135=telephoto
cam_data.lens_unit = 'MILLIMETERS'  # or 'FOV'

# Sensor size (full frame = 36mm, affects DoF and perspective)
cam_data.sensor_width = 36.0
cam_data.sensor_fit   = 'AUTO'

# Depth of Field
cam_data.dof.use_dof        = True
cam_data.dof.focus_object   = bpy.data.objects["Subject"]
cam_data.dof.aperture_fstop = 2.8   # lower = shallower DoF / more blur

# Camera type
cam_data.type = 'PERSP'    # 'PERSP', 'ORTHO', 'PANO'

# Panoramic (360° VR render)
cam_data.type = 'PANO'
cam_data.panorama_type = 'EQUIRECTANGULAR'

# Clip range (relevant for very large/small scenes)
cam_data.clip_start = 0.1
cam_data.clip_end   = 1000.0

# Set as active scene camera
bpy.context.scene.camera = cam_obj`,
        content: `Select the camera → **Object Data Properties (🎬 camera icon)**:

- **Focal Length** — Longer = telephoto (compressed perspective, good for portraits). Shorter = wide angle (distorted, dramatic). 50mm ≈ human eye. 85–135mm = portrait. 24mm = wide architectural.
- **Sensor Size** — Affects depth of field and perspective. Full Frame (36mm) is the default.
- **Depth of Field → F-Stop** — Lower = more blur (shallow depth of field). Higher = everything sharp. Enable DoF, set Focus Object or Distance.
- **Clip Start/End** — The near and far range where Blender renders. Adjust for very small or very large scenes.
- **Camera Type** — Perspective (default), Orthographic (no perspective, technical drawings), Panoramic (360° equirectangular for VR).

**Numpad 0** — Enter camera view
**N → View → Lock Camera to View** — Navigate freely and the camera follows. Disable when done.
**Ctrl+Alt+0** — Snap the camera to current viewport.`,
      },
      {
        title: "🔨 Mini Workshop: First Beauty Render",
        isWorkshop: true,
        pythonCode: `import bpy, math

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples       = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser      = 'OPENIMAGEDENOISE'

# HDRI world
world = scene.world
world.use_nodes = True
tree  = world.node_tree
tree.nodes.clear()
bg  = tree.nodes.new('ShaderNodeBackground')
env = tree.nodes.new('ShaderNodeTexEnvironment')
out = tree.nodes.new('ShaderNodeOutputWorld')
env.image = bpy.data.images.load("/path/to/studio.hdr")
bg.inputs["Strength"].default_value = 1.2
tree.links.new(env.outputs["Color"], bg.inputs["Color"])
tree.links.new(bg.outputs["Background"], out.inputs["Surface"])

# Shadow catcher floor
bpy.ops.mesh.primitive_plane_add(size=10)
floor = bpy.context.active_object
mat   = bpy.data.materials.new("ShadowCatcher")
mat.use_nodes       = True
mat.shadow_method   = 'OPAQUE'
floor.data.materials.append(mat)
floor.is_shadow_catcher = True  # Cycles shadow catcher

# Render
scene.render.filepath = "//beauty_render"
scene.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(write_still=True)`,
        content: `Take any object and render it in a way you'd actually want to show someone:

1. Switch to **Cycles** in Render Properties
2. Samples: 128, enable **Denoising** (OpenImageDenoise)
3. **World Properties → Environment Texture** — load any HDRI
4. **Shift+A → Mesh → Plane** — large plane below object as floor. Add material → enable **Shadow Catcher** (Material → Settings → Shadow Mode: Shadow Catcher) — floor shows only shadows, not itself.
5. **Numpad 0** — camera view. Press N → View → Lock Camera to View, navigate to a good angle.
6. **F12** — render.

Experiment: switch the same setup to EEVEE Next. Compare quality vs render time.

✅ Goal: A render you'd show someone — with shadows, environment, proper camera`,
      },
    ],
  },
  {
    id: 14,
    emoji: "🌊",
    title: "Procedural Textures",
    tag: "ADVANCED SHADING",
    color: "#818cf8",
    intro:
      "Procedural textures are generated mathematically — no image files, infinite resolution, no tiling, fully animatable. Combined with the Shader Editor, they can describe almost any surface.",
    quiz: [
      {
        q: "What does a ColorRamp node do?",
        options: [
          "Changes the hue of a texture by rotating the color wheel",
          "Remaps a grayscale 0–1 value to any set of colors or values you define",
          "Converts a color texture to black and white",
          "Blends two color inputs together equally",
        ],
        answer: 1,
        explanation:
          "ColorRamp takes a single grayscale input (like Noise Texture's Fac output) and maps it to any gradient of colors you define. It's the bridge between procedural noise and meaningful color variation.",
      },
      {
        q: "Which texture node creates cell-like patterns — useful for cracked earth, skin pores, or ceramic tiles?",
        options: [
          "Noise Texture",
          "Wave Texture",
          "Voronoi Texture",
          "Magic Texture",
        ],
        answer: 2,
        explanation:
          "Voronoi Texture creates cell-based patterns. 'Distance to Edge' mode gives sharp cracked lines between cells. Smooth F1 gives soft cellular blobs. Randomness controls how irregular the cells are.",
      },
      {
        q: "What is the difference between a Bump node and a Displacement node?",
        options: [
          "Bump is for organic surfaces, Displacement is for hard surfaces",
          "Bump fakes surface detail by changing how light hits without moving geometry; Displacement actually moves vertices",
          "Bump works in EEVEE, Displacement only in Cycles",
          "They are identical — just named differently for historical reasons",
        ],
        answer: 1,
        explanation:
          "Bump is cheap — it tricks the lighting system into seeing detail that isn't geometrically there. Displacement is expensive and real — it requires enough geometry to actually move. Enable Displacement: Both in material settings for Cycles.",
      },
      {
        q: "You want a wood grain texture. Which node produces the underlying stripe/ring pattern?",
        options: [
          "Noise Texture with high Detail",
          "Voronoi in Distance to Edge mode",
          "Wave Texture in Rings or Bands mode, with Distortion added",
          "Musgrave with FBM type",
        ],
        answer: 2,
        explanation:
          "Wave Texture creates concentric rings or parallel bands — the natural structure of wood grain. Add Distortion to break up the regularity, and a ColorRamp to map it to realistic wood colours.",
      },
    ],
    sections: [
      {
        title: "Core Texture Nodes",
        pythonCode: `import bpy

mat  = bpy.context.active_object.active_material
tree = mat.node_tree
n    = tree.nodes

# Noise Texture
noise = n.new('ShaderNodeTexNoise')
noise.inputs["Scale"].default_value      = 5.0
noise.inputs["Detail"].default_value     = 8.0
noise.inputs["Roughness"].default_value  = 0.6
noise.inputs["Distortion"].default_value = 0.0
# Outputs: "Fac" (0-1 grayscale), "Color"

# Voronoi Texture
vor = n.new('ShaderNodeTexVoronoi')
vor.voronoi_dimensions = '3D'
vor.feature            = 'F1'         # 'F1','F2','SMOOTH_F1','DISTANCE_TO_EDGE','N_SPHERE_RADIUS'
vor.distance           = 'EUCLIDEAN'  # 'EUCLIDEAN','MANHATTAN','CHEBYCHEV','MINKOWSKI'
vor.inputs["Scale"].default_value      = 10.0
vor.inputs["Randomness"].default_value = 1.0

# Wave Texture
wave = n.new('ShaderNodeTexWave')
wave.wave_type       = 'RINGS'    # 'BANDS' or 'RINGS'
wave.bands_direction = 'X'
wave.inputs["Scale"].default_value      = 5.0
wave.inputs["Distortion"].default_value = 2.0  # wood grain effect

# Musgrave Texture
musg = n.new('ShaderNodeTexMusgrave')
musg.musgrave_dimensions = '3D'
musg.musgrave_type       = 'FBM'   # 'FBM','MULTIFRACTAL','HYBRID_MULTIFRACTAL',etc.
musg.inputs["Scale"].default_value  = 3.0
musg.inputs["Detail"].default_value = 8.0`,
        content: `All found via **Shift+A → Texture** in the Shader Editor:

**Noise Texture** — The fundamental organic texture. Parameters: Scale (zoom level), Detail (complexity layers), Roughness (sharpness of detail), Distortion (warp the noise itself). The foundation of most procedural materials.

**Voronoi Texture** — Cell-based patterns. Distance to Edge mode = cracked earth, ceramic, skin pores. Smooth F1 = soft cellular blobs. Randomness controls how regular the cells are.

**Wave Texture** — Concentric rings or parallel stripes. Bands vs Rings type. Add Distortion for wood grain. Phase Offset can animate it.

**Musgrave Texture** — Fractal noise with more layers and control than basic Noise. Great for terrain height maps, cloud patterns.

**Magic Texture** — Colorful, swirling psychedelic patterns. Depth and Distortion controls. Underrated for abstract surfaces and trippy effects.

**Brick Texture** — Procedural bricks with mortar. Control width, height, offset, mortar size. Can mix with other textures for realistic variation.

**Gradient Texture** — Simple linear/radial/spherical gradient. Often used as a factor for mixing or masking.`,
      },
      {
        title: "Connecting Textures to Materials",
        pythonCode: `import bpy

mat  = bpy.context.active_object.active_material
tree = mat.node_tree
n, l = tree.nodes, tree.links
bsdf = n["Principled BSDF"]

# ColorRamp — remap noise (0-1) to any colors
noise = n.new('ShaderNodeTexNoise'); noise.location = (-500, 200)
noise.inputs["Scale"].default_value = 6.0
ramp  = n.new('ShaderNodeValToRGB'); ramp.location  = (-200, 200)
# Set ramp colors (rock: grey/brown)
ramp.color_ramp.elements[0].color = (0.15, 0.12, 0.10, 1)
ramp.color_ramp.elements[1].color = (0.55, 0.50, 0.45, 1)
l.new(noise.outputs["Fac"], ramp.inputs["Fac"])
l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])

# Bump node — fake surface detail without moving geometry
bump = n.new('ShaderNodeBump'); bump.location = (-200, -100)
bump.inputs["Strength"].default_value = 0.5
l.new(noise.outputs["Fac"], bump.inputs["Height"])
l.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# Map Range — remap texture output to a numeric input range
mr = n.new('ShaderNodeMapRange'); mr.location = (-200, 0)
mr.inputs["From Min"].default_value = 0.0
mr.inputs["From Max"].default_value = 1.0
mr.inputs["To Min"].default_value   = 0.3   # roughness min
mr.inputs["To Max"].default_value   = 0.9   # roughness max
l.new(noise.outputs["Fac"], mr.inputs["Value"])
l.new(mr.outputs["Result"], bsdf.inputs["Roughness"])

# Texture Coordinate + Mapping (control how texture projects)
tc  = n.new('ShaderNodeTexCoord'); tc.location  = (-900, 0)
mp  = n.new('ShaderNodeMapping');  mp.location  = (-700, 0)
mp.inputs["Scale"].default_value = (2.0, 2.0, 2.0)
l.new(tc.outputs["Object"], mp.inputs["Vector"])
l.new(mp.outputs["Vector"], noise.inputs["Vector"])`,
        content: `The key connectors between textures and the Principled BSDF:

**ColorRamp** — Remap any grayscale value (0–1) to any set of colors. The most versatile node. Plug Noise → ColorRamp → Base Color for instant rock/lava/organic color.

**Bump node** — Simulate surface detail from a height map without moving geometry. Fast, works in Cycles and EEVEE. Height → Bump → Normal input.

**Displacement node** — Actually moves vertices based on texture (requires Cycles + Material → Settings → Displacement: Both). Much more expensive than Bump but geometrically correct.

**Mix node** — Blend two colors/textures by a Factor. Use another texture as the Factor for organic blending (e.g., blend clean grass and muddy grass by a Noise-driven mask).

**Texture Coordinate + Mapping** — Always pair these when using procedural textures. Texture Coordinate (Object) + Mapping (translate/rotate/scale) controls how the texture maps to the surface. Object coordinates mean the texture moves with the object — useful for predictable results.

**Math / Map Range** — Transform the 0–1 output of a texture into any numeric range. Essential for routing texture outputs to non-color inputs like Roughness, Metallic, Emission Strength.`,
      },
      {
        title: "Procedural Material Recipes",
        pythonCode: `import bpy

def new_mat(name, obj):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    obj.data.materials.append(mat)
    return mat, mat.node_tree

obj  = bpy.context.active_object
mat, tree = new_mat("Rock", obj)
n, l = tree.nodes, tree.links
bsdf = n["Principled BSDF"]

# ── ROCK ──
noise = n.new('ShaderNodeTexNoise')
noise.inputs["Scale"].default_value = 6.0; noise.inputs["Detail"].default_value = 8.0
ramp  = n.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color = (0.15, 0.12, 0.10, 1)
ramp.color_ramp.elements[1].color = (0.55, 0.50, 0.45, 1)
bump  = n.new('ShaderNodeBump'); bump.inputs["Strength"].default_value = 0.4
l.new(noise.outputs["Fac"], ramp.inputs["Fac"])
l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
l.new(noise.outputs["Fac"], bump.inputs["Height"])
l.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# ── WOOD GRAIN ──
# wave = n.new('ShaderNodeTexWave')
# wave.wave_type = 'RINGS'; wave.inputs["Distortion"].default_value = 2.0
# ramp2 = n.new('ShaderNodeValToRGB')
# ramp2.color_ramp.elements[0].color = (0.35, 0.18, 0.06, 1)  # dark wood
# ramp2.color_ramp.elements[1].color = (0.75, 0.50, 0.25, 1)  # light wood
# l.new(wave.outputs["Fac"], ramp2.inputs["Fac"])
# l.new(ramp2.outputs["Color"], bsdf.inputs["Base Color"])

# ── LAVA ──
# noise2 = n.new('ShaderNodeTexNoise'); noise2.inputs["Scale"].default_value = 4.0
# ramp3  = n.new('ShaderNodeValToRGB')
# ramp3.color_ramp.elements[0].color = (0.0, 0.0, 0.0, 1)     # cooled
# ramp3.color_ramp.elements[1].color = (1.0, 0.3, 0.0, 1)     # molten crack
# emit   = n.new('ShaderNodeEmission'); emit.inputs["Strength"].default_value = 5.0
# l.new(noise2.outputs["Fac"], ramp3.inputs["Fac"])
# l.new(ramp3.outputs["Color"], bsdf.inputs["Base Color"])
# l.new(ramp3.outputs["Color"], emit.inputs["Color"])`,
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
→ Transmission 1, Roughness 0.1, IOR 1.33, blue-tinted Base Color`,
      },
      {
        title: "🔨 Mini Workshop: Procedural Planet",
        isWorkshop: true,
        pythonCode: `import bpy

# Create planet mesh
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1)
planet = bpy.context.active_object
planet.name = "Planet"
bpy.ops.object.shade_smooth()

# Create material
mat = bpy.data.materials.new("PlanetMat")
mat.use_nodes = True
planet.data.materials.append(mat)
tree = mat.node_tree
n, l = tree.nodes, tree.links
n.clear()

bsdf = n.new('ShaderNodeBsdfPrincipled'); bsdf.location = (0, 0)
out  = n.new('ShaderNodeOutputMaterial'); out.location  = (300, 0)
l.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

# Noise → ColorRamp → Base Color (ocean/land/mountain bands)
noise = n.new('ShaderNodeTexNoise'); noise.location = (-700, 100)
noise.inputs["Scale"].default_value     = 5.0
noise.inputs["Detail"].default_value    = 8.0
noise.inputs["Roughness"].default_value = 0.6

ramp = n.new('ShaderNodeValToRGB'); ramp.location = (-400, 100)
cr   = ramp.color_ramp
cr.elements[0].position = 0.0;  cr.elements[0].color = (0.0, 0.1, 0.6, 1)   # deep ocean
cr.elements.new(0.45);          cr.color_ramp.elements[1].color = (0.1, 0.4, 0.8, 1) # shallow
cr.elements.new(0.5);           cr.color_ramp.elements[2].color = (0.8, 0.7, 0.4, 1) # sand
cr.elements.new(0.6);           cr.color_ramp.elements[3].color = (0.2, 0.5, 0.1, 1) # land
cr.elements[1].position = 1.0;  cr.color_ramp.elements[-1].color = (1.0, 1.0, 1.0, 1) # snow

l.new(noise.outputs["Fac"],    ramp.inputs["Fac"])
l.new(ramp.outputs["Color"],   bsdf.inputs["Base Color"])

# Atmosphere: Fresnel-driven emission rim
fres = n.new('ShaderNodeFresnel');   fres.location  = (-400, -200)
fres.inputs["IOR"].default_value = 1.3
emit = n.new('ShaderNodeEmission');  emit.location  = (-100, -200)
emit.inputs["Color"].default_value   = (0.4, 0.7, 1.0, 1)
emit.inputs["Strength"].default_value = 2.0
mix  = n.new('ShaderNodeMixShader'); mix.location   = (200, -100)
l.new(fres.outputs["Fac"],  mix.inputs["Fac"])
l.new(bsdf.outputs["BSDF"], mix.inputs[1])
l.new(emit.outputs["Emission"], mix.inputs[2])
l.new(mix.outputs["Shader"], out.inputs["Surface"])

# Animate surface: keyframe noise W offset
noise.inputs["W"].default_value = 0.0
noise.inputs["W"].keyframe_insert("default_value", frame=1)
noise.inputs["W"].default_value = 5.0
noise.inputs["W"].keyframe_insert("default_value", frame=250)`,
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

✅ Goal: A convincing planet with atmosphere, zero image files, and an animated surface`,
      },
    ],
  },
];

const outcomes = [
  {
    category: "Shape & Form",
    items: [
      {
        goal: "Organic creature or character",
        approach:
          "Sculpt Mode (Dyntopo for exploration → Remesh → Multires for detail). Retopologize with Shrinkwrap modifier.",
        tools: [
          "Sculpt Mode",
          "Multiresolution",
          "Remesh",
          "Shrinkwrap modifier",
        ],
      },
      {
        goal: "Hard surface / mechanical object",
        approach:
          "Edit Mode box-modeling + Boolean modifier for cuts + Bevel modifier for edge highlights + Subdivision Surface.",
        tools: [
          "Edit Mode",
          "Boolean modifier",
          "Bevel modifier",
          "Subdivision Surface",
        ],
      },
      {
        goal: "Terrain or landscape",
        approach:
          "Grid + Displace modifier with Musgrave/Noise texture. Or Geometry Nodes with noise-driven height.",
        tools: [
          "Grid",
          "Displace modifier",
          "Geometry Nodes",
          "Musgrave Texture",
        ],
      },
      {
        goal: "Repeated / instanced objects (forest, crowd, bricks)",
        approach:
          "Geometry Nodes: Distribute Points on Faces → Instance on Points. Near-zero memory cost.",
        tools: [
          "Geometry Nodes",
          "Instance on Points",
          "Distribute Points on Faces",
        ],
      },
      {
        goal: "Rope, cable, pipe following a path",
        approach:
          "Bezier curve for the path + cylinder with Curve modifier following it. Or GN with Curve to Mesh.",
        tools: ["Bezier Curve", "Curve modifier", "Geometry Nodes"],
      },
      {
        goal: "Symmetrical model",
        approach:
          "Model one half in Edit Mode with Mirror modifier (Clipping on). Apply modifier to merge when done.",
        tools: ["Mirror modifier", "Edit Mode"],
      },
      {
        goal: "Vase, bottle, column (revolved profile)",
        approach:
          "Draw the profile as a curve or mesh → Screw modifier revolves it around an axis.",
        tools: ["Screw modifier", "Curve"],
      },
      {
        goal: "Hair, fur, feathers",
        approach:
          "New Hair system (Geometry Nodes based): Add → Curve → Empty Hair. Style with hair sculpt brushes.",
        tools: ["Hair Curves", "Geometry Nodes", "Particle Edit"],
      },
    ],
  },
  {
    category: "Surface & Appearance",
    items: [
      {
        goal: "Photorealistic material (metal, glass, skin)",
        approach:
          "Principled BSDF with correct Metallic/Roughness/IOR values. Add Noise-driven Roughness variation for realism.",
        tools: ["Principled BSDF", "Shader Editor", "Noise Texture"],
      },
      {
        goal: "Procedural texture (no image files)",
        approach:
          "Shader Editor: Noise/Voronoi/Wave → ColorRamp → Principled BSDF inputs.",
        tools: ["Noise Texture", "Voronoi Texture", "ColorRamp"],
      },
      {
        goal: "Worn, aged, or dirt-layered surface",
        approach:
          "Two material layers (clean + worn) mixed by a procedural mask. Pointiness from Geometry node for edge wear.",
        tools: ["Shader Editor", "Mix Shader", "Geometry node (Pointiness)"],
      },
      {
        goal: "Animated texture / dissolve effect",
        approach:
          "Drive a ColorRamp or Mix Factor with a Noise Texture that animates over time (keyframe the W offset).",
        tools: ["ColorRamp", "Noise Texture", "Drivers"],
      },
    ],
  },
  {
    category: "Environment & Lighting",
    items: [
      {
        goal: "Outdoor daylight scene",
        approach:
          "Sun light for directional shadows + HDRI environment for sky color. Rotate HDRI to match sun direction.",
        tools: ["Sun Light", "HDRI (World)"],
      },
      {
        goal: "Indoor studio / product lighting",
        approach:
          "3-point area light setup (key + fill + rim). Shadow Catcher plane for ground shadow.",
        tools: ["Area Light", "Shadow Catcher", "Light Linking"],
      },
      {
        goal: "Cinematic mood lighting",
        approach:
          "One strong warm key (orange/amber), one soft cool fill (blue), HDRI for ambient. Strong contrast.",
        tools: ["Area Light", "HDRI", "Light Linking"],
      },
      {
        goal: "Neon / glowing light in EEVEE",
        approach:
          "Emissive material on object + EEVEE Bloom (Render Properties → Bloom). Adjust Bloom Threshold and Intensity.",
        tools: ["Emission shader", "EEVEE Bloom", "Compositor Glare node"],
      },
    ],
  },
  {
    category: "Animation & Motion",
    items: [
      {
        goal: "Object animation (position, rotation, scale)",
        approach:
          "Insert keyframes (I key) in Object Mode. Edit curves in Graph Editor. Non-linear blending in NLA Editor.",
        tools: ["Keyframes", "Graph Editor", "NLA Editor"],
      },
      {
        goal: "Character animation with a skeleton",
        approach:
          "Armature object → rigging (parent mesh to armature with automatic weights) → pose in Pose Mode → keyframe.",
        tools: ["Armature", "Weight Paint", "Pose Mode", "Graph Editor"],
      },
      {
        goal: "Procedural / parametric animation",
        approach:
          "Geometry Nodes with frame-driven inputs. Or Drivers linking object properties to time/other values.",
        tools: ["Geometry Nodes", "Drivers", "Graph Editor"],
      },
      {
        goal: "Camera fly-through or orbit",
        approach:
          "Keyframe camera transforms. Or: Follow Path constraint (camera follows a Bezier curve). Or: camera shake with Noise modifier in Graph Editor.",
        tools: [
          "Camera keyframes",
          "Follow Path constraint",
          "Graph Editor Noise modifier",
        ],
      },
    ],
  },
  {
    category: "VFX & Simulation",
    items: [
      {
        goal: "Falling, stacking, or breaking objects",
        approach:
          "Rigid Body simulation. Active objects = dynamic. Passive = static colliders. Fracture with Cell Fracture addon.",
        tools: ["Rigid Body", "Cell Fracture addon"],
      },
      {
        goal: "Cloth, fabric, flags",
        approach:
          "Cloth simulation. Pin vertex groups keep parts fixed. Add Collision physics to surrounding objects.",
        tools: ["Cloth simulation", "Vertex Groups", "Collision physics"],
      },
      {
        goal: "Water or liquid",
        approach:
          "Mantaflow fluid simulation. Domain object (Liquid type) + Flow emitter object. Mesh the domain for visible water surface.",
        tools: ["Mantaflow Fluid", "Domain", "Flow object"],
      },
      {
        goal: "Fire and smoke",
        approach:
          "Mantaflow Gas simulation (Domain: Gas type). Flow type: Fire+Smoke. Add Noise modifier to domain for detail. Render with Cycles.",
        tools: ["Mantaflow Gas", "Volumetric rendering", "Cycles"],
      },
      {
        goal: "Particle explosion or spray",
        approach:
          "Emitter particle system: emit many particles with short lifetime, high initial velocity, Force Field for wind/turbulence.",
        tools: ["Particle system", "Force Fields", "Emitter"],
      },
    ],
  },
  {
    category: "Rendering & Output",
    items: [
      {
        goal: "Photorealistic still image",
        approach:
          "Cycles renderer. High samples (512+) + OIDN denoising. Area lights or HDRI. Compositor for color grade.",
        tools: ["Cycles", "Denoising", "Compositor"],
      },
      {
        goal: "Fast animation render",
        approach:
          "EEVEE Next. Bake lighting where needed. Lower samples with EEVEE's near-instant frame times.",
        tools: ["EEVEE Next", "Light Probes"],
      },
      {
        goal: "Stylized / non-photorealistic render",
        approach:
          "EEVEE Next with Toon shader or custom shader. Or Grease Pencil (2D lines in 3D space). Or Freestyle (line rendering).",
        tools: ["EEVEE Next", "Shader Editor", "Grease Pencil", "Freestyle"],
      },
      {
        goal: "Compositing / color grading after render",
        approach:
          "Render to OpenEXR Multilayer. Use Compositor: Render Layers → Color Balance → Glare → Output.",
        tools: ["Compositor", "OpenEXR", "Color Balance node", "Glare node"],
      },
      {
        goal: "360° / VR render",
        approach:
          "Camera Type: Panoramic → Equirectangular. Resolution: 4096×2048 or higher. Render with Cycles.",
        tools: ["Panoramic Camera", "Cycles", "Equirectangular"],
      },
    ],
  },
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
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: 4,
        flexShrink: 0,
        flexWrap: "wrap",
        maxWidth: 180,
      }}
    >
      {keys.map((k, i) => (
        <span
          key={i}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            padding: "2px 7px",
            fontFamily: "monospace",
            fontSize: 11,
            color: "#e8e8f0",
            fontWeight: 700,
            boxShadow: "0 2px 0 rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {k}
        </span>
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
  let treeBuffer = [];
  let inTree = false;

  const flushList = (key) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul
        key={`ul-${key}`}
        style={{ margin: "4px 0", padding: 0, listStyle: "none" }}
      >
        {listBuffer.map((item, idx) => (
          <li key={idx} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
            <span style={{ color: "#555577", flexShrink: 0, fontWeight: 700 }}>
              ›
            </span>
            <span
              style={{ fontSize: 13.5, lineHeight: 1.7, color: "#9999bb" }}
              dangerouslySetInnerHTML={{ __html: applyBold(item) }}
            />
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  const flushTree = (key) => {
    if (treeBuffer.length === 0) return;
    elements.push(
      <pre
        key={`tree-${key}`}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          color: "#7777aa",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #1e1e2e",
          borderRadius: 6,
          padding: "12px 16px",
          margin: "12px 0",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {treeBuffer.join("\n")}
      </pre>
    );
    treeBuffer = [];
  };

  lines.forEach((line, i) => {
    if (line.trim() === "##tree") {
      flushList(i);
      inTree = true;
      return;
    }
    if (line.trim() === "##endtree") {
      flushTree(i);
      inTree = false;
      return;
    }
    if (inTree) {
      treeBuffer.push(line);
      return;
    }
    if (!line.trim()) {
      flushList(i);
      elements.push(<div key={i} style={{ height: 6 }} />);
    } else if (/^[-•]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-•]\s+/, ""));
    } else if (/^>\s+/.test(line)) {
      flushList(i);
      elements.push(
        <div
          key={i}
          style={{
            borderLeft: "2px solid #2a2a3a",
            paddingLeft: 12,
            marginTop: 4,
            marginBottom: 6,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: "#666688",
            fontStyle: "italic",
          }}
          dangerouslySetInnerHTML={{ __html: applyBold(line.replace(/^>\s+/, "")) }}
        />,
      );
    } else {
      flushList(i);
      elements.push(
        <p
          key={i}
          style={{
            fontSize: 13.5,
            lineHeight: 1.7,
            color: "#9999bb",
            marginBottom: 2,
          }}
          dangerouslySetInnerHTML={{ __html: applyBold(line) }}
        />,
      );
    }
  });

  flushList("end");
  return elements;
};

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
                  let bg = "transparent",
                    border = "#2a2a3a",
                    color = "#888899";
                  if (done) {
                    if (isCorrect) {
                      bg = "rgba(68,217,162,0.08)";
                      border = "#44d9a240";
                      color = "#44d9a2";
                    } else if (isSelected) {
                      bg = "rgba(244,114,114,0.08)";
                      border = "#f4727240";
                      color = "#f47272";
                    }
                  } else {
                    if (isSelected) {
                      bg = "rgba(91,141,238,0.1)";
                      border = "#5b8dee40";
                      color = "#e8e8f0";
                    }
                  }
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

const CodeBlock = ({ code }) => {
  const highlight = (line) => {
    // comment
    if (/^\s*#/.test(line))
      return (
        <span style={{ color: "#555577", fontStyle: "italic" }}>{line}</span>
      );
    // apply token coloring
    const tokens = [];
    const re =
      /("""[\s\S]*?"""|'[^']*'|"[^"]*")|(bpy\.\w+(?:\.\w+)*)|(import\s+\w+|for\s|if\s|in\s|return\s|True|False|None)|(\b\d+\.?\d*\b)|(\b\w+\s*(?=\())|([=,\[\]{}():])/g;
    let last = 0,
      m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last)
        tokens.push(
          <span key={last} style={{ color: "#9999bb" }}>
            {line.slice(last, m.index)}
          </span>,
        );
      if (m[1])
        tokens.push(
          <span key={m.index} style={{ color: "#fbbf24" }}>
            {m[1]}
          </span>,
        );
      // strings
      else if (m[2])
        tokens.push(
          <span key={m.index} style={{ color: "#38bdf8" }}>
            {m[2]}
          </span>,
        );
      // bpy.*
      else if (m[3])
        tokens.push(
          <span key={m.index} style={{ color: "#c084fc" }}>
            {m[3]}
          </span>,
        );
      // keywords
      else if (m[4])
        tokens.push(
          <span key={m.index} style={{ color: "#fb923c" }}>
            {m[4]}
          </span>,
        );
      // numbers
      else if (m[5])
        tokens.push(
          <span key={m.index} style={{ color: "#44d9a2" }}>
            {m[5]}
          </span>,
        );
      // function calls
      else
        tokens.push(
          <span key={m.index} style={{ color: "#666688" }}>
            {m[0]}
          </span>,
        ); // punctuation
      last = m.index + m[0].length;
    }
    if (last < line.length)
      tokens.push(
        <span key={last} style={{ color: "#9999bb" }}>
          {line.slice(last)}
        </span>,
      );
    return tokens;
  };

  return (
    <div
      style={{
        marginTop: 12,
        background: "#0d0d16",
        border: "1px solid #2a2a4a",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          background: "#111128",
          borderBottom: "1px solid #2a2a4a",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#38bdf8",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
          }}
        >
          🐍 bpy
        </span>
        <span
          style={{
            fontSize: 10,
            color: "#444466",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Python API equivalent
        </span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code
          .trim()
          .split("\n")
          .map((line, i) => (
            <div key={i}>{highlight(line)}</div>
          ))}
      </pre>
    </div>
  );
};

export default function BlenderWorkshop() {
  const [activeModule, setActiveModule] = useState(null); // null = home
  const [completedModules, setCompletedModules] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [activeTab, setActiveTab] = useState("content");
  const [showPython, setShowPython] = useState(false);
  const [openPath, setOpenPath] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const tabs = [
    { id: "content", label: "📖 Lessons", mobileLabel: "📖" },
    { id: "outcomes", label: "🎯 Outcomes", mobileLabel: "🎯" },
    { id: "quickref", label: "⌨️ Quick Ref", mobileLabel: "⌨️" },
  ];

  const learningPaths = [
    {
      emoji: "🖼️", title: "Still Images", shortTitle: "Still Images",
      desc: "Model, light, and render compelling 3D images. No animation required.",
      modules: [
        { idx: 0, note: "Foundation" },
        { idx: 1, note: "Python setup" },
        { idx: 2, note: "Navigation basics" },
        { idx: 3, note: "Building geometry" },
        { idx: 4, note: "Editing topology" },
        { idx: 5, note: "Non-destructive ops" },
        { idx: 7, note: "Shading" },
        { idx: 8, note: "Lighting your scene" },
        { idx: 12, note: "Rendering" },
        { idx: 13, note: "Procedural textures" },
      ],
    },
    {
      emoji: "🎬", title: "Motion & Animation", shortTitle: "Animation",
      desc: "Bring scenes to life with keyframes, physics, and procedural motion.",
      modules: [
        { idx: 0, note: "Foundation" },
        { idx: 1, note: "Python setup" },
        { idx: 2, note: "Navigation" },
        { idx: 3, note: "Geometry" },
        { idx: 4, note: "Topology" },
        { idx: 5, note: "Modifiers" },
        { idx: 6, note: "Procedural animation" },
        { idx: 7, note: "Shading" },
        { idx: 8, note: "Lighting" },
        { idx: 11, note: "Physics & simulation" },
        { idx: 12, note: "Rendering" },
      ],
    },
    {
      emoji: "🧬", title: "Procedural Art", shortTitle: "Procedural",
      desc: "Use Geometry Nodes and shaders to generate complex outputs from simple rules.",
      modules: [
        { idx: 0, note: "Foundation" },
        { idx: 1, note: "Python setup" },
        { idx: 5, note: "Modifiers" },
        { idx: 6, note: "Geometry Nodes — core tool" },
        { idx: 7, note: "Shading" },
        { idx: 8, note: "Lighting" },
        { idx: 12, note: "Rendering" },
        { idx: 13, note: "Procedural textures" },
      ],
    },
    {
      emoji: "🐍", title: "Vibe-Coding", shortTitle: "Vibe-Code",
      desc: "Learn just enough Blender to direct AI confidently. Focus on vocabulary and bpy.",
      modules: [
        { idx: 0, note: "Mental model — start here" },
        { idx: 1, note: "bpy environment — do this second" },
        { idx: 5, note: "Modifiers via code" },
        { idx: 6, note: "Geometry Nodes via code" },
        { idx: 7, note: "Materials via code" },
        { idx: 12, note: "Headless rendering" },
        { idx: 13, note: "Procedural textures via code" },
      ],
    },
  ];

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
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "#e8622a",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            WORKSHOP FOR VIBE CODERS
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            Blender <span style={{ color: "#e8622a" }}>5.1</span>
          </div>
        </div>

        {/* Progress */}
        <div
          style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e" }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "#555577",
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            PROGRESS
          </div>
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

        {/* Nav */}
        <div style={{ flex: 1, padding: "8px 0" }}>
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
          {tabs.map((tab) => (
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
            {learningPaths.map((path, pi) => (
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
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0" }}>{learningPaths[openPath].emoji} {learningPaths[openPath].title}</div>
                <div style={{ fontSize: 11, color: "#555577", marginTop: 2 }}>{learningPaths[openPath].desc}</div>
              </div>
              {learningPaths[openPath].modules.map((m, mi) => (
                <div
                  key={mi}
                  onClick={() => { setActiveModule(m.idx); setExpandedSections({ 0: true }); setActiveTab("content"); setOpenPath(null); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 20px",
                    borderBottom: mi < learningPaths[openPath].modules.length - 1 ? "1px solid #12121c" : "none",
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
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#555577",
                      letterSpacing: 2,
                      marginBottom: 12,
                    }}
                  >
                    {group.category.toUpperCase()}
                  </div>
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
                  → Option+drag = orbit
                  <br />✅{" "}
                  <strong style={{ color: "#e8e8f0" }}>Emulate Numpad</strong> →
                  number row = view shortcuts
                  <br />✅{" "}
                  <strong style={{ color: "#e8e8f0" }}>
                    Use Multi-Touch Trackpad
                  </strong>{" "}
                  → pinch = zoom, 2-finger drag = pan
                </div>
              </div>

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
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "#555577",
                        letterSpacing: 2,
                        marginBottom: 10,
                      }}
                    >
                      {group.title.toUpperCase()}
                    </div>
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
                  F3 — Your Most Important Shortcut
                </div>
                <div
                  style={{ fontSize: 12, color: "#888899", lineHeight: 1.6 }}
                >
                  Press <strong style={{ color: "#e8e8f0" }}>F3</strong>{" "}
                  anywhere in Blender to search every operator by name. If you
                  know what you want but not where it lives — F3 finds it. This
                  is how you navigate Blender when vibe-coding: describe what
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
                  BLENDER 5.1 WORKSHOP FOR VIBE CODERS
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
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#555577",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  THE LEARNING METHOD
                </div>
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
                      body: "The Outcomes tab inverts the learning: start from what you want to make, then find which Blender system applies. That's how vibe-coding works in practice.",
                    },
                    {
                      icon: "🐍",
                      title: "UI maps to code",
                      body: "Every section has a Python/bpy equivalent. Toggle it on (top right of page) to see how each knob in Blender's interface maps to a line of code you can generate or modify.",
                    },
                    {
                      icon: "🧠",
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
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#555577",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  HOW TO USE THIS WORKSHOP
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {[
                    {
                      step: "01",
                      label: "Start each module with the Lessons tab",
                      desc: "Read the intro framing, then expand each section in order. The intro tells you why this domain matters. Read this before the details.",
                    },
                    {
                      step: "02",
                      label: "Allocate 30–60 minutes per module",
                      desc: "Concept-only pass (just reading): ~30 min. With the workshop exercise in Blender: ~60 min. Geometry Nodes (Module 7) and Physics (Module 12) each deserve a dedicated session.",
                    },
                    {
                      step: "03",
                      label: "Toggle the 🐍 bpy switch",
                      desc: "Once you've read a section, turn on the bpy toggle and trace how the UI concepts map to Python. This is the bridge to vibe-coding as you learn to describe what you want in Blender's terms.",
                    },
                    {
                      step: "04",
                      label: "Take the quiz before moving on",
                      desc: "Answer the questions at the bottom of each module. If something surprises you, re-read the relevant section.",
                    },
                    {
                      step: "05",
                      label: "Use the Outcomes tab as a reference",
                      desc: "After finishing all modules, the Outcomes tab becomes your primary tool. It's an index of Blender's possibility space: goal → workflow → tool names.",
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
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#555577",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  TIME ALLOCATION
                </div>
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
                  conceptually dense — each deserves its own session. Module 2
                  (bpy Setup) is short but high-value if you plan to vibe-code.
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
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#44d9a2",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  AFTER COMPLETING ALL MODULES
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    "Fluent in Blender's vocabulary - you can read documentation, watch tutorials, and follow technical discussions without getting lost in terminology",
                    "Able to look at any 3D scene, render, or effect and name the systems involved: which modifiers, shaders, light types, and simulation domains produced it",
                    "Know which Blender tool or system to reach for given any creative goal without having to try every option by hand",
                    "Understand the non-destructive workflow: when to stay live, when to apply, and how to structure a scene for future editability",
                    "Ready to vibe-code: you can describe what you want in precise Blender terms, interpret the Python that comes back, and debug it using bpy knowledge",
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
                <div style={{ fontSize: 13, color: "#666688", lineHeight: 1.7 }}>Use the path selector above — always visible at the top — to pick a goal and get a recommended module sequence. You can access all modules in any order at any time.</div>
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
                  Start Module 1 — Mental Model →
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

              {/* Sections */}
              {mod.sections.map((section, i) => (
                <div
                  key={i}
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
