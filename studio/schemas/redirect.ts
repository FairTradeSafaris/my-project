import {defineType} from 'sanity'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Redirect Type',
      type: 'string',
      options: {
        list: [
          {title: 'Redirect (301/302)', value: 'redirect'},
          {title: 'Gone (410)', value: 'gone'},
        ],
      },
      initialValue: 'redirect',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'source',
      title: 'Source Path',
      type: 'string',
      description: 'The old URL path, e.g., /old-page',
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const val = value as string
          const parent = context.parent as {destination?: string; type?: string}
          const destination = parent?.destination

          if (parent?.type === 'redirect' && destination && destination === val) {
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
      hidden: ({parent}) => parent?.type === 'gone',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {source?: string; type?: string}

          if (parent?.type === 'gone') return true // no validation needed

          if (!value) return 'Destination is required for redirects'

          const val = value as string
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
      hidden: ({parent}) => parent?.type === 'gone',
    },
  ],

  preview: {
    select: {
      title: 'source',
      subtitle: 'destination',
      type: 'type',
    },
    prepare({title, subtitle, type}) {
      if (type === 'gone') {
        return {
          title: `🚫 GONE: ${title}`,
          subtitle: 'Returns 410',
        }
      }

      return {
        title: `From: ${title}`,
        subtitle: `To: ${subtitle}`,
      }
    },
  },
})
