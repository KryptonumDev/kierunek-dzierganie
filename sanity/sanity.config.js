import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { media } from 'sanity-plugin-media';
import { structureTool } from 'sanity/structure';
import { deskStructure } from './deskStructure';
import { schemaTypes, singleTypes } from './schemas';

import { colorInput } from '@sanity/color-input';
import { markdownSchema } from 'sanity-plugin-markdown';
import { CustomMarkdownInput } from './components/Markdown';
import './styles.css';

const singletonTypes = new Set(singleTypes.map(type => type.name));
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'default',
  title: 'Kierunek Dzierganie',
  projectId: '5q82mab3',
  dataset: 'production',
  studioUrl: 'https://kierunek-dzierganie.sanity.studio',

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
    markdownSchema({ input: CustomMarkdownInput }),
    media(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
