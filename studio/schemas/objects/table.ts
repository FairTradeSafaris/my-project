// /schemas/objects/table.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'table',
  type: 'object',
  title: 'Table',
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'cells',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [], // remove headings etc. if not needed
                  marks: {
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'External Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) =>
                              Rule.uri({
                                scheme: ['http', 'https', 'mailto', 'tel'],
                              }),
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              // ✅ allows rich text inside table cells
            },
          ],
        },
      ],
    }),
  ],
})
