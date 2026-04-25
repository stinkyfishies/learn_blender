// Module 9: materialsShading

const materialsShading = {
    id: 9,
    emoji: "🎨",
    title: "Materials & Shading",
    tag: "SURFACE APPEARANCE",
    color: "#f472b6",
    intro:
      "Materials define what an object is made of: metal, glass, skin, rubber, cloth. The Shader Editor is a node graph where you can build any surface appearance. Blender 5.1 uses both Cycles and EEVEE Next, each with full Principled BSDF support.",
    quiz: [
      {
        q: "What does setting Metallic to 0.5 on the Principled BSDF produce?",
        options: [
          "A semi-metallic alloy material",
          "An unrealistic result: Metallic should almost always be 0 or 1, not in-between",
          "A brushed metal appearance",
          "A material halfway between plastic and chrome",
        ],
        answer: 1,
        explanation:
          "Real-world materials are either conductors (metals, Metallic=1) or dielectrics (everything else, Metallic=0). Values in between don't correspond to real materials and look wrong.",
      },
      {
        q: "What does the Roughness parameter control on Principled BSDF?",
        options: [
          "How rough the geometry surface is",
          "Whether the surface reflects light as a sharp mirror (0) or as a blurry matte (1)",
          "The amount of surface displacement",
          "How transparent the material is",
        ],
        answer: 1,
        explanation:
          "Roughness controls microsurface scattering. 0 = perfect mirror, 1 = completely diffuse matte. Most real surfaces fall between 0.3–0.8.",
      },
      {
        q: "You want rock-coloured variation that's organic and non-repeating, with no image texture. Which node combination works?",
        options: [
          "Image Texture → Color Mix",
          "Noise Texture → ColorRamp → Base Color",
          "Voronoi Texture → Bump → Normal",
          "Wave Texture → Fresnel → Emission",
        ],
        answer: 1,
        explanation:
          "Noise Texture generates infinite organic variation. ColorRamp remaps the 0–1 output to any set of colours. Connect to Base Color for instant procedural surface variation.",
      },
      {
        q: "What is the Fresnel node used for in a shader?",
        options: [
          "Controlling how transparent glass is at different angles",
          "Making surfaces more reflective at grazing angles: the physical phenomenon of edge highlights",
          "Generating a rainbow spectrum effect",
          "Setting the index of refraction for transmission",
        ],
        answer: 1,
        explanation:
          "Fresnel models how reflectivity increases at grazing angles: exactly what makes real surfaces like plastic and water look realistic. Use as a Mix Shader factor for physically correct blending.",
      },
    ],
    sections: [
      {
        title: "Principled BSDF: The Universal Shader",
        versionNote: "v4.x",
        pythonCode: `import bpy

obj = bpy.context.active_object

# Create and assign a new material
mat = bpy.data.materials.new(name="MyMaterial")
mat.use_nodes = True
obj.data.materials.append(mat)

# Get the Principled BSDF node
bsdf = mat.node_tree.nodes["Principled BSDF"]

# Key inputs — set via default_value on the input socket
bsdf.inputs["Base Color"].default_value        = (0.8, 0.2, 0.1, 1.0)  # RGBA
bsdf.inputs["Metallic"].default_value          = 0.0    # 0=dielectric, 1=metal
bsdf.inputs["Roughness"].default_value         = 0.5    # 0=mirror, 1=matte
bsdf.inputs["IOR"].default_value               = 1.45   # glass=1.45, water=1.33
bsdf.inputs["Transmission Weight"].default_value = 0.0  # 1.0 = fully transparent
bsdf.inputs["Emission Color"].default_value    = (1.0, 0.5, 0.0, 1.0)
bsdf.inputs["Emission Strength"].default_value = 0.0    # 0=off, >0=glowing
bsdf.inputs["Alpha"].default_value             = 1.0    # 0=transparent
bsdf.inputs["Coat Weight"].default_value       = 0.0    # clearcoat layer
bsdf.inputs["Sheen Weight"].default_value      = 0.0    # fabric/velvet retroreflection
bsdf.inputs["Subsurface Weight"].default_value = 0.0    # skin/wax light scatter`,
        content: `The **Principled BSDF** node handles nearly every real-world material in one node. Key parameters:

**Base Color**
The fundamental color or texture of the surface.
**Metallic**
0 = dielectric (plastic, wood, skin), 1 = metal. Use 0 or 1, not in-between. Real materials are one or the other.
**Roughness**
0 = mirror-smooth, 1 = completely matte. Most surfaces: 0.3–0.8. Metals often 0.1–0.4.
**IOR (Index of Refraction)**
How much light bends through transparent materials. Glass: 1.45, Water: 1.33, Diamond: 2.42.
**Transmission Weight**
0 = opaque, 1 = fully transmissive (glass, water). EEVEE needs Screen Space Refraction enabled.
**Coat Weight / Coat Roughness**
A clearcoat layer on top (car paint, lacquered wood).
**Sheen Weight**
Soft retroreflective sheen (fabric, velvet, skin at grazing angles).
**Emission Color + Strength**
Makes the surface glow and emit light.
**Alpha**
Transparency (set Blend Mode in Material Settings to Alpha Blend or Alpha Clip).
**Subsurface Weight**
Light scatters below the surface (skin, wax, marble). Set Subsurface Radius for color bleed.`,
      },
      {
        title: "The Shader Editor",
        pythonCode: `import bpy

mat = bpy.context.active_object.active_material
mat.use_nodes = True
tree = mat.node_tree
nodes = tree.nodes
links = tree.links

bsdf = nodes["Principled BSDF"]
out  = nodes["Material Output"]

# Add an Image Texture node and connect to Base Color
img_node = nodes.new('ShaderNodeTexImage')
img_node.location = (-300, 200)
img_node.image = bpy.data.images.load("/path/to/texture.png")
links.new(img_node.outputs["Color"], bsdf.inputs["Base Color"])

# Add a Noise Texture → drive Roughness variation
noise = nodes.new('ShaderNodeTexNoise')
noise.location = (-500, -100)
noise.inputs["Scale"].default_value   = 5.0
noise.inputs["Detail"].default_value  = 8.0
ramp = nodes.new('ShaderNodeValToRGB')   # ColorRamp
ramp.location = (-200, -100)
links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
links.new(ramp.outputs["Color"], bsdf.inputs["Roughness"])

# Add a Bump node for surface detail
bump = nodes.new('ShaderNodeBump')
bump.location = (-100, -300)
bump.inputs["Strength"].default_value = 0.5
links.new(noise.outputs["Fac"], bump.inputs["Height"])
links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# Texture Coordinate + Mapping (control UV projection)
tex_coord = nodes.new('ShaderNodeTexCoord'); tex_coord.location = (-800, 0)
mapping    = nodes.new('ShaderNodeMapping');  mapping.location    = (-600, 0)
links.new(tex_coord.outputs["UV"], mapping.inputs["Vector"])
links.new(mapping.outputs["Vector"], noise.inputs["Vector"])`,
        content: `Open: **Workspace → Shading tab** or split any panel → Shader Editor.

Every material is a node graph. The minimum: **Principled BSDF → Material Output (Surface)**.

Adding textures: connect to inputs:
- **Shift+A → Texture → Image Texture** → Color → Base Color (loads a real image file)
- **Shift+A → Texture → Noise Texture** → Fac → Roughness (procedural variation)
- For bump: Image Texture → **Normal Map** node → Normal → Normal input

Essential utility nodes:
**ColorRamp**
Remap a grayscale range to any colors or values. Plug noise → ColorRamp → Base Color for instant organic color variation.
**Mix Color / Mix Shader**
Blend two colors or two complete shaders.
**Fresnel**
More reflective at grazing angles. Physically correct, adds realism.
**Texture Coordinate**
Controls how textures map: UV (uses UV map), Object (texture fixed to object), Generated (auto), World (fixed in world space).
**Mapping**
Translate/rotate/scale a texture coordinate. Plug Texture Coordinate → Mapping → Texture.`,
      },
      {
        title: "EEVEE Next vs Cycles: Material Considerations",
        versionNote: "v4.2+",
        pythonCode: `import bpy

scene = bpy.context.scene

# Switch render engine
scene.render.engine = 'CYCLES'            # path-traced, accurate
scene.render.engine = 'BLENDER_EEVEE_NEXT'  # real-time path-traced

# Cycles: enable GPU rendering
prefs = bpy.context.preferences
cycles_prefs = prefs.addons['cycles'].preferences
cycles_prefs.compute_device_type = 'METAL'  # Mac GPU (or 'CUDA', 'OPTIX' on NVIDIA)
cycles_prefs.get_devices()
for device in cycles_prefs.devices:
    device.use = True  # enable all available devices
scene.cycles.device = 'GPU'

# Cycles sample settings
scene.cycles.samples = 256
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPENIMAGEDENOISE'  # or 'OPTIX' on NVIDIA

# EEVEE Next settings
eevee = scene.eevee
eevee.taa_render_samples = 64
eevee.use_gtao = True          # ambient occlusion
eevee.use_bloom = True         # bloom/glow effect

# Material: enable screen-space refraction (EEVEE glass)
mat = bpy.context.active_object.active_material
mat.use_screen_refraction = True
mat.blend_method = 'HASHED'    # for transparency: 'OPAQUE','CLIP','HASHED','BLEND'`,
        content: `**Cycles** (path-traced) renders materials with physically accurate light simulation. All Principled BSDF features work. Slower but ground-truth accurate.

**EEVEE Next** (real-time path-traced, default in Blender 4.2+) is dramatically improved over classic EEVEE:
- Supports true reflections and refractions
- Path-tracing option for higher quality
- Real-time global illumination
- Shadow casting from all light types
- Subsurface scattering support

EEVEE Next caveats vs Cycles:
- Caustics are limited (light focusing through glass)
- Very dense volumes may differ
- Ray count is limited for real-time performance

For most use cases (product shots, architectural viz, motion graphics), EEVEE Next now produces results that were previously Cycles-only, in a fraction of the render time.

Shader nodes that are Cycles-only: some advanced volume shaders, true caustics paths. Everything else is compatible.`,
      },
      {
        title: "Material Recipes for Common Surfaces",
        pythonCode: `import bpy

def make_material(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    return mat, mat.node_tree, bsdf

# Polished chrome
mat, tree, bsdf = make_material("Chrome")
bsdf.inputs["Base Color"].default_value  = (0.8, 0.8, 0.8, 1)
bsdf.inputs["Metallic"].default_value    = 1.0
bsdf.inputs["Roughness"].default_value   = 0.05

# Glass
mat, tree, bsdf = make_material("Glass")
bsdf.inputs["Transmission Weight"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.0
bsdf.inputs["IOR"].default_value = 1.45
mat.blend_method = 'HASHED'

# Emissive neon
mat, tree, bsdf = make_material("Neon")
bsdf.inputs["Emission Color"].default_value   = (0.0, 1.0, 0.8, 1)
bsdf.inputs["Emission Strength"].default_value = 10.0

# Skin (subsurface)
mat, tree, bsdf = make_material("Skin")
bsdf.inputs["Base Color"].default_value          = (0.9, 0.7, 0.6, 1)
bsdf.inputs["Subsurface Weight"].default_value   = 0.3
bsdf.inputs["Subsurface Radius"].default_value   = (1.0, 0.2, 0.1)
bsdf.inputs["Roughness"].default_value           = 0.5`,
        content: `**Brushed metal**:
→ Metallic: 1.0 | Roughness: 0.4 | Base Color: medium grey
→ Add Noise Texture → Map Range (0.3–0.5) → Roughness for variation

**Polished chrome**:
→ Metallic: 1.0 | Roughness: 0.05 | Base Color: light grey (#CCCCCC)

**Glass**:
→ Transmission Weight: 1.0 | Roughness: 0.0 | IOR: 1.45
→ In EEVEE: Material Settings → enable Screen Space Refraction

**Worn painted plastic**:
→ Base Color: color of paint | Roughness: 0.6 | Metallic: 0
→ Second material slot: bare plastic (Roughness: 0.8, darker)
→ Mix using an edge wear mask (Pointiness from Geometry node)

**Skin (basic)**:
→ Subsurface Weight: 0.3 | Subsurface Radius: warm red tones | Roughness: 0.5
→ Add Noise Texture → slight Base Color variation

**Emissive neon**:
→ Emission Color: bright saturated color | Strength: 5–20
→ Combine with Bloom in post-processing (Compositor or EEVEE Bloom)`,
      },
      {
        title: "🔨 Mini Workshop: 3 Materials, 3 Surfaces",
        isWorkshop: true,
        pythonCode: `import bpy

def add_sphere_with_mat(x, name, metallic, roughness, transmission=0, base_color=(0.8,0.8,0.8,1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.8, location=(x, 0, 0))
    obj = bpy.context.active_object
    obj.name = name
    bpy.ops.object.shade_smooth()
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value          = base_color
    bsdf.inputs["Metallic"].default_value            = metallic
    bsdf.inputs["Roughness"].default_value           = roughness
    bsdf.inputs["Transmission Weight"].default_value = transmission
    obj.data.materials.append(mat)

add_sphere_with_mat(-3, "Metal",  metallic=1.0, roughness=0.1, base_color=(0.3,0.3,0.3,1))
add_sphere_with_mat( 0, "Rubber", metallic=0.0, roughness=0.9, base_color=(0.9,0.4,0.1,1))
add_sphere_with_mat( 3, "Glass",  metallic=0.0, roughness=0.0, transmission=1.0)`,
        content: `Create three spheres. Apply one material each. Your goal: see how 2–3 parameters completely define material identity.

**Polished metal sphere**: Metallic 1.0, Roughness 0.1, Base Color dark grey
**Matte rubber sphere**: Metallic 0, Roughness 0.9, Base Color saturated orange
**Glass sphere**: Transmission Weight 1.0, Roughness 0, IOR 1.45

Then experiment:
- Change roughness on the metal from 0.1 to 0.5: see how it shifts from chrome to brushed
- Add a ColorRamp between a Noise Texture and Base Color on the rubber sphere
- Set the glass sphere's Base Color to a slight blue tint

✅ Goal: Understand that Principled BSDF sliders = material identity`,
      },
    ],
  };

export default materialsShading;
