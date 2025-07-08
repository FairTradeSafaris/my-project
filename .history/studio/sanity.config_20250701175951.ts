import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from '../studio/.sanity/schema'

export default defineConfig({
  name: 'default',
  title: 'fts-studio',

  projectId: 'jw971r14', // Replace with your actual project ID
  dataset: 'production',

  plugins: [deskTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
})
