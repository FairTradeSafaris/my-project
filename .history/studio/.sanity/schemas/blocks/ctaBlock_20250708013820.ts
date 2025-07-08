import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'ctaBlock',
  title: 'Call To Action Block',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex code like #ff6600 or Tailwind class like bg-orange-500',
    }),

    defineField({
      name: 'link',
      title: 'Button Link',
      type: 'url',
    }),
  ],
})
