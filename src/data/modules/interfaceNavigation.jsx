// Module 2: interfaceNavigation

const interfaceNavigation = {
    id: 2,
    emoji: "🧭",
    title: "Interface & Navigation",
    tag: "MAC TRACKPAD",
    color: "#5b8dee",
    intro:
      "Learn to navigate Blender comfortably on a Mac trackpad: viewport movement, editor layout, and the three settings that make everything work.",
    quiz: [
      {
        q: "On a Mac trackpad, what gesture orbits the 3D viewport in Blender?",
        options: [
          "Option + drag",
          "Three-finger swipe",
          "Two-finger drag",
          "Cmd + drag",
        ],
        answer: 2,
        explanation:
          "Two-finger drag orbits the viewport. Shift+two-finger drag pans, and pinch zooms. Option+drag maps to middle mouse but two-finger drag is the natural orbit gesture on Mac.",
      },
      {
        q: "You want to run a Blender feature but can't find it in any menu. What's the fastest way?",
        options: [
          "Search the Blender documentation online",
          "Press F3 to open the operator search",
          "Check Preferences → Add-ons",
          "Right-click in the viewport",
        ],
        answer: 1,
        explanation:
          "F3 searches every available operator by name. Type what you want and run it directly: the core AI-assisted coding shortcut.",
      },
      {
        q: "What does pressing the Period (.) key do in the 3D viewport?",
        options: [
          "Opens the decimal input for precise transforms",
          "Frames the selected object(s) in the viewport",
          "Toggles orthographic mode",
          "Opens the pivot point pie menu",
        ],
        answer: 3,
        explanation:
          "The regular Period key opens the pivot point pie menu (Median Point, Active Element, etc.). Framing the selected object requires Numpad Period, or View → Frame Selected from the viewport header.",
      },
      {
        q: "What does the Z key open in the 3D viewport?",
        options: [
          "The zoom controls",
          "The undo history",
          "The shading pie menu (Wireframe, Solid, Material, Rendered)",
          "The scale tool",
        ],
        answer: 2,
        explanation:
          "Z opens the shading pie menu: a quick way to switch between how the scene looks without going to the toolbar.",
      },
    ],
    sections: [
      {
        title: "First: Configure Blender for Mac Trackpad",
        pythonCode: `import bpy

# Read/write Blender preferences via Python
prefs = bpy.context.preferences
inputs = prefs.inputs

# The three essential Mac trackpad settings
inputs.use_mouse_emulate_3_button = True   # Option+click = MMB (orbit)
inputs.use_numpad_as_ndof = False
inputs.use_emulate_numpad = True           # Number row = numpad views

# Save preferences so they persist
bpy.ops.wm.save_userpref()`,
        content: `**Edit → Preferences → Input**: enable these three settings:

1. ✅ **Emulate 3 Button Mouse**: Maps Option+click to middle mouse button (orbit). Essential.
2. ✅ **Emulate Numpad**: Maps the top number row (1–0) to numpad view shortcuts. Essential if you don't have a numpad.
3. ✅ **Allow Mouse Selection With Trackpad Gesture** (if shown): gesture-aware selection

Then under the **Trackpad** section (same Preferences page):
- ✅ **Use Multi-Touch Trackpad**: enables pinch-to-zoom, two-finger orbit, and Shift+two-finger pan natively

Save these preferences: **Hamburger menu (☰) → Save Preferences** so they persist across launches.`,
      },
      {
        title: "Viewport Navigation (Trackpad-First)",
        pythonCode: `import bpy

# Set the viewport to a specific view angle via Python
# (useful in scripts that set up a scene for the user)
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        region = area.spaces[0].region_3d
        # Look from front (same as Numpad 1)
        region.view_rotation.identity()

# Frame all objects (same as Home key)
bpy.ops.view3d.view_all(use_all_regions=False)

# Frame selected object (same as Numpad . key)
bpy.ops.view3d.view_selected()

# Set orthographic vs perspective
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        area.spaces[0].region_3d.view_perspective = 'ORTHO'  # or 'PERSP', 'CAMERA'`,
        content: `Once configured, your primary navigation controls:

Note: trackpad gesture mappings depend on your Preferences settings and macOS trackpad configuration. The gestures below reflect a typical Mac setup with Multi-Touch Trackpad enabled; yours may differ.

**Two-finger drag**
Orbit (rotate the view around the scene)
**Shift+two-finger drag**
Pan (slide the view left/right/up/down)
**Pinch (two-finger)**
Zoom in/out
**Numpad . (or View menu → Frame Selected)**
Frame the selected object(s): instantly centers view on your selection. Note: the regular Period key opens the pivot point menu instead. You need the numpad period, or use View → Frame Selected from the viewport header menu.
**Home** (Fn+Left Arrow on Mac laptop)
Frame everything in the scene

Keyboard view shortcuts (with Emulate Numpad ON):
**1**
Front view (looking down -Y axis)
**3**
Right side view
**7**
Top view (looking down -Z)
**Ctrl+1 / 3 / 7**
Opposite views (Back, Left, Bottom)
**5**
Toggle Perspective ↔ Orthographic
**0**
Camera view (what your render will see)
**\` (backtick)**
View pie menu: access all views at once`,
      },
      {
        title: "Editor Layout & Workspaces",
        pythonCode: `import bpy

# List all editor types in the current screen
for area in bpy.context.screen.areas:
    print(area.type)
# Common types: VIEW_3D, NODE_EDITOR, PROPERTIES, OUTLINER,
#   IMAGE_EDITOR, NLA_EDITOR, GRAPH_EDITOR, DOPESHEET_EDITOR

# Change an area to a different editor type
area = bpy.context.screen.areas[0]
area.type = 'NODE_EDITOR'

# Access the Shader Editor's node tree for active object
obj = bpy.context.active_object
if obj and obj.active_material:
    tree = obj.active_material.node_tree
    for node in tree.nodes:
        print(node.name, node.type)`,
        content: `Every panel in Blender is an editor. Any area can become any editor type: click the icon in the top-left corner of that area to change it. Split areas by dragging from a corner; join by dragging one corner into a neighbor.

The workspace tabs across the top (Layout, Modeling, Shading, Animation, etc.) are just saved arrangements of editors. Switch freely, nothing is lost.`,
        primitiveGrid: [
          { emoji: "🎬", name: "3D Viewport", desc: "Main working area. Present in every workspace.", use: "Everything: modeling, placing objects, sculpting, previewing the scene" },
          { emoji: "🌳", name: "Outliner", desc: "Scene hierarchy as a tree: collections, objects, and their data.", use: "Finding and selecting objects by name, hiding/showing collections, checking what's in the scene" },
          { emoji: "⚙️", name: "Properties Editor", desc: "All settings for the scene and selected object, organized by icon tabs down the side.", use: "Adding modifiers, assigning materials, adjusting render settings" },
          { emoji: "🔗", name: "Shader Editor", desc: "Build materials by wiring nodes together. Each node does one thing: color, roughness, texture.", use: "Creating a material where Noise Texture drives roughness variation across the surface" },
          { emoji: "📐", name: "Geometry Node Editor", desc: "Modify or generate geometry using a node graph instead of manual editing.", use: "Scattering 500 objects on a surface with controllable density, rotation, and scale" },
          { emoji: "🖼️", name: "UV Editor", desc: "Shows the 2D flattened layout of a mesh surface for texture mapping.", use: "Adjusting which part of an image lines up with which face after unwrapping" },
          { emoji: "⏱️", name: "Timeline", desc: "Horizontal strip showing keyframes across frames. Basic animation playback control.", use: "Scrubbing through an animation, setting the frame range for a render" },
          { emoji: "📈", name: "Graph Editor", desc: "Shows animation curves between keyframes. Control how motion accelerates and decelerates.", use: "Smoothing out a bouncing ball so it eases in and out rather than moving at constant speed" },
          { emoji: "🎞️", name: "NLA Editor", desc: "Layers and mixes multiple animations as non-linear clips.", use: "Blending a walk cycle with a wave animation on the same character" },
          { emoji: "🌈", name: "Compositor", desc: "Process the rendered image with nodes: color grade, glow, blur, combine passes.", use: "Adding a Glare node to make emissive materials bloom after rendering" },
          { emoji: "📊", name: "Info Editor", desc: "Logs every user action as Python in real time.", use: "Doing something manually in the UI then copying the Python line it logged into your script" },
        ],
      },
      {
        title: "The Most Useful Navigation Shortcuts",
        pythonCode: `import bpy

# F3 equivalent: run any operator by its Python ID
# Find operator IDs by hovering over menu items and reading the tooltip
bpy.ops.mesh.subdivide(number_cuts=2)
bpy.ops.object.shade_smooth()
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY')

# Toggle X-Ray (Alt+Z) via Python
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        area.spaces[0].shading.show_xray = True

# Set shading mode (Z pie menu equivalent)
area.spaces[0].shading.type = 'SOLID'      # Solid
area.spaces[0].shading.type = 'MATERIAL'   # Material Preview
area.spaces[0].shading.type = 'RENDERED'   # Rendered`,
        content: `These shortcuts work anywhere in Blender, regardless of which editor is active.`,
        primitiveGrid: [
          { emoji: "🔍", name: "F3: Operator Search", desc: "Type any Blender feature by name and run it instantly.", use: "You know what you want but not where it lives: F3 finds it" },
          { emoji: "⬛", name: "Ctrl+Space: Maximize", desc: "Expands the hovered editor to fill the screen. Press again to restore.", use: "Focusing on one editor without rearranging the layout" },
          { emoji: "📋", name: "N: Sidebar", desc: "Toggles the N-Panel on the right of the 3D Viewport (Item, Tool, View, addon tabs).", use: "Checking or typing exact transform values for a selected object" },
          { emoji: "🛠️", name: "T: Toolbar", desc: "Toggles the left toolbar showing tool icons for the current mode.", use: "Accessing selection and transform tools without keyboard shortcuts" },
          { emoji: "⊞", name: "Ctrl+Alt+Q: Quad View", desc: "Splits viewport into four: top, front, right, and perspective. Toggle off the same way.", use: "Aligning geometry precisely across multiple axes at once" },
          { emoji: "🎨", name: "Z: Shading Pie", desc: "Opens the shading picker: Wireframe, Solid, Material Preview, Rendered.", use: "Quickly switching how the scene looks without going to the toolbar" },
          { emoji: "👁️", name: "Alt+Z: X-Ray", desc: "Toggle see-through mode. Lets you select geometry behind the surface.", use: "Selecting hidden verts or edges that the solid surface is blocking" },
          { emoji: "🖼️", name: "F11: Last Render", desc: "Opens the last rendered image in a floating window.", use: "Reviewing a render without switching to the Render workspace" },
        ],
      },
      {
        title: "Selection on Mac",
        pythonCode: `import bpy

# Select objects by name
bpy.data.objects["Cube"].select_set(True)
bpy.context.view_layer.objects.active = bpy.data.objects["Cube"]

# Deselect all
bpy.ops.object.select_all(action='DESELECT')

# Select all
bpy.ops.object.select_all(action='SELECT')

# Select by type
bpy.ops.object.select_by_type(type='MESH')

# In Edit Mode: select all vertices
bpy.ops.mesh.select_all(action='SELECT')

# Select edge loops (Alt+Click equivalent: must be in EDGE select mode)
bpy.ops.mesh.loop_select(extend=False)

# Invert selection
bpy.ops.mesh.select_all(action='INVERT')

# Box select (programmatic, by location range)
bpy.ops.mesh.select_random(ratio=0.5)  # random % for procedural selection`,
        content: `Blender defaults to **left-click select** (matches Mac conventions).

**Click**
Select single item
**Shift+Click**
Add/remove from selection
**Cmd+Click**
(same as Shift in most contexts)
**B**
Box select: drag a rectangle
**C**
Circle select: paint with a brush (scroll to resize, right-click to exit)
**Ctrl+I**
Invert selection
**A**
Select all / deselect all (toggle)
**Alt+A**
Deselect all

In Edit Mode, selection works on whichever element type is active. With Emulate Numpad on, 1/2/3 are taken by view shortcuts. Use the three icons in the 3D Viewport header bar instead (left side, looks like a vertex/edge/face icon set). Shift+click an icon to enable multiple modes at once.

If you turn Emulate Numpad off, the number keys work as:
**1**
Vertex select mode
**2**
Edge select mode
**3**
Face select mode
**Alt+Click**
Select an entire edge loop (one of the most important shortcuts in modeling)`,
      },
    ],
  };

export default interfaceNavigation;
