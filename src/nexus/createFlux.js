import { Flux } from 'react-nexus';
import url from 'url';

import createExampleModule from './example';

function createFlux({ context, window }) {

  const exampleModule = createExampleModule(url.parse((context || window.location).href));

  return new Flux({
    actions: [
      ...exampleModule.actions,
    ],
    stores: [
      ...exampleModule.stores,
    ],
  });
}

export default createFlux;
