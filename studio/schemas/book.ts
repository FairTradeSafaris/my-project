const book = {
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'previewUrl',
      title: 'Preview Link (Issuu)',
      type: 'url',
      validation: (Rule: any) => Rule.required().uri({scheme: ['http', 'https']}),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'previewUrl',
    },
  },
}

export default book
