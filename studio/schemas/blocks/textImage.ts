import {defineType, defineField} from 'sanity'

type SanityImageValue = {
  asset?: {
    _ref?: string
  }
}

export default defineType({
  name: 'textImage',
  title: 'Text & Image',
  type: 'object',
  fields: [
    // ✅ Main image field (unchanged)
    defineField({
      name: 'image',
      title: 'Upload Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility.'),
        }),

        defineField({
          name: 'caption',
          title: 'Image Caption',
          type: 'string',
          description: 'Text displayed below the image.',
        }),

        defineField({
          name: 'credit',
          title: 'Photo Credit / Description',
          type: 'string',
          description: 'Optional credit or description under the caption.',
        }),
      ],
      validation: (Rule) =>
        Rule.custom((image: SanityImageValue | undefined) => {
          const ref = image?.asset?._ref || ''
          if (ref && !ref.includes('-webp')) {
            return 'Please upload a WebP image.'
          }
          return true
        }),
    }),

    // ✅ Optional gallery reference
    defineField({
      name: 'galleryImage',
      title: 'Or Select from Gallery',
      type: 'reference',
      to: [{type: 'galleryImage'}],
    }),

    // ✅ Background Style (NOW CORRECT LOCATION)
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          {title: 'Default (White)', value: 'default'},
          {title: 'Soft Neutral', value: 'neutral'},
        ],
      },
      initialValue: 'default',
    }),

    // ✅ Text & display config
    defineField({
      name: 'text',
      title: 'Text Content',
      type: 'blockContent',
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
    defineField({
      name: 'padding',
      title: 'Section Padding',
      type: 'string',
      options: {
        list: [
          {title: 'Default (Top & Bottom)', value: 'default'},
          {title: 'Top Only', value: 'top'},
          {title: 'Bottom Only', value: 'bottom'},
          {title: 'No Padding', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      description: 'Control vertical spacing for this section.',
    }),
    defineField({
      name: 'imageSize',
      title: 'Image Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Full Width', value: 'full'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'md',
    }),
  ],

  // ✅ Validate that either `image` or `galleryImage` is used — not both
  validation: (Rule) =>
    Rule.custom((fields) => {
      const hasImage = !!fields?.image
      const hasGallery = !!fields?.galleryImage

      if (hasImage && hasGallery) return 'Choose either an upload or gallery image — not both.'
      if (!hasImage && !hasGallery) return 'Please provide an image.'

      return true
    }),
})
