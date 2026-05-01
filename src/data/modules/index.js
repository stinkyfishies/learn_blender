// Aggregates all modules in order

import mentalModel from './mentalModel.jsx';
import interfaceNavigation from './interfaceNavigation.jsx';
import bpyAIAssist from './bpyAIAssist.jsx';
import enhancingBlender from './enhancingBlender.jsx';
import meshPrimitives from './meshPrimitives.jsx';
import editModeTopology from './editModeTopology.jsx';
import modifiers from './modifiers.jsx';
import materialsShading from './materialsShading.jsx';
import buildThis from './buildThis.jsx';
import lighting from './lighting.jsx';
import rendering from './rendering.jsx';
import finishThis from './finishThis.jsx';
import uvUnwrapping from './uvUnwrapping.jsx';
import geometryNodes from './geometryNodes.jsx';
import sculptMode from './sculptMode.jsx';
import rigging from './rigging.jsx';
import booleanHardSurface from './booleanHardSurface.jsx';
import physicsSimulation from './physicsSimulation.jsx';
import proceduralTextures from './proceduralTextures.jsx';
import cameraTracking from './cameraTracking.jsx';

const modules = [
  // Set Up
  mentalModel,
  interfaceNavigation,
  bpyAIAssist,
  enhancingBlender,
  // Build Model
  meshPrimitives,
  editModeTopology,
  modifiers,
  materialsShading,
  buildThis,
  // Finish Model
  lighting,
  rendering,
  finishThis,
  // Level Up
  uvUnwrapping,
  geometryNodes,
  sculptMode,
  rigging,
  booleanHardSurface,
  physicsSimulation,
  proceduralTextures,
  cameraTracking,
];

export default modules;
