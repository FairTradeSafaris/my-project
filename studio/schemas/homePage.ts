import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Home Page',
    }),

    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          name: 'heroSection',
          type: 'reference',
          to: [{type: 'hero'}],
        },
        {
          name: 'whyChooseSection',
          type: 'reference',
          to: [{type: 'whyChoose'}],
        },
        {
          name: 'foundersPromiseSection',
          type: 'reference',
          to: [{type: 'foundersPromise'}],
        },
        {
          name: 'featuredJourneysSectionRef',
          type: 'reference',
          to: [{type: 'featuredJourneysSection'}],
        },
        {
          name: 'ctaBannerSection',
          type: 'reference',
          to: [{type: 'ctaBanner'}],
        },
      ],
    }),
  ],
})
