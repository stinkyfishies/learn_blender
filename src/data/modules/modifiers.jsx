// Module 7: modifiers

const modifiers = {
    id: 7,
    emoji: "🔧",
    title: "Modifiers",
    tag: "NON-DESTRUCTIVE",
    workflow: "py",
    color: "#c084fc",
    intro:
      "Learn to use the modifier stack non-destructively, which modifiers matter most, and why the order you stack them changes the result.",
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
        content: `These modifiers create or grow geometry. Stack them in the order: Mirror → Array → Boolean → Bevel → Subdivision Surface.`,
        primitiveGrid: [
          { emoji: "🔲", name: "Subdivision Surface", desc: "Smooths by subdividing geometry. Catmull-Clark for organic shapes, Simple for displacement.", use: "Smoothing a hard-surface object. Use Ctrl+E → Mark Crease on edges to keep them sharp." },
          { emoji: "🪞", name: "Mirror", desc: "Model one half, get full symmetry. Enable Clipping so verts snap at the center seam.", use: "Character faces, vehicle bodies, furniture. Always goes first in the stack." },
          { emoji: "🔁", name: "Array", desc: "Duplicate in a pattern: fixed count, fit to length, or fit to curve.", use: "Fence posts, chain links, stairs, brick walls. Stack two Arrays for a 2D grid." },
          { emoji: "🔪", name: "Bevel", desc: "Procedurally round edges. Set Angle Limit to only bevel sharp edges automatically.", use: "Softening corners on a hard-surface object without manual edge work." },
          { emoji: "📄", name: "Solidify", desc: "Add thickness to any flat surface.", use: "Walls, fabric, paper, panels. Keeps the mesh non-destructive until you're done." },
          { emoji: "🌀", name: "Screw", desc: "Revolve a profile around an axis to produce a solid of revolution.", use: "Bottles, vases, springs, columns, wine glasses. Pairs with a single-vertex profile." },
          { emoji: "✂️", name: "Boolean", desc: "Use one object to cut, join, or intersect another. Solver: Exact for clean results.", use: "Cutting holes, vents, and slots. Goes after Mirror and Array, before Bevel." },
          { emoji: "🔗", name: "Weld", desc: "Merge vertices within a distance threshold automatically.", use: "Cleaning up after Boolean operations where edges don't quite meet." },
          { emoji: "🫧", name: "Remesh", desc: "Rebuild the entire mesh surface with uniform topology (Voxel or Quad modes).", use: "Preparing a sculpt for retopology, or cleaning up a Boolean-heavy mesh." },
        ],
      },
      {
        title: "Mirror Modifier: Symmetric Modeling",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Add Mirror on X axis with clipping
mir = obj.modifiers.new("Mirror", 'MIRROR')
mir.use_axis[0]  = True   # X axis
mir.use_axis[1]  = False  # Y axis
mir.use_clip     = True   # clipping: verts snap at seam, won't cross
mir.merge_threshold = 0.001

# Mirror relative to another object instead of origin
mir.mirror_object = bpy.data.objects["MirrorTarget"]

# Bisect an existing mesh before mirroring (via Edit Mode)
# Select all → Mesh → Bisect along the axis, delete one side, then add Mirror`,
        content: `The Mirror modifier reflects your mesh across the object's origin. Model one half: the other appears automatically.

**The workflow**
1. Place the object's origin at the center of symmetry (Object → Set Origin → Origin to Geometry, or manually position it)
2. Add the Mirror modifier, choose axis (X for left-right symmetry)
3. Enable **Clipping**: vertices at the seam snap together and cannot be pulled apart accidentally
4. Model freely on one side. The mirrored half updates in real time.

**Clipping explained**
Without Clipping, vertices at the center seam can drift apart and leave a gap, or cross through each other. With Clipping on, they're locked to the mirror plane. Always enable it.

**Starting from an existing mesh**
If you have a full mesh and want to mirror half of it:
1. Tab into Edit Mode → select all
2. **Mesh → Bisect**: cut exactly along the axis (hold Ctrl to snap)
3. Delete one side
4. Add Mirror modifier

**X-Mirror toggle vs Mirror modifier**
Edit Mode has an X-Mirror toggle (top of Edit Mode toolbar). This mirrors vertex movement while editing but is not a modifier: it doesn't generate geometry and won't show the full shape while you work. The modifier is almost always the right choice.

**Mirror Object**
Instead of mirroring across the object's own origin, you can mirror relative to another object's origin. Useful for asymmetric rigs or objects that don't sit at world center.

**Common uses**
- Character faces and bodies (bilateral symmetry)
- Vehicle bodies and wings
- Furniture (chairs, tables)
- Architectural details (window frames, decorative panels)

>> Mirror goes first in the stack: Mirror → Array → Boolean → Bevel → Subdivision Surface. Putting it after Boolean or Bevel causes unpredictable results at the seam.`,
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
        content: `These modify existing geometry without adding or removing it.`,
        primitiveGrid: [
          { emoji: "🌀", name: "Simple Deform", desc: "Twist, Bend, Taper, or Stretch along an axis. Controlled by angle or factor.", use: "Twisted vase body, bent pipe, tapered cone shape without manual vertex editing." },
          { emoji: "📦", name: "Lattice", desc: "Deform a mesh using a cage object. Edit the cage and the mesh follows.", use: "Non-destructive squash and stretch on a complex mesh without touching its vertices." },
          { emoji: "〰️", name: "Curve", desc: "Deform a mesh along a Bezier or NURBS curve path.", use: "Roads, pipes, roller coasters, cables, any shape that follows a path." },
          { emoji: "🏔️", name: "Displace", desc: "Push vertices along their normals using a texture (Noise, Image, Musgrave).", use: "Terrain from a grid, wrinkled fabric, knurled surfaces, alien landscapes." },
          { emoji: "✨", name: "Smooth / Laplacian Smooth", desc: "Relax geometry to reduce bumps without subdividing.", use: "Cleaning up a sculpt, softening harsh Boolean edges before rendering." },
          { emoji: "🎯", name: "Shrinkwrap", desc: "Snap a mesh onto the surface of another object.", use: "Retopology: drawing clean geometry over a sculpted mesh." },
          { emoji: "🔮", name: "Cast", desc: "Push the mesh toward a sphere, cube, or cylinder shape.", use: "Rounding out a blocky mesh, morphing a shape toward a primitive." },
          { emoji: "🌊", name: "Wave", desc: "Animate a ripple or wave across the surface over time.", use: "Water surface, flag flutter, cloth ripple without a full physics simulation." },
        ],
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
import bmesh
import math

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Define vase profile as (radius, height) pairs, bottom to top.
# The Screw modifier will revolve these points around the Z axis.
profile = [
    (0.0,  0.0),   # base center
    (0.28, 0.0),   # base edge
    (0.30, 0.04),  # base bevel
    (0.22, 0.22),  # lower body taper
    (0.32, 0.50),  # widest point
    (0.26, 0.70),  # upper body
    (0.16, 0.86),  # neck
    (0.19, 0.92),  # lip flare
    (0.21, 0.97),  # lip rim
]

mesh = bpy.data.meshes.new("VaseProfile")
bm = bmesh.new()
verts = [bm.verts.new((x, 0, z)) for x, z in profile]
for i in range(len(verts) - 1):
    bm.edges.new([verts[i], verts[i + 1]])
bm.to_mesh(mesh)
bm.free()

obj = bpy.data.objects.new("Vase", mesh)
bpy.context.collection.objects.link(obj)
bpy.context.view_layer.objects.active = obj
obj.select_set(True)

# Screw modifier: revolve profile 360° around Z
scr = obj.modifiers.new("Screw", 'SCREW')
scr.angle = math.radians(360)
scr.steps = 48
scr.render_steps = 48
scr.axis = 'Z'
scr.use_merge_vertices = True  # closes seam and base

# Smooth with Subdivision Surface
sub = obj.modifiers.new("Subdiv", 'SUBSURF')
sub.levels = 2
sub.subdivision_type = 'CATMULL_CLARK'`,
        content: `The Screw modifier works as a lathe: it revolves a 2D profile around the Z axis to produce a solid of revolution. You build one side of the silhouette, the modifier does the rest.

**Build the profile from a single vertex**

Start with one vertex and extrude upward to draw the right-side silhouette of the vase. No circles, no deleting, no rotation ambiguity.

1. **Delete the default cube**: X → Delete
2. **Shift+A → Mesh → Single Vert** (if not visible: enable Extra Objects add-on in Preferences → Add-ons)
   - Or: Shift+A → Mesh → Circle, set Vertices to 1 in the F9 panel. Same result.
3. **Tab → Edit Mode**. Press **1** for Vertex select mode. The single vertex is at the origin.
4. **G → X → 0.15 → Enter** to move it out to the base edge position.
5. Now extrude upward and shape as you go. Each step: **E → Z → (amount) → Enter** to extrude up, then **G → X → (amount) → Enter** to adjust the radius at that height:
   - Base edge: already placed at X=0.15, Z=0
   - **E → Z → 0.02 → Enter** (base thickness), **G → X → 0.01 → Enter** (slight outward bevel)
   - **E → Z → 0.15 → Enter** (lower body), **G → X → 0.05 → Enter** (widen slightly)
   - **E → Z → 0.20 → Enter** (belly), **G → X → 0.08 → Enter** (widest point)
   - **E → Z → 0.20 → Enter** (upper body), **G → X → -0.06 → Enter** (taper inward)
   - **E → Z → 0.10 → Enter** (neck), **G → X → -0.04 → Enter** (narrow neck)
   - **E → Z → 0.05 → Enter** (lip), **G → X → 0.03 → Enter** (slight outward flare)
6. **For the closed base:** select the very first vertex (the base edge at Z=0) by clicking it. **E → Enter** to extrude in place → **G → X**, type the negative of its current X to bring it to 0 (e.g. **-0.15 → Enter**). This puts a vertex exactly on the axis. The Screw modifier treats any vertex at X=0 as a fixed center point and closes the base.
7. **Tab → Object Mode**. Properties panel (wrench icon) → **Add Modifier → Screw**: Axis Z, Angle 360°, Steps 32, enable **Merge Vertices**.
8. Check the result. If the base is open, go back to Edit Mode and confirm the base vertex is exactly at X=0 (check the N panel → Item → X value).
9. **Add Modifier → Subdivision Surface** (level 2). If Catmull-Clark pulls the base edge upward, select the base edge loop in Edit Mode (Alt+click) → **Shift+E → 1 → Enter** to crease it flat.

**Shaping tips**
- Use **G → X** not **S** to adjust individual verts. S scales from a center and moves everything horizontally together.
- Press **Numpad 1** (or **Numpad 3**) to look at the profile from the front/side so you can see the silhouette clearly while shaping.
- Add more vertices anywhere with **Ctrl+click** on an edge to insert a new vert between two existing ones.
- Change Screw Angle below 360° to get an open spiral instead of a closed vase.

✅ Goal: A vase with a closed base, shaped silhouette, and no manual sculpting`,
      },
    ],
  };

export default modifiers;
