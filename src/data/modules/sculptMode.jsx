// Module 11: sculptMode

const sculptMode = {
    id: 11,
    emoji: "🏛️",
    title: "Sculpt Mode",
    tag: "ORGANIC MODELING",
    color: "#34d399",
    intro:
      "Sculpt Mode is digital clay. Push and pull geometry with brushes to create organic forms: characters, creatures, terrain, abstract shapes. The approach to topology here is completely different from Edit Mode.",
    quiz: [
      {
        q: "What is Dyntopo (Dynamic Topology) best used for?",
        options: [
          "Final production sculpts with clean topology",
          "Early exploration: it adds/removes geometry on the fly so you can pull out details without pre-subdividing",
          "Retopologising a sculpt for animation",
          "Baking normal maps",
        ],
        answer: 1,
        explanation:
          "Dyntopo is for messy exploration. It keeps adding triangles wherever you sculpt. The downside is chaotic topology: use it early, then Remesh before fine detail.",
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
          "Remesh discards the existing topology and rebuilds it uniformly: either as voxels or quads. Use it to clean up chaotic Dyntopo topology before adding fine detail with Multires.",
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
          "Masking paints a protected region. Masked vertices are locked: you can sculpt freely on the unmasked face without any risk of accidentally affecting the body.",
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

# Remesh: rebuild with uniform voxel topology
bpy.ops.object.voxel_remesh()  # uses scene remesh voxel size
obj.data.remesh_voxel_size = 0.01  # smaller = more detail, heavier

# Enable Dyntopo (dynamic topology) in Sculpt Mode
bpy.ops.object.mode_set(mode='SCULPT')
bpy.ops.sculpt.dynamic_topology_toggle()
bpy.context.scene.tool_settings.sculpt.detail_size = 12  # lower = finer detail`,
        content: `Before sculpting, you need enough geometry to work with. Three approaches:

**Dyntopo (Dynamic Topology)**
Blender adds and removes geometry on-the-fly as you sculpt. Enable in the Sculpt header or N panel. Great for early exploration: you can pull out a horn or ear without pre-subdividing. Downsides: chaotic topology, slow at high detail.

**Multires Modifier**
Stacks subdivision levels while keeping the lower levels editable. Add the Multiresolution modifier → Subdivide several times → sculpt at high level → the base form at level 0 is unchanged. Best for production sculpts. Subdivision levels 4–7 for character work.

**Remesh**
Rebuilds the entire mesh with uniform topology. In Sculpt Mode header: **Remesh** with a Voxel Size setting. Use this to re-even topology after Dyntopo gets too messy. Also available as the **Remesh modifier** for non-destructive use.

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

# Set brush via name: all built-in brushes
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
        content: `**Draw**: Push geometry outward (Ctrl = inward). The basic brush. Use for adding volume anywhere.
**Clay / Clay Strips**
Build material up like adding clay slabs. Flatter stroke than Draw. Great for primary forms.
**Smooth**
Hold **Shift** with any brush to smooth instantly. The most used secondary action.
**Inflate**
Puff geometry outward in all directions uniformly. Good for lips, cheeks, puffiness.
**Crease**
Create a sharp indented line. Wrinkles, muscle lines, panel seams.
**Pinch**
Pull geometry toward the brush center. Sharpens edges and ridges.
**Flatten**
Press geometry against a plane. Rocks, bone planes, flat-faced organic forms.
**Grab**
Move large chunks of mesh together. Rough posing, pulling out limbs.
**Snake Hook**
Pull out tendrils of geometry as you drag. Tentacles, horns, hair locks. Only works without Dyntopo (or with it at low count).
**Elastic Deform**
Pushes nearby geometry naturally, simulates tissue. Posing organic forms.

**F**
Resize brush (drag)
**Shift+F**
Change strength (drag)
**Ctrl+drag**
Invert brush direction (push → pull)`,
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

# Face sets: stored as integer attribute ".sculpt_face_set"
if ".sculpt_face_set" in mesh.attributes:
    fs_attr = mesh.attributes[".sculpt_face_set"]
    unique_sets = set(v.value for v in fs_attr.data)
    print(f"Face sets: {unique_sets}")`,
        content: `**Masking**: Paint areas you want to protect from sculpting.

**M**
Mask brush (paint mask onto surface)
**Alt+M**
Clear mask
**Ctrl+I**
Invert mask (what was protected becomes sculptable, and vice versa)
**Ctrl+Click**
Fill mask on a Face Set

**Face Sets**
Color-coded regions of the mesh. Each face set can be isolated, hidden, or sculpted independently.
**Ctrl+W**
Create face set from masked area
**H**
Hide unmasked face sets (isolate the active face set)
**Alt+H**
Reveal all hidden face sets
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

# Programmatic sculpting is limited in Python: most sculpting
# is interactive. What you CAN do: drive mesh shape via vertex positions
# before entering sculpt mode.
bpy.ops.object.mode_set(mode='OBJECT')
import random, mathutils
mesh = rock.data
for v in mesh.vertices:
    noise = mathutils.noise.noise(v.co * 2.0)  # built-in Blender noise
    v.co += v.normal * noise * 0.3  # displace along normal

bpy.ops.object.mode_set(mode='SCULPT')`,
        content: `Rocks are ideal first sculpts: they're irregular by nature, so mistakes look intentional:

1. **Shift+A → Ico Sphere** (subdivisions: 3 in F9)
2. Add a **Multiresolution modifier** → Subdivide 3–4 times
3. Enter **Sculpt Mode**
4. **Grab brush**: pull out 3–4 irregular protrusions to break the perfect sphere
5. **Clay Strips**: build up flat rocky faces
6. **Flatten brush**: create some flat facets; rocks have these
7. **Crease brush**: add sharp cracks and crevices
8. **Shift** (Smooth): wherever things look too pointy or unnatural
9. **Draw + Ctrl**: push in some pits and cavities

Duplicate it (Shift+D), use Grab to reshape differently: instant rock cluster.

✅ Goal: Organic results in under 10 minutes. Sculpting is fast once you stop being precious.`,
      },
    ],
  };

export default sculptMode;
