// Module 16: uvUnwrapping

const uvUnwrapping = {
  id: 16,
  emoji: "🗺️",
  title: "UV Unwrapping",
  tag: "TEXTURING",
  color: "#2dd4bf",
  intro:
    "UV maps tell Blender how to project a 2D image texture onto a 3D surface. Without them, image textures can't be placed accurately. UV unwrapping is the step between modeling and texturing that most tutorials skip over, which is why it blindsides so many people.",
  quiz: [
    {
      q: "What does a UV map actually store?",
      options: [
        "The texture image itself",
        "2D coordinates (U, V) for each vertex that define how a texture maps onto the 3D surface",
        "The color of each face",
        "The normal direction of each face",
      ],
      answer: 1,
      explanation:
        "UV coordinates are just 2D positions (U = horizontal, V = vertical, both 0-1) that tell Blender which part of a texture image maps to which part of the mesh. The texture is stored separately.",
    },
    {
      q: "What is a seam in UV unwrapping?",
      options: [
        "A visible line on the rendered surface",
        "An edge marked to tell Blender where to cut the mesh when unfolding it flat",
        "A border between two UV islands that overlaps",
        "A UV island that's too small to texture",
      ],
      answer: 1,
      explanation:
        "Seams mark the cuts. When you unwrap, Blender splits the mesh along seams and flattens the result into 2D UV islands. Good seams go in hidden areas so the cuts aren't visible.",
    },
    {
      q: "When is Smart UV Project the right choice?",
      options: [
        "Characters with hand-painted textures",
        "Any object that needs a unique texture layout",
        "Hard-surface objects that will use tiled or procedural textures",
        "Organic shapes that need to deform",
      ],
      answer: 2,
      explanation:
        "Smart UV Project splits the mesh by angle automatically and produces many small, randomly oriented islands. Fine for tiled materials. Unusable if you need to position a specific image texture across the surface.",
    },
    {
      q: "What causes texture stretching on a UV-mapped surface?",
      options: [
        "Too many polygons in the mesh",
        "A UV island that is unevenly scaled: some parts of the island represent more texture space than they should relative to the mesh area",
        "Using Smart UV Project instead of manual Unwrap",
        "The texture resolution is too low",
      ],
      answer: 1,
      explanation:
        "Stretching happens when UV space isn't proportional to surface area. A long, thin UV island mapped from a roughly square face will stretch the texture. Fix by selecting the island and using Minimize Stretch, or re-unwrapping with better seams.",
    },
    {
      q: "What is texture bleeding and how do you prevent it?",
      options: [
        "When the texture is too dark: fix by increasing lamp intensity",
        "When colors from one UV island appear on an adjacent island at render time: fix by increasing the margin between islands when packing",
        "When the UV map has overlapping islands: fix by re-unwrapping",
        "When the normal map conflicts with the diffuse: fix by disabling bump",
      ],
      answer: 1,
      explanation:
        "Texture bleeding happens at island edges when the renderer samples slightly outside the island boundary. Increasing pack margin (0.02+) adds padding between islands. When baking textures, set a bleed margin in the bake settings.",
    },
  ],
  sections: [
    {
      title: "What UVs Are",
      pythonCode: `import bpy

obj = bpy.context.active_object
mesh = obj.data

# List all UV maps on the object
for uv_layer in mesh.uv_layers:
    print(uv_layer.name, "| active:", uv_layer.active)

# Add a new UV map
new_uv = mesh.uv_layers.new(name="UVMap")
new_uv.active = True

# Read UV coordinates (per loop, not per vertex)
# Each polygon has loop_indices: one per corner
uv_layer = mesh.uv_layers.active
for poly in mesh.polygons:
    for loop_idx in poly.loop_indices:
        uv = uv_layer.data[loop_idx].uv
        print(f"Loop {loop_idx}: U={uv.x:.3f}  V={uv.y:.3f}")`,
      content: `A UV map is a 2D coordinate system (U = horizontal, V = vertical, both ranging 0 to 1) mapped onto your 3D mesh. Every point on the mesh gets assigned a UV coordinate that points to a position in the texture image.

Why "UV" and not "XY": X, Y, Z are already taken by 3D space. U and V are the 2D equivalents used for texture space.

UV coordinates are stored **per loop** (per face-corner), not per vertex. This matters because a single vertex at a seam edge can have different UV coordinates depending on which face it belongs to. That's how seams work: the same vertex has two different UV positions on either side of the cut.

Without a UV map, procedural textures (Noise, Voronoi, etc.) still work using Object or Generated coordinates. But any image texture placed precisely on a surface requires a UV map.`,
    },
    {
      title: "Seams: Where to Cut",
      pythonCode: `import bpy
import bmesh

obj = bpy.context.active_object
# Must be in Edit Mode
bm = bmesh.from_edit_mesh(obj.data)

# Mark selected edges as seams
for edge in bm.edges:
    if edge.select:
        edge.seam = True

# Clear all seams
for edge in bm.edges:
    edge.seam = False

# Find all current seams
seam_edges = [e for e in bm.edges if e.seam]
print(f"{len(seam_edges)} seams marked")

bmesh.update_edit_mesh(obj.data)`,
      content: `Seams mark where Blender cuts the mesh when unfolding it flat. Think of peeling an orange: you cut the skin to lay it flat. The cuts are seams.

**Marking seams:**
In Edit Mode, select the edges you want as seams → Edge menu (Ctrl+E) → Mark Seam. Seams display as red edges in the viewport.

**Where to put seams:**
- Hidden areas: inside joints, underneath limbs, along the bottom of objects
- Where texture continuity doesn't matter
- Along natural boundaries of the object (where a shirt hem would be, where a lid meets a jar)

**The goal:** create UV islands (contiguous unfolded sections) that are as large as possible, with minimal distortion.

!! Plan seams before unwrapping. Re-seaming after you've started texturing is painful. Spend a few minutes thinking about where cuts should go on your specific object before running the unwrap.`,
    },
    {
      title: "Unwrap Methods",
      pythonCode: `import bpy

# Must be in Edit Mode with geometry selected
# All four are under U key in the 3D viewport

# Standard unwrap: follows your marked seams
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.001)
# method: 'ANGLE_BASED' (better for organic) or 'CONFORMAL' (better for flat)

# Smart UV Project: ignores seams, auto-splits by angle
bpy.ops.uv.smart_project(
    angle_limit=66.0,      # faces with sharper angles get their own island
    island_margin=0.02,    # padding between islands
    area_weight=0.0        # 0=uniform scale, 1=proportional to face area
)

# Cube projection (good for boxy objects)
bpy.ops.uv.cube_project(cube_size=1.0)

# Pack all islands efficiently into 0-1 UV space
bpy.ops.uv.pack_islands(margin=0.01)

# Normalize island scale (equal texel density across all islands)
bpy.ops.uv.average_islands_scale()`,
      content: `**Unwrap** (U → Unwrap)
Follows your marked seams. Best for characters, props, anything where you've thought about seam placement. Produces the most usable result for hand-painted or unique textures.

**Smart UV Project** (U → Smart UV Project)
Ignores seams entirely. Automatically splits the mesh based on face angles. Produces many small, randomly-oriented islands. Fast, but impractical for precise texture placement. Good for: architectural walls, hard-surface objects using tiled materials, anything that won't have a unique painted texture.

**Cube / Cylinder / Sphere Project**
Projects from a primitive shape onto the mesh. Reasonable starting point if your object roughly matches that shape. Usually needs cleanup in the UV Editor afterward.

**Pack Islands**
After unwrapping, run this to pack all UV islands efficiently into the 0-1 UV space. Maximizes texture resolution usage.

!! Smart UV Project looks fine until you try to place a specific image across the surface. The islands are randomly oriented and sized, so aligning anything is impractical. Only use it when your texture is tiled or procedural.`,
    },
    {
      title: "The UV Editor",
      pythonCode: `import bpy

# Open UV Editing workspace or change any editor to UV Editor
# UV Editor only shows UV data when:
# - A mesh is selected
# - You are in Edit Mode

# Most UV operations run as operators while in the UV Editor

# Select all islands
bpy.ops.uv.select_all(action='SELECT')

# Minimize stretch (relax UVs to reduce distortion)
bpy.ops.uv.minimize_stretch(iterations=500)

# Stitch islands back together along a shared seam
bpy.ops.uv.stitch()

# Pin selected UVs (lock them during subsequent unwrap)
bpy.ops.uv.pin(clear=False)

# Unpin
bpy.ops.uv.pin(clear=True)

# Scale islands to equal texel density
bpy.ops.uv.average_islands_scale()`,
      content: `The UV Editor shows the 2D UV map for the selected mesh. Open it via the **UV Editing** workspace tab, or change any editor type to UV Editor.

**The UV Editor only shows data in Edit Mode.** Select your mesh, enter Edit Mode, select the faces you want to see, and the UV Editor will show their UV layout.

**Navigation:**
Same as the 3D viewport: scroll to zoom, MMB to pan.

**Selecting:**
L to select an island (connected UV region). A to select all. Box select, circle select all work.

**Transforming:**
G / S / R to move, scale, rotate selected UV islands. Same as 3D viewport transforms.

**Key tools:**
- **Minimize Stretch**: relaxes UV islands to reduce distortion without losing your seam layout. Run this after Unwrap for cleaner results.
- **Average Island Scale**: normalizes all islands to the same texel density (pixels per meter). Run this after packing so no island gets more texture resolution than it deserves.
- **Pin (P)**: locks selected UVs so they don't move during subsequent unwrap or stitch operations.`,
    },
    {
      title: "Common Problems",
      pythonCode: `import bpy

obj = bpy.context.active_object

# Check if object has a UV map at all
if not obj.data.uv_layers:
    print("No UV map: add one or run Unwrap first")

# Check for overlapping islands (basic check via bounding box)
# Full overlap detection requires the UV editor's Select Overlapping operator
# In the UV Editor: Select → Select Overlapping

# Set packing margin to reduce bleeding
# Run in Edit Mode with UVs selected:
bpy.ops.uv.pack_islands(margin=0.02)  # 0.02 = 2% margin between islands

# When baking textures, also set bake margin:
bpy.context.scene.render.bake.margin = 4  # pixels of bleed margin`,
      content: `**Stretching**
The texture looks smeared or elongated on the surface. Caused by UV islands that aren't proportional to the actual face area. Fix: select the stretched island in the UV Editor, use Minimize Stretch, or re-unwrap that section with better seams.

**Texture bleeding**
Colors from one UV island bleed into adjacent islands at render time. Caused by islands packed too close together. Fix: increase pack margin (margin=0.02 or higher). When baking, set a pixel bleed margin in the bake settings.

**Overlapping islands**
Two islands occupy the same UV space. Intentional for mirrored objects sharing texture space (left arm = right arm). A problem for lightmaps or any situation requiring unique UV coverage. Use Select → Select Overlapping in the UV Editor to find them.

**Nothing moves when I try to texture**
The object likely has no UV map, or the material is using Generated/Object coordinates instead of UV. Check the Texture Coordinate node in the material, and check that a UV map exists in Object Data Properties → UV Maps.

!! Seam edges can show as faint lines on a textured surface if the texture doesn't account for them. This is a texturing/baking problem, not a UV problem. Adding bleed margin when baking is the fix.`,
    },
    {
      title: "🔨 Mini Workshop: Unwrap the Mug",
      isWorkshop: true,
      pythonCode: `import bpy
import bmesh

# Start from the mug created in the Edit Mode module
# If you don't have it, create a cylinder and hollow it (see Edit Mode workshop)

obj = bpy.data.objects["Mug"]
bpy.context.view_layer.objects.active = obj
bpy.ops.object.select_all(action='DESELECT')
obj.select_set(True)

# Enter Edit Mode
bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(obj.data)

# Mark seams:
# Top rim loop, bottom loop, and one vertical edge on the back
# In Python: find and mark by position (conceptual, not exact indices)
# Easier to mark interactively: select edges, Ctrl+E → Mark Seam

# After marking seams interactively, run unwrap:
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.unwrap(method='ANGLE_BASED', margin=0.001)

# Pack and normalize
bpy.ops.uv.average_islands_scale()
bpy.ops.uv.pack_islands(margin=0.02)

bpy.ops.object.mode_set(mode='OBJECT')
print("Mug unwrapped")`,
      content: `Unwrap the mug from the Edit Mode mini workshop. Goal: one clean UV layout suitable for painting a label on the body and a separate texture on the handle.

**Step 1: Plan your seams**
The mug body is a cylinder. To unwrap it flat, you need:
- A loop around the top rim
- A loop around the bottom
- One vertical edge running down the back (hidden when facing the viewer)

The handle is a separate shape. Mark seams around its joints where it meets the body.

**Step 2: Mark seams**
In Edit Mode, select the edges described above. Ctrl+E → Mark Seam. They'll turn red.

**Step 3: Unwrap**
Select all (A), then U → Unwrap. Open the UV Editor to see the result.

**Step 4: Check and clean**
You should see: a rectangular island for the mug body, a separate island for the handle, and small islands for the top rim and base.

Run **Average Island Scale**, then **Pack Islands** (margin 0.02).

**Step 5: Verify**
Assign a test image texture to the material using the UV coordinates. The checkerboard pattern should wrap cleanly around the mug body with no visible stretching.`,
    },
  ],
};

export default uvUnwrapping;
