import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {colorInput} from '@sanity/color-input'
import {table} from '@sanity/table' // ✅ Table plugin import

import deskStructure from './deskStructure'
import schemaTypes from './schema'

// 👇 Import your tool
import BulkGalleryUploadTool from './tools/BulkGalleryUpload'

export default defineConfig({
  name: 'default',
  title: 'fts-studio',

  projectId: 'jw971r14',
  dataset: 'production',

  plugins: [
    deskTool({structure: deskStructure}),
    visionTool(),
    codeInput(),
    colorInput(),
    table(), // ✅ Register the plugin here
  ],

  schema: {
    types: schemaTypes,
  },

  // 👇 Add the custom tool to sidebar
  tools: [
    {
      name: 'bulk-gallery-upload',
      title: '📤 Bulk Gallery Upload',
      component: BulkGalleryUploadTool,
    },
  ],
})
