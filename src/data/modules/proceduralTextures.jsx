// Module 15: proceduralTextures

const proceduralTextures = {
    id: 15,
    emoji: "🌊",
    title: "Procedural Textures",
    tag: "ADVANCED SHADING",
    specialized: true,
    color: "#818cf8",
    intro:
      "Procedural textures are generated mathematically: no image files, infinite resolution, no tiling, fully animatable. Combined with the Shader Editor, they can describe almost any surface.",
    quiz: [
      {
        q: "What does a ColorRamp node do?",
        options: [
          "Changes the hue of a texture by rotating the color wheel",
          "Remaps a grayscale 0–1 value to any set of colors or values you define",
          "Converts a color texture to black and white",
          "Blends two color inputs together equally",
        ],
        answer: 1,
        explanation:
          "ColorRamp takes a single grayscale input (like Noise Texture's Fac output) and maps it to any gradient of colors you define. It's the bridge between procedural noise and meaningful color variation.",
      },
      {
        q: "Which texture node creates cell-like patterns: useful for cracked earth, skin pores, or ceramic tiles?",
        options: [
          "Noise Texture",
          "Wave Texture",
          "Voronoi Texture",
          "Magic Texture",
        ],
        answer: 2,
        explanation:
          "Voronoi Texture creates cell-based patterns. 'Distance to Edge' mode gives sharp cracked lines between cells. Smooth F1 gives soft cellular blobs. Randomness controls how irregular the cells are.",
      },
      {
        q: "What is the difference between a Bump node and a Displacement node?",
        options: [
          "Bump is for organic surfaces, Displacement is for hard surfaces",
          "Bump fakes surface detail by changing how light hits without moving geometry; Displacement actually moves vertices",
          "Bump works in EEVEE, Displacement only in Cycles",
          "They are identical: just named differently for historical reasons",
        ],
        answer: 1,
        explanation:
          "Bump is cheap: it tricks the lighting system into seeing detail that isn't geometrically there. Displacement is expensive and real: it requires enough geometry to actually move. Enable Displacement: Both in material settings for Cycles.",
      },
      {
        q: "You want a wood grain texture. Which node produces the underlying stripe/ring pattern?",
        options: [
          "Noise Texture with high Detail",
          "Voronoi in Distance to Edge mode",
          "Wave Texture in Rings or Bands mode, with Distortion added",
          "Musgrave with FBM type",
        ],
        answer: 2,
        explanation:
          "Wave Texture creates concentric rings or parallel bands: the natural structure of wood grain. Add Distortion to break up the regularity, and a ColorRamp to map it to realistic wood colours.",
      },
    ],
    sections: [
      {
        title: "Core Texture Nodes",
        pythonCode: `import bpy

mat  = bpy.context.active_object.active_material
tree = mat.node_tree
n    = tree.nodes

# Noise Texture
noise = n.new('ShaderNodeTexNoise')
noise.inputs["Scale"].default_value      = 5.0
noise.inputs["Detail"].default_value     = 8.0
noise.inputs["Roughness"].default_value  = 0.6
noise.inputs["Distortion"].default_value = 0.0
# Outputs: "Fac" (0-1 grayscale), "Color"

# Voronoi Texture
vor = n.new('ShaderNodeTexVoronoi')
vor.voronoi_dimensions = '3D'
vor.feature            = 'F1'         # 'F1','F2','SMOOTH_F1','DISTANCE_TO_EDGE','N_SPHERE_RADIUS'
vor.distance           = 'EUCLIDEAN'  # 'EUCLIDEAN','MANHATTAN','CHEBYCHEV','MINKOWSKI'
vor.inputs["Scale"].default_value      = 10.0
vor.inputs["Randomness"].default_value = 1.0

# Wave Texture
wave = n.new('ShaderNodeTexWave')
wave.wave_type       = 'RINGS'    # 'BANDS' or 'RINGS'
wave.bands_direction = 'X'
wave.inputs["Scale"].default_value      = 5.0
wave.inputs["Distortion"].default_value = 2.0  # wood grain effect

# Musgrave Texture
musg = n.new('ShaderNodeTexMusgrave')
musg.musgrave_dimensions = '3D'
musg.musgrave_type       = 'FBM'   # 'FBM','MULTIFRACTAL','HYBRID_MULTIFRACTAL',etc.
musg.inputs["Scale"].default_value  = 3.0
musg.inputs["Detail"].default_value = 8.0`,
        content: `All found via **Shift+A → Texture** in the Shader Editor:

**Noise Texture**
The fundamental organic texture. Parameters: Scale (zoom level), Detail (complexity layers), Roughness (sharpness of detail), Distortion (warp the noise itself). The foundation of most procedural materials.

**Voronoi Texture**
Cell-based patterns. Distance to Edge mode = cracked earth, ceramic, skin pores. Smooth F1 = soft cellular blobs. Randomness controls how regular the cells are.

**Wave Texture**
Concentric rings or parallel stripes. Bands vs Rings type. Add Distortion for wood grain. Phase Offset can animate it.

**Musgrave Texture**
Fractal noise with more layers and control than basic Noise. Great for terrain height maps, cloud patterns.

**Magic Texture**
Colorful, swirling psychedelic patterns. Depth and Distortion controls. Underrated for abstract surfaces and trippy effects.

**Brick Texture**
Procedural bricks with mortar. Control width, height, offset, mortar size. Can mix with other textures for realistic variation.

**Gradient Texture**
Simple linear/radial/spherical gradient. Often used as a factor for mixing or masking.`,
      },
      {
        title: "Connecting Textures to Materials",
        pythonCode: `import bpy

mat  = bpy.context.active_object.active_material
tree = mat.node_tree
n, l = tree.nodes, tree.links
bsdf = n["Principled BSDF"]

# ColorRamp: remap noise (0-1) to any colors
noise = n.new('ShaderNodeTexNoise'); noise.location = (-500, 200)
noise.inputs["Scale"].default_value = 6.0
ramp  = n.new('ShaderNodeValToRGB'); ramp.location  = (-200, 200)
# Set ramp colors (rock: grey/brown)
ramp.color_ramp.elements[0].color = (0.15, 0.12, 0.10, 1)
ramp.color_ramp.elements[1].color = (0.55, 0.50, 0.45, 1)
l.new(noise.outputs["Fac"], ramp.inputs["Fac"])
l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])

# Bump node: fake surface detail without moving geometry
bump = n.new('ShaderNodeBump'); bump.location = (-200, -100)
bump.inputs["Strength"].default_value = 0.5
l.new(noise.outputs["Fac"], bump.inputs["Height"])
l.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# Map Range: remap texture output to a numeric input range
mr = n.new('ShaderNodeMapRange'); mr.location = (-200, 0)
mr.inputs["From Min"].default_value = 0.0
mr.inputs["From Max"].default_value = 1.0
mr.inputs["To Min"].default_value   = 0.3   # roughness min
mr.inputs["To Max"].default_value   = 0.9   # roughness max
l.new(noise.outputs["Fac"], mr.inputs["Value"])
l.new(mr.outputs["Result"], bsdf.inputs["Roughness"])

# Texture Coordinate + Mapping (control how texture projects)
tc  = n.new('ShaderNodeTexCoord'); tc.location  = (-900, 0)
mp  = n.new('ShaderNodeMapping');  mp.location  = (-700, 0)
mp.inputs["Scale"].default_value = (2.0, 2.0, 2.0)
l.new(tc.outputs["Object"], mp.inputs["Vector"])
l.new(mp.outputs["Vector"], noise.inputs["Vector"])`,
        content: `The key connectors between textures and the Principled BSDF:

**ColorRamp**
Remap any grayscale value (0–1) to any set of colors. The most versatile node. Plug Noise → ColorRamp → Base Color for instant rock/lava/organic color.

**Bump node**
Simulate surface detail from a height map without moving geometry. Fast, works in Cycles and EEVEE. Height → Bump → Normal input.

**Displacement node**
Actually moves vertices based on texture (requires Cycles + Material → Settings → Displacement: Both). Much more expensive than Bump but geometrically correct.

**Mix node**
Blend two colors/textures by a Factor. Use another texture as the Factor for organic blending (e.g., blend clean grass and muddy grass by a Noise-driven mask).

**Texture Coordinate + Mapping**
Always pair these when using procedural textures. Texture Coordinate (Object) + Mapping (translate/rotate/scale) controls how the texture maps to the surface. Object coordinates mean the texture moves with the object: useful for predictable results.

**Math / Map Range**
Transform the 0–1 output of a texture into any numeric range. Essential for routing texture outputs to non-color inputs like Roughness, Metallic, Emission Strength.`,
      },
      {
        title: "Procedural Material Recipes",
        pythonCode: `import bpy

def new_mat(name, obj):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    obj.data.materials.append(mat)
    return mat, mat.node_tree

obj  = bpy.context.active_object
mat, tree = new_mat("Rock", obj)
n, l = tree.nodes, tree.links
bsdf = n["Principled BSDF"]

# ── ROCK ──
noise = n.new('ShaderNodeTexNoise')
noise.inputs["Scale"].default_value = 6.0; noise.inputs["Detail"].default_value = 8.0
ramp  = n.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color = (0.15, 0.12, 0.10, 1)
ramp.color_ramp.elements[1].color = (0.55, 0.50, 0.45, 1)
bump  = n.new('ShaderNodeBump'); bump.inputs["Strength"].default_value = 0.4
l.new(noise.outputs["Fac"], ramp.inputs["Fac"])
l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
l.new(noise.outputs["Fac"], bump.inputs["Height"])
l.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# ── WOOD GRAIN ──
# wave = n.new('ShaderNodeTexWave')
# wave.wave_type = 'RINGS'; wave.inputs["Distortion"].default_value = 2.0
# ramp2 = n.new('ShaderNodeValToRGB')
# ramp2.color_ramp.elements[0].color = (0.35, 0.18, 0.06, 1)  # dark wood
# ramp2.color_ramp.elements[1].color = (0.75, 0.50, 0.25, 1)  # light wood
# l.new(wave.outputs["Fac"], ramp2.inputs["Fac"])
# l.new(ramp2.outputs["Color"], bsdf.inputs["Base Color"])

# ── LAVA ──
# noise2 = n.new('ShaderNodeTexNoise'); noise2.inputs["Scale"].default_value = 4.0
# ramp3  = n.new('ShaderNodeValToRGB')
# ramp3.color_ramp.elements[0].color = (0.0, 0.0, 0.0, 1)     # cooled
# ramp3.color_ramp.elements[1].color = (1.0, 0.3, 0.0, 1)     # molten crack
# emit   = n.new('ShaderNodeEmission'); emit.inputs["Strength"].default_value = 5.0
# l.new(noise2.outputs["Fac"], ramp3.inputs["Fac"])
# l.new(ramp3.outputs["Color"], bsdf.inputs["Base Color"])
# l.new(ramp3.outputs["Color"], emit.inputs["Color"])`,
        content: `**Rock / Stone**:
→ Noise (Scale 6, Detail 8) → ColorRamp (greys with brown) → Base Color
→ Same Noise → Bump → Normal (for surface detail)
→ Second Noise → Map Range → Roughness (0.5–0.9 variation)

**Wood grain**:
→ Wave Texture (Rings, Distortion 2.0) → ColorRamp (light brown to dark brown) → Base Color
→ Noise texture → Distortion input of Wave for organic grain imperfection

**Rust / Worn metal**:
→ Base metal: Metallic 1, Roughness 0.2
→ Voronoi (Distance to Edge, Scale 15) + Noise → Mix → drives a mask between metal and rust (orange, Metallic 0, Roughness 0.9)
→ Mask also drives Roughness variation

**Lava / Molten**:
→ Noise → ColorRamp: black (cooled) with orange/white cracks → Base Color
→ Same ColorRamp → Emission Strength (bright only in the cracks)

**Stylized water**:
→ Wave Texture → Bump for ripples
→ Transmission 1, Roughness 0.1, IOR 1.33, blue-tinted Base Color`,
      },
      {
        title: "🔨 Mini Workshop: Procedural Planet",
        isWorkshop: true,
        pythonCode: `import bpy

# Create planet mesh
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1)
planet = bpy.context.active_object
planet.name = "Planet"
bpy.ops.object.shade_smooth()

# Create material
mat = bpy.data.materials.new("PlanetMat")
mat.use_nodes = True
planet.data.materials.append(mat)
tree = mat.node_tree
n, l = tree.nodes, tree.links
n.clear()

bsdf = n.new('ShaderNodeBsdfPrincipled'); bsdf.location = (0, 0)
out  = n.new('ShaderNodeOutputMaterial'); out.location  = (300, 0)
l.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

# Noise → ColorRamp → Base Color (ocean/land/mountain bands)
noise = n.new('ShaderNodeTexNoise'); noise.location = (-700, 100)
noise.inputs["Scale"].default_value     = 5.0
noise.inputs["Detail"].default_value    = 8.0
noise.inputs["Roughness"].default_value = 0.6

ramp = n.new('ShaderNodeValToRGB'); ramp.location = (-400, 100)
cr   = ramp.color_ramp
cr.elements[0].position = 0.0;  cr.elements[0].color = (0.0, 0.1, 0.6, 1)   # deep ocean
cr.elements.new(0.45);          cr.color_ramp.elements[1].color = (0.1, 0.4, 0.8, 1) # shallow
cr.elements.new(0.5);           cr.color_ramp.elements[2].color = (0.8, 0.7, 0.4, 1) # sand
cr.elements.new(0.6);           cr.color_ramp.elements[3].color = (0.2, 0.5, 0.1, 1) # land
cr.elements[1].position = 1.0;  cr.color_ramp.elements[-1].color = (1.0, 1.0, 1.0, 1) # snow

l.new(noise.outputs["Fac"],    ramp.inputs["Fac"])
l.new(ramp.outputs["Color"],   bsdf.inputs["Base Color"])

# Atmosphere: Fresnel-driven emission rim
fres = n.new('ShaderNodeFresnel');   fres.location  = (-400, -200)
fres.inputs["IOR"].default_value = 1.3
emit = n.new('ShaderNodeEmission');  emit.location  = (-100, -200)
emit.inputs["Color"].default_value   = (0.4, 0.7, 1.0, 1)
emit.inputs["Strength"].default_value = 2.0
mix  = n.new('ShaderNodeMixShader'); mix.location   = (200, -100)
l.new(fres.outputs["Fac"],  mix.inputs["Fac"])
l.new(bsdf.outputs["BSDF"], mix.inputs[1])
l.new(emit.outputs["Emission"], mix.inputs[2])
l.new(mix.outputs["Shader"], out.inputs["Surface"])

# Animate surface: keyframe noise W offset
noise.inputs["W"].default_value = 0.0
noise.inputs["W"].keyframe_insert("default_value", frame=1)
noise.inputs["W"].default_value = 5.0
noise.inputs["W"].keyframe_insert("default_value", frame=250)`,
        content: `Build a planet with zero image textures: everything procedural:

1. **Shift+A → UV Sphere** (64 segments in F9)
2. Apply a **Subdivision Surface** (level 2) → Enter **Shader Editor**
3. Add a **Noise Texture** (Scale: 5, Detail: 8, Roughness: 0.6)
4. Add a **ColorRamp**: deep blue on left, add stops for green, tan, white (poles): position them like elevation bands
5. Connect: Noise → ColorRamp → Base Color
6. Add a second **Noise** (different Scale) → **Bump** → Normal

For an atmosphere rim:
7. Add a **Fresnel** node (IOR: 1.3)
8. **Emission** node: color = light blue, Strength: 3
9. **Mix Shader**: Factor from Fresnel, Shader 1 = Principled BSDF, Shader 2 = Emission
10. Mix Shader → Material Output

Animate: right-click the **W offset** on the Noise Texture → Insert Keyframe at frame 1 and frame 250 with different values. Planet rotates procedurally.

✅ Goal: A convincing planet with atmosphere, zero image files, and an animated surface`,
      },
    ],
  };

export default proceduralTextures;
