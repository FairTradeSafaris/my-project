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
    {
      name: 'credit',
      title: 'Photo Credit',
      type: 'string',
      description: 'Photographer name or image source (e.g. Unsplash, Pexels, Adobe Stock)',
    },
    {
      name: 'license',
      title: 'Image License',
      type: 'string',
      description: 'E.g. Creative Commons, Purchased, Rights-Managed, etc.',
    },
    {
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Optional — link to the original image source if applicable.',
    },
  ],

  preview: {
    select: {
      title: 'alt',
      media: 'image',
      subtitle: 'category',
    },
  },
})
