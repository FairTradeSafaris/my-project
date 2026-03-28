import {defineType, defineField} from 'sanity'

type SanityImageValue = {
  asset?: {
    _ref?: string
  }
}

export default defineType({
  name: 'heroImage',
  title: 'Hero Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Upload Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for every image.'),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
        {
          name: 'credit',
          title: 'Photo Credit',
          type: 'string',
        },
      ],
      validation: (Rule) =>
        Rule.custom((image: SanityImageValue | undefined) => {
          const ref = image?.asset?._ref || ''
          if (ref && !ref.includes('-webp')) {
            return 'Please upload a true WebP image (not renamed).'
          }
          return true
        }),
    }),
    defineField({
      name: 'galleryImage',
      title: 'Or Select from Gallery',
      type: 'reference',
      to: [{type: 'galleryImage'}],
    }),
    defineField({
      name: 'text',
      title: 'Overlay Text',
      type: 'string',
    }),
    defineField({
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'center',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((fields) => {
      const hasUpload = !!fields?.image
      const hasGallery = !!fields?.galleryImage
      if (hasUpload && hasGallery) {
        return 'Choose either an upload or a gallery image — not both.'
      }
      if (!hasUpload && !hasGallery) {
        return 'Please provide a hero image.'
      }
      return true
    }),
})
