// This file is basically just a hack to expose the Artemis namespace in the
// window object. Once/if bun adds support for this, we can remove this file.

import * as Artemis from './index';

declare global {
  interface Window {
    Artemis: typeof Artemis;
  }
}

if (typeof window === 'object') {
  window.Artemis = Artemis;
}

