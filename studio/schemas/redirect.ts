import {defineType} from 'sanity'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    {
      name: 'source',
      title: 'Source Path',
      type: 'string',
      description: 'The old URL path, e.g., /old-page',
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const val = value as string
          const parent = context.parent as {destination?: string}
          const destination = parent?.destination

          if (destination && destination === val) {
            return 'Source and destination cannot be the same'
          }

          if (!val.startsWith('/')) {
            return 'Path must start with a "/"'
          }

          return true
        }),
    },
    {
      name: 'destination',
      title: 'Destination Path',
      type: 'string',
      description: 'The new URL to redirect to, e.g., /new-page',
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const val = value as string
          const parent = context.parent as {source?: string}
          const source = parent?.source

          if (source && source === val) {
            return 'Source and destination cannot be the same'
          }

          if (!val.startsWith('/')) {
            return 'Path must start with a "/"'
          }

          return true
        }),
    },
    {
      name: 'permanent',
      title: 'Is Permanent?',
      type: 'boolean',
      initialValue: true,
      description: 'Use 301 for permanent, 302 for temporary',
    },
  ],
  preview: {
    select: {
      title: 'source',
      subtitle: 'destination',
    },
    prepare({title, subtitle}) {
      return {
        title: `From: ${title}`,
        subtitle: `To: ${subtitle}`,
      }
    },
  },
})
