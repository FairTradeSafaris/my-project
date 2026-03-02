import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    // -------------------------------------------------------
    // BASIC AUTHOR INFO (existing)
    // -------------------------------------------------------
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

    // -------------------------------------------------------
    // NEW: SEO + AI FIELDS
    // -------------------------------------------------------

    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'Used in Person schema for Google and AI assistants.',
    }),

    defineField({
      name: 'sameAs',
      title: 'Online Profiles',
      type: 'array',
      of: [{type: 'url'}],
      description:
        'Links to author profiles (LinkedIn, Instagram, website, etc). Required for entity linking + E-E-A-T.',
    }),

    defineField({
      name: 'expertiseAreas',
      title: 'Expertise Areas',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Topics this author specializes in (e.g., Wildlife Conservation, African Culture, Safari Planning).',
    }),

    defineField({
      name: 'location',
      title: 'Location (Optional)',
      type: 'string',
      description: 'City or country — used for additional entity context in AI models.',
    }),

    // -------------------------------------------------------
    // FUN BRAND FIELDS (existing + safe)
    // -------------------------------------------------------
    defineField({
      name: 'favoriteWildlifeEncounter',
      title: 'Favorite Wildlife Encounter',
      type: 'string',
    }),

    defineField({
      name: 'inspiringDestination',
      title: 'Most Inspiring Destination',
      type: 'string',
    }),

    defineField({
      name: 'whyTellStories',
      title: 'Why I Tell Safari Stories',
      type: 'text',
    }),
  ],
})
