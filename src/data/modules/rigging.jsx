// Module 17: rigging

const rigging = {
  id: 17,
  emoji: "🦴",
  title: "Rigging",
  tag: "ANIMATION",
  workflow: "ui",
  specialized: true,
  color: "#f43f5e",
  intro:
    "Learn how armatures, bones, and skinning work together — enough to rig a simple prop or character and understand rigs you encounter in downloaded assets.",
  quiz: [
    {
      q: "What is the correct order to parent a mesh to an armature with Ctrl+P?",
      options: [
        "Select the armature first, then the mesh, then Ctrl+P",
        "Select the mesh first, then Shift+click the armature, then Ctrl+P",
        "Select both at the same time with Box Select, then Ctrl+P",
        "Drag the mesh onto the armature in the Outliner",
      ],
      answer: 1,
      explanation:
        "In Blender, the last selected object is the parent. To make the armature the parent of the mesh: select the mesh, Shift+click the armature (so it's active), then Ctrl+P → With Automatic Weights.",
    },
    {
      q: "What does weight painting control?",
      options: [
        "The color of the mesh in the viewport",
        "How much influence each bone has over each vertex of the mesh",
        "The texture coordinates for the armature",
        "The speed of the animation playback",
      ],
      answer: 1,
      explanation:
        "Weights are per-vertex values (0.0 to 1.0) that determine how much a specific bone moves each vertex. Red = full influence, blue = none. Overlapping weights between bones create smooth deformations.",
    },
    {
      q: "What is the difference between FK and IK?",
      options: [
        "FK is for fingers, IK is for knees",
        "FK: rotate each bone manually down the chain. IK: place the end of the chain and Blender calculates intermediate bone positions",
        "FK uses keyframes, IK uses physics simulation",
        "They are two names for the same thing",
      ],
      answer: 1,
      explanation:
        "Forward Kinematics (FK): rotate parent to affect child, chain by chain. Inverse Kinematics (IK): move a target at the end of the chain and the solver works backwards to position all intermediate bones. IK is much faster for animating limbs.",
    },
    {
      q: "In Pose Mode, what does the 'Chain Count' on an IK constraint control?",
      options: [
        "How many objects are in the scene",
        "How many keyframes the IK animation uses",
        "How many bones up the chain are affected by the IK solver",
        "The speed of the IK calculation",
      ],
      answer: 2,
      explanation:
        "Chain Count = 2 means the IK solver affects the bone with the constraint plus 1 bone above it (e.g. hand + forearm). Chain Count = 3 would also include the upper arm. Set to 0 for unlimited chain length.",
    },
    {
      q: "A section of your mesh doesn't move when you pose a bone. What is the most likely cause?",
      options: [
        "The mesh resolution is too low",
        "The bone has no influence over those vertices: either the vertex group for that bone has zero weight, or those vertices aren't in the group at all",
        "The armature modifier is disabled",
        "You need to apply the armature before posing",
      ],
      answer: 1,
      explanation:
        "Weight = 0 means no movement. Enter Weight Paint mode, select the bone in question, and the viewport will show the weight map. Vertices in blue have zero weight. Paint them red to add influence.",
    },
  ],
  sections: [
    {
      title: "What Rigging Is",
      pythonCode: `import bpy

# A rig has three main components:
# 1. Armature object: the skeleton
# 2. Mesh object: the skin
# 3. Parenting + weights: the binding between them

# List all armatures in the scene
for obj in bpy.data.objects:
    if obj.type == 'ARMATURE':
        print(f"Armature: {obj.name}")
        for bone in obj.data.bones:
            print(f"  Bone: {bone.name}, parent: {bone.parent}")

# Check if a mesh has an Armature modifier
mesh = bpy.data.objects["Character"]
for mod in mesh.modifiers:
    if mod.type == 'ARMATURE':
        print(f"Armature modifier: target = {mod.object.name}")`,
      content: `A rig is a control system layered on top of a mesh. You don't animate the mesh directly: you pose bones, and the mesh follows.

**Three components:**
**Armature**: a Blender object containing bones. Bones have a head (base), tail (tip), and roll (rotation around the bone axis). They form hierarchies: rotating a parent bone rotates all its children.
**Mesh**: the geometry being controlled. It stays in place while bones move; weights determine how much each bone pulls each vertex.
**Armature modifier**: added to the mesh automatically when you parent to the armature. This modifier reads bone positions and deforms the mesh accordingly.

**Two modes for armatures:**
**Edit Mode**: add, move, and connect bones. This is where you build the skeleton structure.
**Pose Mode**: rotate, translate, and scale bones to create poses. This is where you animate.

Object Mode: the armature is treated as a regular object (move the whole rig, not individual bones).`,
    },
    {
      title: "Armatures and Bones",
      pythonCode: `import bpy

# Add an armature
bpy.ops.object.armature_add(location=(0, 0, 0))
armature = bpy.context.active_object
armature.name = "Character_Rig"
armature.data.display_type = 'STICK'  # clearest for learning

# Enter Edit Mode to build the skeleton
bpy.ops.object.mode_set(mode='EDIT')
arm = armature.data

# The default bone
root = arm.edit_bones["Bone"]
root.name = "Root"
root.head = (0, 0, 0)
root.tail = (0, 0, 0.5)

# Extrude a child bone (spine)
spine = arm.edit_bones.new("Spine")
spine.head = root.tail.copy()
spine.tail = (0, 0, 1.2)
spine.parent = root
spine.use_connect = True  # tail of parent = head of child

# Add an arm bone (not connected to spine, offset to side)
upper_arm = arm.edit_bones.new("Upper_Arm_L")
upper_arm.head = (0.3, 0, 1.1)
upper_arm.tail = (0.7, 0, 0.9)
upper_arm.parent = spine
upper_arm.use_connect = False  # floating attachment point

bpy.ops.object.mode_set(mode='OBJECT')`,
      content: `**Adding an armature:**
Shift+A → Armature in Object Mode. Starts with a single bone.

**Edit Mode for bones:**
Tab to enter Edit Mode on the armature. Works like mesh editing but for bones.

**Extruding bones:**
Select a bone tip (the white circle at the tail end), press E to extrude a new connected child bone. This is the fastest way to build a chain (spine, arm, finger segments).

**Bone display:**
Object Data Properties → Viewport Display → Display As. **Stick** is clearest for learning. B-Bone gives more visual control for curved spines.

**Bone axis:**
Each bone has a roll angle controlling which direction is "up" for that bone. Consistent roll across a limb is important for predictable rotation. With bones selected in Edit Mode: Armature → Recalculate Roll → Local + X Tangent works well for arms.

**Connected vs floating:**
When use_connect is True, the head of a child bone is locked to the tail of its parent. Rotating the parent drags the child. When False, the parent-child relationship still exists but the child can be positioned independently.`,
    },
    {
      title: "Parenting Mesh to Armature",
      pythonCode: `import bpy

mesh = bpy.data.objects["Character_Mesh"]
armature = bpy.data.objects["Character_Rig"]

# Deselect everything
bpy.ops.object.select_all(action='DESELECT')

# Select mesh first, then armature (armature must be active)
mesh.select_set(True)
armature.select_set(True)
bpy.context.view_layer.objects.active = armature

# Parent with automatic weights
bpy.ops.object.parent_set(type='ARMATURE_AUTO')
# This: adds Armature modifier to the mesh
#       creates one vertex group per bone
#       calculates initial weights automatically

# Alternative: empty groups (manual weight painting only)
bpy.ops.object.parent_set(type='ARMATURE_NAME')
# Creates groups but all weights = 0 until you paint them`,
      content: `**The parenting step:**
1. Select the mesh
2. Shift+click the armature (it becomes active)
3. Ctrl+P → **With Automatic Weights**

Blender calculates influence weights for each bone automatically based on proximity. The result won't be perfect for complex characters, but it's a working base to refine with weight painting.

**What happens behind the scenes:**
- An **Armature modifier** is added to the mesh (visible in the modifier stack)
- One **vertex group** is created per bone, named to match the bone
- Each vertex gets assigned weights across these groups

**With Empty Groups** (Ctrl+P → With Empty Groups):
Creates the vertex groups but leaves all weights at 0. Every weight must be painted manually. Only useful when you want full control from the start.

!! Select mesh first, armature second. The last selected object becomes the parent. Getting this backwards means the mesh becomes the parent of the armature, which is not what you want.`,
    },
    {
      title: "Weight Painting",
      pythonCode: `import bpy

obj = bpy.data.objects["Character_Mesh"]
bpy.context.view_layer.objects.active = obj

# List vertex groups (one per bone)
for vg in obj.vertex_groups:
    print(f"{vg.index}: {vg.name}")

# Set weight for specific vertices programmatically
vg = obj.vertex_groups["Upper_Arm_L"]
# add(vertex_indices, weight, mode)
# mode: 'REPLACE', 'ADD', 'SUBTRACT'
vg.add([0, 1, 2, 3], 1.0, 'REPLACE')   # full influence
vg.add([4, 5, 6],    0.5, 'REPLACE')   # half influence

# Remove vertices from a group
vg.remove([7, 8, 9])

# Normalize all vertex groups on all vertices
# (makes sure weights across all bones sum to 1.0 per vertex)
bpy.ops.object.vertex_group_normalize_all(lock_active=False)`,
      content: `Weight painting is how you refine which bone controls which part of the mesh.

**Entering Weight Paint mode:**
Select the mesh (with the armature also present in the scene), then switch to Weight Paint mode from the mode dropdown or Ctrl+Tab.

**Reading the weight map:**
Red = 1.0 (full influence). Blue = 0.0 (no influence). The color shows which bone's influence you're viewing: the active bone in the armature determines which vertex group is displayed.

**Brushes:**
- **Draw**: paint a weight value directly
- **Blur**: smooth the transition between weights
- **Add / Subtract**: incrementally increase or decrease
Adjust brush strength and radius in the header bar.

**Workflow:**
1. In Pose Mode, move a bone to see which vertices follow
2. Find the problem (part doesn't move, wrong bone takes it, etc.)
3. Switch to Weight Paint mode
4. Select the bone whose influence you want to adjust in the armature (Pose Mode) while staying in Weight Paint mode on the mesh
5. Paint the correction

!! If part of your mesh doesn't move when you pose a bone, enter Weight Paint mode and select that bone. The weight map will show the affected vertices. Blue means zero weight: paint them to add influence.
!! Weights should sum to 1.0 per vertex across all bones for correct deformation. Run Object → Vertex Groups → Normalize All after manual painting sessions. Automatic Weights handles this; manual painting can drift.`,
    },
    {
      title: "Pose Mode: Posing and Keyframing",
      pythonCode: `import bpy
import mathutils

armature = bpy.data.objects["Character_Rig"]
bpy.context.view_layer.objects.active = armature
bpy.ops.object.mode_set(mode='POSE')

bone = armature.pose.bones["Upper_Arm_L"]

# Set rotation (Euler angles in radians)
bone.rotation_mode = 'XYZ'
bone.rotation_euler = mathutils.Euler((0.5, 0.0, 0.3), 'XYZ')

# Insert keyframe for rotation at current frame
bpy.context.scene.frame_set(1)
bone.keyframe_insert(data_path="rotation_euler", frame=1)

# Different pose at frame 24
bpy.context.scene.frame_set(24)
bone.rotation_euler = mathutils.Euler((1.2, 0.0, 0.0), 'XYZ')
bone.keyframe_insert(data_path="rotation_euler", frame=24)

# Reset bone to rest pose
bone.rotation_euler = mathutils.Euler((0, 0, 0), 'XYZ')
bone.location = (0, 0, 0)
bone.scale = (1, 1, 1)

# Apply rest pose: bake current pose as the new default
bpy.ops.pose.armature_apply()`,
      content: `Pose Mode is where you animate. Each bone can be rotated (R), translated (G), or scaled (S) like any 3D object.

**Keying poses:**
Press I with the cursor over the viewport to insert a keyframe. A menu asks what to key: Location, Rotation, Scale, or LocRotScale. For character animation, LocRotScale on the relevant bones is typical.

**Dope Sheet:**
Shows all keyframes on a timeline. Switch any editor to Dope Sheet to see and edit timing. Select keyframes and slide them left/right to adjust timing.

**Graph Editor:**
Shows the interpolation curves between keyframes. This is where you control easing: a curve that shoots up and slows down at the top gives a bouncing feel. A flat curve gives linear, robotic movement.

**Bone constraints** (Properties → Bone Constraints, with a bone selected in Pose Mode):
Constraints limit or automate bone behavior. **Copy Rotation**: one bone mirrors another. **Track To**: bone always points at a target. **Limit Rotation**: prevents a joint from bending past its anatomical limit.

The rest pose (Edit Mode pose) is the zero point. When all bones show no rotation, the mesh matches the Edit Mode shape.`,
    },
    {
      title: "Basic IK Setup",
      pythonCode: `import bpy

armature = bpy.data.objects["Character_Rig"]
bpy.context.view_layer.objects.active = armature
bpy.ops.object.mode_set(mode='POSE')

# Add IK constraint to the hand bone
hand_bone = armature.pose.bones["Hand_L"]
ik = hand_bone.constraints.new('IK')
ik.chain_count = 2  # affects Hand_L + Forearm_L

# Create an empty as the IK target
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0.6, 0, 1.0))
ik_target = bpy.context.active_object
ik_target.name = "IK_Target_Hand_L"

# Create a pole target (controls elbow direction)
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0.5, -1.0, 1.0))
pole_target = bpy.context.active_object
pole_target.name = "Pole_Hand_L"

# Wire up targets
bpy.context.view_layer.objects.active = armature
bpy.ops.object.mode_set(mode='POSE')
ik.target = ik_target
ik.pole_target = pole_target
ik.pole_angle = 0  # adjust until elbow points the right direction`,
      content: `**FK vs IK:**
**FK (Forward Kinematics)**: rotate the shoulder, then the elbow, then the wrist. Natural for spine, tail, and finger animation where you want direct control of each segment.
**IK (Inverse Kinematics)**: place a target where the hand should be. Blender calculates shoulder and elbow angles automatically. Much faster for hand and foot placement.

**Setting up IK:**
1. In Pose Mode, select the bone at the end of the chain (hand/wrist)
2. Properties → Bone Constraints → Add → Inverse Kinematics
3. Set **Target**: an empty object you'll move to position the hand
4. Set **Chain Count**: how many bones the solver controls (2 = hand + forearm)

**Pole target:**
A second target that controls which direction the elbow (or knee) bends toward. Without it, the IK solver can flip unpredictably. Add a pole target empty positioned in front of the knee or behind the elbow.

**IK vs FK switching:**
Advanced rigs allow switching between IK and FK per-shot using drivers and custom properties. Beyond the scope of this module, but worth knowing it exists once you need it.`,
    },
    {
      title: "🔨 Mini Workshop: Rig a Simple Arm",
      isWorkshop: true,
      pythonCode: `import bpy
import mathutils

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create a simple arm mesh (two cylinders joined)
bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.08, depth=0.6, location=(0, 0, 0.3))
upper = bpy.context.active_object
upper.name = "Upper_Arm"

bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.06, depth=0.5, location=(0, 0, -0.25))
lower = bpy.context.active_object
lower.name = "Lower_Arm"

# Join into one mesh
bpy.ops.object.select_all(action='DESELECT')
upper.select_set(True)
lower.select_set(True)
bpy.context.view_layer.objects.active = upper
bpy.ops.object.join()
arm_mesh = bpy.context.active_object
arm_mesh.name = "Arm"

# Create armature
bpy.ops.object.armature_add(location=(0, 0, 0))
rig = bpy.context.active_object
rig.name = "Arm_Rig"

bpy.ops.object.mode_set(mode='EDIT')
arm_data = rig.data

upper_bone = arm_data.edit_bones["Bone"]
upper_bone.name = "Upper_Arm"
upper_bone.head = (0, 0, 0.6)
upper_bone.tail = (0, 0, 0)

lower_bone = arm_data.edit_bones.new("Lower_Arm")
lower_bone.head = (0, 0, 0)
lower_bone.tail = (0, 0, -0.5)
lower_bone.parent = upper_bone
lower_bone.use_connect = True

bpy.ops.object.mode_set(mode='OBJECT')

# Parent mesh to armature
bpy.ops.object.select_all(action='DESELECT')
arm_mesh.select_set(True)
rig.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.parent_set(type='ARMATURE_AUTO')

print("Arm rig created")`,
      content: `Build a two-bone arm rig from scratch.

**Step 1: Create the mesh**
Model two cylinders representing upper arm and forearm. Join them (Ctrl+J). The joint should be at Z=0 for easy armature alignment.

**Step 2: Build the armature**
Shift+A → Armature. In Edit Mode, set up two bones: Upper_Arm (head at shoulder, tail at elbow) and Lower_Arm (head at elbow, tail at wrist), connected.

**Step 3: Parent with automatic weights**
Select the mesh, Shift+click the armature (armature becomes active), Ctrl+P → With Automatic Weights.

**Step 4: Test FK**
Enter Pose Mode on the armature. Rotate the Upper_Arm bone. The forearm should follow. Rotate Lower_Arm independently to bend the elbow.

**Step 5: Add IK**
Select the Lower_Arm bone in Pose Mode. Add an IK constraint (Bone Constraints). Create an empty, assign it as the IK target. Set Chain Count to 2.

**Step 6: Test IK**
Move the empty in Object Mode. The arm should follow, bending naturally at the elbow. Adjust the pole target if the elbow bends in the wrong direction.

**Step 7: Check weights**
Enter Weight Paint mode on the mesh. Select each bone in turn and look at the weight maps. Any obvious bleeding (upper arm bone influencing forearm vertices) should be corrected by painting.`,
    },
  ],
};

export default rigging;
