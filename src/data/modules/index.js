// Aggregates all modules in order

import mentalModel from './mentalModel.jsx';
import interfaceNavigation from './interfaceNavigation.jsx';
import bpyAIAssist from './bpyAIAssist.jsx';
import enhancingBlender from './enhancingBlender.jsx';
import meshPrimitives from './meshPrimitives.jsx';
import editModeTopology from './editModeTopology.jsx';
import modifiers from './modifiers.jsx';
import geometryNodes from './geometryNodes.jsx';
import materialsShading from './materialsShading.jsx';
import lighting from './lighting.jsx';
import sculptMode from './sculptMode.jsx';
import booleanHardSurface from './booleanHardSurface.jsx';
import physicsSimulation from './physicsSimulation.jsx';
import rendering from './rendering.jsx';
import proceduralTextures from './proceduralTextures.jsx';

const modules = [
  mentalModel,
  interfaceNavigation,
  bpyAIAssist,
  enhancingBlender,
  meshPrimitives,
  editModeTopology,
  modifiers,
  geometryNodes,
  materialsShading,
  lighting,
  sculptMode,
  booleanHardSurface,
  physicsSimulation,
  rendering,
  proceduralTextures,
];

export default modules;
