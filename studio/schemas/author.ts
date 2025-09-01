import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
    }),

    // 🔥 NEW FIELDS BELOW
    defineField({
      name: 'favoriteWildlifeEncounter',
      title: 'Favorite Wildlife Encounter',
      type: 'string',
      description: 'A quick highlight moment with animals in the wild',
    }),
    defineField({
      name: 'inspiringDestination',
      title: 'Most Inspiring Destination',
      type: 'string',
      description: 'A destination that deeply impacted this storyteller',
    }),
    defineField({
      name: 'whyTellStories',
      title: 'Why I Tell Safari Stories',
      type: 'text',
      description: 'Let them share their personal mission or purpose',
    }),
  ],
})
