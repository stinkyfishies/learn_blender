// Module 3: bpyAIAssist

const bpyAIAssist = {
    id: 3,
    emoji: "🐍",
    title: "bpy with AI-Assist",
    tag: "PYTHON + WORKFLOW",
    color: "#38bdf8",
    intro:
      "Blender has a complete Python API called bpy. Every single thing you can do in Blender's UI (add an object, apply a modifier, set a material, trigger a render) has a Python equivalent. This is Blender's most powerful aspect: the entire application is programmable. A script can build a fully lit, shaded, rendered scene from nothing. That's what we're going to drive with AI. You describe the outcome, an AI writes the bpy script, and Blender executes it. If the idea of writing code feels overwhelming, stop. You don't write it. You describe what you want and the AI writes it. Your job is to set up the environment, run the script, see what happens, and iterate. This module breaks that into four parts: your workspace, version control, your editor, and the run-refresh cycle.",
    quiz: [
      {
        q: "What is the fastest way to find the Python operator name for a menu action you just performed in Blender?",
        options: [
          "Search the bpy documentation online",
          "Check the Info Editor: it logs every operator call as a Python statement in real time",
          "Hover over the menu item and read the tooltip",
          "Look in Preferences → Add-ons",
        ],
        answer: 1,
        explanation:
          "The Info Editor records every action as executable Python. Perform the action manually, then copy the operator call from Info: this is the fastest way to discover operator names.",
      },
      {
        q: "You want to run a Python script that modifies your scene. Where do you run it inside Blender?",
        options: [
          "The Terminal / System Console only",
          "The Scripting workspace → Text Editor → Run Script (or the Python Console for one-liners)",
          "The Graph Editor's driver expression field",
          "You must install a Blender add-on first",
        ],
        answer: 1,
        explanation:
          "The Scripting workspace has a Text Editor (for full scripts) and a Python Console (for interactive one-liners). Both have access to the full bpy API and run in Blender's embedded Python interpreter.",
      },
      {
        q: "What is the Python Console's main advantage over the Text Editor for AI-assisted coding workflows?",
        options: [
          "It's faster to render from",
          "It supports auto-complete: type bpy.data. and Tab shows all available attributes interactively",
          "It runs scripts 10x faster",
          "It has syntax highlighting",
        ],
        answer: 1,
        explanation:
          "The Python Console has Tab auto-complete for the full bpy API. It's the fastest way to explore what's available on any bpy object without reading documentation.",
      },
      {
        q: "When an AI generates a bpy script for you, what's the most important first debugging step if it errors?",
        options: [
          "Re-prompt the AI immediately",
          "Read the full error in the Blender System Console or Info Editor: it gives the exact line and error type",
          "Restart Blender",
          "Delete the script and start over",
        ],
        answer: 1,
        explanation:
          "Blender's System Console (Window → Toggle System Console on Windows, launch from Terminal on Mac) shows the full Python traceback. The line number and error message are usually enough to identify the fix: or to give the AI precise feedback for a correction.",
      },
    ],
    sections: [
      {
        title: "What Python Can and Cannot Do in Blender",
        content: `Before anything else, know the territory.

**Python fully owns:**
- Procedural and generative geometry (math-driven, no hands)
- Scene assembly from existing assets
- Materials and shaders
- Lighting and cameras
- Rendering pipeline
- Batch operations across many objects

**Python can read but not meaningfully reconstruct:**
- Freehand mesh edits (vertex dragging): final positions are readable, but the operation isn't logged
- Sculpted meshes: vertex data exists, but encoding 100k coordinates in a script is not a usable source of truth
- Weight painting: data is readable, but the brushwork that produced it is not

**What this means for your workflow:**
There are two lanes. Generative work: Python is the complete source of truth, no .blend required. Artisanal work: the .blend is load-bearing and Python operates on top of it. Most real projects use both. The discipline is knowing which lane you're in.

**Ways Python hooks into Blender:**
- \`bpy.ops\` — operator calls (everything in the UI has one)
- \`bpy.data\` — direct read/write access to all scene data
- \`bpy.app.handlers\` — event hooks: save, load, frame change, depsgraph update
- \`bpy.msgbus\` — subscribe to property changes
- Info Editor log — records every user action as Python in real time
- Modal operators — intercept input events as they happen

**Formats Blender speaks:**
- \`.blend\` — full state, binary, not diffable, not text
- \`.usda\` — USD, text-based, diffable, composable — Blender support is partial but improving
- \`.abc\` (Alembic) — geometry cache, animation-focused
- \`.obj\`, \`.fbx\`, \`.glb\` — interchange formats, lossy, no Blender-specific data

**If you want a fully text-based 3D pipeline:**
USD (Universal Scene Description) is the open standard built for exactly this. Pixar open-sourced it in 2016. Houdini and NVIDIA Omniverse are built around it. Blender supports import and export but not the full layered composition workflow yet. This is a 2-3 year gap, not a permanent one.

> This module is for a specific use case: using AI to generate and automate Blender work. Knowing where Python stops is the first thing to get clear on.`,
      },
      {
        title: "What You Actually Need to Get Started",
        pythonCode: `# The AI-assisted coding setup in one place:

# 1. Workspace directory
mkdir my_blender_project
cd my_blender_project

# 2. Git versioning
git init
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Create a .gitignore
echo "*.blend" >> .gitignore
echo "*.blend1" >> .gitignore
echo "renders/" >> .gitignore
git add .gitignore
git commit -m "init project"

# 3. Your first script (AI writes this for you)
# scene.py lives here: this is what you version control

# 4. Run it into Blender
# Option A: from terminal
# /Applications/Blender.app/Contents/MacOS/Blender -b --python scene.py

# Option B: paste into Blender's Text Editor → Alt+P to run`,
        content: `You don't need to learn Python. You need four things in place, then the loop runs itself.

**1. A workspace directory**
A folder on your machine for this project. Everything lives here: your scripts, your .gitignore, nothing else. No .blend files. Those are generated output, not source.

\`\`\`
mkdir my_blender_project
cd my_blender_project
\`\`\`

**2. Git versioning**
Non-negotiable. This is code. Every time you have a working script, commit it. You will break things and you will want to go back. Setup takes two minutes. And if your editor is running an AI agent (Claude Code, Cursor, Zed with an agent), you can just ask it to set up git, write the .gitignore, and make the first commit. The agent handles the terminal commands.

\`\`\`
git init
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
\`\`\`

Then create a \`.gitignore\` file in the folder with these lines:
\`\`\`
*.blend
*.blend1
renders/
\`\`\`

**3. A code editor (or Claude Code)**
VS Code or Zed (both covered in this module). Or use Claude Code directly, which writes and runs scripts in a terminal. You don't type Python. You describe what you want. The editor is where the AI delivers the script and where you paste it.

**4. The run-refresh loop**
Ask AI for a script. Paste it into Blender's Text Editor and press Alt+P to run it, or run it from the terminal headlessly. See what happens. If it errors, copy the error back to the AI. If it works, commit it. Repeat.

That's everything. The rest of this module covers each piece in more depth. If you have these four things set up, you can start today.`,
      },
      {
        title: "The AI-Assisted Coding Loop",
        pythonCode: `# The complete AI-assisted coding workflow for Blender:

# 1. Know what you want (this workshop gives you the vocabulary)
goal = "Create a procedural rocky terrain with Cycles lighting and an HDRI"

# 2. Prompt an AI with precise Blender terminology
prompt = """
Write a bpy Python script that:
- Creates a Grid mesh (50x50 subdivisions, 20 units wide)
- Adds a Displace modifier with a Musgrave texture (scale 3.0, strength 2.0)
- Adds a Principled BSDF material with Noise-driven Base Color (grey/brown tones)
  and Roughness variation (0.4-0.8 range via Map Range node)
- Adds a 3-point Area light setup (key 800W warm, fill 200W cool, rim 300W)
- Sets the World to an HDRI environment (placeholder path)
- Sets the render engine to Cycles, 128 samples, OIDN denoising
- Renders to //render_output.png
"""

# 3. Receive the script: review for obvious issues
# 4. Run it: paste into Blender Text Editor → Alt+P
#    OR: blender -b -P generated_script.py

# 5. Read errors in System Console: feed back to AI with exact error message
error_feedback = "Line 34: KeyError: 'Principled BSDF', node created with use_nodes=True but nodes weren't cleared first"

# 6. Iterate: usually 1-3 rounds to a working scene
# 7. Tweak parameters directly in bpy or via the UI`,
        content: `The AI-assisted coding loop with Blender has a specific shape, and this workshop is designed to make each step effective.

**The loop:**

1. **Describe what you want**: in precise Blender terms. "A procedural rocky terrain" is vague. "A Grid mesh with a Displace modifier driven by a Musgrave texture at scale 3, feeding into a Subdivision Surface at level 2, with a noise-driven roughness variation between 0.4 and 0.8" is a prompt that generates working code.

2. **Prompt with tool names**: the vocabulary from this workshop (modifier types, node names, bpy paths) is exactly what makes prompts accurate. The AI knows Blender's API precisely; your job is to give it the right terms.

3. **Run and read errors**: most generated scripts fail on first run due to context issues or API version differences. Copy the error from the System Console and feed it back to the AI with the exact message and line number.

4. **Iterate**: typically 1–3 rounds. After that, the scene is live in Blender and you can tweak parameters directly in the UI or in the script.

**What makes this workshop directly useful:**
- You know enough to describe any outcome in Blender vocabulary → better prompts
- You can read the generated script and understand what it's doing → spot obvious errors before running
- You know what context errors mean → fix or explain them to the AI quickly
- You understand the non-destructive stack → you can modify the generated scene sensibly`,
      },
      {
        title: "The Script Is the Save File",
        pythonCode: `import bpy

# --- Workflow 1: Edit the script, re-run ---
# Make changes in your editor, then re-run.
# Without clearing first, you get duplicate objects every run.
# Always start your scripts with a scene clear:

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Then build the scene fresh from scratch.
# This is the most reliable workflow for structural changes.

# --- Workflow 2: Manual tweak → Info Editor → back into script ---
# Make a manual tweak in the viewport (move a light, change a value).
# Open the Info Editor: it logged every action as Python.
# Copy the relevant line, paste it into the right place in your script.
# Save the script. Now the change is permanent.

# --- Workflow 3: Throwaway exploration ---
# Sketch something manually. Don't worry about the script.
# When you know what you want, describe it to AI from scratch.
# "Make a cube at (2, 0, 0) with a bevel of 0.1 and a red material."
# AI rewrites the script from intent. Manual work was just the sketch.

# --- Saving the script to disk ---
# If you opened the script from disk (File → Open or dragged in):
#   Cmd+S saves back to that file.
# If you pasted into a new buffer (no file path):
#   Cmd+S does nothing. Use Text → Save As to write it to disk first.
#   After that, Cmd+S works normally.`,
        content: `This is the single most important mechanic to understand before you start.

**The script is the save file. The .blend is just the preview.**

When you run a bpy script, Blender builds the scene in memory. The .blend file (if you save it) is a snapshot of that memory. But if you re-run your script, Blender rebuilds the scene from code. The script is the source of truth, not the .blend.

This means: if you make a manual change in the viewport but don't put it back in the script, that change is gone the next time you run the script.

**Three ways to work:**

**1. Edit the script, re-run**
Make changes in your editor, save to disk, re-run in Blender. This is the main workflow for structural changes. One trap: re-running a script that creates objects will create duplicates unless you clear the scene first. Always start scripts with a scene clear.

**2. Manual tweak → Info Editor → back into script**
Make a manual change in the viewport. Open the Info Editor — it logged that action as Python in real time. Copy the line, paste it into your script in the right place. Save. Now the change is permanent and survives the next run. This is how you bridge manual work and the script without losing anything.

**3. Throwaway exploration**
Make manual changes freely, knowing they're a sketch. Once you know what you want, describe the result to AI and get a clean script. The manual session was just discovery.

**Saving the script to disk**
If you opened the script from disk (via the Text Editor's Open button or your external editor), Cmd+S saves back to that file. If you pasted code into a new buffer with no file path, Cmd+S does nothing useful. Use Text → Save As to give it a path first. After that, Cmd+S works normally.

!! Re-running a script without a scene clear creates duplicates. Always clear the scene at the top of your script before building anything.`,
      },
      {
        title: "Blender's Python Environment",
        pythonCode: `# Blender ships with its own Python interpreter: you don't install anything.
# Access it from: Scripting workspace (top workspace tabs)

import bpy
import sys

# See which Python version Blender is running
print(sys.version)

# bpy is always available in the Python Console,
# but you do need 'import bpy' at the top of scripts in the Text Editor.

# The three main bpy namespaces you'll use constantly:
bpy.context   # what's currently selected/active in the UI
bpy.data      # all datablocks in the .blend file (objects, meshes, materials, etc.)
bpy.ops       # operators: the same actions as menu items and shortcuts

# Example: what is currently selected?
print(bpy.context.active_object)
print(bpy.context.selected_objects)`,
        content: `Blender ships with a built-in Python 3 interpreter: no separate installation required. The bpy module is always available and gives you programmatic access to everything in Blender.

The three namespaces you'll use constantly:
**bpy.context**
What's currently selected, active, or visible. Changes as you click in the UI.
**bpy.data**
All datablocks in the file: objects, meshes, materials, textures, node trees.
**bpy.ops**
Operators. Every action in Blender's interface has an ops equivalent.

Access Python from:

**Scripting workspace** (top tab bar)
Opens a Text Editor + Python Console layout.

**Python Console**
Interactive, with Tab auto-complete.

**Text Editor**
Write full scripts, click Run Script (or Alt+P).

**Driver expressions**
Python expressions inside animation drivers.

**Add-on scripts**
Python files Blender loads as plugins.`,
      },
      {
        title: "The Scripting Workspace Layout",
        pythonCode: `# In the Python Console (interactive, one-liners):
# Type any bpy expression and press Enter: result shows immediately

>>> bpy.context.active_object
>>> bpy.context.active_object.location
>>> bpy.context.active_object.location.x = 5.0  # move it

# Tab auto-complete: type bpy.data. then press Tab
# → shows: actions, armatures, brushes, cameras, collections,
#           curves, fonts, grease_pencils, images, lights,
#           materials, meshes, node_groups, objects, scenes...

# In the Text Editor (full scripts):
import bpy

# Write your script, then: Text menu → Run Script, or Alt+P
# Errors appear in the Info Editor and System Console`,
        content: `The Scripting workspace (click the **Scripting** tab at the top of Blender) opens a pre-arranged layout:

**Text Editor** (left)
Write multi-line scripts. Alt+P to run. Has basic syntax highlighting.

**Python Console** (bottom-left)
Interactive REPL. Tab auto-complete on any bpy object. Best for exploration.

**Info Editor** (top-right)
Logs every UI action as a Python operator call in real time.

**Properties + Outliner**
Context for whatever you're scripting.

**The Info Editor is your most important learning tool.** Do anything in Blender's UI: add an object, change a modifier value, run a menu command. The Info Editor records the exact Python statement that performed it. This is how you discover operator names without reading documentation.

To open the Info Editor: change any editor's type to **Info** via the editor type icon.`,
      },
      {
        title: "Finding Operator Names (The Info Method)",
        pythonCode: `# Step 1: Do the action manually in Blender's UI
# Step 2: Open the Info Editor
# Step 3: Copy the logged Python statement

# Example: you manually added a UV Sphere via Shift+A → Mesh → UV Sphere
# Info logs:
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, enter_editmode=False,
    align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))

# Example: you applied a Subdivision Surface modifier
bpy.ops.object.modifier_apply(modifier="Subdivision")

# Example: you set a material's roughness to 0.3
bpy.context.object.active_material.node_tree.nodes["Principled BSDF"].inputs[2].default_value = 0.3

# Hover method: hover over any UI element → tooltip shows the data path
# e.g. hover over Roughness slider: bpy.data.materials["Mat"].node_tree...
# Right-click any property → "Copy Data Path" → paste directly into a script`,
        content: `The fastest way to learn bpy operator names is the **Info Method**:

1. Do the action manually in Blender (add an object, apply a modifier, change a setting)
2. Open the **Info Editor**: it shows the exact Python call that just ran
3. Copy it into your script

This means you never need to guess operator names. Perform the action once in the UI, then automate it.

**Two other methods:**
**Hover tooltips**
Hover over any UI button or property field. The tooltip shows the Python data path (e.g. \`bpy.context.object.modifiers["Subdiv"].levels\`).

**Right-click → Copy Data Path**
Right-click any property and it copies its full Python path to clipboard. Paste directly into a script.

Together these three methods let you discover the bpy path to any UI control in under 30 seconds, without reading the API documentation.`,
      },
      {
        title: "Debugging Scripts",
        pythonCode: `import bpy

# 1. Print debugging: the simplest approach
obj = bpy.context.active_object
print(f"Active object: {obj}")          # None if nothing selected
print(f"Type: {obj.type if obj else 'N/A'}")

# 2. Context guards: most errors are context failures
if bpy.context.active_object is None:
    raise RuntimeError("No active object: select something first")
if bpy.context.active_object.type != 'MESH':
    raise TypeError(f"Expected MESH, got {bpy.context.active_object.type}")
if bpy.context.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')  # auto-correct mode

# 3. Check operator context overrides (some ops need specific context)
# If you get "context is incorrect" error:
with bpy.context.temp_override(active_object=obj):
    bpy.ops.object.shade_smooth()

# 4. See the full traceback: run from System Console:
# Mac: open Terminal → /Applications/Blender.app/Contents/MacOS/Blender
# Windows: Window → Toggle System Console
# The full Python traceback prints there, not inside Blender's UI`,
        content: `Scripts fail for predictable reasons. Learn the patterns and you'll fix most errors in under a minute.

**Common error types:**

**AttributeError: 'NoneType' has no attribute...**
You're operating on \`bpy.context.active_object\` but nothing is selected. Add a selection guard.

**RuntimeError: Operator bpy.ops.X.y() context is incorrect**
The operator needs to run in a specific mode or with specific context. Check what mode you're in.

**KeyError: 'NodeName'**
A node with that name doesn't exist. Print \`tree.nodes.keys()\` to see what's actually there.

**TypeError: expected MESH, got CURVE**
Wrong object type. Check \`obj.type\` before operating.

**Where errors appear:**

**Info Editor**
Shows the error type but not always the full traceback.

**System Console**
The full Python traceback with line numbers. On Mac: launch Blender from Terminal (\`/Applications/Blender.app/Contents/MacOS/Blender\`). This is where serious debugging happens.

**Text Editor**
Errors highlight the failing line after running.

**The single most useful debug line:** \`print(dir(obj))\`: prints every attribute and method on any bpy object. Use it when you don't know what's available.`,
      },
      {
        title: "Rendering from the Command Line",
        pythonCode: `# Run Blender headlessly from Terminal (no UI): ideal for automation

# Render a single frame (frame 1) and save to /renders/
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend -o /renders/frame_ -f 1

# Render animation (frames 1–250)
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend -o /renders/frame_ -a

# Run a Python script on a .blend file without opening the UI
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend --python my_script.py

# Run a script that modifies the scene, then renders
/Applications/Blender.app/Contents/MacOS/Blender -b scene.blend --python setup.py -o /renders/ -f 1

# In the script, trigger render programmatically:
import bpy
bpy.context.scene.render.filepath = "/renders/output_"
bpy.context.scene.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(write_still=True)   # render current frame
bpy.ops.render.render(animation=True)     # render full animation`,
        content: `Blender can run entirely without a GUI. This is useful for batch rendering, automated scene generation, and CI/CD-style pipelines.

**Key flags:**
- \`-b\` or \`--background\`: headless mode (no window)
- \`-f N\`: render frame N
- \`-a\`: render full animation
- \`-o /path/\`: output directory
- \`--python script.py\`: run a Python script on the loaded scene
- \`-E ENGINE\`: set render engine (\`CYCLES\`, \`BLENDER_EEVEE_NEXT\`)
- \`-t N\`: use N threads for CPU rendering

**The AI-assisted coding pipeline this enables:**
1. AI generates a Python script that builds a scene
2. You run it headlessly: \`blender -b -P scene_builder.py -o /renders/ -f 1\`
3. No need to open Blender's UI at all

This is how automated 3D content generation works at scale: parametric scene scripts + headless renders, driven from any external system.`,
      },
      {
        title: "External Editor: VS Code or Zed",
        pythonCode: `# VS Code: install the "Blender Development" extension by Jacques Lucke
# It connects VS Code directly to a running Blender instance

# In VS Code: Cmd+Shift+P → "Blender: Start" → picks a Blender executable
# Then: Cmd+Shift+P → "Blender: Run Script" → runs current file in Blender

# Install fake-bpy-module for bpy auto-complete in any editor:
# pip install fake-bpy-module-latest

# VS Code: create .vscode/settings.json
# {
#   "python.analysis.extraPaths": ["path/to/fake-bpy-module"]
# }

# Zed: add to settings.json
# {
#   "lsp": {
#     "pyright": {
#       "settings": {
#         "python": { "analysis": { "extraPaths": ["path/to/fake-bpy-module"] } }
#       }
#     }
#   }
# }

import bpy
obj = bpy.context.active_object  # editor knows this is bpy.types.Object
obj.modifiers.new(  # → auto-completes name, type parameters`,
        content: `For serious scripting, any modern editor beats Blender's built-in Text Editor. Two good options:

**VS Code**
The most established option with dedicated Blender tooling. Install the **Blender Development** extension by Jacques Lucke. It connects VS Code directly to a running Blender instance so you can run scripts with one command.

Setup:
1. Install the Blender Development extension in VS Code
2. Install fake-bpy-module: \`pip install fake-bpy-module-latest\` for full bpy auto-complete without Blender running
3. Connect to Blender: Cmd+Shift+P → Blender: Start
4. Run scripts: Cmd+Shift+P → Blender: Run Script

**Zed**
A faster, newer editor with native AI integration (Claude, GPT) built in. No dedicated Blender extension yet, but fake-bpy-module works via Pyright LSP for auto-complete. For a AI-assisted coding workflow where you're talking to an AI inside the editor, Zed's native AI assistant is a smoother experience than VS Code's Copilot/extensions.

Setup:
1. Install Zed (zed.dev)
2. Install fake-bpy-module: \`pip install fake-bpy-module-latest\`
3. Configure Pyright in Zed settings to pick up the fake-bpy-module path
4. Run scripts into Blender manually via terminal: \`blender -b --python script.py\`

**Which to choose:**
Both work well. Open your script from inside Blender's Text Editor once to link it, then edit in your external editor. Blender picks up the changes and you reload with a shortcut. VS Code has a dedicated Blender extension; Zed has faster performance and native AI built in. Use whichever you're already comfortable with.

Both give you full bpy auto-complete and are vastly better than Blender's built-in editor for anything beyond a few lines.`,
      },
      {
        title: "Giving Your AI Assistant Blender Context",
        pythonCode: `# Drop a CLAUDE.md (or equivalent) in your project root.
# Your AI tool loads it automatically before every session.

# --- CLAUDE.md template ---

# Blender Scripting Context
# Environment: Blender X.Y, Python 3.12, EEVEE Next renderer  # ← update to match your version
#
# API notes:
# - Principled BSDF v2: use Base Color, Roughness, Metallic, IOR. Specular removed.
# - Hair is GN-based (Hair Curves + Geometry Nodes). Particle hair is legacy.
# - Prefer bpy.data direct assignment over bpy.ops where possible (no context required).
# - Always set active object and mode before calling operators.
# - bpy.ops calls fail silently or raise RuntimeError if context is wrong.
#
# Project:
# scripts/   .py files: source, versioned
# renders/   output: gitignored
# .blend files are build artifacts, gitignored
#
# Conventions:
# Objects: snake_case. Materials: Title_Case.
# Target: 1920x1080, 24fps, EEVEE Next.`,
        content: `Every AI session starts cold. Without context, the AI defaults to generic Python advice and may target the wrong Blender version or API. A context file loaded automatically at session start fixes this.

**How it works:**
Place a small Markdown file in your project root. Your AI tool reads it before you type anything. You never need to re-explain your Blender version, renderer, or project conventions.

**Claude Code:** \`CLAUDE.md\` in the project root. Loaded automatically.

**Cursor:** Create \`.cursor/rules/blender.mdc\`:
\`\`\`
---
description: Blender X.Y scripting context
globs: ["**/*.py"]
---
[paste your context here]
\`\`\`

**GitHub Copilot (VS Code 1.99+):** Create \`.github/copilot-instructions.md\` and paste your context. Loaded automatically for the repo.

**Zed:** No file-based project context yet. Paste your context into the AI panel's system prompt field manually, or save it as a reusable snippet.

**What to put in the context file:**
- Blender version and renderer (EEVEE Next vs Cycles)
- Key API notes for that version (what changed, what's deprecated)
- Your project structure (where scripts live, what they do)
- Conventions (naming, units, output paths)

**Starter template** (copy this into a \`CLAUDE.md\` in your project root):
\`\`\`
# Blender Scripting Context
Blender X.Y, Python 3.12, EEVEE Next renderer.  # ← fill in your version

API notes:
- Principled BSDF v2: Base Color, Roughness, Metallic, IOR. Specular removed.
- Hair is GN-based (Hair Curves + Geometry Nodes). Particle hair is legacy.
- Prefer bpy.data direct assignment over bpy.ops where context allows.
- Always set active object and mode before calling operators.
- bpy.ops calls raise RuntimeError if context (mode, active object) is wrong.

Project layout:
- scenes/    one .py per scene or deliverable: self-contained, runnable
- lib/       reusable functions (lighting rigs, materials, utils) imported by scenes
- renders/   output: gitignored
- .blend files are build artifacts: gitignored

Conventions:
- Objects: snake_case. Materials: Title_Case.
- Target: 1920x1080, 24fps.
- Each scene script imports from lib/ rather than duplicating setup code.
- New scene scripts follow the structure of existing ones in scenes/.
\`\`\`

Update the version and renderer line when you upgrade Blender. Everything else carries forward unless your conventions change.

>> API changes between Blender versions are not a research problem. When a script breaks after an upgrade, paste the error into your AI with one line of context: "I upgraded to Blender X.Y and this call now fails." The AI knows the API differences and will give you the updated equivalent immediately: no changelog hunting required. This is one of the clearest advantages of AI-assisted Blender scripting over following static tutorials.`,
      },
      {
        title: "Organising Your Blender Scripting Project",
        pythonCode: `# Recommended project layout
my_blender_project/
├── CLAUDE.md            # AI context file: loaded automatically
├── .gitignore           # *.blend, renders/, __pycache__/
├── README.md            # what this project is, how to run each script
│
├── scenes/              # one script per scene or deliverable
│   ├── terrain.py       # builds the rocky terrain scene
│   ├── product_viz.py   # builds the product visualisation
│   └── title_card.py    # builds the animated title card
│
├── lib/                 # reusable pieces the AI imports
│   ├── lighting.py      # standard lighting rigs as functions
│   ├── materials.py     # material setup functions
│   └── utils.py         # shared helpers (clear scene, etc.)
│
└── renders/             # output: gitignored

# Example: lib/lighting.py
import bpy

def three_point(key_energy=800, fill_energy=200, rim_energy=300):
    """Standard 3-point area light setup. Call from any scene script."""
    bpy.ops.object.light_add(type='AREA', location=(4, -3, 5))
    key = bpy.context.active_object
    key.data.energy = key_energy
    key.data.color = (1.0, 0.95, 0.85)   # warm key

    bpy.ops.object.light_add(type='AREA', location=(-3, -2, 3))
    fill = bpy.context.active_object
    fill.data.energy = fill_energy
    fill.data.color = (0.85, 0.9, 1.0)   # cool fill

    bpy.ops.object.light_add(type='AREA', location=(0, 3, 4))
    rim = bpy.context.active_object
    rim.data.energy = rim_energy

# Example: scenes/terrain.py
import bpy, sys
sys.path.append("/path/to/my_blender_project")
from lib.lighting import three_point
from lib.utils import clear_scene

clear_scene()
three_point(key_energy=600)
# ... rest of terrain setup`,
        content: `When AI generates your scripts, the organisation discipline shifts from writing clean code to giving the AI a clear project map. A well-structured folder is also a better prompt -- you can say "add a new scene script following the same structure as terrain.py, using the lighting rig from lib/lighting.py" and get consistent output every time.

**The core principle: one script per deliverable**
Each scene, object, or animation gets its own file. Not one giant script for everything. If a script produces something standalone and reusable, it's a scene script. If it's a function another script calls, it goes in lib/.

**Recommended layout:**
\`\`\`
my_blender_project/
├── CLAUDE.md            # AI context (Blender version, conventions)
├── .gitignore
├── README.md            # what each script produces, how to run it
├── scenes/              # one .py per scene or deliverable
├── lib/                 # reusable functions (lighting, materials, utils)
└── renders/             # output: gitignored
\`\`\`

**scenes/**: Each file is self-contained and runnable. It imports from lib/ and produces one complete result. Name files after what they produce: \`terrain.py\`, \`product_viz.py\`, \`title_card.py\`.

**lib/**: Functions the AI extracts when the same setup appears in multiple scenes. Typical candidates: lighting rigs, material presets, scene-clear utility, camera setup. Keep each function small and focused. A function in \`lib/lighting.py\` called \`three_point()\` is a prompt you can reuse across every project.

**README.md**: One line per script describing what it produces and how to run it. This is for you in six months, not for anyone else. Without it, a folder of twenty AI-generated scripts becomes opaque fast.

**Why this helps with AI generation:**
When your CLAUDE.md describes this layout, the AI generates files that fit the pattern automatically. It will import from lib/ rather than duplicating functions, name files consistently, and place output in the right folders. The structure becomes self-reinforcing: each new prompt produces a file that fits without you having to specify it every time.

**Prompting with structure:**
Once the layout is established, your prompts get shorter and more precise:
- "Add a new scene script in scenes/ that builds a product visualisation. Use the three_point() rig from lib/lighting.py and the glossy_plastic() material from lib/materials.py."
- "Extract the material setup from terrain.py into a reusable function in lib/materials.py called rocky_ground()."

The AI knows where things live and follows the pattern.`,
      },
      {
        title: "Version Control for AI-Assisted Coders (Git Intro)",
        pythonCode: `# Your project folder structure
my_blender_project/
├── .gitignore        # tells git what to ignore
├── scene_builder.py  # your script: this is the source
├── lighting_rig.py   # reusable components
└── renders/          # output: not versioned

# .gitignore contents:
*.blend
*.blend1
*.blend2
renders/
__pycache__/

# The .blend is a build artifact: generated by running the script.
# You version the script, not the .blend.
# Anyone who clones your repo can reproduce the scene by running:
# blender -b --python scene_builder.py`,
        content: `If you already know git, skip this section. If you don't, read it. AI-assisted coding without version control means every working state you leave behind is gone the moment you change something.

**What git is:**
A time machine for your files. Every time you commit, git takes a snapshot. You can go back to any snapshot, see what changed between them, and work on multiple versions simultaneously. It's free, runs locally, and the files live on your machine.

**Why it matters for AI-assisted coding Blender:**
Your Python scripts are the source of truth, not the .blend file. The .blend is generated output (like a compiled binary in software). You version the script, gitignore the .blend, and reproduce the scene by running the script. This gives you a complete, readable history of every scene you've built.

**One-time setup:**
\`\`\`
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
\`\`\`

**Starting a project:**
\`\`\`
git init              # start tracking this folder
\`\`\`

**The daily workflow: three commands**
\`\`\`
git add script.py     # stage the file (tell git you want to snapshot it)
git commit -m "add procedural terrain with noise displacement"   # snapshot it
git push              # send it to GitHub (optional, for backup/sharing)
\`\`\`

**Seeing what happened:**
\`\`\`
git log               # full history of commits
git show              # what changed in the last commit
git status            # what's changed but not yet committed
\`\`\`

**Saving work without committing:**
\`\`\`
git stash             # temporarily shelve uncommitted changes
git stash pop         # bring them back
\`\`\`
Useful when you want to try something experimental without losing your current state.

**Working on multiple versions:**
\`\`\`
git branch rocky-terrain     # create a new branch
git checkout rocky-terrain   # switch to it
git checkout main            # switch back to main
\`\`\`
Branches let you explore a direction without affecting your stable working version. If the experiment works, merge it back. If it doesn't, discard the branch.

**What to put on GitHub:**
Create a free account at github.com, create a repository, and push your scripts there. This gives you an offsite backup and a URL you can share. Someone else can clone your repo and run your scene script on their machine.

**The commit message discipline:**
Write messages that describe what the script now produces, not what you did. "add rocky terrain with Musgrave displacement" is useful. "update script" is not. Future you will thank present you.`,
      },
      {
        title: "🔨 Mini Workshop: Your First bpy Script",
        isWorkshop: true,
        pythonCode: `import bpy

# This script builds a simple shaded sphere entirely from Python.
# Run it in: Scripting workspace → Text Editor → Alt+P

# Clear the default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Add a sphere
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1)
obj = bpy.context.active_object
obj.name = "MyFirstSphere"
bpy.ops.object.shade_smooth()

# Create a simple material
mat = bpy.data.materials.new("ProcMat")
mat.use_nodes = True
obj.data.materials.append(mat)
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.2, 0.5, 0.9, 1.0)
bsdf.inputs["Roughness"].default_value  = 0.3
bsdf.inputs["Metallic"].default_value   = 0.0

# Add a key light
bpy.ops.object.light_add(type='AREA', location=(3, -2, 4))
light = bpy.context.active_object
light.data.energy = 500
light.data.size   = 1.5

# Set Cycles, 64 samples, denoise
scene = bpy.context.scene
scene.render.engine  = 'CYCLES'
scene.cycles.samples = 64
scene.cycles.use_denoising = True

print("Scene built. Press F12 to render.")`,
        content: `Get your first bpy script running end-to-end:

**Part 1: Use the Info Method**
1. Open the **Scripting workspace** (top tab)
2. Open the **Info Editor** (change one of the panels to Info type)
3. Add a UV Sphere via Shift+A → Mesh → UV Sphere
4. Change its Roughness in the material to 0.4
5. Look at what the Info Editor logged: that's the Python equivalent

**Part 2: Run the Python script**
1. In the **Text Editor** (left panel of Scripting workspace), click **New**
2. Paste in the bpy code shown in the Python panel (toggle the 🐍 switch above)
3. Press **Alt+P** to run it
4. Watch the sphere appear in the viewport

**Part 3: Deliberately break it and debug**
1. Remove the \`import bpy\` line: run it. Read the error.
2. Change \`"ProcMat"\` to an existing material name: see what happens.
3. Add \`print(dir(obj))\` anywhere: see every attribute available on the object.

✅ Goal: Run a script, read an error, understand where errors appear, and find your way back to working code

---

You now have everything you need to start AI-assisted coding in Blender. Seriously, stop here, open a new chat with an AI, and try building something. Describe a scene, ask for a bpy script, run it, iterate.

The modules that follow are not prerequisites. They are vocabulary. The more of them you read, the better your prompts get, the more precisely you can describe what you want, and the less back-and-forth you need with the AI. But none of them unlock the ability to start. You can already start.

Come back when you hit a wall: when the AI keeps getting something wrong and you can't explain why, or when you want to understand what the generated code is actually doing. That's when the next module earns its place.`,
      },
    ],
  };

export default bpyAIAssist;
