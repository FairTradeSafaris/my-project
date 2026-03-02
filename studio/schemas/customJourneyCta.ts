// sanity/schemas/customJourneyCta.ts

export default {
  name: 'customJourneyCta',
  title: 'Custom Safari CTA',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 4,
    },
    {
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Request a Custom Safari',
    },
    {
      name: 'ctaLink',
      title: 'Button Link',
      type: 'url',
      initialValue: 'mailto:books@fairtradesafaris.com',
    },
    {
      name: 'isActive',
      title: 'Show this CTA?',
      type: 'boolean',
      initialValue: true,
    },
  ],
}
