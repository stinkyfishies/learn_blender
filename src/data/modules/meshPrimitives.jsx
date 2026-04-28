// Module 5: meshPrimitives

const meshPrimitives = {
    id: 5,
    emoji: "🧊",
    title: "Mesh Primitives",
    tag: "OBJECT MODE",
    workflow: "both",
    color: "#60a5fa",
    intro:
      "Every 3D model starts from a primitive. These are the raw materials. What matters is knowing what each one gives you topologically: not just what it looks like.",
    quiz: [
      {
        q: "You want to sculpt a creature head. Which sphere primitive is the better starting point, and why?",
        options: [
          "UV Sphere: more vertices means more sculpting detail",
          "Ico Sphere: more uniform triangle distribution across the surface, better for subdivision and sculpting",
          "Plane: you can extrude into any shape",
          "Torus: ring topology works well for necks",
        ],
        answer: 1,
        explanation:
          "UV Sphere has messy pole pinching at the top/bottom which deforms badly under subdivision. Ico Sphere distributes geometry evenly: ideal for organic sculpting.",
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
          "A mesh made of curved edges: same as a mesh but pre-smoothed",
          "A mathematically smooth path defined by control points and handles, not polygons",
          "A modifier that curves an existing mesh",
          "A texture that creates a curved gradient",
        ],
        answer: 1,
        explanation:
          "Curves are a separate data type: defined by handles and control points, not vertices/edges/faces. They can be converted to mesh, or used directly (for pipes, paths, etc.) via the Curve modifier.",
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
        content: `**Shift+A → Mesh** to open the add menu. Every model starts from one of these.`,
        primitiveGrid: [
          { emoji: "🟦", name: "Cube", desc: "6 quads, 8 verts. Box-modeling workhorse.", use: "Furniture, buildings, mechanical parts" },
          { emoji: "🌐", name: "UV Sphere", desc: "Latitude/longitude topology. Poles are messy under subdivision.", use: "Planets, eyes, balls" },
          { emoji: "🔺", name: "Ico Sphere", desc: "Uniform triangle distribution. Better for sculpting and subdivision.", use: "Organic shapes, creature heads" },
          { emoji: "🪣", name: "Cylinder", desc: "Loop-based sides, flat end caps.", use: "Cups, cans, limbs, columns" },
          { emoji: "📐", name: "Cone", desc: "Pointed top, circular base.", use: "Arrow tips, teeth, spikes, horns" },
          { emoji: "🍩", name: "Torus", desc: "Donut topology: ring of edge loops.", use: "Rings, cables, life preservers" },
          { emoji: "⬜", name: "Plane", desc: "Single quad face.", use: "Floors, walls, leaf/hair cards" },
          { emoji: "⭕", name: "Circle", desc: "Edges only, no fill. Not a mesh face.", use: "Extrusion base, Screw modifier profile" },
          { emoji: "🔲", name: "Grid", desc: "Subdivided plane.", use: "Terrain, cloth, displacement maps" },
          { emoji: "🐒", name: "Monkey (Suzanne)", desc: "Blender's test subject.", use: "Shading and lighting experiments" },
        ],
      },
      {
        title: "First Moves: Transforms in Object Mode",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Move (G equivalent)
obj.location = (2.0, 0.0, 0.0)       # place at exact position
obj.location.x += 1.0                 # move 1 unit along X

# Rotate (R equivalent) — values in radians
import math
obj.rotation_euler.z = math.radians(45)   # 45° around Z

# Scale (S equivalent)
obj.scale = (2.0, 2.0, 2.0)          # uniform scale
obj.scale.x = 0.5                     # non-uniform: squash on X

# Apply transforms (make current position/rotation/scale the new "default")
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)`,
        content: `You added a primitive. Now what?

Three keys work in Object Mode on any selected object:

**G** — Grab (move)
Press G, move the mouse, click to confirm. Press Esc to cancel.

**R** — Rotate
Press R, move the mouse, click to confirm.

**S** — Scale
Press S, move the mouse, click to confirm.

**Lock to an axis: X, Y, or Z**
After pressing G, R, or S — press X, Y, or Z to constrain to that axis. The movement locks to a straight line or plane.

Examples:
- G → Z: move straight up/down
- R → Z: spin around the vertical axis
- S → X: stretch or squash on X only

**Type a number for exact values:**
- G → Z → 2 → Enter: move exactly 2 meters up
- R → Z → 90 → Enter: rotate exactly 90°
- S → 0.5 → Enter: scale to half size

These same three keys (G, R, S) also work in Edit Mode on selected vertices, edges, or faces. The mechanics are identical — the only difference is what you have selected.

> For detailed mesh editing — loop cuts, extrusion, bevels — continue to Edit Mode & Topology.`,
      },
      {
        title: "The Operator Panel (F9) — Configure Before You Commit",
        pythonCode: `import bpy

# The F9 panel settings are just keyword args on the operator.
# Pass them directly: no need to open F9 at all in scripting.

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
        content: `>> Every time you add a primitive, Blender gives you a free configuration window. Most beginners never notice it. This is one of the most useful things to know early.

When you add a primitive, a small panel appears at the **bottom-left** of the viewport. Click it or press **F9** to expand it. You can change the topology of the object before doing anything else: vertex count, radius, segments, alignment, exact position.

- **Vertices / Segments**: mesh density — more = smoother, heavier
- **Radius / Size**: initial dimensions
- **Generate UVs**: auto-create a UV map — turn this on, costs nothing
- **Align to View**: face the current camera direction
- **Location / Rotation**: exact initial placement

!! This panel disappears the moment you do anything else — click, move, type. It is a one-time window. If you miss it, Ctrl+Z and re-add.`,
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
        content: `**Shift+A → Curve** gives you a different data type: mathematically smooth paths, not polygon meshes.

**Bezier**
Handles for smooth curves. Great for paths, logos, cables, motion paths.
**NURBS**
Weighted control points. Smooth surfaces, automotive design.
**Path**
A simple spline. Use as a motion path for animation or a spine for Curve modifier.

Curves can be converted to meshes (**Object → Convert → Mesh**) or used directly with the **Curve modifier** to deform other objects along them.

**Shift+A → Surface**
NURBS surface patches. Rarely used for modeling, but understand they exist.

Key curve settings (Properties → Object Data → Geometry):
**Bevel → Depth**
Give the curve a round cross-section (instant pipe/tube)
**Bevel → Object**
Use a custom shape as the cross-section
**Fill Mode**
Whether the curve end caps are filled`,
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

# Check for n-gons (faces with more than 4 verts: shading risk)
ngons = [p for p in mesh.polygons if len(p.vertices) > 4]
print(f"N-gons: {len(ngons)}")

# Check for triangles
tris = [p for p in mesh.polygons if len(p.vertices) == 3]
print(f"Triangles: {len(tris)}")`,
        content: `Add one of each primitive and turn on **Edit Mode (Tab)** to inspect its geometry. What you're learning: what you get before you do anything.

1. Add a **UV Sphere** → Tab → see the pole pinching at top/bottom
2. Add an **Ico Sphere** → Tab → see the uniform triangle distribution
3. Add a **Cylinder** → Tab → 3 (face select) → click the top cap → it's one n-gon face (important: n-gons cause shading issues if subdivided)
4. Add a **Torus** → Tab → notice how it's made of edge loops: great for ring topology
5. Add a **Curve → Bezier** → Tab → see the control points and handles → G to move one

✅ Goal: Given a target shape, immediately know which primitive to start from`,
      },
    ],
  };

export default meshPrimitives;
