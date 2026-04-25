// Module 12: booleanHardSurface

const booleanHardSurface = {
    id: 12,
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
          "Difference subtracts: like a cookie cutter. The cutter carves its shape out of the base. The cutter object is usually hidden after the operation, keeping the cut live and editable.",
      },
      {
        q: "Why add a Bevel modifier after Booleans on a hard surface object?",
        options: [
          "To fix the topology that Booleans break",
          "To add rounded edge highlights: without them, boolean cuts look unrealistically sharp",
          "To merge the cutter object permanently",
          "Bevel is required for Cycles to render hard edges correctly",
        ],
        answer: 1,
        explanation:
          "Real manufactured objects have micro-bevels on their edges: they catch light and reveal form. A Bevel modifier with Angle Limit adds these highlights procedurally without touching the mesh.",
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
          "Keeping cutters alive means the boolean cut remains editable: move or reshape the cutter later to adjust the cut non-destructively",
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

**Union**
Combine two objects into one merged solid
**Difference**
Subtract one object from another. Carves holes, cuts recesses.
**Intersect**
Keep only the overlapping volume between two objects

**Workflow:**
1. Select the base (target) object
2. **Properties → Modifier → Boolean**
3. Set operation type
4. Set the Cutter object in the Object field
5. **H** to hide the cutter: the cut remains live and non-destructive
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
bev.angle_limit   = 0.5236   # 30°: only bevel sharp edges
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
2. **Bevel modifier**: round all edges above an angle threshold (Limit Method: Angle, ~30°). Use segments: 2–3 for a sharp highlight.
3. **Subdivision Surface modifier**: smooth the curved areas, keep sharp edges beveled
4. **Weighted Normals modifier**: compute normals based on face area. Keeps flat areas shading flat even with micro-bevels.

**Edge Creases (Ctrl+E → Edge Crease in Edit Mode)**
Tell the Subdivision Surface modifier to keep specific edges sharp without beveling them. Good for internal detail you want crisp.

**Bevel Weight**
Per-edge control over how much the Bevel modifier affects each edge. Mark via Ctrl+E → Edge Bevel Weight. Lets you have some edges fully beveled and others untouched.

**Shade Auto Smooth** (Object right-click): Set a degree threshold. Edges sharper than the threshold show as hard; gentler ones shade smooth. No geometry needed.`,
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

1. Start with a **Cube**: your base panel, hull, or body
2. Add **Boolean cutters**: other cubes, cylinders, custom shapes: for recesses, holes, vents, panels
3. Keep all cutters live and hidden (H) so you can adjust any cut at any time
4. Add **Bevel modifier** with Angle limit for edge highlights
5. Add **Subdivision Surface** for final smoothing
6. Add **Weighted Normals** for shading correctness

The key insight: you never manually model the holes, recesses, or panel lines. They're all boolean cuts.

**Recommended addons** for professional hard surface work:
**HardOps**
Boolean management, shading tools, workflow shortcuts
**BoxCutter**
Interactive boolean drawing directly in the viewport
**MESHmachine**
Edge flow and bevel management after booleans`,
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
        content: `Create a wall panel like you'd see on a spaceship: using only booleans:

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
  };

export default booleanHardSurface;
