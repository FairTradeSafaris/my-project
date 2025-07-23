// studio/schemas/projectPortal.ts

export default {
  name: 'projectPortal',
  type: 'document',
  title: 'Developer Portal',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Page Title',
    },
    {
      name: 'sections',
      type: 'array',
      title: 'Content Sections',
      of: [
        {
          type: 'object',
          title: 'Collapsible Section',
          fields: [
            {name: 'title', type: 'string', title: 'Section Title'},
            {
              name: 'body',
              type: 'array',
              title: 'Content',
              of: [
                {type: 'block'},
                {type: 'code'},
                {type: 'table'}, // ✅ This enables table support
              ],
            },
          ],
        },
      ],
    },
  ],
}
