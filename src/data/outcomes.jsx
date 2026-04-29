const outcomes = [
  {
    category: "Shape & Form",
    items: [
      {
        goal: "Organic creature or character",
        approach:
          "Sculpt Mode (Dyntopo for exploration → Remesh → Multires for detail). Retopologize with Shrinkwrap modifier.",
        tools: ["Sculpt Mode", "Multiresolution", "Remesh", "Shrinkwrap modifier"],
      },
      {
        goal: "Hard surface / mechanical object",
        approach:
          "Edit Mode box-modeling + Boolean modifier for cuts + Bevel modifier for edge highlights + Subdivision Surface.",
        tools: ["Edit Mode", "Boolean modifier", "Bevel modifier", "Subdivision Surface"],
      },
      {
        goal: "Terrain or landscape",
        approach:
          "Grid + Displace modifier with Noise texture. Or Geometry Nodes with noise-driven height.",
        tools: ["Grid", "Displace modifier", "Geometry Nodes", "Noise Texture"],
      },
      {
        goal: "Repeated / instanced objects (forest, crowd, bricks)",
        approach:
          "Geometry Nodes: Distribute Points on Faces → Instance on Points. Near-zero memory cost.",
        tools: ["Geometry Nodes", "Instance on Points", "Distribute Points on Faces"],
      },
      {
        goal: "Rope, cable, pipe following a path",
        approach:
          "Bezier curve for the path + cylinder with Curve modifier following it. Or GN with Curve to Mesh.",
        tools: ["Bezier Curve", "Curve modifier", "Geometry Nodes"],
      },
      {
        goal: "Symmetrical model",
        approach:
          "Model one half in Edit Mode with Mirror modifier (Clipping on). Apply modifier to merge when done.",
        tools: ["Mirror modifier", "Edit Mode"],
      },
      {
        goal: "Vase, bottle, column (revolved profile)",
        approach:
          "Draw the profile as a curve or mesh → Screw modifier revolves it around an axis.",
        tools: ["Screw modifier", "Curve"],
      },
      {
        goal: "Hair, fur, feathers",
        approach:
          "GN-based Hair system: Add → Curve → Empty Hair. Style with hair sculpt brushes. Particle Edit is the legacy system — avoid for new work.",
        tools: ["Hair Curves", "Geometry Nodes", "Hair Sculpt brushes"],
      },
    ],
  },
  {
    category: "Surface & Appearance",
    items: [
      {
        goal: "Apply an image texture (photo, decal, label)",
        approach:
          "UV unwrap the mesh first: mark seams along natural edges, then Unwrap. In the Shader Editor, add an Image Texture node and connect it to the Principled BSDF Base Color (or other inputs).",
        tools: ["UV Unwrapping", "UV Editor", "Image Texture node", "Shader Editor"],
      },
      {
        goal: "Photorealistic material (metal, glass, skin)",
        approach:
          "Principled BSDF with correct Metallic/Roughness/IOR values. Add Noise-driven Roughness variation for realism.",
        tools: ["Principled BSDF", "Shader Editor", "Noise Texture"],
      },
      {
        goal: "Procedural texture (no image files)",
        approach:
          "Shader Editor: Noise/Voronoi/Wave → ColorRamp → Principled BSDF inputs.",
        tools: ["Noise Texture", "Voronoi Texture", "ColorRamp"],
      },
      {
        goal: "Worn, aged, or dirt-layered surface",
        approach:
          "Two material layers (clean + worn) mixed by a procedural mask. Pointiness from Geometry node for edge wear.",
        tools: ["Shader Editor", "Mix Shader", "Geometry node (Pointiness)"],
      },
      {
        goal: "Animated texture / dissolve effect",
        approach:
          "Drive a ColorRamp or Mix Factor with a Noise Texture that animates over time (keyframe the W offset).",
        tools: ["ColorRamp", "Noise Texture", "Drivers"],
      },
    ],
  },
  {
    category: "Environment & Lighting",
    items: [
      {
        goal: "Outdoor daylight scene",
        approach:
          "Sun light for directional shadows + HDRI environment for sky color. Rotate HDRI to match sun direction.",
        tools: ["Sun Light", "HDRI (World)"],
      },
      {
        goal: "Indoor studio / product lighting",
        approach:
          "3-point area light setup (key + fill + rim). Shadow Catcher plane for ground shadow.",
        tools: ["Area Light", "Shadow Catcher", "Light Linking"],
      },
      {
        goal: "Cinematic mood lighting",
        approach:
          "One strong warm key (orange/amber), one soft cool fill (blue), HDRI for ambient. Strong contrast.",
        tools: ["Area Light", "HDRI", "Light Linking"],
      },
      {
        goal: "Neon / glowing light in EEVEE",
        approach:
          "Emissive material on object. Bloom was removed from Render Properties in 4.2. Add glow in the Compositor: Render Layers → Glare node (Fog Glow or Streaks type).",
        tools: ["Emission shader", "Compositor", "Glare node"],
      },
    ],
  },
  {
    category: "Animation & Motion",
    items: [
      {
        goal: "Object animation (position, rotation, scale)",
        approach:
          "Insert keyframes (I key) in Object Mode. Edit curves in Graph Editor. Non-linear blending in NLA Editor.",
        tools: ["Keyframes", "Graph Editor", "NLA Editor"],
      },
      {
        goal: "Rig a character or prop for animation",
        approach:
          "Add an Armature, place bones in Edit Mode to match the mesh structure. Parent the mesh to the armature with Automatic Weights. Refine bone influence in Weight Paint mode.",
        tools: ["Armature", "Edit Mode (bones)", "Weight Paint", "Automatic Weights"],
      },
      {
        goal: "Character animation with a skeleton",
        approach:
          "Armature object → rigging (parent mesh to armature with automatic weights) → pose in Pose Mode → keyframe.",
        tools: ["Armature", "Weight Paint", "Pose Mode", "Graph Editor"],
      },
      {
        goal: "Procedural / parametric animation",
        approach:
          "Geometry Nodes with frame-driven inputs. Or Drivers linking object properties to time/other values.",
        tools: ["Geometry Nodes", "Drivers", "Graph Editor"],
      },
      {
        goal: "Camera fly-through or orbit",
        approach:
          "Keyframe camera transforms. Or: Follow Path constraint (camera follows a Bezier curve). Or: camera shake with Noise modifier in Graph Editor.",
        tools: ["Camera keyframes", "Follow Path constraint", "Graph Editor Noise modifier"],
      },
    ],
  },
  {
    category: "VFX & Simulation",
    items: [
      {
        goal: "Falling, stacking, or breaking objects",
        approach:
          "Rigid Body simulation. Active objects = dynamic. Passive = static colliders. Fracture with Cell Fracture addon.",
        tools: ["Rigid Body", "Cell Fracture addon"],
      },
      {
        goal: "Cloth, fabric, flags",
        approach:
          "Cloth simulation. Pin vertex groups keep parts fixed. Add Collision physics to surrounding objects.",
        tools: ["Cloth simulation", "Vertex Groups", "Collision physics"],
      },
      {
        goal: "Water or liquid",
        approach:
          "Mantaflow fluid simulation. Domain object (Liquid type) + Flow emitter object. Mesh the domain for visible water surface.",
        tools: ["Mantaflow Fluid", "Domain", "Flow object"],
      },
      {
        goal: "Fire and smoke",
        approach:
          "Mantaflow Gas simulation (Domain: Gas type). Flow type: Fire+Smoke. Add Noise modifier to domain for detail. Render with Cycles.",
        tools: ["Mantaflow Gas", "Volumetric rendering", "Cycles"],
      },
      {
        goal: "Particle explosion or spray",
        approach:
          "Emitter particle system: emit many particles with short lifetime, high initial velocity, Force Field for wind/turbulence.",
        tools: ["Particle system", "Force Fields", "Emitter"],
      },
    ],
  },
  {
    category: "Rendering & Output",
    items: [
      {
        goal: "Photorealistic still image",
        approach:
          "Cycles renderer. High samples (512+) + OIDN denoising. Area lights or HDRI. Compositor for color grade.",
        tools: ["Cycles", "Denoising", "Compositor"],
      },
      {
        goal: "Fast animation render",
        approach:
          "EEVEE Next. Bake lighting where needed. Lower samples with EEVEE's near-instant frame times.",
        tools: ["EEVEE Next", "Light Probes"],
      },
      {
        goal: "Stylized / non-photorealistic render",
        approach:
          "EEVEE Next with Toon shader or custom shader. Or Grease Pencil (2D lines in 3D space). Or Freestyle (line rendering).",
        tools: ["EEVEE Next", "Shader Editor", "Grease Pencil", "Freestyle"],
      },
      {
        goal: "Compositing / color grading after render",
        approach:
          "Render to OpenEXR Multilayer. Use Compositor: Render Layers → Color Balance → Glare → Output.",
        tools: ["Compositor", "OpenEXR", "Color Balance node", "Glare node"],
      },
      {
        goal: "360° / VR render",
        approach:
          "Camera Type: Panoramic → Equirectangular. Resolution: 4096×2048 or higher. Render with Cycles.",
        tools: ["Panoramic Camera", "Cycles", "Equirectangular"],
      },
    ],
  },
];

export const workflows = [
  {
    name: "Screw Modifier",
    desc: "Draw a 2D silhouette of the object's cross-section, spin it 360° around an axis. One profile curve becomes a full solid of revolution.",
    produces: ["Mugs", "Vases", "Bottles", "Wine glasses", "Chess pieces", "Columns", "Wheels", "Bowls"],
    tools: ["Screw modifier", "Spin (Edit Mode)"],
    moduleSlug: "modifiers",
    difficulty: "beginner",
  },
  {
    name: "Curve Modifier",
    desc: "Give a 2D cross-section shape and a 3D path curve. The profile sweeps along the path to generate the surface.",
    produces: ["Pipes", "Cables", "Rails", "Molding", "Roads", "Roller coaster tracks", "Noodles"],
    tools: ["Bezier Curve", "Curve modifier", "Geometry Nodes (Curve to Mesh)"],
    moduleSlug: "modifiers",
    difficulty: "beginner",
  },
  {
    name: "Edit Mode Extrusion",
    desc: "Start from a primitive, add edge loops, extrude faces, push and pull vertices. The foundational hard-surface workflow.",
    produces: ["Furniture", "Buildings", "Vehicles", "Electronics", "Architectural props", "Weapons"],
    tools: ["Edit Mode", "Loop Cut", "Extrude", "Inset", "Bevel modifier"],
    moduleSlug: "edit-mode-topology",
    difficulty: "beginner",
  },
  {
    name: "Mirror + Subdivision Surface",
    desc: "Model one half of a symmetrical object, mirror it, then smooth with Subdivision Surface. Standard character and vehicle workflow.",
    produces: ["Faces", "Character bodies", "Vehicles", "Helmets", "Shoes", "Symmetric props"],
    tools: ["Mirror modifier", "Subdivision Surface", "Edit Mode"],
    moduleSlug: "modifiers",
    difficulty: "beginner",
  },
  {
    name: "Boolean Operations",
    desc: "Use one object as a cutter to remove volume from another. Fast for holes, slots, vents, and mechanical cutouts.",
    produces: ["Mechanical parts", "Vents and grilles", "Architectural cutouts", "Sci-fi paneling", "Molds"],
    tools: ["Boolean modifier", "Bevel modifier", "Weld modifier"],
    moduleSlug: "boolean-hard-surface",
    difficulty: "intermediate",
  },
  {
    name: "Array Modifier",
    desc: "Duplicate a single unit along a curve path. The curve controls spacing, count, and direction automatically.",
    produces: ["Chains", "Fences", "Stairs", "Roller coaster cars", "Beaded necklaces", "Brick walls"],
    tools: ["Array modifier", "Curve modifier", "Bezier Curve"],
    moduleSlug: "modifiers",
    difficulty: "beginner",
  },
  {
    name: "Distribute Points on Faces",
    desc: "Scatter instances across a surface procedurally, with density, rotation, and scale driven by textures or attributes.",
    produces: ["Forests", "Grass fields", "Crowds", "Rocks", "Coral reefs", "Scattered debris"],
    tools: ["Geometry Nodes", "Distribute Points on Faces", "Instance on Points"],
    moduleSlug: "geometry-nodes",
    difficulty: "intermediate",
  },
  {
    name: "Displace Modifier",
    desc: "Start from a flat grid, push vertices outward using a texture map. Fast terrain and surface detail with no manual sculpting.",
    produces: ["Terrain", "Ocean surfaces", "Desert dunes", "Alien landscapes", "Fabric wrinkles", "Knurled surfaces"],
    tools: ["Displace modifier", "Noise Texture", "Musgrave Texture", "Subdivision Surface"],
    moduleSlug: "modifiers",
    difficulty: "beginner",
  },
  {
    name: "Sculpt Mode",
    desc: "Start from a sphere, use sculpt brushes to push and pull mass into form. The organic modeling workflow for anything biological.",
    produces: ["Creatures", "Faces", "Hands", "Rocks", "Trees", "Clouds", "Abstract organic shapes"],
    tools: ["Sculpt Mode", "Dyntopo", "Remesh", "Multiresolution"],
    moduleSlug: "sculpt-mode",
    difficulty: "intermediate",
  },
];

export default outcomes;
