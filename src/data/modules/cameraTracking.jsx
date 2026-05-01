// Level Up: cameraTracking

const cameraTracking = {
  id: 20,
  emoji: "🎥",
  title: "Camera Tracking",
  tag: "VFX",
  workflow: "ui",
  specialized: true,
  color: "#f43f5e",
  intro:
    "Learn to reconstruct a camera's position from real footage so you can place 3D objects into a video and have them feel physically present in the scene.",
  quiz: [
    {
      q: "What does solving a camera track actually produce?",
      options: [
        "A stabilized version of the footage with camera shake removed",
        "A 3D camera object whose position and rotation matches the real camera at every frame",
        "A depth map of the scene derived from the footage",
        "A UV projection of the video onto 3D geometry",
      ],
      answer: 1,
      explanation:
        "The solve produces a camera object in 3D space. Its position and rotation at every frame mathematically matches where the real camera was when the footage was shot. This is what allows 3D objects to sit correctly in perspective with the video.",
    },
    {
      q: "Why does a fixed camera produce a much easier solve than a moving one?",
      options: [
        "Fixed cameras have higher resolution footage",
        "A fixed camera means tracking markers barely move, giving the solver strong constraints with minimal data",
        "Blender's tracker only works with fixed cameras",
        "Moving cameras require more markers than Blender supports",
      ],
      answer: 1,
      explanation:
        "With a fixed camera, tracked points stay nearly still across frames. The solver has very tight, consistent constraints and can produce an accurate solve with just a few markers. A moving camera requires many more markers and the solve error is harder to minimize.",
    },
    {
      q: "What is the purpose of setting the scene origin after a camera solve?",
      options: [
        "It tells Blender where to save the render output",
        "It defines where 3D world coordinates map to in the real scene: placing the origin on the bowl means (0,0,0) in 3D space is the bowl's position in the video",
        "It resets the camera to its starting position",
        "It scales the scene to match the footage resolution",
      ],
      answer: 1,
      explanation:
        "The solve gives you a camera path but no inherent scale or orientation. Setting the origin (and optionally a floor plane) tells Blender what real-world location corresponds to the 3D coordinate origin. Place it on the bowl and your 3D objects placed at (0,0,0) will sit on the bowl in the composite.",
    },
    {
      q: "What does a high solve error (above 1.0 px) indicate?",
      options: [
        "The footage resolution is too low for tracking",
        "The tracked markers are moving inconsistently between frames: the solver couldn't find a consistent camera path",
        "Blender needs more RAM to complete the solve",
        "The frame rate of the footage doesn't match the scene settings",
      ],
      answer: 1,
      explanation:
        "Solve error is measured in pixels: how far the reprojected marker positions deviate from their actual tracked positions. Above ~0.5px is worth investigating. Above 1.0px usually means bad markers, insufficient parallax, or a marker that slipped during tracking. Delete the worst markers and re-solve.",
    },
  ],
  sections: [
    {
      title: "What Camera Tracking Is For",
      content: `Camera tracking (also called match moving) reconstructs where a real camera was in 3D space at every frame of a video. The output is a Blender camera object that moves exactly as the real camera moved.

With this camera you can:
- Place 3D objects into the video that stay locked to real-world positions
- Have 3D elements cast shadows onto real surfaces
- Composite rendered 3D layers over the footage with correct perspective

**The fixed camera advantage:**
A fixed camera is the easiest possible case. The camera barely moves, so tracked points stay nearly still. The solve is fast, accurate, and requires very few markers. If your footage has a fixed camera, tracking is close to trivial.

**Where this fits the singing bowl project:**
The bowl is at a fixed position in the frame. Once tracked and solved, placing 3D wave geometry at the bowl's origin means the waves appear to emerge from the exact bowl position in the video, in correct perspective, at every frame.`,
    },
    {
      title: "The Tracking Workflow",
      content: `**Step 1: Load the footage**
Open the **Movie Clip Editor** (change any editor type). Click **Open** and load your video file. Set the scene frame range to match the clip length.

**Step 2: Place tracking markers**
Press **Ctrl+Click** to place a marker on a high-contrast, stable point in the scene. Good markers: sharp corners, bolts, edge intersections. Bad markers: flat textureless surfaces, anything that moves, anything near the frame edge.

For a fixed camera with a simple scene, 6-8 well-placed markers is enough.

**Step 3: Track the markers**
With markers placed at frame 1, press **Track** (the forward arrow in the toolbar, or A to select all markers then Track Forward). Blender follows each marker across every frame. Watch for any that drift or lose the point: delete and replace those.

**Step 4: Solve**
Click **Solve Camera Motion** in the Solve panel. A good solve error is below 0.5px. Above 1.0px: find the worst-performing markers (highlighted in the graph), delete them, and re-solve.

**Step 5: Set up the scene**
Click **Setup Tracking Scene** — Blender creates a camera object with the solved animation, a background movie clip, and an empty at the origin.

**Step 6: Set origin and floor**
Select 3 or more markers that define a flat plane (the table the bowl sits on). Use **Reconstruction → Set as Floor**. Then select the marker at the bowl position: **Reconstruction → Set Origin**. Now (0,0,0) in 3D space is the bowl.

**Step 7: Link to your scene**
The solved camera is now usable in the 3D viewport. Place your 3D geometry at the origin and it sits on the bowl in the composite.

!! Track markers on the background, not the bowl itself. The bowl moves when struck: you want the camera solve based on static scene elements.`,
    },
    {
      title: "Compositing the Result",
      pythonCode: `import bpy

# The Setup Tracking Scene button does most of this automatically.
# This shows what it creates so you understand the structure.

scene = bpy.context.scene

# The solved camera is already animated (keyframed per frame)
# It's linked via a constraint to the tracking data:
cam = bpy.data.objects["Camera"]
# cam has a Camera Solver constraint pointing to the clip

# Background: the video plays behind the 3D render
# In the Compositor: use the Movie Clip node as the background layer

scene.use_nodes = True
tree  = scene.node_tree
nodes = tree.nodes
links = tree.links
nodes.clear()

rl    = nodes.new('CompositorNodeRLayers');   rl.location    = (-300, 0)
clip  = nodes.new('CompositorNodeMovieClip'); clip.location  = (-300, -200)
alpha = nodes.new('CompositorNodeAlphaOver'); alpha.location = (0, 0)
comp  = nodes.new('CompositorNodeComposite'); comp.location  = (300, 0)

clip.clip = bpy.data.movieclips[0]

# Layer order: video behind, 3D render on top (alpha over)
links.new(clip.outputs["Image"],  alpha.inputs[1])
links.new(rl.outputs["Image"],    alpha.inputs[2])
links.new(alpha.outputs["Image"], comp.inputs["Image"])`,
      content: `The Compositor merges the video and the 3D render into a final output.

**The node setup:**
1. **Movie Clip node**: the original video footage as a 2D image sequence
2. **Render Layers node**: your 3D wave geometry rendered with a transparent background
3. **Alpha Over node**: composites the 3D layer over the video

**Transparent background:**
Render Properties → Film → Transparent: on. This makes the background of your 3D render transparent so only the wave geometry is visible over the video.

**Shadow Catcher:**
To make the waves cast shadows onto the real bowl/table, add a plane at the bowl position and enable **Shadow Catcher** (Object Properties → Visibility → Shadow Catcher). The plane catches shadows from your 3D lights and composites them into the video layer — the shadow appears on the real table without the plane itself being visible.

**Color matching:**
The 3D render and the video will have different color characteristics. Use a **Color Balance** or **Hue Saturation** node after the Alpha Over to grade the 3D layer to match the footage. This is what separates a convincing composite from an obvious one.`,
    },
    {
      title: "Applying This to the Singing Bowl",
      content: `Putting the full pipeline together for the singing bowl project:

**1. Track the footage**
Place markers on stable background elements: corners of the room, objects on the table, anything that doesn't move. 6-8 markers. Solve. Set origin to the bowl position.

**2. Build the wave geometry in GN**
A Geometry Nodes setup on a plane at the origin. Drive wave amplitude from a single custom property (a float, 0 to 1). At 0: flat. At 1: full wave height.

Good wave types to try:
- Expanding concentric rings: displace vertices by a sine function of distance from center, animated outward
- Chladni patterns: standing wave math, visually matches how bowls actually vibrate
- Abstract tendrils: noise-driven, less physically accurate but visually striking

**3. Keyframe the amplitude**
At each tap frame: amplitude jumps from 0 to 1 over ~3 frames, then decays back to 0 over ~20 frames. The wave blooms at the tap and fades. Use the Graph Editor to shape the decay curve.

**4. Material**
The waves need to feel present but not opaque. Options: thin emission (glowing), glass-like refraction, iridescent surface that shifts color with viewing angle. All achievable with Principled BSDF or a custom shader.

**5. Composite**
Movie clip behind, rendered waves on top. Transparent background. Color match.

>> The tap timing is manual: watch the footage, note the frame numbers, keyframe those frames. If you want audio-driven automation, that's a separate pipeline involving Blender's sound baking or an external tool.`,
    },
    {
      title: "🔨 Mini Workshop: Track a Fixed Shot",
      isWorkshop: true,
      content: `Practice the full solve on any fixed-camera footage. A phone video of a static object on a table works perfectly.

1. Open the **Movie Clip Editor**, load your footage
2. **Ctrl+Click** to place 8 markers on stable high-contrast points around the scene — not on the object you want to augment, on the background
3. Select all markers (A), **Track Forward** — watch for any that drift, delete and replace them
4. **Solve Camera Motion** — target: solve error below 0.5px
5. **Setup Tracking Scene** — Blender creates the camera and background setup
6. Select 3 markers on the flat surface, **Set as Floor**. Select the marker on your target object, **Set Origin**
7. In the 3D viewport with the solved camera active: **Shift+A → Mesh → Sphere** — place it at (0,0,0)
8. **Render a frame** — the sphere should sit on your object in the video

If the sphere floats or sinks: the floor plane or scale is off. Re-set the floor using markers you're more confident are coplanar.

✅ Goal: A rendered frame where a 3D object sits convincingly on a real surface`,
    },
  ],
};

export default cameraTracking;
