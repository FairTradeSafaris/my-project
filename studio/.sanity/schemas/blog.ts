import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'summary', title: 'Summary', type: 'text'}),
    defineField({name: 'content', title: 'Content', type: 'blockContent'}),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'publishedAt', title: 'Published At', type: 'datetime'}),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt Text', type: 'string'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})
