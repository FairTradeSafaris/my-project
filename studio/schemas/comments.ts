import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
      hidden: true, // optional: hide email from non-admin views
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'post',
      title: 'Related Blog Post',
      type: 'reference',
      to: [{type: 'blog'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Only approved comments will appear on the live site.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'comment',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle?.length > 50 ? subtitle.slice(0, 50) + '…' : subtitle,
      }
    },
  },
})
