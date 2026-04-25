// Module 6: editModeTopology

const editModeTopology = {
    id: 6,
    emoji: "✏️",
    title: "Edit Mode & Topology",
    tag: "CORE MODELING",
    color: "#44d9a2",
    intro:
      "Edit Mode is where real modeling happens. You're operating on the mesh's actual geometry: vertices, edges, faces. Topology (how geometry is connected) determines everything: how the mesh deforms, subdivides, and renders.",
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
          "Alt+Click selects an edge loop: a ring of connected edges that runs around the mesh. One of the most powerful selection shortcuts in modeling.",
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
          "Proportional Editing creates a smooth falloff: like pulling fabric. Essential for organic shaping without selecting every vert individually.",
      },
      {
        q: "An object's faces are shading dark and look inside-out. What's most likely wrong?",
        options: [
          "The material is set to transparent",
          "The normals are flipped: faces are pointing inward instead of outward",
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
**1**
Vertex select (points)
**2**
Edge select (lines)
**3**
Face select (polygons)

Selecting:
**Alt+Click**
Select an entire edge/face loop. One of the most powerful selection tools.
**Ctrl+Click**
Select shortest path between two elements
**B**
Box select
**C**
Circle select (paint with brush, scroll to resize, right-click to exit)
**Ctrl+I**
Invert selection
**L**
Select linked (hover over a mesh island and press L to select it all)

**Alt+Z**
Toggle X-Ray (lets you select through the mesh, not just surface)

Proportional Editing:
**O**
Toggle Proportional Editing: transforms fall off smoothly around selected verts. Press O while transforming to adjust falloff radius with scroll wheel. Essential for organic shaping.`,
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

# Loop cut (Ctrl+R): adds edge loop with n cuts
bpy.ops.mesh.loopcut_slide(
    MESH_OT_loopcut={"number_cuts": 1},
    TRANSFORM_OT_edge_slide={"value": 0.0}
)

# Bevel edges (Ctrl+B)
bpy.ops.mesh.bevel(offset=0.1, segments=2, affect='EDGES')

# Merge vertices by distance (removes doubles)
bpy.ops.mesh.remove_doubles(threshold=0.001)

bmesh.update_edit_mesh(obj.data)`,
        content: `**G**: Grab (move). Then X/Y/Z to constrain to an axis. Type a number for exact distance.
**R**
Rotate. Then X/Y/Z to constrain. Type a number for exact degrees.
**S**
Scale. Then X/Y/Z to constrain. Type a number for exact factor.

Axis constraint tricks:
**Shift+X**
Move on the YZ plane (constrain to everything EXCEPT X)
**G → X → 2 → Enter**
Move exactly 2 units along X
**R → Z → 90**
Rotate exactly 90° around Z axis

The most important modeling operations:
**E**
Extrude selected (pull new geometry out from selection)
**I**
Inset faces (shrink a face inward, creating a border frame)
**Ctrl+R**
Loop Cut: add an edge loop running around the mesh. Scroll to add more cuts.
**K**
Knife tool: draw freehand cuts across faces
**F**
Fill: create a face or edge between selected elements
**M**
Merge vertices (to center, to cursor, to last selected, by distance)
**Ctrl+B**
Bevel: chamfer edges or vertices. Scroll to add segments.
**Ctrl+M**
Mirror selected across an axis`,
      },
      {
        title: "Pivot Point: What Rotates Around What",
        pythonCode: `import bpy

# Set pivot point via Python
# Options: 'MEDIAN_POINT', 'INDIVIDUAL_ORIGINS', 'ACTIVE_ELEMENT',
#          'CURSOR', 'BOUNDING_BOX_CENTER'
bpy.context.scene.tool_settings.transform_pivot_point = 'MEDIAN_POINT'

# Example: scale faces around their own centers (not group center)
bpy.context.scene.tool_settings.transform_pivot_point = 'INDIVIDUAL_ORIGINS'
bpy.ops.transform.resize(value=(0.5, 0.5, 0.5))

# Place the 3D cursor (used by CURSOR pivot)
bpy.ops.view3d.cursor3d()  # places at mouse position
bpy.context.scene.cursor.location = (0, 0, 2)  # or set directly`,
        content: `When you rotate (R) or scale (S) a selection, Blender needs a center point to transform around. That's the pivot point. Press Period (.) to open the pivot point pie menu.

**Median Point** (default)
The average center of everything selected. Rotate three objects and they orbit the midpoint between them.

**Individual Origins**
Each object, face, or vertex group rotates and scales around its own center. Scaling multiple faces inward with Individual Origins shrinks each one separately. With Median Point, they'd all collapse toward a shared center.

**Active Element**
Transforms around the last-clicked item in your selection (highlighted brighter than the rest).

**3D Cursor**
Transforms around the red/white cursor in the viewport. Place it anywhere with Shift+Right-click, then use it as a custom pivot. Useful for rotating something around a specific point in space.

**Bounding Box Center**
Center of the invisible box that fits around your entire selection.

For most work, leave it on Median Point. Switch to Individual Origins when you want things to transform independently rather than as a group.`,
      },
      {
        title: "Topology Concepts That Matter",
        pythonCode: `import bpy
import bmesh

obj = bpy.context.active_object
bm = bmesh.from_edit_mesh(obj.data)

# Check valence (number of edges per vertex): find poles
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
**Quads**
4-sided faces. Always prefer quads. They subdivide predictably and shade cleanly.
**Tris (triangles)**
Acceptable in static meshes, problematic in animated ones. Avoid on curved surfaces.
**N-gons**
5+ sided faces. Cause shading artifacts when subdivided. Acceptable only on flat, non-subdivided areas.
**Edge loops**
A ring of connected edges that runs around the mesh. The backbone of good topology. Alt+Click selects them.
**Edge rings**
The edges connecting two parallel loops. Ctrl+Alt+Click selects them.
**Poles**
Vertices where more or fewer than 4 edges meet. 3-edge poles (stars) and 5-edge poles are sometimes necessary but should be placed carefully.

**Ctrl+Alt+Shift+M**
Select Non-Manifold (broken geometry: holes, internal faces, flipped normals). Use this to diagnose mesh problems.`,
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

!! A face going black mid-render is almost always a flipped normal, not a lighting or materials problem. Enable **Viewport Overlays → Face Orientation** first: blue = outward, red = inward. Select all in Edit Mode, then **Mesh → Normals → Recalculate Outside** (Shift+N). Check this before touching anything else.

Common normal issues and fixes:
**Flipped normals**
Face looks dark or inverted. Fix: Select all → **Mesh → Normals → Recalculate Outside** (Shift+N)
**Flat vs Smooth shading**
Right-click object → Shade Smooth (or Shade Auto Smooth). Smooth shading interpolates normals across a face; Flat shows each face as a distinct polygon.
**Auto Smooth**
In Object Data Properties → Normals: set an angle threshold. Edges sharper than the angle show as hard; others as smooth. Best of both worlds.
**Weighted Normals modifier**
Computes normals based on face area. Keeps hard-surface objects looking clean after boolean operations.

Overlay: **Viewport Overlays → Face Orientation**: Blue = outward-facing, Red = inward. All blue = healthy mesh.`,
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
  };

export default editModeTopology;
