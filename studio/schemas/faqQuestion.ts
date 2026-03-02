import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'faqQuestion',
  title: 'FAQ Question',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'answer',
      type: 'array',
      of: [{type: 'block'}],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    defineField({
      name: 'order',
      type: 'number',
      initialValue: 0,
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faqCategory'}]}],
    }),

    // ✅ NEW
    defineField({
      name: 'destinations',
      title: 'Related Destinations',
      description: 'Attach this question to one or more destinations',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'destination'}]}],
    }),
  ],

  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
