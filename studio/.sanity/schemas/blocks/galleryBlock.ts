import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'galleryBlock',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.min(2).error('Add at least two images.'),
    }),
    defineField({
      name: 'layout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Carousel', value: 'carousel'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'grid',
    }),
  ],
})
