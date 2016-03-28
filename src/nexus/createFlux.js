import { Flux } from 'react-nexus';

function createFlux({ context, window }) {
  return Flux.create();
}

export default createFlux;
