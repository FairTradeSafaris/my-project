import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'whyChoose',
  title: 'Why Travel With Us',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'reasons',
      title: 'Reasons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reason',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon (Emoji or Unicode)',
              type: 'string',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
  ],
})
