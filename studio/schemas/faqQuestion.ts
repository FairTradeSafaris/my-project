import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'faqQuestion',
  title: 'FAQ Question',
  type: 'document',

  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faqCategory'}]}],
    }),

    // NEW: toggle if question relates to specific destinations
    defineField({
      name: 'isDestinationSpecific',
      title: 'Destination Specific?',
      type: 'boolean',
      initialValue: false,
      description: 'Enable if this FAQ only applies to specific safari destinations.',
    }),

    defineField({
      name: 'destinations',
      title: 'Related Destinations',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'destination'}]}],
      hidden: ({document}) => !document?.isDestinationSpecific,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as {isDestinationSpecific?: boolean}

          // If NOT destination specific → skip validation
          if (!doc?.isDestinationSpecific) {
            return true
          }

          // If destination specific → require at least one
          if (!value || value.length === 0) {
            return 'Select at least one destination'
          }

          return true
        }),
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
