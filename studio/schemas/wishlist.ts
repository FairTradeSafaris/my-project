// wishlist.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'wishlist',
  title: 'Wishlist',
  type: 'document',
  fields: [
    defineField({
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'journeys',
      title: 'Wishlisted Journeys',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'journey'}]}],
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
