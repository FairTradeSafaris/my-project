// schemas/nonProfit.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'nonProfit',
  title: 'Non-Profit Partners',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'text',
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
      name: 'logo',
      title: 'Organization Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'description',
      title: 'Description / Partnership Details',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label (e.g. Visit Site)',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA URL (External or Internal)',
      type: 'url',
    }),
    defineField({
      name: 'website',
      title: 'Official Website',
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
      title: '🌟 Featured Partner',
      type: 'boolean',
      initialValue: false,
      description: 'Only one should be marked as featured at a time.',
    }),
  ],
})
