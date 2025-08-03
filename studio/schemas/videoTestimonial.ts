// /schemas/videoTestimonial.ts

export default {
  name: 'videoTestimonial',
  title: 'Video Testimonial',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Traveler Name',
      type: 'string',
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
  ],
}
