// /your-schema-folder/leadMagnetPopup.ts

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'leadMagnetPopup',
  title: 'Timed Lead Magnet Popup',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to enable or disable this popup.',
    }),
    defineField({
      name: 'delaySeconds',
      title: 'Popup Delay (in seconds)',
      type: 'number',
      initialValue: 30,
      validation: (Rule) => Rule.min(5).max(300),
      description: 'Time delay before the popup appears (default: 30s).',
    }),
    defineField({
      name: 'title',
      title: 'Popup Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Popup Body Text',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Optional Image',
      type: 'image',
    }),
    defineField({
      name: 'ctas',
      title: 'CTA Buttons',
      type: 'array',
      of: [
        defineField({
          name: 'cta',
          title: 'CTA',
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Button Label',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              type: 'url',
              title: 'Button URL',
              validation: (Rule) => Rule.required().uri({allowRelative: true}),
            },
          ],
        }),
      ],
      validation: (Rule) => Rule.max(2),
      description: 'Add up to 2 CTAs (e.g., Contact and Book links)',
    }),

    defineField({
      name: 'hideOnMobile',
      title: 'Hide on Mobile',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hideForSignedIn',
      title: 'Hide for Logged-in Users',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showOnRoutes',
      title: 'Display on Specific Routes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description:
        'Leave blank to show site-wide. Use exact paths like "/about", or wildcards like "/itineraries/*".',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'enabled',
      media: 'image',
    },
  },
})
