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
    {
      name: 'regionVisited',
      title: 'Country or Region Visited',
      type: 'string',
      options: {
        list: [
          {title: 'Tanzania', value: 'Tanzania'},
          {title: 'Kenya', value: 'Kenya'},
          {title: 'Botswana', value: 'Botswana'},
          {title: 'South Africa', value: 'South Africa'},
          {title: 'Namibia', value: 'Namibia'},
        ],
      },
    },
    {
      name: 'sourceLink',
      title: 'Review Source Link',
      type: 'url',
    },
    {
      name: 'sourceLogo',
      title: 'Review Source Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}

export default testimonial
