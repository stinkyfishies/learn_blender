// Module 18: buildThis

const buildThis = {
  id: 18,
  emoji: "🛠️",
  title: "Build This",
  tag: "FIRST PROJECTS",
  workflow: "ui",
  color: "#f59e0b",
  intro:
    "Learn what the foundational modules can produce by building complete objects and bringing them to life with math-driven animation. Each project pairs a modeled form with an animated behavior — the animation is the same object pushed further, not a separate exercise.",
  quiz: [
    {
      q: "You want the hands of a clock to move at the correct relative speed automatically. Which Blender feature handles this?",
      options: [
        "Keyframing each hand separately on the timeline",
        "A Driver that links hand rotation to a math expression",
        "The Physics simulation system",
        "A Shape Key on the clock face",
      ],
      answer: 1,
      explanation:
        "Drivers let you express one property as a math function of another value. The minute hand angle can be frame/4, the hour hand frame/48. Both driven from the same time value, always in sync, no manual keyframing needed.",
    },
    {
      q: "You want a candle flame to flicker irregularly, not on a fixed repeating cycle. Which F-Curve modifier adds organic randomness?",
      options: [
        "Sine wave modifier",
        "Cycles modifier",
        "Noise modifier",
        "Stepped interpolation",
      ],
      answer: 2,
      explanation:
        "The Noise modifier adds randomized variation on top of a base value. Combined with a Sine modifier for the base pulse, it produces irregular flickering that never exactly repeats.",
    },
    {
      q: "Two interlocking gears need to stay in sync forever. Keyframing both separately will eventually drift. What's the correct approach?",
      options: [
        "Use a Rigid Body constraint between them",
        "Keyframe both at every frame",
        "Driver on the follower gear reading the driver gear's rotation, multiplied by the tooth ratio",
        "Use a Copy Rotation constraint",
      ],
      answer: 2,
      explanation:
        "A Driver expression like -driver_z * (large_teeth / small_teeth) keeps the gears perpetually in sync. The negative reverses direction, the ratio keeps speeds proportional. Math is more reliable than keyframes for mechanical relationships.",
    },
  ],
  sections: [
    {
      title: "How to Use This Module",
      content: `Each project has two parts: a **static model** and an **animation** that brings it to life. You can do them in sequence or return to the animation half later.

**Pick your scope carefully.** A mug takes an afternoon. A clock with working hands takes a weekend. A gear system takes a week. Underscoping is better than getting stuck halfway through something too ambitious.

**What "done" looks like:** a render, not a perfect model. Set up a camera, light the scene, render a short clip or a still. That's the finish line. Refinement is something you do on the next project.

>> Share your work at **r/blender** or **Blenderartists.org** — both are beginner-friendly and give honest feedback.`,
    },
    {
      title: "Mug + Steam",
      content: `**The model:** A ceramic mug. Cylinder primitive, loop cuts for the rim thickness, extrude-and-bridge for the handle, Solidify modifier for wall thickness. Smooth shading. A ceramic material: Principled BSDF, off-white or terracotta Base Color, Roughness around 0.6.

**The animation:** Steam rising from the opening. Two approaches:

- **Quick:** A Bezier curve above the rim, animated with a Noise F-Curve modifier on a path-follow constraint. Looks decent, no particles needed.
- **Better:** A GeoNodes setup that distributes points above the rim, offsets them upward over time with animated noise, and fades them out at a set height.

**What this exercises:** Mesh Primitives, Edit Mode, Modifiers (Solidify), Materials, basic GeoNodes or F-Curve modifiers.

!! Don't spend more than two hours on the mug shape. The animation is the interesting part.`,
    },
    {
      title: "Clock + Moving Hands",
      content: `**The model:** A wall clock. Cylinder for the face, extruded flat. Two thin rectangular prisms for hands, origin set to center. Simple materials: white face, dark hands, metallic rim.

**The animation:** The hands tell actual time driven by math. Right-click the minute hand's Z Rotation in the N-panel, choose Add Driver. Set the expression to \`frame / 4\`. The hour hand gets \`frame / 48\`. Both are driven from the same underlying frame counter, always proportionally correct.

**What this exercises:** Mesh Primitives, Edit Mode, Materials, Drivers, math expressions.

>> Drivers work on almost any numeric property in Blender. Once you understand the pattern you will find uses everywhere.`,
      pythonCode: `import bpy

# Add a driver to the minute hand's Z rotation
obj = bpy.data.objects["MinuteHand"]
fc  = obj.driver_add("rotation_euler", 2)  # 2 = Z axis
fc.driver.type = 'SCRIPTED'
fc.driver.expression = "frame / 4 * 0.10472"  # degrees to radians

# Hour hand: same approach, slower ratio
obj2 = bpy.data.objects["HourHand"]
fc2  = obj2.driver_add("rotation_euler", 2)
fc2.driver.type = 'SCRIPTED'
fc2.driver.expression = "frame / 48 * 0.10472"`,
    },
    {
      title: "Candle + Flickering Flame",
      content: `**The model:** A candle cylinder with a slightly tapered top. A small elongated teardrop for the flame: Sphere primitive, scaled tall, tapered at the tip with proportional editing. Flame material: Emission node, warm orange-white, Strength around 5. A thin cylinder for the wick.

**The animation:** In the Graph Editor, select the Emission Strength keyframe and add two F-Curve modifiers:

1. **Sine** — the base pulse. Amplitude 1, Phase Offset slightly randomized.
2. **Noise** — irregular variation on top. Scale 2, Strength 0.5.

The combination produces flickering that never exactly repeats. Apply the same Noise modifier to the flame's Z Scale for subtle size variation.

**What this exercises:** Mesh Primitives, Edit Mode, Materials (Emission), F-Curve modifiers, lighting (the flame object becomes a light source via its emission).

>> Place a Point Light inside the flame object and apply the same Noise driver to its Energy. The room lighting flickers with it.`,
    },
    {
      title: "Bouncing Ball + Squash-Stretch",
      content: `**The model:** A sphere. The interest is entirely in the animation.

**The animation:** The ball bounces with squash-stretch driven by position, not hand-keyed.

1. Keyframe the Z location: high at frame 1, ground level at frame 12, high at frame 24. Set easing to ease-in before impact, ease-out after.
2. Add a Driver on Z Scale. Set expression to \`1 - (max(0, 1 - z_loc) * 0.4)\` where z_loc is a variable reading the ball's Z location. Near the ground it squashes; at height it returns to 1.
3. To preserve volume, add Drivers on X and Y Scale with the inverse expression.

**What this exercises:** Keyframing, F-Curves, Drivers, math expressions, proportional editing.

>> The squash-stretch physics are fake but the result reads as real. That gap between physical accuracy and perceived realism is the core craft of animation.`,
      pythonCode: `import bpy

ball = bpy.data.objects["Ball"]

# Driver on Z scale: squash near ground (z=0)
fcz = ball.driver_add("scale", 2)
fcz.driver.type = 'SCRIPTED'
vz = fcz.driver.variables.new()
vz.name = "z_loc"
vz.targets[0].id = ball
vz.targets[0].data_path = "location.z"
fcz.driver.expression = "1 - (max(0, 1 - z_loc) * 0.4)"

# Driver on X scale: compensate to preserve volume
fcx = ball.driver_add("scale", 0)
fcx.driver.type = 'SCRIPTED'
vx = fcx.driver.variables.new()
vx.name = "z_loc"
vx.targets[0].id = ball
vx.targets[0].data_path = "location.z"
fcx.driver.expression = "1 + (max(0, 1 - z_loc) * 0.2)"`,
    },
    {
      title: "Gear + Rotation",
      content: `**The model:** Two interlocking gears. Model the teeth with an Array modifier set to fit a curve circle — count matches the tooth count. Duplicate for the second gear, scale it down. Position them so teeth interlock.

**The animation:** Rotate the driver gear by keyframing its Z rotation. The follower gear rotates automatically in the opposite direction at proportional speed via a Driver:

Expression: \`-driver_z * (large_teeth / small_teeth)\`

The negative reverses direction. The ratio keeps speeds proportional. If the large gear has 24 teeth and the small has 12, the expression is \`-driver_z * 2\`.

**What this exercises:** Mesh Primitives, Array modifier, Curve modifier, Drivers, math ratios.

>> Keyframing both gears separately will always drift out of sync eventually. Math keeps them locked indefinitely. This is the clearest demonstration of why Drivers exist.`,
      pythonCode: `import bpy

driver_gear = bpy.data.objects["GearLarge"]
follower    = bpy.data.objects["GearSmall"]

fc = follower.driver_add("rotation_euler", 2)
fc.driver.type = 'SCRIPTED'
v = fc.driver.variables.new()
v.name = "driver_z"
v.targets[0].id = driver_gear
v.targets[0].data_path = "rotation_euler[2]"
# Large: 24 teeth, Small: 12 teeth — ratio 2
fc.driver.expression = "-driver_z * 2"`,
    },
  ],
};

export default buildThis;
