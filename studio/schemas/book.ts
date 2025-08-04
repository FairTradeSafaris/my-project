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
    {
      name: 'buyLink',
      title: 'Buy Link (Amazon)',
      type: 'url',
      description: 'Optional link to purchase this book on Amazon or other store',
      validation: (Rule: any) => Rule.uri({scheme: ['http', 'https']}),
    },
    {
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'previewUrl',
      media: 'previewImage',
    },
  },
}

export default book
