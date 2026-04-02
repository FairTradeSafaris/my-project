export default {
  name: 'bestTimeSection',
  title: 'Best Time Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Best Time to Go on a Luxury African Safari',
    },
    {
      name: 'intro',
      title: 'Intro Text',
      type: 'text',
    },

    // ✅ REGIONS (linked properly now)
    {
      name: 'regions',
      title: 'Regions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'regionBlock',
          title: 'Region',
          fields: [
            // 🔗 REAL REGION LINK
            {
              name: 'region',
              title: 'Select Region',
              type: 'reference',
              to: [{type: 'region'}],
              validation: (Rule: any) => Rule.required(),
            },

            // 🖼️ OPTIONAL OVERRIDE IMAGE
            {
              name: 'image',
              title: 'Override Image (optional)',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                },
              ],
            },

            // 📆 PERIODS (your core logic)
            {
              name: 'periods',
              title: 'Time Periods',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'period',
                  title: 'Period',
                  fields: [
                    {
                      name: 'startMonth',
                      title: 'Start Month (1–12)',
                      type: 'number',
                      validation: (Rule: any) => Rule.min(1).max(12).required(),
                    },
                    {
                      name: 'endMonth',
                      title: 'End Month (1–12)',
                      type: 'number',
                      validation: (Rule: any) => Rule.min(1).max(12).required(),
                    },

                    {
                      name: 'label',
                      title: 'Main Label',
                      type: 'string',
                      description: 'e.g. Peak wildlife viewing',
                    },

                    {
                      name: 'shortLabel',
                      title: 'Short Label',
                      type: 'string',
                      description: 'e.g. Peak',
                    },

                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                    },

                    {
                      name: 'seasonType',
                      title: 'Season Type',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Peak', value: 'peak'},
                          {title: 'Green', value: 'green'},
                          {title: 'Shoulder', value: 'shoulder'},
                        ],
                      },
                    },

                    {
                      name: 'priority',
                      title: 'Display Priority',
                      type: 'number',
                      description: 'Lower = shows first',
                    },

                    {
                      name: 'highlight',
                      title: 'Highlight?',
                      type: 'boolean',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // 📝 CLOSING NOTE
    {
      name: 'note',
      title: 'Closing Note',
      type: 'text',
    },
  ],
}
