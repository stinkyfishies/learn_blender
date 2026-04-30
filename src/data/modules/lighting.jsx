// Module 10: lighting

const lighting = {
    id: 10,
    emoji: "💡",
    title: "Lighting",
    tag: "ILLUMINATION",
    workflow: "both",
    color: "#fbbf24",
    intro:
      "Learn which light type to use for which situation and how to set up a scene that looks good in both EEVEE Next and Cycles.",
    quiz: [
      {
        q: "Which light type produces the softest shadows, and why?",
        options: [
          "Point: because it emits in all directions",
          "Sun: because it's infinitely far away",
          "Area: because it's a large surface emitter; larger size = softer shadows",
          "Spot: because of the Blend parameter",
        ],
        answer: 2,
        explanation:
          "Shadow softness is determined by apparent light source size. Area lights are physical surfaces: a 2m area light produces much softer shadows than a 0.1m point.",
      },
      {
        q: "An HDRI in the World settings does what?",
        options: [
          "Adds a background image that doesn't affect lighting",
          "Acts as both environment background and light source: a 360° photograph that illuminates the scene",
          "Only affects viewport display, not renders",
          "Creates a dome mesh around the scene",
        ],
        answer: 1,
        explanation:
          "HDRI (High Dynamic Range Image) provides realistic omnidirectional lighting from a real-world photograph. It's both the background you see and the light that hits your objects.",
      },
      {
        q: "In a 3-point lighting setup, what is the Fill Light for?",
        options: [
          "It fills the frame with light uniformly",
          "It's the primary key light, positioned in front",
          "It softens the harsh shadows created by the key light from the opposite side",
          "It creates a rim highlight on the back edge of the subject",
        ],
        answer: 2,
        explanation:
          "Fill light reduces contrast from the key light. It's placed on the opposite side at lower intensity: typically cool-toned vs a warm key. Without it, shadow areas go completely dark.",
      },
      {
        q: "You rotate a Sun light object in the scene. Its position is 100 units away from the subject. How does this affect the lighting?",
        options: [
          "Moving the sun closer makes it brighter",
          "Position has no effect: only rotation matters for Sun lights",
          "Moving it further makes shadows softer",
          "The sun must be within 10 units to cast shadows",
        ],
        answer: 1,
        explanation:
          "Sun lights simulate a light source at infinite distance. Their rays are perfectly parallel regardless of the object's position in the scene: only rotation determines the light direction.",
      },
    ],
    sections: [
      {
        title: "Light Types and When to Use Each",
        pythonCode: `import bpy
import math

# Add lights via Python
def add_light(name, type, location, energy, color=(1,1,1), size=0.5):
    bpy.ops.object.light_add(type=type, location=location)
    light = bpy.context.active_object
    light.name = name
    light.data.energy = energy
    light.data.color  = color
    if hasattr(light.data, 'shadow_soft_size'):
        light.data.shadow_soft_size = size
    return light

# Point light: omnidirectional bulb
add_light("KeyPoint", 'POINT', (3, -3, 5), energy=500)

# Sun light: parallel rays, position irrelevant, only rotation matters
sun = add_light("Sun", 'SUN', (0, 0, 10), energy=5)
sun.rotation_euler = (math.radians(45), 0, math.radians(30))

# Spot light: cone
spot = add_light("Spot", 'SPOT', (0, -5, 8), energy=1000)
spot.data.spot_size  = math.radians(45)   # cone angle
spot.data.spot_blend = 0.15               # soft edge (0=hard, 1=very soft)

# Area light: rectangular, softest shadows
area = add_light("KeyArea", 'AREA', (4, -2, 6), energy=800, size=2.0)
area.data.shape = 'RECTANGLE'  # 'SQUARE', 'RECTANGLE', 'DISK', 'ELLIPSE'
area.data.size  = 2.0
area.data.size_y = 1.0`,
        content: `Each light type behaves differently. Choosing the wrong one is the most common reason a scene looks flat or fake.`,
        primitiveGrid: [
          { emoji: "💡", name: "Point", desc: "Omnidirectional bulb. Radiates in all directions from a single point. Small, hard shadows.", use: "Candles, light bulbs, glowing orbs, lamp fixtures" },
          { emoji: "☀️", name: "Sun", desc: "Parallel rays from infinite distance. Position in the scene doesn't matter, only rotation. Consistent across the entire scene.", use: "Outdoor daylight, large directional sources. Casts parallel shadows unlike any other light type." },
          { emoji: "🔦", name: "Spot", desc: "Cone of light. Controls: Spot Size (cone angle), Blend (0 = hard edge, 1 = soft falloff).", use: "Stage lighting, flashlights, headlights, theatrical beams" },
          { emoji: "🪟", name: "Area", desc: "Rectangular or disc surface emitter. Larger = softer shadows. Most photorealistic light type. Needs high power values (500W+).", use: "Studio softboxes, windows, diffuse panels, product lighting" },
          { emoji: "🌍", name: "HDRI (World)", desc: "A 360° real-world photograph used as both background and light source. Instant realistic environment lighting.", use: "World Properties → Environment Texture. Free HDRIs at Poly Haven." },
        ],
      },
      {
        title: "Key Light Settings",
        pythonCode: `import bpy
import math

light = bpy.context.active_object  # must be a light object
ld = light.data  # bpy.types.Light

# Universal settings
ld.energy = 500               # Watts (area lights need much higher)
ld.color  = (1.0, 0.85, 0.7) # warm key light
ld.shadow_soft_size = 1.0    # larger = softer shadows (Point/Sun/Spot)

# 3-point lighting setup via Python
import math

def three_point(subject_location=(0,0,0)):
    # Key light: bright, 45° upper-left
    bpy.ops.object.light_add(type='AREA', location=(4, -3, 5))
    key = bpy.context.active_object
    key.name = "Key"
    key.data.energy = 600
    key.data.size   = 1.5
    key.data.color  = (1.0, 0.9, 0.8)  # warm
    key.rotation_euler = (math.radians(50), 0, math.radians(45))

    # Fill light: soft, opposite side
    bpy.ops.object.light_add(type='AREA', location=(-4, -2, 3))
    fill = bpy.context.active_object
    fill.name = "Fill"
    fill.data.energy = 150
    fill.data.size   = 2.0
    fill.data.color  = (0.8, 0.9, 1.0)  # cool

    # Rim light: behind subject
    bpy.ops.object.light_add(type='AREA', location=(0, 4, 4))
    rim = bpy.context.active_object
    rim.name = "Rim"
    rim.data.energy = 300

three_point()`,
        content: `For any light object:
**Power (W)**
Intensity. Area lights need much higher values than Point lights for equivalent brightness.
**Color**
Warm (3200K orange) key + cool (7000K blue) fill = cinematic look.
**Radius / Size**
Larger radius = softer shadows. This is the most impactful realism setting.
- **Spread** (Area lights): How wide the light spreads from the surface.

**Three-Point Lighting (the classic setup)**:
1. **Key Light**: Primary light, positioned 45° above and to one side. Bright.
2. **Fill Light**: Softer, from the opposite side. Reduces harsh shadows. ~30–50% of key power.
3. **Rim / Back Light**: Behind the subject, creates a highlight edge that separates it from the background.

**Light Linking** (Blender 4.1+):
In the **Light Properties → Light Linking panel**, specify exactly which objects a light affects. One light can illuminate the subject but not the background. Essential for controlled product and portrait lighting.`,
      },
      {
        title: "HDRI Lighting Setup",
        pythonCode: `import bpy

world = bpy.context.scene.world
world.use_nodes = True
tree = world.node_tree
nodes = tree.nodes
links = tree.links

# Clear default nodes
nodes.clear()

# Build HDRI node graph
bg     = nodes.new('ShaderNodeBackground')
env    = nodes.new('ShaderNodeTexEnvironment')
tex_co = nodes.new('ShaderNodeTexCoord')
mapping = nodes.new('ShaderNodeMapping')
out    = nodes.new('ShaderNodeOutputWorld')

bg.location      = (200,  0)
env.location     = (-100, 0)
mapping.location = (-350, 0)
tex_co.location  = (-550, 0)
out.location     = (400,  0)

# Load HDRI file
env.image = bpy.data.images.load("/path/to/environment.hdr")

# Connect: TexCoord → Mapping → EnvTexture → Background → Output
links.new(tex_co.outputs["Generated"], mapping.inputs["Vector"])
links.new(mapping.outputs["Vector"],   env.inputs["Vector"])
links.new(env.outputs["Color"],        bg.inputs["Color"])
links.new(bg.outputs["Background"],   out.inputs["Surface"])

# Adjust brightness and rotation
bg.inputs["Strength"].default_value = 1.5
mapping.inputs["Rotation"].default_value[2] = 1.5708  # rotate HDRI 90°`,
        content: `HDRI is the fastest path to realistic environment lighting:

1. **World Properties → Surface → Background**
2. Click **Color → Environment Texture**
3. Click **Open** → load any .hdr or .exr file
4. Add a **Texture Coordinate** (Object) + **Mapping** node to rotate the HDRI
5. Change World **Strength** to adjust overall brightness

Controlling HDRI appearance:
**Rotation**
Rotate the environment to change where the light hits from
**World Strength**
Global exposure of the environment
**Background visibility**
Uncheck "Show Background" in Render Properties if you want the HDRI for light only, not visible as background

Combining HDRI + additional lights: the HDRI provides ambient/fill, your placed lights add controlled highlights and shadows. Best of both approaches.`,
      },
      {
        title: "🔨 Mini Workshop: Light Your Subject",
        isWorkshop: true,
        pythonCode: `import bpy, math

# Delete all existing lights
bpy.ops.object.select_by_type(type='LIGHT')
bpy.ops.object.delete()

# Key area light
bpy.ops.object.light_add(type='AREA', location=(3, -2, 4))
key = bpy.context.active_object
key.data.energy = 500
key.data.size   = 1.0
key.rotation_euler = (math.radians(55), 0, math.radians(30))

# Fill area light
bpy.ops.object.light_add(type='AREA', location=(-3, -1, 2))
fill = bpy.context.active_object
fill.data.energy = 150
fill.data.size   = 2.0

# Rim light
bpy.ops.object.light_add(type='AREA', location=(0, 3, 3))
rim = bpy.context.active_object
rim.data.energy = 300

# Switch viewport to rendered mode
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        area.spaces[0].shading.type = 'RENDERED'`,
        content: `Using any object (your mug, Suzanne, or a simple sphere):

1. Delete the default light
2. **Shift+A → Light → Area**: position above and to the left (key light). Power: 500W, Size: 1m.
3. Add another Area light from the opposite side. Power: 150W (fill light).
4. Add a Point or Area light behind: rim light for edge definition.
5. Switch viewport shading to Rendered: **Z → Rendered** (or click the sphere icon top-right)

Compare the difference between:
- Flat single overhead light
- 3-point setup
- Replacing all lights with just an HDRI

Observe: how does shadow softness change with light size? How does light color temperature affect mood?

✅ Goal: Be able to diagnose why a render looks bad: and fix it with lighting`,
      },
    ],
  };

export default lighting;
