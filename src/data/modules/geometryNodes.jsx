// Module: geometryNodes

const geometryNodes = {
    id: 8,
    emoji: "🔷",
    title: "Geometry Nodes",
    tag: "PROCEDURAL GENERATION",
    workflow: "py",
    specialized: true,
    color: "#38bdf8",
    intro:
      "Learn Geometry Nodes by building one thing: a ripple wave. Every concept is introduced only when the wave needs it.",
    quiz: [
      {
        q: "You connect a Position node to a Math node set to Sine. What does this produce?",
        options: [
          "A static flat mesh with no visible change",
          "A sine wave displacement: every vertex moves based on its position, producing a wave shape",
          "An error: Position outputs a Vector, not a Float",
          "A random noise pattern across the mesh",
        ],
        answer: 1,
        explanation:
          "Position gives each vertex its XY location. Feeding that into Sine applies the sine function per-vertex: vertices at different X positions get different Z offsets, producing a wave. This is the core of how GN displaces geometry.",
      },
      {
        q: "You want the wave to animate: moving forward over time. What do you add to the sine input?",
        options: [
          "A Noise Texture node",
          "A Timeline node",
          "A Scene Time node (outputting Seconds or Frame), subtracted from the position value",
          "A Keyframe on the Math node's Value input",
        ],
        answer: 2,
        explanation:
          "Scene Time outputs the current frame or elapsed seconds as a number. Subtracting it from the position before the sine function shifts the wave's phase over time — the wave appears to move. This is called phase animation.",
      },
      {
        q: "What is a Field in Geometry Nodes?",
        options: [
          "A named group input on a node group",
          "A value evaluated per-element: each vertex, face, or instance gets its own result",
          "A texture used to drive geometry displacement",
          "A 2D grid of values baked from a simulation",
        ],
        answer: 1,
        explanation:
          "Fields are the reason GN can say 'displace every vertex by a function of its position.' A field isn't one number: it's a rule evaluated independently at every element. Position is a field. Sine of position is a field. That's what makes per-vertex displacement possible.",
      },
      {
        q: "You want expanding rings from a center point rather than parallel wave bands. What changes in the wave math?",
        options: [
          "Use Y position instead of X position as the sine input",
          "Replace the X position input with the distance from the center: length of the XY position vector",
          "Add a Rotate Instances node to the graph",
          "Switch the Math node from Sine to Cosine",
        ],
        answer: 1,
        explanation:
          "Parallel bands use one axis (X) as the sine input. Expanding rings use radial distance from center: the length of the (X, Y) vector. Every vertex at the same distance from center gets the same displacement, producing a ring.",
      },
    ],
    sections: [
      {
        title: "What Geometry Nodes Actually Does",
        pythonCode: `import bpy

# Add a GN modifier to any object
obj = bpy.context.active_object
mod = obj.modifiers.new("GeoNodes", 'NODES')

# Create and assign a node group
ng = bpy.data.node_groups.new("RippleWave", 'GeometryNodeTree')
mod.node_group = ng

# Every GN graph needs these two nodes minimum
ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

inp = ng.nodes.new('NodeGroupInput');  inp.location = (-400, 0)
out = ng.nodes.new('NodeGroupOutput'); out.location = ( 400, 0)

# Pass geometry through unchanged (nothing happens yet)
ng.links.new(inp.outputs[0], out.inputs[0])`,
        content: `Geometry Nodes is a modifier. You add it to an object, and it gives you a node graph where you describe what should happen to that object's geometry — procedurally, non-destructively, animatably.

The graph has two fixed endpoints:
- **Group Input**: the object's geometry comes in here
- **Group Output**: whatever you wire here is what renders

Everything in between is up to you. You connect nodes that transform, displace, distribute, or generate geometry. The object updates live as you wire nodes.

The key insight: **every node operation happens to every vertex simultaneously**. When you say "displace by sine of position," Blender evaluates that for every vertex in parallel. You're not writing a loop — you're describing a rule.

This is what makes it Python-native in spirit: you describe the transformation, not the steps.`,
      },
      {
        title: "Step 1: Displace a Grid",
        pythonCode: `import bpy, math

# Start with a subdivided grid (needs enough vertices to show the wave)
bpy.ops.mesh.primitive_grid_add(x_subdivisions=64, y_subdivisions=64, size=4)
obj = bpy.context.active_object

mod = obj.modifiers.new("RippleWave", 'NODES')
ng  = bpy.data.node_groups.new("RippleWave", 'GeometryNodeTree')
mod.node_group = ng

ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

n = ng.nodes
l = ng.links

inp  = n.new('NodeGroupInput');       inp.location  = (-800, 0)
out  = n.new('NodeGroupOutput');      out.location  = ( 400, 0)

# Get vertex positions
pos  = n.new('GeometryNodeInputPosition'); pos.location = (-600, -150)

# Separate XYZ to get the X component
sep  = n.new('ShaderNodeSeparateXYZ');    sep.location = (-400, -150)

# Apply sine to X position
sine = n.new('ShaderNodeMath');           sine.location = (-200, -150)
sine.operation = 'SINE'

# Scale the sine output (wave height)
scale = n.new('ShaderNodeMath');          scale.location = (0, -150)
scale.operation = 'MULTIPLY'
scale.inputs[1].default_value = 0.3  # amplitude: 0.3m wave height

# Combine back into a vector (only Z changes)
comb = n.new('ShaderNodeCombineXYZ');     comb.location = (200, -150)

# Set position on the geometry
setpos = n.new('GeometryNodeSetPosition'); setpos.location = (200, 0)

l.new(inp.outputs[0],    setpos.inputs["Geometry"])
l.new(pos.outputs[0],    sep.inputs[0])
l.new(sep.outputs[0],    sine.inputs[0])   # X → Sine
l.new(sine.outputs[0],   scale.inputs[0])
l.new(scale.outputs[0],  comb.inputs[2])   # into Z
l.new(comb.outputs[0],   setpos.inputs["Offset"])
l.new(setpos.outputs[0], out.inputs[0])`,
        content: `Start with a **Grid** (Shift+A → Mesh → Grid). In F9, set X and Y subdivisions to 64. You need enough vertices to see the wave — a grid with 4 vertices is too coarse.

Add a **Geometry Nodes modifier**. In the node editor, build this chain:

**Position** → **Separate XYZ** → **Math (Sine)** → **Math (Multiply)** → **Combine XYZ** → **Set Position**

What each node does:
- **Position**: outputs the XYZ location of each vertex as a vector
- **Separate XYZ**: breaks the vector into individual X, Y, Z numbers
- **Math (Sine)**: applies the sine function to X — vertices at different X positions get different values
- **Math (Multiply)**: scales the result (this is your wave height/amplitude)
- **Combine XYZ**: puts the value back as a vector, only in the Z channel
- **Set Position**: moves each vertex by that offset

The result: a sine wave running across the grid. Vertices undulate based on their X position.

!! The grid needs enough subdivisions to show a smooth wave. Too few and you get a jagged zigzag. 32+ per axis is a reasonable starting point.`,
      },
      {
        title: "Step 2: Animate It",
        pythonCode: `import bpy

ng = bpy.data.node_groups["RippleWave"]
n  = ng.nodes
l  = ng.links

# Add Scene Time node (outputs current frame as a number)
time = n.new('GeometryNodeInputSceneTime'); time.location = (-600, -300)

# Add a Math node to scale the time (controls wave speed)
speed = n.new('ShaderNodeMath'); speed.location = (-400, -300)
speed.operation = 'MULTIPLY'
speed.inputs[1].default_value = 0.1  # lower = slower wave

# Subtract time from position before sine: this shifts the phase
subtract = n.new('ShaderNodeMath'); subtract.location = (-200, -300)
subtract.operation = 'SUBTRACT'

# Re-wire: X position and time both go into Subtract, then into Sine
sep  = n["Separate XYZ"]
sine = n["Math"]  # the Sine node from step 1

# Disconnect X from sine, route through subtract first
for link in list(l):
    if link.from_node == sep and link.to_node == sine:
        l.remove(link)

l.new(sep.outputs[0],      subtract.inputs[0])   # X position
l.new(speed.outputs[0],    subtract.inputs[1])   # scaled time
l.new(time.outputs["Frame"], speed.inputs[0])    # frame number
l.new(subtract.outputs[0], sine.inputs[0])       # phase-shifted X into sine`,
        content: `The wave is static. To animate it, you need to shift its phase over time.

**Phase** is the offset of a wave — shifting it makes the wave appear to move forward.

Add a **Scene Time** node (Shift+A → Input → Scene Time). It outputs the current frame number. Multiply that by a small value (0.1) to control speed. Then **subtract** it from the X position before feeding into Sine.

The result: as the frame number increases, the phase shifts, and the wave appears to travel across the grid.

Press **Spacebar** to play — you now have a moving wave.

**Controlling the wave:**
- **Amplitude** (Multiply value after Sine): wave height. 0.1 = gentle ripple, 0.5 = dramatic.
- **Frequency**: multiply the X position before Sine to increase how many wave peaks fit across the grid.
- **Speed**: multiply the Scene Time before subtracting. Higher = faster.

These three numbers — amplitude, frequency, speed — are the controls for every wave effect you'll ever build.`,
      },
      {
        title: "Step 3: Make It Radial (Expanding Rings)",
        pythonCode: `import bpy

ng = bpy.data.node_groups["RippleWave"]
n  = ng.nodes
l  = ng.links

# Replace the X-only input with radial distance from center
# Vector Math: Length of the XY position vector

pos  = n["Input Position"]   # already exists
sep  = n["Separate XYZ"]     # already exists

# Add Vector Math node to compute distance from center
vmath = n.new('ShaderNodeVectorMath'); vmath.location = (-600, -100)
vmath.operation = 'LENGTH'

# Re-wire: full position vector into Length, output scalar into subtract
sub = n["Subtract"]  # already exists from step 2

for link in list(l):
    if link.from_node == sep and link.to_node == sub:
        l.remove(link)

l.new(pos.outputs[0],    vmath.inputs[0])   # full XYZ into Length
l.new(vmath.outputs[1],  sub.inputs[0])     # scalar distance into subtract

# Now the sine input is distance from center, not just X
# Result: concentric expanding rings instead of parallel bands`,
        content: `Parallel bands use X position as the sine input. Expanding rings use **distance from center**.

The change: instead of Separate XYZ → take X, use **Vector Math (Length)** on the full position vector. Length gives you a single number: how far each vertex is from the origin (0,0,0).

Every vertex at the same distance from center gets the same displacement — producing a ring. As time advances and phase shifts, the ring expands outward.

This is the singing bowl wave. Place this graph on a plane at the bowl's position and the rings expand from the bowl's center.

**Controlling the rings:**
- More frequency = tighter rings, more visible at once
- Faster speed = rings expand quickly (match to the bowl's sustain time)
- Amplitude that decays with distance = rings fade as they expand (add a Divide by Distance node after the sine)

>> The only difference between parallel bands and expanding rings is what feeds into the sine function. One axis = bands. Distance from center = rings. This is the core pattern in wave math.`,
      },
      {
        title: "Step 4: Fade With Distance",
        pythonCode: `import bpy

ng = bpy.data.node_groups["RippleWave"]
n  = ng.nodes
l  = ng.links

# The amplitude should decrease with distance from center
# Multiply the sine output by (1 / distance), clamped

vmath = n["Vector Math"]  # Length node from step 3

# Add nodes for falloff
# Map Range: remap distance (0 to 2m) to amplitude (1 to 0)
falloff = n.new('ShaderNodeMapRange'); falloff.location = (-100, -300)
falloff.inputs["From Min"].default_value = 0.0
falloff.inputs["From Max"].default_value = 2.0
falloff.inputs["To Min"].default_value   = 1.0  # full amplitude at center
falloff.inputs["To Max"].default_value   = 0.0  # zero amplitude at edge

# Multiply: sine * falloff
mul_fade = n.new('ShaderNodeMath'); mul_fade.location = (100, -200)
mul_fade.operation = 'MULTIPLY'

# Re-wire: after sine and scale, multiply by falloff
scale_node = n["Multiply"]  # amplitude scale from step 1
comb       = n["Combine XYZ"]

for link in list(l):
    if link.from_node == scale_node and link.to_node == comb:
        l.remove(link)

l.new(vmath.outputs[1],     falloff.inputs["Value"])
l.new(scale_node.outputs[0], mul_fade.inputs[0])
l.new(falloff.outputs[0],    mul_fade.inputs[1])
l.new(mul_fade.outputs[0],   comb.inputs[2])`,
        content: `Real waves lose energy as they travel. The rings should be tallest at the center and fade to nothing at the edge.

Add a **Map Range** node:
- Input: the distance from center (reuse the Length output from Step 3)
- From: 0 → 2 (meters from center)
- To: 1 → 0 (amplitude at that distance)

Then **Multiply** the sine output by this falloff value. At the center (distance 0): amplitude × 1 = full height. At 2m out: amplitude × 0 = flat.

The result: a wave that blooms from the center and fades as it expands — exactly the physical behavior of a singing bowl's vibration.

**Map Range** is one of the most useful nodes in GN. It translates any number from one range to another. You'll use it constantly to convert raw math outputs into meaningful visual ranges.`,
      },
      {
        title: "🔨 Mini Workshop: Build the Wave",
        isWorkshop: true,
        pythonCode: `import bpy

# Run this to set up the starting point
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

bpy.ops.mesh.primitive_grid_add(x_subdivisions=64, y_subdivisions=64, size=4)
grid = bpy.context.active_object
grid.name = "WavePlane"

mod = grid.modifiers.new("RippleWave", 'NODES')
ng  = bpy.data.node_groups.new("RippleWave", 'GeometryNodeTree')
mod.node_group = ng

ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

inp = ng.nodes.new('NodeGroupInput');  inp.location = (-800, 0)
out = ng.nodes.new('NodeGroupOutput'); out.location = ( 600, 0)
ng.links.new(inp.outputs[0], out.inputs[0])

# Switch to Geometry Node Editor and build the graph manually
# following the steps in this module
print("Grid ready. Build the wave graph in the Geometry Node Editor.")`,
        content: `Build the full ripple wave from scratch, following the four steps in this module:

1. **Grid setup**: 64x64 subdivisions, size 4m
2. **Step 1**: Position → Separate XYZ → Sine → Multiply → Combine XYZ → Set Position. Confirm you see a static sine wave.
3. **Step 2**: Add Scene Time → Multiply (speed) → Subtract before Sine. Press Spacebar: wave moves.
4. **Step 3**: Replace X with Vector Math (Length) of full position. Wave becomes expanding rings.
5. **Step 4**: Add Map Range on distance → Multiply with sine output. Rings fade at the edge.

**Tune it:**
- Amplitude: 0.05–0.1 for subtle, 0.3+ for dramatic
- Frequency: multiply X/distance by 5–15 before Sine
- Speed: multiply Scene Time by 0.05–0.2

**Take it further:** add a second wave at a different frequency and Mix the two displacements together. Two overlapping waves produce the interference patterns that make singing bowls visually distinctive.

✅ Goal: A plane with animated expanding rings that fade with distance. If it looks like it could be a bowl vibrating, you're done.`,
      },
    ],
  };

export default geometryNodes;
