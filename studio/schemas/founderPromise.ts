// /sanity/schemas/foundersPromise.ts

export default {
  name: 'foundersPromise',
  title: 'Founder’s Promise',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
    },
    {
      name: 'intro',
      title: 'Intro Paragraph',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'safelist',
      title: 'S.A.F.E. List',
      type: 'array',
      of: [{type: 'string'}],
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
    },
    {
      name: 'lineArtImage',
      title: 'Line Art Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'textOnLeft',
      title: 'Text on Left?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'impactContent',
      title: 'Impact Content',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Impact Title',
          type: 'string',
        },
        {
          name: 'body',
          title: 'Impact Body',
          type: 'array',
          of: [{type: 'block'}],
        },
        {
          name: 'ctaText',
          title: 'CTA Text',
          type: 'string',
        },
        {
          name: 'ctaLink',
          title: 'CTA Link',
          type: 'string',
        },
      ],
    },
  ],
}
