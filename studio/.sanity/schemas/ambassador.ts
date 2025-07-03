import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'ambassador',
  title: 'Ambassadors & Collaborators',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (optional, for landing page)',
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
      title: 'Rich Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link (can be external or internal)',
      type: 'url',
    }),

    // 🔗 SOCIALS
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
  ],
})
