import {defineType, defineField} from 'sanity'
import {colorInput} from '@sanity/color-input'

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
      type: 'color',
      description: 'Choose a background color',
    }),

    defineField({
      name: 'buttonColor',
      title: 'Button Text Color',
      type: 'color',
      description: 'Choose a color for the button text',
    }),

    defineField({
      name: 'buttonBackground',
      title: 'Button Background Color',
      type: 'color',
      description: 'Choose a background color for the button',
    }),

    defineField({
      name: 'link',
      title: 'Button Link',
      type: 'string',
      description: 'Can be a relative path like /journey or a full URL',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== 'string') return true

          const isRelative = value.startsWith('/')
          const isAbsolute = /^(https?:\/\/|mailto:|tel:)/.test(value)

          return isRelative || isAbsolute || 'Must be a valid URL or start with "/"'
        }),
    }),
  ],
})
