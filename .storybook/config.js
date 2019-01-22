import { configure } from '@storybook/react';

function loadStories() {
  require('../test/storybook/index.tsx');
  // You can require as many stories as you need.
}

configure(loadStories, module);