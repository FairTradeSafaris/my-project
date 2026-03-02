import {defineType, defineField} from 'sanity'

export const imageOrGallery = defineType({
  name: 'imageOrGallery',
  title: 'Image or Gallery Reference',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Upload Image (.webp only)',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility.'),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((image) => {
          if (!image || typeof image !== 'object' || !('asset' in image)) return true
          const ref = (image.asset as {_ref?: string})?._ref
          const isWebp = ref?.includes('-webp')
          return isWebp || 'Only .webp images are allowed'
        }),
    }),
    defineField({
      name: 'galleryImage',
      title: 'Or Select from Gallery',
      type: 'reference',
      to: [{type: 'galleryImage'}],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const hasUpload = !!value?.image
      const hasGallery = !!value?.galleryImage
      if (hasUpload && hasGallery) return 'Choose either an upload or a gallery image — not both.'
      if (!hasUpload && !hasGallery) return 'Please provide an image.'
      return true
    }),
})
