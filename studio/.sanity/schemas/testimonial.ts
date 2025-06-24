// testimonial.ts

// Testimonial Section Settings (singleton document)
export const testimonialSettings = {
  name: 'testimonialSettings',
  title: 'Testimonial Section Settings',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Client Feedback & Testimonial',
    },
    {
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      initialValue:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit diam nonummy euismod tincidunt laoreet dolore magna aliquam erat volutpat.',
    },
  ],
}

// Testimonial Items
const testimonial = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {name: 'name', title: 'Name', type: 'string'},
    {name: 'title', title: 'Title/Role', type: 'string'},
    {name: 'rating', title: 'Star Rating', type: 'number'},
    {name: 'text', title: 'Testimonial Text', type: 'text'},
    {
      name: 'color',
      title: 'Theme Color',
      type: 'string',
      options: {
        list: [
          {title: 'Green', value: 'bg-green-500'},
          {title: 'Blue', value: 'bg-blue-500'},
          {title: 'Orange', value: 'bg-orange-500'},
        ],
      },
    },
  ],
}

export default testimonial
