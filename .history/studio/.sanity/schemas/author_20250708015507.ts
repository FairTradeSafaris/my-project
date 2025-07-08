import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'text'}),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
  ],
})
