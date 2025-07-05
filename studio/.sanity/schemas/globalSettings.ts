export default {
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    {
      name: 'customHeaderScripts',
      title: 'Custom Header Scripts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Script Name / Purpose',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'code',
              title: 'Script Code',
              type: 'text',
              rows: 8,
              description: 'Paste full <script> tags here',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
}
