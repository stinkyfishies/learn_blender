// Module 4: enhancingBlender

const enhancingBlender = {
    id: 4,
    emoji: "⚙️",
    title: "Enhancing Blender",
    tag: "SETUP + ADD-ONS",
    color: "#a78bfa",
    intro:
      "Blender ships with a solid default setup, but a handful of built-in add-ons and free community tools make a meaningful difference from day one. This module covers what to enable, what to install, and where to find more.",
    quiz: [
      {
        q: "Node Wrangler is a free add-on that ships with Blender. What does it do?",
        options: [
          "Adds extra mesh primitive shapes",
          "Adds shortcuts for connecting, previewing, and managing nodes in the Shader and Geometry Node editors",
          "Enables GPU rendering on Apple Silicon",
          "Syncs Blender with VS Code",
        ],
        answer: 1,
        explanation:
          "Node Wrangler adds critical shortcuts to node editors: Ctrl+Shift+Click to preview any node, Ctrl+T to add a texture coordinate setup, and much more. It's considered essential by most Blender users.",
      },
      {
        q: "Where can you browse and install community extensions directly inside Blender 4.2+?",
        options: [
          "File → Import → Extensions",
          "Preferences → Add-ons → Install from File",
          "Preferences → Get Extensions",
          "Scripting workspace → Package Manager",
        ],
        answer: 2,
        explanation:
          "Blender 4.2 introduced the Extensions platform. Go to Preferences → Get Extensions to browse and install community add-ons without downloading anything manually.",
      },
    ],
    sections: [
      {
        title: "Built-in Add-ons to Enable First",
        pythonCode: `import bpy
import addon_utils

# Enable Node Wrangler (the one built-in add-on worth enabling immediately)
addon_utils.enable("node_wrangler", default_set=True)

# Save preferences so it persists across sessions
bpy.ops.wm.save_userpref()

# List all currently enabled add-ons
for mod in addon_utils.modules():
    is_enabled, is_loaded = addon_utils.check(mod.__name__)
    if is_enabled:
        print(mod.__name__)`,
        content: `In Blender 5.1, most of the classic bundled add-ons (LoopTools, Extra Objects, Screencast Keys) have been removed or migrated to the Extensions platform. One remains worth enabling immediately.

**Node Wrangler**
Go to **Edit → Preferences → Add-ons**, search "Node Wrangler", check the box.

Adds essential shortcuts to the Shader Editor and Geometry Node Editor. Without it, connecting nodes requires dragging every wire manually. With it:
- **Ctrl+Shift+Click** any node to preview its output directly in the viewport
- **Ctrl+T** to instantly add a Texture Coordinate + Mapping setup
- **Alt+RMB** to cut connections by dragging across wires
- **Ctrl+Shift+RMB** to mix two nodes together automatically

Enable this before touching materials. Everything else you want can be found through the Extensions platform.`,
      },
      {
        title: "The Extensions Platform (Blender 4.2+)",
        versionNote: "v4.2+",
        pythonCode: `# The Extensions platform replaced the old add-on system in Blender 4.2
# You can install extensions from inside Blender:
# Preferences → Get Extensions → search → Install

# Or install from a local .zip file:
# Preferences → Add-ons → Install from Disk

# Check installed extensions via Python
import addon_utils
for mod in addon_utils.modules():
    print(mod.bl_info.get('name', mod.__name__))`,
        content: `Blender 4.2 introduced a built-in extension browser. Instead of downloading .zip files and installing them manually, you can browse and install directly from inside Blender.

**How to use it:**
1. Open **Edit → Preferences → Get Extensions**
2. Search for what you want
3. Click Install. Done.

Extensions are sandboxed and versioned, which means they update cleanly and are less likely to break between Blender versions than the old add-on system.

The old manual method still works: download a .zip, go to Preferences → Add-ons → Install from Disk, pick the file. Some older add-ons not yet on the platform still require this.

!! On first open, the Extensions tab may show "remote data unavailable" or "sync required" — this just means the local index hasn't been downloaded yet. Click the refresh/sync icon (circular arrow) next to the extensions.blender.org entry in Preferences → Extensions. It downloads the index once and caches it. If the sync fails, check whether a VPN or proxy is active. If not, your system firewall may be blocking Blender (on Windows: Windows Defender Firewall → Allow an app; on Mac: System Settings → Network → Firewall). Test on a different network if nothing else works.`,
      },
      {
        title: "Free Add-ons Worth Knowing",
        pythonCode: `# BlenderKit: asset library accessible inside Blender
# Install via Preferences → Get Extensions → search "BlenderKit"
# Then: in the 3D Viewport sidebar (N panel) → BlenderKit tab
# Browse materials, models, HDRIs without leaving Blender

# After installing an add-on, its UI usually appears in one of:
# - The N panel (sidebar, press N in 3D Viewport)
# - A new menu item in an editor header
# - The Properties panel under a new section
# Check the add-on's documentation or hover over the Preferences
# entry: it usually shows a link to where the UI appears`,
        content: `**BlenderKit**
A free asset library integrated directly into Blender. Browse and drag in materials, 3D models, HDRIs, and brushes without leaving the app. The free tier has thousands of assets. Install via Get Extensions, then find it in the N panel sidebar inside the 3D Viewport.

**Node Wrangler** (already covered, but worth repeating: install this first)

**Gaffer**
Better lighting management. Shows all lights in a clean list, lets you adjust intensity and color without clicking into each light individually. Useful once your scenes have more than two lights.

**Photographer**
Physically-based camera controls: exposure in EV, real aperture and shutter speed values, auto-exposure. Makes the camera behave like a real camera instead of Blender's abstract defaults.

These are all free. Search for them in Get Extensions or on GitHub.`,
      },
      {
        title: "Recommended Preferences to Change",
        pythonCode: `import bpy

prefs = bpy.context.preferences

# Auto-save every 2 minutes (default is 2, but confirm it's on)
prefs.filepaths.use_auto_save_temporary_files = True
prefs.filepaths.auto_save_time = 2

# Save versions: keep last 10 .blend1, .blend2 backups
prefs.filepaths.save_version = 10

# Undo steps: increase from default 32
prefs.edit.undo_steps = 64

# Turn off splash screen on startup
prefs.view.show_splash = False

# Set cycles device to GPU if available
cycles_prefs = prefs.addons['cycles'].preferences
cycles_prefs.compute_device_type = 'METAL'  # Mac Apple Silicon
bpy.ops.wm.save_userpref()`,
        content: `A few preference changes that make daily use noticeably better:

**Auto Save**
Edit → Preferences → Save & Load: confirm auto-save is on and set to every 2 minutes. Blender crashes occasionally; this limits damage.

**Save Versions**
Same section: set Save Versions to 10. Blender keeps .blend1, .blend2 etc. as backups every time you save. If you save over something you wanted to keep, the previous version is still there.

**Undo Steps**
Edit → Preferences → System: increase Undo Steps from 32 to 64. Complex modeling sessions exhaust 32 quickly.

**GPU Rendering (Mac)**
Edit → Preferences → System → Cycles Render Devices: set to Metal (Apple Silicon) or CUDA/OptiX (NVIDIA). Without this, Cycles renders on CPU only, which is much slower.

**Viewport Anti-Aliasing**
Edit → Preferences → Viewport: if the viewport feels jaggy, increase the anti-aliasing setting.

Save all of these: **Edit → Preferences → hamburger menu (☰) → Save Preferences**.`,
      },
      {
        title: "🔨 Mini Workshop: Configure Your Environment",
        isWorkshop: true,
        pythonCode: `import bpy
import addon_utils

# This script enables the essential add-ons and sets key preferences.
# Run it once from the Scripting workspace to set up a new Blender install.

# Enable essential built-in add-ons
for addon in ["node_wrangler", "mesh_looptools", "add_mesh_extra_objects"]:
    addon_utils.enable(addon, default_set=True)
    print(f"Enabled: {addon}")

# Set preferences
prefs = bpy.context.preferences
prefs.filepaths.use_auto_save_temporary_files = True
prefs.filepaths.auto_save_time = 2
prefs.filepaths.save_version = 10
prefs.edit.undo_steps = 64
prefs.view.show_splash = False

# Save
bpy.ops.wm.save_userpref()
print("Preferences saved.")`,
        content: `Get your Blender environment properly configured before diving into content:

1. Go to **Edit → Preferences → Add-ons**. Search for and enable: Node Wrangler, LoopTools, Extra Objects, Screencast Keys.

2. Go to **Edit → Preferences → Get Extensions**. Install **BlenderKit**. Browse it briefly so you know it exists.

3. Go to **Edit → Preferences → Save & Load**. Confirm auto-save is on. Set Save Versions to 10.

4. Go to **Edit → Preferences → System**. Set your GPU under Cycles Render Devices. Increase Undo Steps to 64.

5. Save: **☰ → Save Preferences**.

6. Open the **Scripting workspace**, paste the Python script from the code panel, and run it (Alt+P). Confirm it prints the enabled add-ons without errors.

✅ Goal: A configured Blender install with essential add-ons enabled and preferences set for real work`,
      },
    ],
  };

export default enhancingBlender;
