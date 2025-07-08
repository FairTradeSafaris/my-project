import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'textImage',
  title: 'Text & Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'text',
      title: 'Text Content',
      type: 'text',
    }),
    defineField({
      name: 'align',
      title: 'Image Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
  ],
})
