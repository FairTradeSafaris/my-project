import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'safariBuilderBlock',
  title: 'Safari Builder CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Start My Safari',
    }),
    defineField({
      name: 'mode',
      title: 'Submission Mode',
      type: 'string',
      options: {
        list: [
          {title: 'CRM (Zoho)', value: 'crm'},
          {title: 'Email Only', value: 'email'},
        ],
        layout: 'radio',
      },
      initialValue: 'crm',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'mode',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Safari Builder CTA',
        subtitle: subtitle === 'email' ? 'Email Mode' : 'CRM Mode',
      }
    },
  },
})
