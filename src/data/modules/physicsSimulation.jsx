// Module 13: physicsSimulation

const physicsSimulation = {
    id: 13,
    emoji: "⚡",
    title: "Physics & Simulation",
    tag: "DYNAMICS",
    workflow: "py",
    specialized: true,
    color: "#fb923c",
    intro:
      "Learn which simulation system handles which problem (cloth, rigid body, fluid, smoke) and how to set one up without guessing.",
    quiz: [
      {
        q: "In Rigid Body simulation, what is a Passive object?",
        options: [
          "An object that moves slowly due to high mass",
          "A static collider: it doesn't move but other active objects bounce off it",
          "An object that absorbs simulation forces without responding",
          "An object that has been baked and can't be changed",
        ],
        answer: 1,
        explanation:
          "Passive rigid bodies are immovable colliders: floors, walls, ramps. Active rigid bodies are dynamically simulated. Every simulation needs at least one passive collider or objects fall forever.",
      },
      {
        q: "What does a Pin Group do in Cloth simulation?",
        options: [
          "Pins the entire cloth to a fixed position",
          "Marks vertices that stay fixed during simulation while the rest simulates freely",
          "Prevents the cloth from self-colliding",
          "Locks the cloth modifier so it can't be changed",
        ],
        answer: 1,
        explanation:
          "Create a vertex group, assign the verts you want fixed (e.g. the top of a tablecloth), then set it as the Pin Group. Those verts won't move: everything else drapes naturally.",
      },
      {
        q: "In Mantaflow, what is the Domain object?",
        options: [
          "The object that emits fluid or smoke",
          "The bounding box that defines where the simulation exists: fluid/smoke cannot leave it",
          "The collision object that fluid bounces off",
          "The camera through which the simulation is rendered",
        ],
        answer: 1,
        explanation:
          "The Domain is the simulation volume. Everything inside it can participate in the sim. Make it large enough to contain the full effect: fluid that reaches the boundary gets clipped.",
      },
      {
        q: "You want fire and smoke. Which Mantaflow domain type and flow type do you use?",
        options: [
          "Domain: Liquid, Flow: Inflow",
          "Domain: Gas, Flow: Fire+Smoke or Fire",
          "Domain: Gas, Flow: Liquid",
          "Domain: Rigid, Flow: Smoke",
        ],
        answer: 1,
        explanation:
          "Gas domain handles volumetric effects: smoke, fire, explosions. Set the Flow object's type to Fire, Smoke, or Fire+Smoke. Liquid domain is for water-like simulations.",
      },
    ],
    sections: [
      {
        title: "Rigid Body Simulation",
        pythonCode: `import bpy

# Make an object a Rigid Body: Active (simulated)
obj = bpy.context.active_object
bpy.ops.rigidbody.object_add()
rb = obj.rigid_body
rb.type         = 'ACTIVE'   # 'ACTIVE' = simulated, 'PASSIVE' = static collider
rb.mass         = 1.0
rb.friction     = 0.5        # 0=frictionless, 1=grippy
rb.restitution  = 0.1        # bounciness (0=dead, 1=perfect bounce)
rb.collision_shape = 'CONVEX_HULL'  # 'BOX','SPHERE','CONVEX_HULL','MESH'

# Make a floor a Passive rigid body (static collider)
bpy.ops.mesh.primitive_plane_add(size=10)
floor = bpy.context.active_object
bpy.ops.rigidbody.object_add()
floor.rigid_body.type = 'PASSIVE'
floor.rigid_body.collision_shape = 'BOX'

# Set up the Rigid Body World
scene = bpy.context.scene
scene.rigidbody_world.enabled = True
scene.rigidbody_world.substeps_per_frame = 10  # accuracy
scene.rigidbody_world.solver_iterations   = 10

# Bake the simulation (cache it)
bpy.ops.ptcache.bake_all(bake=True)`,
        content: `**Properties → Physics → Rigid Body**: Makes objects fall, collide, bounce, and stack under simulated gravity.

Two roles:
**Active**
The object participates in the simulation, is affected by gravity and collisions
**Passive**
A static collider (floor, walls). Other objects bounce off it.

Key settings:
**Mass**
Heavier objects have more momentum
**Friction**
How much objects slide vs grip
**Bounciness (Restitution)**
How elastic collisions are (0 = dead stop, 1 = perfect bounce)
**Collision Shape**
How Blender approximates the object for collision: Box, Sphere, Convex Hull, Mesh. Use Convex Hull or Mesh for complex shapes.

**Scene → Rigid Body World → Cache**
Bake the simulation to frames so it plays back reliably.
**Ctrl+A**
Apply the simulation result as keyframes if you need to edit the baked motion.

Use for: falling objects, breaking things, stacking simulations, pinball physics, dominos.`,
      },
      {
        title: "Cloth Simulation",
        pythonCode: `import bpy

cloth_obj = bpy.context.active_object

# Add cloth physics
bpy.ops.object.modifier_add(type='CLOTH')
cloth = cloth_obj.modifiers["Cloth"].settings

# Key cloth settings
cloth.mass              = 0.3     # vertex mass (light=floaty, heavy=stiff)
cloth.tension_stiffness = 15.0   # resist stretching
cloth.compression_stiffness = 15.0
cloth.shear_stiffness   = 5.0    # resist shearing
cloth.bending_stiffness = 0.5    # resist folding (low=silk, high=cardboard)
cloth.use_self_collision = True  # prevent cloth passing through itself

# Pin a vertex group (those verts stay fixed during sim)
# First create a vertex group in Edit Mode and assign top verts to it
cloth.vertex_group_mass = "PinGroup"  # name of the vertex group

# Add Collision physics to objects the cloth should interact with
collider = bpy.data.objects["TableSurface"]
bpy.context.view_layer.objects.active = collider
bpy.ops.object.modifier_add(type='COLLISION')
collider.collision.thickness_outer = 0.01

# Bake
bpy.context.view_layer.objects.active = cloth_obj
bpy.ops.ptcache.bake_all(bake=True)`,
        content: `**Properties → Physics → Cloth**: Simulates fabric: draping, colliding with objects, responding to wind.

Key settings:
**Vertex Mass**
How heavy the fabric is. Light = floaty, heavy = stiff.
**Stiffness → Tension/Compression/Shear**
How much the cloth resists stretching and shearing. Low = silky, High = canvas.
**Bending**
Resistance to folding. Low = silk, High = cardboard.
**Self Collision**
Prevents cloth from passing through itself (computationally expensive).
**Collision**
Enable on the objects the cloth should land on (Properties → Physics → Collision).

**Pinning**: Select vertices in Edit Mode → assign to a Vertex Group. In Cloth → Shape → Pin Group, use that group. Those vertices stay fixed while the rest simulates.

Use for: draped tablecloths, clothing on a character, flags, curtains, falling fabric.

**Bake**: Properties → Physics → Cloth → Cache → Bake. Always bake before rendering.`,
      },
      {
        title: "Fluid & Gas Simulation (Mantaflow)",
        pythonCode: `import bpy

# ── LIQUID SETUP ──
# 1. Domain object (the simulation volume)
bpy.ops.mesh.primitive_cube_add(size=3)
domain_obj = bpy.context.active_object
domain_obj.name = "FluidDomain"
bpy.ops.object.modifier_add(type='FLUID')
domain = domain_obj.modifiers["Fluid"].domain_settings
domain.domain_type       = 'LIQUID'
domain.resolution_max    = 64       # higher = more detail, much slower
domain.use_mesh          = True     # generate smooth liquid surface mesh
domain.use_spray         = True     # spray/foam particles

# 2. Flow object (the emitter)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.3, location=(0, 0, 1.2))
emitter = bpy.context.active_object
bpy.ops.object.modifier_add(type='FLUID')
flow = emitter.modifiers["Fluid"].flow_settings
flow.flow_type     = 'LIQUID'
flow.flow_behavior = 'INFLOW'  # continuous source ('INFLOW','OUTFLOW','GEOMETRY')

# ── GAS SETUP ──
bpy.ops.mesh.primitive_cube_add(size=3)
gas_domain = bpy.context.active_object
bpy.ops.object.modifier_add(type='FLUID')
gd = gas_domain.modifiers["Fluid"].domain_settings
gd.domain_type  = 'GAS'
gd.vorticity    = 0.1    # turbulence/swirling
gd.use_noise    = True   # high-detail noise

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, location=(0,0,0))
gas_src = bpy.context.active_object
bpy.ops.object.modifier_add(type='FLUID')
gf = gas_src.modifiers["Fluid"].flow_settings
gf.flow_type     = 'FIRE'  # 'SMOKE','FIRE','BOTH','LIQUID'
gf.flow_behavior = 'INFLOW'`,
        content: `Blender uses **Mantaflow** for both liquid and gas (smoke/fire) simulations. Both use a **Domain** object + **Flow** objects + optional **Effectors**.

Setup:
1. Create a box → **Properties → Physics → Fluid → Domain** (this is the simulation volume)
2. Create the source (emitter) → **Properties → Physics → Fluid → Flow**
3. Set Domain type: **Liquid** or **Gas**

**Liquid (water)**: Resolution determines quality (64–128 for preview, 256+ for final). Enable **Mesh** in Domain settings for a smooth liquid surface. Add **Diffuse** particles for spray/foam.

**Gas (fire/smoke)**: Set Flow type to Fire+Smoke or just Smoke. Add a **Vorticity** value for turbulent, swirling smoke. Use the **Noise modifier** (in Domain settings) for fine detail. Render smoke with **Cycles** for best results (volumetric rendering).

**Effectors**: objects that redirect fluid flow (obstacles). Add them via Physics → Fluid → Effector.

Cache and bake before rendering. Gas sims especially benefit from baking to disk.`,
      },
      {
        title: "Particles, Hair & Force Fields",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Add a particle system
bpy.ops.object.particle_system_add()
ps = obj.particle_systems[-1]
settings = ps.settings

# Emitter particle settings
settings.type            = 'EMITTER'  # or 'HAIR'
settings.count           = 1000
settings.frame_start     = 1
settings.frame_end       = 50
settings.lifetime        = 80        # frames each particle lives
settings.normal_factor   = 2.0       # initial velocity along normal
settings.factor_random   = 0.5       # velocity randomness

# Physics
settings.physics_type    = 'NEWTON'  # 'NEWTON','KEYED','BOIDS','FLUID'
settings.use_self_effect = False
settings.drag_factor     = 0.0

# Render particles as an instanced object
settings.render_type  = 'OBJECT'
settings.instance_object = bpy.data.objects["Debris"]

# Force Fields: create wind
bpy.ops.object.effector_add(type='WIND', location=(0, -3, 1))
wind = bpy.context.active_object
wind.field.strength   = 5.0
wind.field.flow       = 1.0

# Turbulence
bpy.ops.object.effector_add(type='TURBULENCE', location=(0, 0, 2))
turb = bpy.context.active_object
turb.field.strength = 2.0
turb.field.size     = 1.0`,
        content: `**Properties → Particles → Add**: Particle systems for emission and hair.

**Emitter particles**: Objects born at a surface, move through space, die.
- **Emission**: count, start/end frame, lifetime
- **Physics**: Newtonian (gravity, drag), Keyed (follow another particle), Boids (flocking AI)
- **Render**: render as Object, Collection, or geometry (dots, halos)

**Hair particles** (legacy): generate strands from a surface. Controlled with Particle Edit mode. The **new hair system** uses Geometry Nodes (see Module 7) and is preferred in Blender 4.x+.

**Force Fields** (Shift+A → Force Field):
**Wind**
Constant directional push
**Turbulence**
Random chaotic movement
**Vortex**
Spiral/spinning force
**Magnetic**
Attract/repel based on particle charge
**Gravity / Force**
Point gravity well or constant force

Force fields affect particles, cloth, soft body, and rigid bodies. Layer multiple fields for complex motion.

**Soft Body** (Physics → Soft Body): elastic, bouncy deformation. Objects squish and jiggle. Use for bouncy logos, jello, organic squash and stretch.`,
      },
      {
        title: "🔨 Mini Workshop: Falling Cubes",
        isWorkshop: true,
        pythonCode: `import bpy
import random

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Floor (passive)
bpy.ops.mesh.primitive_plane_add(size=8)
floor = bpy.context.active_object
bpy.ops.rigidbody.object_add()
floor.rigid_body.type = 'PASSIVE'

# Spawn cubes with random positions
for i in range(10):
    x = random.uniform(-1.5, 1.5)
    y = random.uniform(-1.5, 1.5)
    z = random.uniform(2.0, 6.0)
    bpy.ops.mesh.primitive_cube_add(size=0.4, location=(x, y, z))
    cube = bpy.context.active_object
    cube.name = f"FallingCube_{i}"
    bpy.ops.rigidbody.object_add()
    cube.rigid_body.type        = 'ACTIVE'
    cube.rigid_body.restitution = 0.3
    cube.rigid_body.friction    = 0.6

# Ensure rigid body world exists
bpy.context.scene.rigidbody_world.enabled = True

# Add wind field
bpy.ops.object.effector_add(type='WIND', location=(0, -4, 2))
wind = bpy.context.active_object
wind.field.strength = 3.0
wind.rotation_euler[0] = 1.5708  # point sideways`,
        content: `The quickest way to see simulation working:

1. **Shift+A → Plane**: scale large (S → 5). **Properties → Physics → Rigid Body → Passive** (this is the floor).
2. **Shift+A → Cube**: position 3 units above the plane. **Physics → Rigid Body → Active**.
3. Duplicate the cube (Shift+D) 5–10 times, scatter randomly above the plane at different heights.
4. Press **Space** (or the play button in the Timeline): the cubes fall and pile up.
5. Try: change Bounciness on a cube to 0.8 and watch it bounce.
6. Add **Shift+A → Force Field → Wind**: point it sideways. The cubes now drift.

✅ Goal: See that simulation is a system of parameters: not keyframes: and understand how to compose it`,
      },
    ],
  };

export default physicsSimulation;
