import { Flux } from 'react-nexus';

import {
  stores as testStores,
  actions as testActions,
} from './test';

function createFlux() {
  return new Flux({
    actions: [
      ...testActions,
    ],
    stores: [
      ...testStores,
    ],
  });
}

export default createFlux;
