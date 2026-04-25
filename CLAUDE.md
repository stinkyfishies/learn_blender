# Blender Scripting Context

This file is auto-loaded by Claude Code. Adapt it for other AI tools — see bottom of this file.

## Environment

- Blender 5.1
- Python 3.12 (bundled with Blender)
- Renderer: EEVEE Next (default) — update if using Cycles

## API Notes for Blender 5.1

- Hair is GN-based (Hair Curves object + Geometry Nodes). The old particle hair system still exists but is legacy.
- Principled BSDF v2: parameters renamed. Use `Base Color`, `Roughness`, `Metallic`, `IOR`. `Specular` is removed.
- EEVEE Next replaces legacy EEVEE. Material and light settings differ from pre-4.2 tutorials.
- Simulation Zones are available in Geometry Nodes (`Simulation Input` / `Simulation Output` nodes).
- Extensions platform (4.2+): add-ons are now packaged with `blender_manifest.toml`, not just `bl_info`.

## Common Pitfalls

- Most operators require the correct context (active object, correct mode). Set `bpy.context.view_layer.objects.active` and `bpy.ops.object.mode_set(mode=...)` before calling operators.
- `bpy.ops.*` calls fail silently or raise `RuntimeError` if context is wrong. Prefer `bpy.data` and direct property assignment where possible — it bypasses context requirements.
- Always deselect all before selecting the object you want to operate on: `bpy.ops.object.select_all(action='DESELECT')`.
- Units default to meters. Scale accordingly.
- After modifying mesh data directly (`bmesh`), call `bmesh.update_edit_mesh()` or `mesh.update()`.

## Project Structure

```
# Fill this in for your project
# Example:
# scripts/          .py files, each recreates one scene or object
# assets/           .blend files (build artifacts, not source)
# README.md         what each script does and how to run it
```

## Conventions

```
# Fill in any project-specific conventions:
# - Naming: objects use snake_case, materials use Title_Case
# - All scenes target 1920x1080, 24fps
# - Render output goes to /renders/
```

---

## Adapting This File for Other AI Tools

### Cursor

Create `.cursor/rules/blender.mdc` in your project root:

```
---
description: Blender 5.1 scripting context
globs: ["**/*.py"]
---

[paste the content above here, minus this section]
```

The `globs` field means Cursor only applies this rule when you're editing `.py` files.

### GitHub Copilot

Create `.github/copilot-instructions.md` and paste the content above. Copilot loads this automatically for the repo in VS Code (1.99+).

### Continue.dev

Add to `.continue/config.json`:

```json
{
  "systemMessage": "[paste content above as a single string]"
}
```

Or reference a file:

```json
{
  "systemMessage": { "file": "CLAUDE.md" }
}
```

### Zed

Zed does not support a project-level context file yet. Paste the content manually into the system prompt field in the AI panel, or save it as a snippet to reuse across sessions.

### General rule

Every AI coding tool has a way to supply a persistent system prompt per project. The content is the same -- only the filename and format differ. Keep one canonical version (this file) and copy-paste into whichever format each tool needs.
