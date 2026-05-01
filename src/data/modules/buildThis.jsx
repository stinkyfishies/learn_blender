// Build Model capstone

const buildThis = {
  id: 9,
  emoji: "🛠️",
  title: "Build This",
  tag: "FIRST PROJECTS",
  workflow: "py",
  color: "#f59e0b",
  intro:
    "Two projects. One teaches you the workflow. One shows you what AI-assisted Blender can actually do.",
  quiz: [
    {
      q: "You run a script that generates a mug and it looks wrong: the inner wall extrusion went the wrong direction. What property controls extrusion depth and direction in bpy?",
      options: [
        "bpy.ops.mesh.extrude_region() has no direction parameter: you set it separately via transform",
        "The depth parameter on extrude_region takes a positive or negative float for direction",
        "Extrusion direction is always along the face normal and cannot be overridden",
        "You must enter Edit Mode interactively to control direction",
      ],
      answer: 0,
      explanation:
        "bpy.ops.mesh.extrude_region() extrudes the selection but leaves the transform to a follow-up call. Use bpy.ops.transform.translate() with a constrained axis vector immediately after. The sign of the vector controls direction.",
    },
    {
      q: "A parametric gear has a tooth count and a module (tooth size). What does changing the module value do to two meshing gears?",
      options: [
        "It changes the gear ratio between them",
        "It scales the teeth: both gears must share the same module to mesh correctly",
        "It controls the rotational speed of the gear",
        "It sets how many faces each tooth has",
      ],
      answer: 1,
      explanation:
        "Module is the tooth size unit. Two gears mesh only if they share the same module. Changing module on one gear without changing the other means the teeth don't fit. It's the first parameter to lock in when designing a gear pair.",
    },
    {
      q: "Your gear system script uses a Driver so the follower gear rotates automatically when the driver gear turns. The follower is spinning the wrong direction. What's the fix?",
      options: [
        "Enable Reverse in the Rigid Body constraint",
        "Negate the driver expression: multiply by -1",
        "Swap the driver and follower object assignments",
        "Increase the gear ratio value",
      ],
      answer: 1,
      explanation:
        "Meshing gears always rotate in opposite directions. A driver expression like -driver_z * ratio negates the rotation. If the follower spins the same way as the driver, you're missing the negative sign.",
    },
  ],
  sections: [
    {
      title: "How to Use This Module",
      content: `Two projects at different scales. Do them in order: the mug builds the workflow habits, the gear system shows you what those habits unlock.

**Project 1: Mug** -- the familiar object. You've seen it in the mini workshops. Now build the whole thing in one script and shade it.

**Project 2: Parametric Gear System** -- the AI wow project. A system of interlocking gears at any tooth count and ratio, mechanically correct, animated. The kind of thing that would take days manually and takes one good prompt with the right vocabulary.

Both projects produce something you take to Finish This: set up lights, camera, render it.

>> Your script is the source of truth. The .blend file is a build artifact. If you need to change something, change the script and regenerate.`,
    },
    {
      title: "Project 1: Mug",
      pythonCode: `import bpy, math

# ── CLEAR SCENE ──
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ── MUG BODY ──
bpy.ops.mesh.primitive_cylinder_add(
    vertices=32, radius=0.45, depth=1.2,
    end_fill_type='NGON', location=(0, 0, 0.6)
)
mug = bpy.context.active_object
mug.name = "Mug"

bpy.ops.object.mode_set(mode='EDIT')
import bmesh
bm = bmesh.from_edit_mesh(mug.data)

# Delete top face (open the mug)
top_faces = [f for f in bm.faces if f.calc_center_median().z > 1.1]
bmesh.ops.delete(bm, geom=top_faces, context='FACES')

# Inset rim
top_edges = [e for e in bm.edges if all(v.co.z > 1.1 for v in e.verts)]
bmesh.ops.inset_region(bm, faces=[f for f in bm.faces if f.calc_center_median().z > 1.05],
                        thickness=0.04, depth=0.0)

# Extrude inner wall down
inner_top = [f for f in bm.faces if f.calc_center_median().z > 1.0 and
             f.calc_center_median().length < 0.42]
result = bmesh.ops.extrude_face_region(bm, geom=inner_top)
verts_extruded = [v for v in result['geom'] if isinstance(v, bmesh.types.BMVert)]
bmesh.ops.translate(bm, vec=(0, 0, -1.0), verts=verts_extruded)

# Cap the inner bottom
bottom_inner = [v for v in bm.verts if v.co.z < 0.15 and v.co.length < 0.42]
bmesh.ops.contextual_create(bm, geom=bottom_inner)

bmesh.update_edit_mesh(mug.data)
bpy.ops.object.mode_set(mode='OBJECT')

# ── HANDLE ──
bpy.ops.curve.primitive_bezier_circle_add(radius=0.18, location=(0.58, 0, 0.6))
handle_curve = bpy.context.active_object
handle_curve.name = "HandleCurve"
handle_curve.scale = (1, 0.6, 1)
handle_curve.data.bevel_depth = 0.035
handle_curve.data.bevel_resolution = 4
handle_curve.data.fill_mode = 'FULL'

# ── CERAMIC MATERIAL ──
mat = bpy.data.materials.new("Ceramic")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.92, 0.88, 0.82, 1)  # off-white
bsdf.inputs["Roughness"].default_value  = 0.55
bsdf.inputs["IOR"].default_value        = 1.45
mug.data.materials.append(mat)
handle_curve.data.materials.append(mat)

bpy.ops.object.shade_smooth()
print("Mug done")`,
      content: `Build the mug as a single script. The goal: one F5 run produces a mug with ceramic material, ready to render.

**What to build:**
1. Cylinder base: 32 vertices, radius 0.45m, depth 1.2m
2. Delete the top face (open it)
3. Inset the rim edge slightly
4. Extrude the inner wall downward and cap the bottom
5. Handle: a Bezier circle with bevel depth for tube cross-section, scaled and positioned
6. Ceramic Principled BSDF: off-white, Roughness 0.55, IOR 1.45

**The AI approach:** describe the mug to your AI assistant using the vocabulary from Edit Mode & Topology. "A hollow cylinder with inset rim, inner wall extruded down, capped. A bezier curve handle with bevel tube cross-section." That's enough to get a working first script. Then iterate on proportions.

!! The inner wall is the part that makes it read as a mug rather than a cup. Don't skip it. The extrude-down + cap-bottom sequence is one connected operation in the script.

>> When the script is working, take it to Finish This: light it, set a camera, render it.`,
    },
    {
      title: "Project 2: Parametric Gear System",
      pythonCode: `import bpy, math, bmesh

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for c in bpy.data.collections:
        bpy.data.collections.remove(c)

def make_gear(name, teeth, module=0.1, thickness=0.08,
              pressure_angle=20, location=(0,0,0)):
    """Generate an involute gear mesh.
    teeth: number of teeth
    module: tooth size (both gears must share same module to mesh)
    thickness: gear depth
    pressure_angle: contact angle in degrees (standard: 20)
    """
    pa  = math.radians(pressure_angle)
    pitch_r = teeth * module / 2       # pitch circle radius
    base_r  = pitch_r * math.cos(pa)  # base circle radius
    tip_r   = pitch_r + module         # addendum circle
    root_r  = pitch_r - 1.25 * module # dedendum circle

    verts, faces = [], []

    steps = 8  # involute curve resolution per flank

    def involute_point(base_r, t):
        return (base_r * (math.cos(t) + t * math.sin(t)),
                base_r * (math.sin(t) - t * math.cos(t)))

    t_tip = math.sqrt((tip_r / base_r)**2 - 1)

    all_outline = []
    for i in range(teeth):
        angle = 2 * math.pi * i / teeth
        half_tooth = math.pi / teeth

        # right flank (involute from base to tip)
        flank_r = []
        for s in range(steps + 1):
            t = t_tip * s / steps
            x, y = involute_point(base_r, t)
            a = math.atan2(y, x)
            r = math.hypot(x, y)
            fa = angle - half_tooth / 2 + a - math.atan2(
                base_r * t_tip / steps, base_r)
            flank_r.append((r * math.cos(fa), r * math.sin(fa)))

        # left flank (mirrored)
        flank_l = []
        for s in range(steps + 1):
            t = t_tip * (steps - s) / steps
            x, y = involute_point(base_r, t)
            a = math.atan2(y, x)
            r = math.hypot(x, y)
            fa = angle + half_tooth / 2 - a + math.atan2(
                base_r * t_tip / steps, base_r)
            flank_l.append((r * math.cos(fa), r * math.sin(fa)))

        # root arc between teeth
        root_pts = []
        a0 = math.atan2(flank_l[-1][1], flank_l[-1][0])
        a1_next = angle + 2 * math.pi / teeth - half_tooth / 2 - math.atan2(
            base_r * t_tip / steps, base_r)
        for s in range(3):
            a = a0 + (a1_next - a0) * s / 2
            root_pts.append((root_r * math.cos(a), root_r * math.sin(a)))

        all_outline += flank_r + flank_l + root_pts

    # Build mesh
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()

    front_verts, back_verts = [], []
    for (x, y) in all_outline:
        front_verts.append(bm.verts.new((x, y,  thickness / 2)))
        back_verts.append( bm.verts.new((x, y, -thickness / 2)))

    n = len(all_outline)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new([front_verts[i], front_verts[j],
                      back_verts[j],  back_verts[i]])

    # Cap front and back (fan triangulation from center)
    cx_f = bm.verts.new((0, 0,  thickness / 2))
    cx_b = bm.verts.new((0, 0, -thickness / 2))
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new([cx_f, front_verts[i], front_verts[j]])
        bm.faces.new([cx_b, back_verts[j],  back_verts[i]])

    bm.to_mesh(mesh)
    bm.free()
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location

    # Material
    mat = bpy.data.materials.new(name + "_Mat")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.15, 0.15, 0.18, 1)
    bsdf.inputs["Metallic"].default_value   = 1.0
    bsdf.inputs["Roughness"].default_value  = 0.3
    obj.data.materials.append(mat)

    return obj, pitch_r


def add_driver_rotation(follower, driver_obj, ratio):
    """Follower rotates opposite to driver at the given ratio."""
    fc = follower.driver_add("rotation_euler", 2)
    fc.driver.type = 'SCRIPTED'
    v = fc.driver.variables.new()
    v.name = "drv"
    v.targets[0].id        = driver_obj
    v.targets[0].data_path = "rotation_euler[2]"
    fc.driver.expression   = f"-drv * {ratio}"


# ── MAIN ──
clear_scene()
MODULE = 0.12   # tooth size: both gears share this
T1, T2 = 24, 12  # driver: 24 teeth, follower: 12 teeth

gear1, r1 = make_gear("GearLarge", teeth=T1, module=MODULE, location=(0, 0, 0))
gear2, r2 = make_gear("GearSmall", teeth=T2, module=MODULE,
                       location=(r1 + r2, 0, 0))

# Animate driver gear
gear1.rotation_euler[2] = 0
gear1.keyframe_insert("rotation_euler", frame=1)
gear1.rotation_euler[2] = 2 * math.pi
gear1.keyframe_insert("rotation_euler", frame=120)

# Wire follower
add_driver_rotation(gear2, gear1, ratio=T1/T2)

# Set playback range
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end   = 120

print(f"Gear pair: {T1}/{T2} teeth, pitch distance {r1+r2:.3f}m")`,
      content: `A parametric gear system: two interlocking gears at any tooth count, mechanically correct geometry, follower driven by math so it stays in sync forever.

**What makes this the AI wow project:**
This is the kind of thing that impresses people who know 3D: geometrically correct involute tooth profiles, automatic gear ratio, perpetual sync. Done manually it's a day of work. Done with a well-prompted script it's 20 minutes.

**Key vocabulary to give your AI:**
- **Module**: the tooth size unit. Both gears must share the same module to mesh.
- **Involute tooth profile**: the mathematically correct tooth curve that produces smooth rolling contact.
- **Pressure angle**: typically 20 degrees. Controls how steep the tooth flanks are.
- **Pitch circle radius**: teeth × module / 2. Two gears mesh when their pitch circles are tangent.
- **Addendum / dedendum**: tip and root heights above/below the pitch circle. Standard: 1× module and 1.25× module.
- **Driver expression**: -driver_z * (T1 / T2). Negative for opposite rotation, ratio keeps speeds proportional.

**How to prompt:**
Start with: "Generate a Blender Python script that creates two meshing involute gears. Driver gear: 24 teeth. Follower: 12 teeth. Module: 0.12. Animate the driver one full rotation over 120 frames, add a Driver to the follower so it rotates opposite at 2x speed."

Iterate: check the tooth count, the pitch circle spacing, whether the teeth actually interlock visually. Ask AI to fix specific issues using the vocabulary above.

!! If the teeth overlap or gap: the center distance is wrong. It must equal (T1 + T2) * module / 2 exactly. Tell the AI this if it gets it wrong.

>> Change T1 and T2 to any values: 8/48, 16/64, 32/32. The ratio, spacing, and driver expression all update automatically. That's what parametric means.`,
    },
    {
      title: "Take It to Finish This",
      content: `Both projects end here: a model in the viewport with a material. Neither is a finished piece yet.

The mug is the more render-ready object: ceramic glaze catches light in a satisfying way, the form reads clearly at any angle.

Go to **Finish This** to complete the loop: light the mug, set the camera, configure Cycles, render it to a PNG.

The gear system is more of a technical showcase. Consider: a dramatic low angle, rim light to catch the metal teeth, HDRI that gives strong directional light. The animation renders as a short clip rather than a still.

>> The point of these projects is not perfect models. It's completing the workflow end-to-end: script generates it, you light it, you render it, you have a file. That full loop is the skill.`,
    },
  ],
};

export default buildThis;
