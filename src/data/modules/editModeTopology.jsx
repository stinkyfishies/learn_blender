// Module 6: editModeTopology

const editModeTopology = {
    id: 6,
    emoji: "✏️",
    title: "Edit Mode & Topology",
    tag: "CORE MODELING",
    color: "#44d9a2",
    intro:
      "Learn to select and transform geometry, why topology matters, and the core operations that shape any mesh.",
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
        content: `Press **Tab** to enter Edit Mode from Object Mode. Press Tab again to return.

First choose what you're selecting: vertices (points), edges (lines), or faces (polygons). Press **1**, **2**, or **3** to switch. The wrong mode is the most common reason a selection doesn't work.

Then select:`,
        primitiveGrid: [
          { emoji: "1️⃣", name: "1 — Vertex Mode", desc: "Select individual points. The most granular level of control.", use: "Nudging a single point to fix a silhouette, snapping a base vert to X=0" },
          { emoji: "2️⃣", name: "2 — Edge Mode", desc: "Select lines between vertices.", use: "Selecting an edge to bevel, adding a crease, loop-cutting at a specific edge" },
          { emoji: "3️⃣", name: "3 — Face Mode", desc: "Select polygons.", use: "Insetting the top of a cylinder, extruding a face outward to build a wall" },
          { emoji: "🔁", name: "Alt+Click — Loop Select", desc: "Selects an entire edge or face loop running around the mesh in one click.", use: "Selecting a ring of faces around a mug to inset, selecting the base edge to crease" },
          { emoji: "📦", name: "B — Box Select", desc: "Click and drag a rectangle to select everything inside it.", use: "Selecting the left half of a mesh to delete, grabbing a group of verts in a region" },
          { emoji: "⭕", name: "C — Circle Select", desc: "Paint over geometry with a circular brush. Scroll to resize. Right-click to exit.", use: "Selecting an irregular cluster of verts that a box would overshoot" },
          { emoji: "🔗", name: "L — Linked Select", desc: "Hover over a mesh island and press L to select all connected geometry.", use: "Selecting just the handle when it's already joined to the mug body" },
          { emoji: "🔀", name: "Ctrl+I — Invert", desc: "Flips the selection: selected becomes unselected and vice versa.", use: "Select the parts you don't want, invert, then work on everything else" },
          { emoji: "👁️", name: "Alt+Z — X-Ray", desc: "Toggle see-through mode. Lets you select verts behind the surface, not just the front face.", use: "Box selecting verts on a curved surface without missing the ones facing away" },
          { emoji: "〰️", name: "O — Proportional Edit", desc: "Transforms fall off smoothly to nearby unselected verts within a radius. Scroll to adjust radius while transforming.", use: "Pulling a single vert to create a smooth bump rather than a sharp spike" },
        ],
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
        content: `These are the tools you will reach for constantly. Each one does one thing well. Learn what it's for before memorizing the shortcut.`,
        primitiveGrid: [
          { emoji: "✋", name: "G — Grab", desc: "Move selected. Then X/Y/Z to lock to axis. Type a number for exact distance.", use: "Repositioning a vertex, moving a face to align with something else" },
          { emoji: "🔄", name: "R — Rotate", desc: "Rotate selected around pivot. Then X/Y/Z for axis. Type degrees for exact.", use: "Tilting a face, rotating a profile upright before applying Screw modifier" },
          { emoji: "↔️", name: "S — Scale", desc: "Scale from pivot point outward. Affects all selected verts together.", use: "Resizing a face uniformly. Not for nudging individual verts — use G for that" },
          { emoji: "⬆️", name: "E — Extrude", desc: "Pull new geometry out from the selection. Duplicates the selected element and connects it.", use: "Building a mug wall upward from a face, adding a finger to a hand, extending a profile" },
          { emoji: "🔲", name: "I — Inset", desc: "Shrink a face inward within its boundary, creating a border ring around it.", use: "Creating a recessed panel, hollowing the top of a cylinder before extruding down" },
          { emoji: "➕", name: "Ctrl+R — Loop Cut", desc: "Adds a new edge loop that follows existing geometry around the mesh. Scroll to add more cuts.", use: "Adding resolution at a specific height, creating a sharp crease near an edge before subdivision" },
          { emoji: "🔀", name: "M — Merge", desc: "Combines selected vertices into one. Choose: At Center, At First, At Last, At Cursor, By Distance.", use: "Closing the tip of a shape, welding two verts that should be one, cleaning up overlapping geometry" },
          { emoji: "🔪", name: "Ctrl+B — Bevel", desc: "Chamfers selected edges or vertices. Scroll to add segments for a rounded bevel.", use: "Softening a hard corner, adding a highlight edge on a hard-surface object" },
          { emoji: "✂️", name: "K — Knife", desc: "Draw freehand cuts across faces. Click to place points, Enter to confirm, Esc to cancel.", use: "Adding geometry exactly where you need it, cutting a specific path across a face" },
          { emoji: "🔗", name: "F — Fill", desc: "Creates a face between selected edges or vertices. Also closes open edge loops.", use: "Capping an open end, bridging two edges with a face" },
          { emoji: "🪞", name: "Ctrl+M — Mirror", desc: "Mirrors selected geometry across a chosen axis.", use: "Flipping a set of faces to the other side, symmetrizing part of a mesh" },
        ],
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
        content: `When you rotate (R) or scale (S), Blender needs a center point to transform around. Press **.** (period) to open the pivot point pie menu.`,
        primitiveGrid: [
          { emoji: "⚖️", name: "Median Point", desc: "Average center of everything selected. The default.", use: "Rotating a group of faces that should orbit a shared center" },
          { emoji: "🎯", name: "Individual Origins", desc: "Each selected element transforms around its own center independently.", use: "Scaling multiple faces inward so each shrinks separately, not toward a shared point" },
          { emoji: "🖱️", name: "Active Element", desc: "Transforms around the last-clicked item in your selection (highlighted brighter).", use: "Rotating a chain of edges around one specific end point" },
          { emoji: "➕", name: "3D Cursor", desc: "Transforms around the red/white cursor. Place it with Shift+Right-click anywhere in the viewport.", use: "Rotating a door hinge around its edge, revolving geometry around a specific axis point" },
          { emoji: "📦", name: "Bounding Box Center", desc: "Center of the invisible box that fits around your entire selection.", use: "Scaling an irregular selection from its geometric center" },
        ],
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
        content: `Topology = how geometry is connected. It determines whether your mesh subdivides cleanly, deforms without tearing, and shades without artifacts. You don't need to obsess over it as a beginner, but knowing these terms will help you read AI-generated code and understand why a mesh looks wrong.`,
        primitiveGrid: [
          { emoji: "🟦", name: "Quads", desc: "4-sided faces. The standard. Subdivide predictably and shade cleanly.", use: "Use quads everywhere you can, especially on curved surfaces you plan to subdivide" },
          { emoji: "🔺", name: "Tris (Triangles)", desc: "3-sided faces. Acceptable on flat static geometry. Cause shading artifacts on curved subdivided surfaces.", use: "Fine for game assets and static renders. Avoid on anything animated or subdivided" },
          { emoji: "🔷", name: "N-gons", desc: "5+ sided faces. Cause unpredictable shading and subdivision. Blender creates them when you fill irregular selections.", use: "Acceptable only on flat, non-subdivided areas. Otherwise break them into quads" },
          { emoji: "〰️", name: "Edge Loops", desc: "A ring of connected edges that runs continuously around the mesh. The backbone of good topology.", use: "Alt+Click selects a loop. Add one with Ctrl+R. Use loops to control where subdivision adds detail" },
          { emoji: "🔗", name: "Edge Rings", desc: "The edges that connect two parallel loops, running perpendicular to them.", use: "Ctrl+Alt+Click selects a ring. Useful for selecting spans of geometry across a surface" },
          { emoji: "📍", name: "Poles", desc: "Vertices where more or fewer than 4 edges meet. 3-edge and 5-edge poles are sometimes necessary but affect subdivision flow.", use: "Keep poles away from curved areas. They're fine on flat faces or at corners" },
          { emoji: "⚠️", name: "Non-Manifold Geometry", desc: "Broken geometry: holes, internal faces, edges shared by more than 2 faces. Causes render errors and simulation failures.", use: "Ctrl+Alt+Shift+M selects all non-manifold elements. Run this when something looks wrong" },
        ],
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
        content: `Normals are invisible vectors pointing outward from each face, telling Blender which direction is "outside." They control how light hits the surface and whether faces shade correctly.

!! A face going black is almost always a flipped normal, not a lighting or material problem. Check **Viewport Overlays → Face Orientation** first: blue = outward (correct), red = inward (flipped). Fix with: Edit Mode → A to select all → Mesh → Normals → Recalculate Outside (Shift+N).`,
        primitiveGrid: [
          { emoji: "🔵", name: "Flipped Normals", desc: "Face points inward instead of outward. Renders dark or invisible. The most common mesh problem.", use: "Edit Mode → A → Shift+N (Recalculate Outside) fixes almost all cases automatically" },
          { emoji: "🪞", name: "Shade Flat", desc: "Each face shades as a distinct polygon. You can see every face boundary.", use: "Hard geometric shapes like crystals, dice, low-poly stylized objects" },
          { emoji: "✨", name: "Shade Smooth", desc: "Blender interpolates normals across faces so edges appear rounded even on a low-poly mesh.", use: "Right-click the object in Object Mode → Shade Smooth. Use for organic shapes, cylinders, spheres" },
          { emoji: "🎚️", name: "Auto Smooth (Shade Smooth by Angle)", desc: "Edges sharper than a threshold show hard; shallower edges show smooth. Best of both worlds.", use: "Right-click → Shade Auto Smooth. Default 30°. Hard-surface objects with both sharp corners and curved surfaces" },
          { emoji: "⚖️", name: "Weighted Normals modifier", desc: "Calculates normals based on face area. Keeps hard-surface shading clean, especially after Boolean operations.", use: "Add after Boolean modifier when faces near cuts show dark shading artifacts" },
        ],
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
