import {defineType} from 'sanity'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image (.webp only)',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) =>
        Rule.custom((image) => {
          if (!image || typeof image !== 'object' || !('asset' in image)) return true
          const ref = (image.asset as {_ref?: string})._ref
          const isWebp = ref?.includes('-webp')
          return isWebp || 'Only .webp images are allowed'
        }),
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      type: 'text',
      title: 'Caption',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Hero Images', value: 'hero'},
          {title: 'Journey Cards', value: 'journey'},
          {title: 'Testimonials', value: 'testimonial'},
          {title: 'Guides', value: 'guides'},
          {title: 'Blog Posts', value: 'blog'},
        ],
        layout: 'dropdown',
      },
    },
  ],

  // 👇 Add this to customize how each item appears in the list
  preview: {
    select: {
      title: 'alt', // shown as main title
      media: 'image', // thumbnail
      subtitle: 'category', // shown below the title
    },
  },
})
