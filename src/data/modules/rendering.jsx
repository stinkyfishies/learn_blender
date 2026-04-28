// Module 14: rendering

const rendering = {
    id: 14,
    emoji: "🎬",
    title: "Rendering",
    tag: "OUTPUT",
    workflow: "py",
    color: "#a78bfa",
    intro:
      "Learn to choose between Cycles and EEVEE Next, configure a render, and get output that looks like you intended.",
    quiz: [
      {
        q: "Your scene has light focusing through a glass lens creating a caustic pattern on the table. Which renderer handles this correctly?",
        options: [
          "EEVEE Next: it's faster so it can compute more effects",
          "Cycles: it physically traces light rays, including caustics",
          "Workbench: it's designed for optical effects",
          "Both render caustics identically",
        ],
        answer: 1,
        explanation:
          "Caustics require physically tracing light rays through refractive/reflective surfaces: something only path tracers like Cycles do correctly. EEVEE Next approximates many effects but not true caustics.",
      },
      {
        q: "What does enabling Denoising in Cycles allow you to do?",
        options: [
          "Render at full quality with zero noise regardless of sample count",
          "Use far fewer samples while still getting a clean result: AI removes remaining noise",
          "Denoise the audio track of an animation",
          "Remove compression artifacts from imported image textures",
        ],
        answer: 1,
        explanation:
          "Denoising (OIDN or OptiX) is a trained model that removes Monte Carlo noise from low-sample Cycles renders. 64 samples + denoising can rival 512 samples without it.",
      },
      {
        q: "You're rendering an animation of a motion graphic logo. Speed matters more than caustics. Which engine?",
        options: [
          "Cycles: it's the only production-quality renderer",
          "EEVEE Next: near-instant frames, still high quality for motion graphics",
          "Workbench: designed for animation",
          "They take the same time for animations",
        ],
        answer: 1,
        explanation:
          "EEVEE Next is a real-time path-traced renderer: frame times are orders of magnitude faster than Cycles for animation. For motion graphics, stylised work, and non-caustics scenes, it's the right choice.",
      },
      {
        q: "What is the Compositor in Blender used for?",
        options: [
          "Compositing multiple .blend files into one scene",
          "A node-based post-processing graph that runs on 2D rendered images: color grading, glare, depth of field, combining render passes",
          "Real-time mixing of audio and video tracks",
          "Merging multiple materials into one shader",
        ],
        answer: 1,
        explanation:
          "The Compositor processes rendered images as 2D data using nodes. It runs after the render and can apply color grading, bloom, lens effects, and combine separate render passes into a final image.",
      },
    ],
    sections: [
      {
        title: "Cycles vs EEVEE Next: When to Use Each",
        versionNote: "v4.2+",
        pythonCode: `import bpy

scene = bpy.context.scene

# Switch engine
scene.render.engine = 'CYCLES'             # path-traced
scene.render.engine = 'BLENDER_EEVEE_NEXT' # real-time path-traced
scene.render.engine = 'BLENDER_WORKBENCH'  # clay/technical

# Cycles: GPU on Apple Metal (Mac)
prefs = bpy.context.preferences
cprefs = prefs.addons['cycles'].preferences
cprefs.compute_device_type = 'METAL'
cprefs.get_devices()
for d in cprefs.devices: d.use = True
scene.cycles.device = 'GPU'

# Cycles: samples + denoising
scene.cycles.samples = 256
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPENIMAGEDENOISE'

# EEVEE Next
eevee = scene.eevee
eevee.taa_render_samples = 64
eevee.use_gtao            = True  # ambient occlusion
eevee.use_bloom           = True  # glow/bloom effect
eevee.use_ssr             = True  # screen space reflections

# Print current engine
print(f"Active engine: {scene.render.engine}")`,
        content: `**Cycles**: Physically accurate path tracing.
- Simulates true light: reflections, refractions, caustics (light through glass), subsurface scattering, volumetrics
- Slower: seconds to minutes per frame on GPU, much longer on CPU
- Use when: photorealistic output is the goal, caustics are required, subsurface skin is critical
- GPU rendering available: CUDA/OptiX (NVIDIA), Metal (Mac). Enable in **Preferences → System → Cycles Render Devices**.

**EEVEE Next** (Blender 4.2+): Real-time path-traced renderer.
- Near-instant feedback in the viewport
- Supports: true reflections, refractions, volumetrics, subsurface scattering, global illumination
- Significantly faster than Cycles for animation
- Some limitations vs Cycles: fewer light bounces, limited caustics, lighter volumetric detail
- Use when: motion graphics, stylized work, animation with tight deadlines, real-time previsualization

**Workbench**
Technical renderer for clay renders, studio presentation. No materials, just form.

For most non-caustics work, EEVEE Next produces competitive results to Cycles at a fraction of the time.`,
      },
      {
        title: "Key Render Settings",
        pythonCode: `import bpy

scene = bpy.context.scene
render = scene.render

# Resolution
render.resolution_x          = 1920
render.resolution_y          = 1080
render.resolution_percentage = 100   # 50% = half resolution (fast preview)

# Frame range and FPS
scene.frame_start = 1
scene.frame_end   = 250
render.fps        = 24   # 24=film, 30=NTSC/web, 60=game

# Output
render.filepath      = "//renders/frame_"   # // = relative to .blend file
render.image_settings.file_format = 'PNG'   # 'PNG','JPEG','OPEN_EXR_MULTILAYER'
render.image_settings.color_depth = '16'    # bit depth for PNG/EXR

# Render a single frame
bpy.ops.render.render(write_still=True)     # F12 equivalent

# Render animation (all frames in range)
bpy.ops.render.render(animation=True)       # Ctrl+F12 equivalent

# Open last render in Image Editor
bpy.ops.render.view_show()                  # F11 equivalent`,
        content: `!! The viewport is not the render. Viewport shading uses approximations: lights may differ, some shader nodes don't preview correctly, post-processing is off, and the viewport camera may not match the render camera. Always hit F12 before judging your scene. If the render looks nothing like the viewport, check: render engine (Cycles vs EEVEE Next), camera match (Numpad 0 = camera view), and whether materials have nodes that require a full render to evaluate.

**Render Properties (🎬 icon)**:
**Render Engine**
Cycles / EEVEE Next / Workbench
**Samples**
How many light paths to trace per pixel (Cycles). More = less noise, more time. 128–256 for preview, 512–2048 for final.
**Denoising**
Enable! AI denoising (OptiX on NVIDIA, OpenImageDenoise for CPU) removes noise at low sample counts. Use **Render Denoising** for final, **Viewport Denoising** for preview.
- **Light Paths** (Cycles): Number of bounces for each ray type. Defaults are fine; reduce Transmission/Volume bounces to speed up glass-heavy scenes.

**Output Properties (🖼️ icon)**:
**Resolution X/Y**
Image size in pixels. Common: 1920×1080 (FHD), 3840×2160 (4K).
**Frame Range**
Start/end frame for animation renders.
**Frame Rate**
24fps (film), 25fps (PAL), 30fps (NTSC/web), 60fps (game/slow-mo).
**Output Path**
Where to save frames. Use // for relative to the .blend file.
**File Format**
PNG (lossless, single frames), JPEG (lossy), OpenEXR (HDR data, multi-pass, essential for compositing).

**F12**
Render current frame
**Ctrl+F12**
Render animation (all frames in range)
**F11**
Show last rendered image`,
      },
      {
        title: "Render Passes & the Compositor",
        pythonCode: `import bpy

# Enable render passes on the View Layer
vl = bpy.context.scene.view_layers["ViewLayer"]
vl.use_pass_diffuse_color   = True
vl.use_pass_shadow          = True
vl.use_pass_z               = True    # depth pass
vl.use_pass_normal          = True
vl.use_pass_combined        = True    # always on (the final beauty)

# Output to OpenEXR Multilayer (preserves all passes in one file)
render = bpy.context.scene.render
render.image_settings.file_format  = 'OPEN_EXR_MULTILAYER'
render.image_settings.color_depth  = '32'
render.image_settings.exr_codec    = 'ZIP'

# Access compositor nodes via Python
scene = bpy.context.scene
scene.use_nodes = True
tree  = scene.node_tree
nodes = tree.nodes
links = tree.links

nodes.clear()

rl  = nodes.new('CompositorNodeRLayers');    rl.location  = (-400, 0)
cb  = nodes.new('CompositorNodeColorBalance'); cb.location = (0,   0)
glare = nodes.new('CompositorNodeGlare');    glare.location = (250, 0)
comp = nodes.new('CompositorNodeComposite'); comp.location  = (500, 0)

glare.glare_type = 'BLOOM'
glare.threshold  = 0.8
glare.size       = 6

links.new(rl.outputs["Image"], cb.inputs["Image"])
links.new(cb.outputs["Image"], glare.inputs["Image"])
links.new(glare.outputs["Image"], comp.inputs["Image"])`,
        content: `Instead of rendering a single flat image, Blender can output **render passes**: separate layers for shadows, reflections, diffuse, specular, depth, normals, etc.

Enable passes: **View Layer Properties → Passes**: check what you need.

Output to **OpenEXR Multilayer** format to preserve all passes in one file.

**The Compositor** (Workspace → Compositing tab or open Compositor editor):
- A node graph for post-processing rendered images
- Runs after the render, on the 2D image
- Key nodes: **Render Layers** (your passes as input), **Color Balance**, **Glare** (bloom/streaks/glow), **Lens Distortion**, **Blur**, **Mix**, **Vignette** (using Ellipse Mask)
- Can combine multiple render layers, apply color grading, add depth of field, all non-destructively

**Viewport Compositor** (Blender 4.x+): apply compositor effects live in the 3D viewport. Instant visual feedback without a full render.

The Compositor is what separates a raw render from a finished image.`,
      },
      {
        title: "Camera Settings That Matter",
        pythonCode: `import bpy

if "Camera" not in bpy.data.objects:
    bpy.ops.object.camera_add(location=(7, -7, 5))
cam_obj  = bpy.data.objects["Camera"]
cam_data = cam_obj.data  # bpy.types.Camera

# Focal length: controls zoom and perspective distortion
cam_data.lens      = 85.0    # mm: 24=wide, 50=normal, 85=portrait, 135=telephoto
cam_data.lens_unit = 'MILLIMETERS'  # or 'FOV'

# Sensor size (full frame = 36mm, affects DoF and perspective)
cam_data.sensor_width = 36.0
cam_data.sensor_fit   = 'AUTO'

# Depth of Field
cam_data.dof.use_dof        = True
cam_data.dof.focus_object   = bpy.data.objects["Subject"]
cam_data.dof.aperture_fstop = 2.8   # lower = shallower DoF / more blur

# Camera type
cam_data.type = 'PERSP'    # 'PERSP', 'ORTHO', 'PANO'

# Panoramic (360° VR render)
cam_data.type = 'PANO'
cam_data.panorama_type = 'EQUIRECTANGULAR'

# Clip range (relevant for very large/small scenes)
cam_data.clip_start = 0.1
cam_data.clip_end   = 1000.0

# Set as active scene camera
bpy.context.scene.camera = cam_obj`,
        content: `Select the camera → **Object Data Properties (🎬 camera icon)**:

**Focal Length**
Longer = telephoto (compressed perspective, good for portraits). Shorter = wide angle (distorted, dramatic). 50mm ≈ human eye. 85–135mm = portrait. 24mm = wide architectural.
**Sensor Size**
Affects depth of field and perspective. Full Frame (36mm) is the default.
**Depth of Field → F-Stop**
Lower = more blur (shallow depth of field). Higher = everything sharp. Enable DoF, set Focus Object or Distance.
**Clip Start/End**
The near and far range where Blender renders. Adjust for very small or very large scenes.
**Camera Type**
Perspective (default), Orthographic (no perspective, technical drawings), Panoramic (360° equirectangular for VR).

**Numpad 0**
Enter camera view
**N → View → Lock Camera to View**
Navigate freely and the camera follows. Disable when done.
**Ctrl+Alt+0**
Snap the camera to current viewport.`,
      },
      {
        title: "🔨 Mini Workshop: First Beauty Render",
        isWorkshop: true,
        pythonCode: `import bpy, math

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples       = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser      = 'OPENIMAGEDENOISE'

# HDRI world
world = scene.world
world.use_nodes = True
tree  = world.node_tree
tree.nodes.clear()
bg  = tree.nodes.new('ShaderNodeBackground')
env = tree.nodes.new('ShaderNodeTexEnvironment')
out = tree.nodes.new('ShaderNodeOutputWorld')
env.image = bpy.data.images.load("/path/to/studio.hdr")
bg.inputs["Strength"].default_value = 1.2
tree.links.new(env.outputs["Color"], bg.inputs["Color"])
tree.links.new(bg.outputs["Background"], out.inputs["Surface"])

# Shadow catcher floor
bpy.ops.mesh.primitive_plane_add(size=10)
floor = bpy.context.active_object
mat   = bpy.data.materials.new("ShadowCatcher")
mat.use_nodes       = True
mat.shadow_method   = 'OPAQUE'
floor.data.materials.append(mat)
floor.is_shadow_catcher = True  # Cycles shadow catcher

# Render
scene.render.filepath = "//beauty_render"
scene.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(write_still=True)`,
        content: `Take any object and render it in a way you'd actually want to show someone:

1. Switch to **Cycles** in Render Properties
2. Samples: 128, enable **Denoising** (OpenImageDenoise)
3. **World Properties → Environment Texture**: load any HDRI
4. **Shift+A → Mesh → Plane**: large plane below object as floor. Add material → enable **Shadow Catcher** (Material → Settings → Shadow Mode: Shadow Catcher): floor shows only shadows, not itself.
5. **Numpad 0**: camera view. Press N → View → Lock Camera to View, navigate to a good angle.
6. **F12**: render.

Experiment: switch the same setup to EEVEE Next. Compare quality vs render time.

✅ Goal: A render you'd show someone: with shadows, environment, proper camera`,
      },
    ],
  };

export default rendering;
