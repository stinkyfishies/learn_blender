// Module 2: interfaceNavigation

const interfaceNavigation = {
    id: 2,
    emoji: "🧭",
    title: "Interface & Navigation",
    tag: "MAC TRACKPAD",
    color: "#5b8dee",
    intro:
      "Blender was designed around a 3-button mouse but works great on Mac trackpad once configured. Three settings unlock everything: do these first.",
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
        content: `**The UI is made of named regions**

**Top bar**
The very top strip: Blender's application menus (File, Edit, Render, Window, Help) on the left, workspace tabs in the center, scene/view layer selectors on the right.

**Workspace tabs**
The labeled tabs across the top bar (Layout, Modeling, Sculpting, Shading, Animation, Rendering, Compositing). Each is a saved arrangement of editors. Add your own with the + tab.

**Editors**
Every panel in Blender is an editor. Any area can be any editor type. Change it by clicking the icon in the top-left corner of that area. You can have as many editors open as you want by splitting areas.

**Header**
The bar at the top of each individual editor. Contains the editor type selector (the icon), mode selector (Object Mode / Edit Mode / etc.), and editor-specific menus and controls. Some editors show it at the bottom instead.

**Toolbar (T panel)**
The vertical strip on the left side of the 3D Viewport. Press T to toggle. Shows tools for the current mode (selection tools, transform tools, etc.).

**Sidebar (N panel)**
The panel that slides in from the right side of the 3D Viewport. Press N to toggle. Has tabs: Item (selected object transform), Tool (active tool settings), View (viewport settings). Addons often add their own tabs here.

**Properties Editor**
The tall panel in the bottom-right of the default layout. Organized into tabs by icon along the side: Scene, Output, View Layer, Scene (world), Object, Modifiers, Particles, Physics, Object Data, Material. This is where most settings live.

**Outliner**
Top-right panel. Shows the scene hierarchy as a tree: collections, objects, and their data. Also has display modes for browsing all data in the file (Blender File mode) or the raw datablock graph (Data API mode).

**Status bar**
The thin strip at the very bottom of the screen. Shows context-sensitive hints for what the mouse buttons and modifier keys do in the current state.

**Splitting and joining editors**
To split: hover over the corner of any editor until the cursor becomes a crosshair, then drag. To join: drag from one editor's corner into the neighbor you want to absorb. You can also right-click any border between editors for split/join options.

To open any of these: click the editor type icon in the top-left corner of any existing editor, then pick from the dropdown. You can also use the workspace tabs at the top: Shading opens a layout with the Shader Editor, Animation opens Timeline/Graph/NLA, etc.

**3D Viewport**
Main working area. Present in every workspace. The large center panel in the default layout.
**Shader Editor**
Where you build materials by wiring boxes together. Each box (node) does one thing: set a color, control roughness, add a texture. You connect outputs into inputs to describe how a surface looks. Example: plug a Noise Texture node into the Roughness input of a Principled BSDF and the roughness varies across the surface without painting anything. Open via the Shading workspace tab. Only shows content when an object with a material is selected.
**Geometry Node Editor**
Where you create or modify geometry using logic instead of pushing vertices by hand. You build a graph of operations: "take this mesh, scatter 500 copies of another object on its surface, randomize their rotation and scale." Change a number, the result updates instantly. Nothing is destructive. Open by adding a Geometry Nodes modifier to an object, or switching any editor to this type.
**Compositor**
Where you process the rendered image after Blender finishes rendering it. Add color grading, glow, depth of field blur, or combine multiple render passes. Works on the final pixels, not the 3D scene. Found in the Compositing workspace tab. Only active when Use Nodes is checked in its header.
**Timeline / Graph Editor / NLA Editor**
Animation editors. Timeline shows keyframes on a simple strip. Graph Editor shows the curves between keyframes so you can control how motion accelerates and decelerates. NLA Editor layers and mixes multiple animations. All three are in the Animation workspace tab.
**UV Editor**
When you apply a texture image to a 3D object, Blender needs to know which part of the image maps to which face. UV unwrapping is the process of flattening the 3D surface into a 2D layout that lines up with the texture. The UV Editor is where you see and adjust that layout. Only shows content when in Edit Mode with faces selected. Found in the UV Editing workspace tab.`,
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
        content: `**F3**: Operator search. Type any Blender feature by name and run it. The single most powerful shortcut: if you know what you want but not where it lives, F3 finds it.

**Ctrl+Space**
Maximize the hovered editor (full screen). Press again to restore.

**N**
Toggle the N-Panel sidebar (Item, Tool, View, and addon panels)
**T**
Toggle the left toolbar (tool icons)

**Ctrl+Alt+Q**
Quad view (four viewports: top, front, right, perspective). Toggle off the same way.

**Z**
Shading pie menu: Wireframe, Solid, Material Preview, Rendered. Essential for quickly switching how you see the scene.

**Alt+Z**
Toggle X-Ray mode (see through the mesh: critical for selecting hidden geometry)

**F11**
Show last render (if you've rendered anything)`,
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

# In Edit Mode — select all vertices
bpy.ops.mesh.select_all(action='SELECT')

# Select edge loops (Alt+Click equivalent — must be in EDGE select mode)
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
