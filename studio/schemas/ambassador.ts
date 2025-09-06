import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'ambassador',
  title: 'Ambassadors & Collaborators',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role or Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Optional)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'description',
      title: 'Bio / Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label (e.g. Learn More)',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA URL (Internal or External)',
      type: 'url',
    }),
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          name: 'socialLink',
          title: 'Social Link',
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'X (Twitter)', value: 'twitter'},
                  {title: 'Website', value: 'website'},
                ],
                layout: 'dropdown',
              },
            },
            {
              name: 'url',
              title: 'Profile URL',
              type: 'url',
            },
            {
              name: 'icon',
              title: 'Custom Icon (optional)',
              type: 'image',
              options: {hotspot: false},
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: '🌟 Featured This Month',
      type: 'boolean',
      initialValue: false,
      description: 'Only one should be marked as featured at a time.',
    }),
  ],
})
