export default {
  name: 'videoTestimonial',
  title: 'Video Testimonial',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Traveler Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{type: 'destination'}],
    },
    {
      name: 'location',
      title: 'Trip Location',
      type: 'string',
    },
    {
      name: 'videoUrl',
      title: 'Video URL (YouTube, Vimeo, etc.)',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
    },
    {
      name: 'uploadDate',
      title: 'Upload Date',
      type: 'datetime',
    },
    {
      name: 'videoDuration',
      title: 'Video Duration (e.g., PT2M30S)',
      type: 'string',
      description: 'Use ISO 8601 duration format, e.g., PT2M30S for 2 minutes 30 seconds',
    },
  ],
}
