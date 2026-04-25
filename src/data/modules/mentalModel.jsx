// Module 1: mentalModel

const mentalModel = {
    id: 1,
    emoji: "🎯",
    title: "Mental Model",
    tag: "FOUNDATION",
    color: "#e8622a",
    intro:
      "Before touching anything: understand how Blender thinks. Its architecture shapes every decision: why modes exist, why nothing is 'just a file', and how to reason about what's possible.",
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
          "The wrench icon (🔧) in the Properties panel opens the Modifier tab: where you add, reorder, and remove modifiers like Subdivision Surface, Mirror, and Boolean.",
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
mesh = obj.data  # bpy.types.Mesh: separate from the object

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
        title: "The Properties Panel: Your Control Center",
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
        content: `**Collections** are Blender's folder system, visible in the Outliner in the top-right corner of the screen. They work like named groups: objects can belong to multiple collections at the same time, and you can toggle an entire collection visible, renderable, or selectable in one click.

**Instance Collections**
Drag a collection into the viewport as a single lightweight object. Duplicate it with Alt+D for zero extra memory cost.
> Example: build one detailed tree collection, then scatter 200 instances of it across a terrain. One set of geometry, 200 positions.

**File: Link**
Reference a collection from another .blend file without copying it. Changes in the source file propagate automatically.
> Example: a character lives in character.blend. Link it into your scene file so the team can update the character without touching your scene.

**File: Append**
Copy data from another .blend into your current file. Unlike Link, appended data becomes independent.
> Example: pull a material from a material library file to use and customize it in your own scene.

The Outliner also shows the full datablock tree. Right-click any item for options. Drag objects between collections to reparent them.`,
      },
      {
        title: "🔨 Mini Workshop: Read the Scene",
        isWorkshop: true,
        pythonCode: `import bpy

# Print a full scene inventory: run this in Blender's Script editor
scene = bpy.context.scene
print(f"Scene: {scene.name}")
print(f"Frame range: {scene.frame_start} – {scene.frame_end}")
print(f"Engine: {scene.render.engine}")

for obj in scene.objects:
    mods = [m.type for m in obj.modifiers]
    mats = [s.material.name for s in obj.material_slots if s.material]
    print(f"  {obj.name} [{obj.type}] | mods: {mods} | mats: {mats}")`,
        content: `Open any Blender scene (the default startup or a downloaded .blend file) and map it to what you now know.

1. Find the **Outliner** (top-right corner of the default layout): a tree of every object in your scene. Identify which Collections exist and which Objects are inside them.
2. Click an object, then check the **Properties panel**. What Modifiers does it have? What Materials?
3. Click the **cube** to select it (orange outline). Tab only works on mesh objects. Cameras and lights have no geometry, so Tab does nothing on them. Hover your cursor over the **3D Viewport**, then press **Tab**. You'll see the raw vertices, edges, and faces of the mesh. Press **Tab** again to return to Object Mode.
4. Press **Ctrl+Tab** to browse through available modes. Notice how the toolbar changes with each one.
5. Press **N** to open the sidebar. Look at the Item tab to see the exact location, rotation, and scale.
6. Select the cube, then look at the **Properties Editor** (bottom-right panel, the tall one with icon tabs on the side). Click the **wrench icon**: that's the Modifier stack. Click the **sphere icon** (looks like a marble): that's the Material tab where material slots live. The default cube has no modifiers and no material assigned, so both will be mostly empty, but that's where you'd add them.

✅ Goal: Be able to answer "what is this scene made of?" for any .blend file`,
      },
    ],
  };

export default mentalModel;
