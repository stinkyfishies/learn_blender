// Finish Model capstone

const finishThis = {
  id: 19,
  emoji: "📸",
  title: "Finish This",
  tag: "FIRST RENDER",
  workflow: "both",
  color: "#a78bfa",
  intro:
    "Take the mug from Build This and deliver a render. Not a viewport screenshot: an actual image you'd show someone. This module is the completion of what you started.",
  quiz: [
    {
      q: "You want soft shadows and accurate reflections on the mug. Which renderer and light source combination gives you this fastest?",
      options: [
        "Workbench + Sun light",
        "Cycles + HDRI environment texture",
        "EEVEE Next + Point light",
        "Cycles + single Spot light",
      ],
      answer: 1,
      explanation:
        "An HDRI provides omnidirectional soft light from a real-world photograph: instant soft shadows and accurate environment reflections at no setup cost. Cycles traces it physically. EEVEE Next with HDRI is also valid if speed matters.",
    },
    {
      q: "You enter camera view (Numpad 0) and navigate, but the camera doesn't follow. How do you make the camera track your viewport movement?",
      options: [
        "Press G to grab the camera and move it",
        "N panel → View → Lock Camera to View",
        "Set the camera as active in the Properties panel",
        "Enable Camera Tracking in the Physics panel",
      ],
      answer: 1,
      explanation:
        "Lock Camera to View (N panel → View tab) ties the camera to your viewport navigation while in camera view. Navigate freely and the camera follows. Disable it when you've found your angle.",
    },
    {
      q: "Your Cycles render is noisy. What's the fastest fix that doesn't require more samples?",
      options: [
        "Switch to EEVEE Next",
        "Enable Denoising (OIDN or OptiX) in Render Properties",
        "Increase light intensity",
        "Apply Subdivision Surface to the mesh",
      ],
      answer: 1,
      explanation:
        "AI denoising (OpenImageDenoise or OptiX on NVIDIA) removes Monte Carlo noise from low-sample renders. 128 samples with denoising can match 1024 samples without it. Enable it in Render Properties → Sampling → Denoising.",
    },
  ],
  sections: [
    {
      title: "How This Works",
      content: `This module picks up exactly where Build This left off. You have a mug in the viewport. The goal is to turn that into a render: a PNG file you'd actually show someone.

The three things between a viewport and a render:
- **Lighting**: how the scene is illuminated
- **Camera**: where it's seen from and with what lens
- **Render settings**: which engine, how many samples, where to save

Do all three, hit F12, and you're done.

>> If you don't have the Build This mug, any object works. The point is the render workflow, not the specific object.`,
    },
    {
      title: "Light the Scene",
      pythonCode: `import bpy, math

scene = bpy.context.scene

# Option 1: HDRI (fastest, most realistic)
world = scene.world
world.use_nodes = True
tree = world.node_tree
tree.nodes.clear()

bg  = tree.nodes.new('ShaderNodeBackground')
env = tree.nodes.new('ShaderNodeTexEnvironment')
out = tree.nodes.new('ShaderNodeOutputWorld')
bg.location  = (200, 0)
env.location = (-100, 0)
out.location = (400, 0)

# Load any .hdr or .exr file
env.image = bpy.data.images.load("/path/to/studio.hdr")
bg.inputs["Strength"].default_value = 1.0

tree.links.new(env.outputs["Color"], bg.inputs["Color"])
tree.links.new(bg.outputs["Background"], out.inputs["Surface"])

# Option 2: Simple 3-point (more control)
def add_area(name, loc, energy, size=1.0):
    bpy.ops.object.light_add(type='AREA', location=loc)
    l = bpy.context.active_object
    l.name = name
    l.data.energy = energy
    l.data.size   = size
    return l

add_area("Key",  (3, -2, 4),  600, size=1.5)
add_area("Fill", (-3, -1, 2), 200, size=2.0)
add_area("Rim",  (0, 3, 3),   300, size=1.0)`,
      content: `Two options. Pick one:

**HDRI (recommended for first render)**
World Properties → Surface → Background → Color → Environment Texture → Open. Load any .hdr file. Poly Haven (polyhaven.com) has hundreds free. One HDRI does all the work: ambient fill, reflections, background.

**3-point Area lights (more control)**
Delete the default light. Add three Area lights:
- Key light: 45° upper-left, 600W, 1.5m size
- Fill light: opposite side, 200W, 2m size (reduces shadows)
- Rim light: behind the mug, 300W (separates it from background)

Area lights + a plain gray backdrop (large plane, neutral Principled BSDF, Roughness 0.9) gives a clean studio look without needing an HDRI.

!! The default Point light that ships with every new Blender file produces hard, unrealistic shadows. Delete it before setting up your lighting.`,
    },
    {
      title: "Camera Setup",
      pythonCode: `import bpy

# Add a camera if one doesn't exist
if "Camera" not in bpy.data.objects:
    bpy.ops.object.camera_add(location=(4, -4, 3))

cam_obj  = bpy.data.objects["Camera"]
cam_data = cam_obj.data

# Focal length: 85mm = portrait compression, good for objects
cam_data.lens = 85.0

# Optional: shallow depth of field
cam_data.dof.use_dof        = True
cam_data.dof.focus_object   = bpy.data.objects["Mug"]
cam_data.dof.aperture_fstop = 2.8  # lower = more blur

# Set as active camera
bpy.context.scene.camera = cam_obj

# Point camera at the mug
bpy.context.view_layer.objects.active = cam_obj
bpy.ops.object.select_all(action='DESELECT')
cam_obj.select_set(True)
# Then: Object → Track To constraint, or aim manually`,
      content: `**Numpad 0**: enter camera view. This is what will render.

**Finding a good angle:**
Press N → View tab → check **Lock Camera to View**. Now navigate normally and the camera follows. When you like the angle, uncheck Lock Camera to View to lock it in place.

**Focal length:**
85–135mm for objects. A longer focal length compresses perspective and makes the mug look more considered. 35mm or shorter exaggerates depth and makes even a simple mug look dramatic.

**Depth of field (optional):**
Camera Data Properties → Depth of Field → Focus Object: select the mug. F-Stop: 2.8 for visible blur. Only renders in Cycles or EEVEE Next with DoF enabled.

**Ctrl+Alt+0**: snaps the camera to exactly the current viewport angle. Useful if you've found the perfect view in perspective mode and just want to freeze the camera there.`,
    },
    {
      title: "Render Settings",
      pythonCode: `import bpy

scene = bpy.context.scene
render = scene.render

# Engine
scene.render.engine = 'CYCLES'
scene.cycles.samples       = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser      = 'OPENIMAGEDENOISE'  # CPU-compatible
# scene.cycles.denoiser    = 'OPTIX'             # NVIDIA GPU only

# GPU (Mac)
prefs  = bpy.context.preferences
cprefs = prefs.addons['cycles'].preferences
cprefs.compute_device_type = 'METAL'
cprefs.get_devices()
for d in cprefs.devices: d.use = True
scene.cycles.device = 'GPU'

# Output
render.resolution_x = 1920
render.resolution_y = 1080
render.image_settings.file_format = 'PNG'
render.filepath = "//renders/mug_render"

# Render
bpy.ops.render.render(write_still=True)`,
      content: `**Engine**: Cycles. EEVEE Next is fine but Cycles handles the ceramic glaze and subtle reflections more accurately for a first showpiece render.

**Samples**: 128. With denoising enabled, this is enough for a clean still image.

**Denoising**: Render Properties → Sampling → Denoising → enable both Render and Viewport. OpenImageDenoise works on CPU and all GPUs. OptiX is NVIDIA-only but faster.

**Resolution**: 1920×1080. Standard, no reason to go higher for a first render.

**Output path**: Output Properties → Output → set a folder and filename. Use // to make it relative to the .blend file.

**F12**: render the current frame. The image opens in the Render Result window. **Image → Save As** to export the PNG.

>> Enable GPU rendering in Preferences → System → Cycles Render Devices. On Mac, select Metal. On NVIDIA, select CUDA or OptiX. Cycles on GPU is 5–20x faster than CPU for this kind of scene.`,
    },
    {
      title: "🔨 Render the Mug",
      isWorkshop: true,
      pythonCode: `import bpy, math

scene = bpy.context.scene

# Engine + denoising
scene.render.engine        = 'CYCLES'
scene.cycles.samples       = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser      = 'OPENIMAGEDENOISE'

# HDRI world lighting
world = scene.world
world.use_nodes = True
tree = world.node_tree
tree.nodes.clear()
bg  = tree.nodes.new('ShaderNodeBackground')
env = tree.nodes.new('ShaderNodeTexEnvironment')
out = tree.nodes.new('ShaderNodeOutputWorld')
env.image = bpy.data.images.load("/path/to/studio.hdr")
bg.inputs["Strength"].default_value = 1.0
tree.links.new(env.outputs["Color"], bg.inputs["Color"])
tree.links.new(bg.outputs["Background"], out.inputs["Surface"])

# Floor plane (shadow catcher)
bpy.ops.mesh.primitive_plane_add(size=10)
floor = bpy.context.active_object
floor.is_shadow_catcher = True

# Camera
if "Camera" not in bpy.data.objects:
    bpy.ops.object.camera_add(location=(4, -4, 3))
cam = bpy.data.objects["Camera"]
cam.data.lens = 85.0
scene.camera = cam

# Output
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = "//renders/mug"

bpy.ops.render.render(write_still=True)`,
      content: `Take your mug from Build This and deliver a render:

1. **Enable GPU**: Preferences → System → Cycles Render Devices → select Metal (Mac) or CUDA/OptiX (NVIDIA)
2. **Delete the default Point light**
3. **Set up lighting**: either load an HDRI (World Properties → Environment Texture) or build a 3-point Area light setup
4. **Add a floor plane**: large plane below the mug. Right-click → Shadow Catcher. It shows only shadows, not its own surface.
5. **Numpad 0**: enter camera view. N → View → Lock Camera to View. Find your angle. Disable Lock Camera.
6. **Render Properties**: Cycles, 128 samples, Denoising on
7. **F12**: render. Image → Save As → export PNG.

Compare: render the same scene with EEVEE Next. Note what Cycles gets right that EEVEE doesn't (ceramic glaze accuracy, shadow softness).

✅ Goal: A PNG file you would actually send to someone. If you'd crop it before sharing, fix the framing first.`,
    },
  ],
};

export default finishThis;
