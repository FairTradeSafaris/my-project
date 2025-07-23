export default {
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Country Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'travelInfo',
      title: 'Travel Information',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'didYouKnowImage',
      title: 'Did You Know Image',
      type: 'image',
    },
    {
      name: 'didYouKnowText',
      title: 'Did You Know Text',
      type: 'text',
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'practicalStuff',
      title: 'Practical Info Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Section Title'},
            {name: 'content', type: 'array', of: [{type: 'block'}]},
          ],
        },
      ],
    },
    {
      name: 'ctaLink',
      title: 'Discovery Call Link',
      type: 'url',
    },
    {
      name: 'flagImage',
      title: 'Country Flag',
      type: 'image',
      options: {hotspot: false},
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
    },
    {
      name: 'ranking',
      title: 'Ranking Position',
      type: 'number',
    },
    {
      name: 'featured',
      title: 'Feature on Homepage?',
      type: 'boolean',
    },
    {
      name: 'mapLocation',
      title: 'Google Map Location (Optional)',
      type: 'string',
      description: 'Used to link to Google Maps (e.g. Tanzania National Parks)',
    },
    {
      name: 'tags',
      title: 'Highlights / Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Used for short labels like "Big 5", "Migration", "Luxury", etc.',
    },
    {
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    },
  ],
}
