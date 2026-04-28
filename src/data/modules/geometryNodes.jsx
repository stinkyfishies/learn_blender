// Module 8: geometryNodes

const geometryNodes = {
    id: 8,
    emoji: "🔷",
    title: "Geometry Nodes",
    tag: "PROCEDURAL GENERATION",
    workflow: "py",
    specialized: true,
    color: "#38bdf8",
    intro:
      "Learn what Geometry Nodes is for, how to read a basic node graph, and when to reach for it over manual modeling.",
    quiz: [
      {
        q: "What is a Field in Geometry Nodes?",
        options: [
          "A named input parameter on a node group",
          "A value that is evaluated per-element (per vertex, face, instance) rather than as a single constant",
          "A 2D texture used to drive geometry",
          "A node that stores multiple geometry outputs",
        ],
        answer: 1,
        explanation:
          "Fields are functions, not values. A Position field doesn't return one point: it returns the position of each element individually. This is what makes 'distribute across a surface' possible.",
      },
      {
        q: "You want to scatter 5,000 rocks across a terrain with near-zero memory cost. What's the GN approach?",
        options: [
          "Duplicate the rock object 5,000 times manually",
          "Use Array modifier with count 5000",
          "Distribute Points on Faces → Instance on Points, with the rock as the instance",
          "Export and reimport as a particle system",
        ],
        answer: 2,
        explanation:
          "Instances are lightweight references: 5,000 instances point to one rock mesh. Near-zero memory overhead vs 5,000 duplicates which would copy all geometry.",
      },
      {
        q: "What do Simulation Zones in Geometry Nodes allow you to do?",
        options: [
          "Simulate rendering performance before a final render",
          "Run per-frame iterative logic where each frame can read the previous frame's state",
          "Preview physics simulations faster",
          "Run geometry nodes only during simulation playback",
        ],
        answer: 1,
        explanation:
          "Simulation Zones pass state from frame to frame: the output of frame N becomes the input of frame N+1. This enables custom physics, growth algorithms, and any iterative process.",
      },
      {
        q: "What's the key difference between using GN for hair vs the legacy particle hair system?",
        options: [
          "GN hair is slower and only works in Cycles",
          "GN hair is Curves-based, fully procedural, and integrated with the node graph: the legacy system uses particles and is being phased out",
          "GN hair requires a GPU",
          "There is no difference: they produce identical results",
        ],
        answer: 1,
        explanation:
          "The new hair system (Blender 4.x+) treats each strand as a Curves object, which can be driven and styled procedurally in GN. Legacy particle hair is deprecated.",
      },
    ],
    sections: [
      {
        title: "What Geometry Nodes Is For",
        pythonCode: `import bpy

# Add a Geometry Nodes modifier to an object
obj = bpy.context.active_object
mod = obj.modifiers.new("GeoNodes", 'NODES')

# Create a new node group and assign it
ng = bpy.data.node_groups.new("MyGeoNodes", 'GeometryNodeTree')
mod.node_group = ng

# Add Group Input and Group Output (the minimum valid graph)
ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

input_node  = ng.nodes.new('NodeGroupInput')
output_node = ng.nodes.new('NodeGroupOutput')
input_node.location  = (-300, 0)
output_node.location = (300, 0)

# Connect input → output (pass-through, no changes yet)
ng.links.new(input_node.outputs[0], output_node.inputs[0])`,
        content: `Geometry Nodes (GN) lets you define geometry through rules rather than by hand. The results are:
- Fully non-destructive: the node graph is always editable
- Instantly animatable: any value can be driven by time, a driver, or another node
- Instancing-friendly: generate thousands of objects with near-zero memory cost

When to reach for Geometry Nodes:
- Any **repeated or distributed** geometry (trees in a forest, bolts on a panel, bricks on a wall)
- **Procedural shapes** that would take too long to model manually
- **Rule-based generation** where parameters should be tweakable
- **Hair and fur** (Blender 4.x+ uses GN for the hair system)
- **Simulation** (Blender 4.1+ Simulation Zones run physics inside GN)
- **Anything you want to animate that isn't keyframeable with standard tools**

Access: Select an object → **Properties → Modifier → Add → Geometry Nodes**. This creates a GN modifier and opens the Geometry Node Editor.`,
      },
      {
        title: "Core Concepts: Fields, Instances, Attributes",
        pythonCode: `import bpy

# Read a named attribute from a mesh via Python
obj = bpy.context.active_object
mesh = obj.data

# Access built-in attributes
mesh.attributes["position"]       # vertex positions (FLOAT_VECTOR on POINT domain)
mesh.attributes[".edge_verts"]    # edge connectivity

# Create a custom attribute
attr = mesh.attributes.new(name="my_weight", type='FLOAT', domain='POINT')
# domain options: 'POINT' (vertex), 'EDGE', 'FACE', 'CORNER', 'CURVE', 'INSTANCE'

# Write values to it
for i, val in enumerate(attr.data):
    val.value = i / len(attr.data)  # 0.0 → 1.0 gradient

# Read attribute values
for val in mesh.attributes["my_weight"].data:
    print(val.value)

# Geometry Nodes exposes attributes as named inputs/outputs
# Use "Named Attribute" node in GN to read "my_weight" as a field`,
        content: `**Fields**: Values that vary per-element. Instead of one number, a field is a function evaluated at each vertex/edge/face/instance. This is what makes "distribute across a surface" possible: the position field gives each point's location.

**Instances**
Lightweight references to geometry placed at many locations. An instance doesn't copy the mesh: it points to the original. 10,000 trees as instances use almost no extra memory. Key nodes:
**Instance on Points**
Place a geometry (or collection) at every point in a point cloud
**Realize Instances**
Convert instances to actual mesh data (necessary before some operations)

**Attributes**
Named data stored per-element (vertex, edge, face, instance). Position, normal, ID, custom names. You can create, read, and write attributes. They flow through the graph.

**Domains**
Where attributes live: Vertex, Edge, Face, Face Corner, Spline, Instance. Nodes can transfer data between domains.`,
      },
      {
        title: "Key Node Categories",
        pythonCode: `import bpy

ng = bpy.data.node_groups["MyGeoNodes"]
nodes = ng.nodes
links = ng.links

# Helper to add and position a node
def add_node(type_name, x=0, y=0):
    n = nodes.new(type_name)
    n.location = (x, y)
    return n

# Key node type names (use these strings with nodes.new())
# Geometry
join        = add_node('GeometryNodeJoinGeometry',         200,  0)
transform   = add_node('GeometryNodeTransform',            200, -200)
merge_dist  = add_node('GeometryNodeMergeByDistance',      200, -400)

# Points & Instances
distribute  = add_node('GeometryNodeDistributePointsOnFaces', -200, 100)
instance_on = add_node('GeometryNodeInstanceOnPoints',        0,   100)
rand_val    = add_node('FunctionNodeRandomValue',             -200, -100)
col_info    = add_node('GeometryNodeCollectionInfo',          -400, 100)

# Mesh primitives (create inside the graph, no scene object needed)
cube_prim   = add_node('GeometryNodeMeshCube',             -400, 200)

# Utilities
math_node   = add_node('ShaderNodeMath',                   0, -200)
map_range   = add_node('ShaderNodeMapRange',               0, -400)
mix_node    = add_node('ShaderNodeMix',                    0, -600)`,
        content: `All accessed via **Shift+A** in the Geometry Node Editor:

**Geometry**:
**Join Geometry**
Merge multiple geometry streams into one
**Transform Geometry**
Move/rotate/scale geometry in the graph
**Merge by Distance**
Weld close vertices (like the Weld modifier)
**Subdivide Mesh**
Subdivide inside the graph

**Instances**:
**Instance on Points**
The workhorse distribution node
**Rotate Instances**
Randomize rotation per instance
**Scale Instances**
Randomize scale per instance
**Collection Info**
Bring a collection into the graph as instancable geometry

**Point**:
**Distribute Points on Faces**
Scatter points across a surface (random or Poisson disk)
**Points to Vertices**
Convert a point cloud to a mesh

**Mesh Primitives**
Create cubes, spheres, cylinders inside the graph without scene objects

**Utilities**:
**Random Value**
Generate random floats/vectors/integers/booleans per-element
**Math**
Every math operation you need
**Mix**
Blend between two values by a factor
**Map Range**
Remap a value from one range to another (like lerp + clamp)

**Input**:
**Position**
The world position of each element (a field)
**Index**
The integer index of each element
**Named Attribute**
Read a custom attribute by name`,
      },
      {
        title: "Simulation Zones (Blender 4.1+)",
        versionNote: "v4.1+",
        pythonCode: `import bpy

# Simulation zones are defined by two paired nodes in the graph:
# GeometryNodeSimulationInput and GeometryNodeSimulationOutput
# Everything wired between them runs per-frame, retaining state.

ng = bpy.data.node_groups["MyGeoNodes"]

sim_in  = ng.nodes.new('GeometryNodeSimulationInput')
sim_out = ng.nodes.new('GeometryNodeSimulationOutput')
sim_in.location  = (-100, 0)
sim_out.location = (300, 0)

# The simulation zone pair is linked automatically on creation.
# Wire geometry through: Group Input → Sim Input → [process] → Sim Output → Group Output

# Bake simulation from Python
bpy.ops.object.simulation_nodes_cache_bake(override={"selected_editable_objects": [bpy.context.active_object]})

# Clear baked simulation
bpy.ops.object.simulation_nodes_cache_delete()

# Set bake path
obj = bpy.context.active_object
mod = obj.modifiers["GeoNodes"]
# Bake path is set per modifier in the UI (Properties → Modifier → Bake)`,
        content: `**Simulation Zones** let you run iterative (frame-by-frame) simulation logic inside Geometry Nodes. This means you can write custom physics, growth algorithms, or state machines: entirely in nodes.

Structure:
- **Simulation Input** node → process geometry for one frame → **Simulation Output** node
- Whatever geometry flows through the zone is "remembered" and passed to the next frame
- You can read the previous frame's state and use it to compute the next

What this unlocks:
- Custom particle systems with GN-controlled behavior
- Growth/spread simulations (fire spread, crystal growth)
- Agent-based motion
- Reaction-diffusion patterns
- Any iterative process

This is advanced but understanding it exists changes what you think is possible.`,
      },
      {
        title: "Hair System (Geometry Nodes Based)",
        versionNote: "v4.0+",
        pythonCode: `import bpy

# Add a hair curves object parented to a mesh
surface = bpy.data.objects["Character_Head"]
bpy.ops.object.curves_empty_hair_add(surface_object=surface.name)
hair = bpy.context.active_object  # bpy.types.Curves object

# Read hair strand data
curves = hair.data  # bpy.types.Curves
print(f"Strands: {len(curves.curves)}")
print(f"Total points: {len(curves.points)}")

# Each strand has a slice of points
for curve in curves.curves:
    pts = curves.points[curve.first_point_index : curve.first_point_index + curve.points_length]
    for pt in pts:
        print(pt.position)

# Add a Geometry Nodes modifier to procedurally style hair
mod = hair.modifiers.new("HairGeoNodes", 'NODES')
# Then build the node graph to scatter, grow, and style strands`,
        content: `As of Blender 4.x, the new hair system is built on Geometry Nodes. Hair is a **Curves** object: each strand is a spline.

**Object → Add → Curve → Empty Hair**
starts a hair object parented to a mesh (the mesh acts as the base surface).

In the **Hair Curves** context:
- Use sculpt brushes to style hair (comb, cut, smooth, clump)
- Hair is instanced as actual strand geometry at render time

In Geometry Nodes, you can procedurally generate hair by:
- Distributing points on the surface
- Creating curves at those points with defined length/direction
- Adding noise for variation

Key nodes for hair: **Distribute Points on Faces**, **Curve Line**, **Set Curve Normal**, **Noise Texture** (for random variation), **Resample Curve** (for render resolution).`,
      },
      {
        title: "🔨 Mini Workshop: Scatter Objects on a Surface",
        isWorkshop: true,
        pythonCode: `import bpy

# Build the full scatter graph in Python
bpy.ops.mesh.primitive_grid_add(x_subdivisions=1, y_subdivisions=1, size=10)
ground = bpy.context.active_object

bpy.ops.mesh.primitive_ico_sphere_add(radius=0.1)
sphere = bpy.context.active_object
sphere.hide_set(True)  # hide from viewport (still available to GN)

# Add GN modifier to ground
mod = ground.modifiers.new("Scatter", 'NODES')
ng = bpy.data.node_groups.new("ScatterNodes", 'GeometryNodeTree')
mod.node_group = ng

# Setup interface
ng.interface.new_socket("Geometry", in_out='INPUT',  socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')

n = ng.nodes
l = ng.links

inp  = n.new('NodeGroupInput');  inp.location  = (-600, 0)
out  = n.new('NodeGroupOutput'); out.location  = (600,  0)
dist = n.new('GeometryNodeDistributePointsOnFaces'); dist.location = (-300, 0)
inst = n.new('GeometryNodeInstanceOnPoints');        inst.location = (0,    0)
info = n.new('GeometryNodeObjectInfo');              info.location = (-300, -200)
info.inputs["Object"].default_value = sphere

dist.inputs["Density"].default_value = 5.0  # instances per m²

l.new(inp.outputs[0],  dist.inputs["Mesh"])
l.new(dist.outputs[0], inst.inputs["Points"])
l.new(info.outputs["Geometry"], inst.inputs["Instance"])
l.new(inst.outputs[0], out.inputs[0])`,
        content: `The foundational GN workflow: place objects procedurally on a mesh:

1. **Shift+A → Mesh → Grid**: your ground plane (scale it up: S → 5)
2. **Shift+A → Mesh → Ico Sphere**: the object you'll scatter. Scale small (S → 0.1). Keep it in scene.
3. Select the **Grid** → Properties → Modifier → Add → **Geometry Nodes**
4. In the node editor, **Shift+A → Point → Distribute Points on Faces**: place it between Group Input and Group Output. Connect: Geometry → Mesh, Geometry → Geometry.
5. **Shift+A → Instances → Instance on Points**: connect: Points → Points, output Instances → Geometry.
6. **Shift+A → Input → Object Info**: set the Object to your Ico Sphere. Connect: Geometry → Instance (on Instance on Points).

You now have hundreds of spheres scattered on the grid: procedurally.

7. Add **Rotate Instances** node after Instance on Points → connect a **Random Value** (Vector) to Rotation for random rotation.

✅ Goal: Understand the Distribute → Instance → Modify pipeline: the foundation of 80% of GN work`,
      },
    ],
  };

export default geometryNodes;
