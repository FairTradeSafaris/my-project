export default {
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
    },

    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Can be a relative path like /journey or a full URL',
    },

    {
      name: 'sideImage',
      title: 'Side Image (line art or illustration)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },

    {
      name: 'backgroundImage',
      title: 'Background Image (PNG/SVG)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'textOnLeft',
      title: 'Place Text on Left?',
      type: 'boolean',
      description: 'Toggle to move text to the left or right side.',
    },
  ],
}
