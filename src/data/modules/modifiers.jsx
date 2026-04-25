// Module 7: modifiers

const modifiers = {
    id: 7,
    emoji: "🔧",
    title: "Modifiers",
    tag: "NON-DESTRUCTIVE",
    color: "#c084fc",
    intro:
      "Modifiers are Blender's superpower: non-destructive operations stacked on top of your base mesh. Stack them, reorder them, toggle them. The original is always safe until you Apply.",
    quiz: [
      {
        q: "You add a Bevel modifier, then a Subdivision Surface modifier. The result looks different than Subdivision then Bevel. Why?",
        options: [
          "The modifiers have conflicting settings",
          "Modifier order matters: the stack processes top to bottom, so each modifier receives the output of the one above it",
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
          "Always apply immediately: live modifiers are slow",
          "Only when you need to sculpt on the result, export, or manually edit the modified geometry",
          "Whenever you save the file",
          "After rendering, to save memory",
        ],
        answer: 1,
        explanation:
          "Keep modifiers live as long as possible. Apply only when you need to do something the modifier stack can't support: like sculpting at the subdivided resolution.",
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

# Apply a modifier (destructive: burns into mesh)
bpy.ops.object.modifier_apply(modifier=mod.name)

# Remove a modifier without applying
obj.modifiers.remove(mod)

# List all modifiers in stack order
for m in obj.modifiers:
    print(m.name, m.type, "viewport:", m.show_viewport)`,
        content: `**Properties → 🔧 Modifier tab**: Add and manage modifiers here.

The stack processes **top to bottom**. Order matters dramatically:
- Subdivision Surface before Bevel: the bevel gets subdivided (smooth result)
- Bevel before Subdivision Surface: the subdivision gets beveled (sharp, then smoothed)

!! Boolean + Bevel is the most common broken combination: if Bevel comes before Boolean in the stack, the boolean cut slices through the beveled edge and leaves mangled triangulated faces. The correct order is Mirror → Array → Boolean → Bevel → Subdivision Surface. When in doubt, Boolean goes near the top.

For each modifier:
**👁 Eye icon**
Toggle viewport visibility
**🎬 Camera icon**
Toggle render visibility
**Apply**
Burns the result permanently into the mesh (destructive, often irreversible)
**Duplicate**
Copy the modifier with same settings

Keep modifiers unapplied until: you need to sculpt on the subdivided mesh, you're exporting, or you need to manually edit the resulting geometry.`,
      },
      {
        title: "Generate Modifiers: Shape Creators",
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

**Subdivision Surface**
The most-used modifier. Smooths by subdividing geometry.
- Catmull-Clark: smooth organic shapes (levels 2–3 usually sufficient)
- Simple: subdivide without smoothing (for displacement maps)
- Use **Ctrl+E → Mark Crease** on edges to keep them sharp while subdividing

**Mirror**
Model one half, get full symmetry. Set the axis, enable Clipping (verts snap at center seam).

**Array**
Duplicate in a pattern: fixed count, fit to length, or fit to curve. Stack multiple Arrays for 2D/3D grids.

**Bevel**
Procedurally round edges. Set Angle Limit to only bevel edges above a degree threshold. Far more flexible than manual beveling.

**Solidify**
Add thickness to any flat surface: walls, fabric, panels, paper.

**Screw**
Revolve a profile around an axis: bottles, vases, springs, columns.

**Boolean**
Use one object to cut/join/intersect another. See Module 11 for detail.

**Weld**
Merge vertices within a distance threshold. Essential after Booleans.

**Remesh**
Rebuild the entire mesh surface with uniform topology (Voxel or Quad modes). Key for sculpt prep.`,
      },
      {
        title: "Deform Modifiers: Shape Changers",
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

**Simple Deform**
Twist, Bend, Taper, or Stretch along an axis. Controlled by an angle or factor. Great for stylized shapes.

**Lattice**
Deform a mesh using a cage object. Edit the cage → the mesh follows. Non-destructive squash and stretch.

**Curve**
Deform a mesh along a Bezier/NURBS curve. Roads, pipes, roller coasters, any along-path shape.

**Displace**
Use a texture (Noise, Image, etc.) to push vertices along normals. Instant terrain, wrinkles, knurling.

**Smooth / Laplacian Smooth**
Relax geometry (reduce bumps) without subdividing. Good for cleaning up sculpts.

**Shrinkwrap**
Snap a mesh onto the surface of another object. Key for retopology.

**Cast**
Push the mesh toward a sphere, cube, or cylinder shape. Good for rounding things out.

**Wave**
Animate a ripple/wave across the surface. Physics-lite animation.`,
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

# Add Screw modifier: revolves the circle profile
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
        content: `Build a vase using zero manual sculpting: pure modifiers:

1. **Shift+A → Mesh → Circle** (16 vertices)
2. **Tab → Edit Mode** → select all → **E** to extrude upward repeatedly, pulling verts in/out to shape a profile
3. Back in **Object Mode** → **Add → Modifier → Screw**: instant vase shape!
4. **Add → Modifier → Solidify**: give it wall thickness (0.02–0.05)
5. **Add → Modifier → Subdivision Surface** (level 2): smooth it
6. Optional: **Add → Modifier → Simple Deform → Twist**: twist the vase body

Explore: change the Screw angle (360° = full closed, less = open spiral), change Screw axis.

✅ Goal: Understand that complex shapes = simple profiles + stacked modifiers`,
      },
    ],
  };

export default modifiers;
