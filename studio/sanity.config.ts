import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {colorInput} from '@sanity/color-input'

import deskStructure from './deskStructure' // ✅ your custom layout
import schemaTypes from './schema' // ✅ all your schemas

export default defineConfig({
  name: 'default',
  title: 'fts-studio',

  projectId: 'jw971r14',
  dataset: 'production',

  plugins: [
    deskTool({structure: deskStructure}), // ✅ use the custom desk structure
    visionTool(),
    codeInput(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
