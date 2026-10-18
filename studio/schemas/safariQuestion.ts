// studio/schemas/safariQuestion.ts
// NEW (batch 17). One page per safari question at
// /safari-questions/<slug>/ on the website. A separate, new type: the
// existing "FAQ Question" (faqQuestion) type is NOT changed.
//
// Every field either is required or has a starting value, and the website
// has its own fallback for every optional field, so nothing ever shows blank.
import {defineType, defineField} from 'sanity'

const words = (s?: string) => (s || '').trim().split(/\s+/).filter(Boolean).length

export default defineType({
  name: 'safariQuestion',
  title: 'Safari Question',
  type: 'document',
  groups: [
    {name: 'content', title: 'Question & answer', default: true},
    {name: 'links', title: 'Links'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      group: 'content',
      description:
        'Write it the way people type it into Google, e.g. "When is the best time for a Tanzania safari?" This becomes the page heading.',
      validation: (Rule) => Rule.required().max(110),
    }),
    defineField({
      name: 'slug',
      title: 'Web address (slug)',
      type: 'slug',
      group: 'content',
      description: 'Click "Generate". The page will be /safari-questions/<this>/',
      options: {source: 'question', maxLength: 80},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortAnswer',
      title: 'Short answer (2 sentences)',
      type: 'text',
      rows: 4,
      group: 'content',
      description:
        'The direct answer, shown first on the page and used by Google. Two sentences, about 40-60 words. Answer the question in the first sentence.',
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((v?: string) =>
          !v || (words(v) >= 25 && words(v) <= 75)
            ? true
            : `Aim for about 40-60 words (now ${words(v)}).`,
        ).warning(),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Full answer',
      type: 'array',
      group: 'content',
      description: 'The longer answer: details, tips, lists. Optional, but recommended.',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      group: 'links',
      to: [{type: 'destination'}],
      description:
        'Optional. Pick a country and this question is listed on that country page under "Questions about ...".',
    }),
    defineField({
      name: 'relatedJourneys',
      title: 'Related itineraries',
      type: 'array',
      group: 'links',
      of: [{type: 'reference', to: [{type: 'journey'}]}],
      description: 'Optional. Up to 3 itineraries shown as cards under the answer.',
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Optional. Wide photo shown beside the short answer.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description (alt text)',
          type: 'string',
          description: 'Describe the photo in a few words, e.g. "Elephants at a waterhole in Tarangire".',
        }),
      ],
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Last reviewed',
      type: 'date',
      group: 'content',
      description: 'Update this when you check the answer is still correct. Shown on the page.',
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      group: 'content',
      description: 'Lower numbers show first in lists (1 = top). Leave 100 if unsure.',
      initialValue: 100,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title (optional)',
      type: 'string',
      group: 'seo',
      description: 'Leave empty to use the question. Max 60 characters.',
      validation: (Rule) => Rule.max(60).warning('Google shows about 60 characters.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description (optional)',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Leave empty to use the short answer. Max 155 characters.',
      validation: (Rule) => Rule.max(155).warning('Google shows about 155 characters.'),
    }),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrderAsc', by: [{field: 'sortOrder', direction: 'asc'}, {field: 'question', direction: 'asc'}]},
    {title: 'Question A-Z', name: 'questionAsc', by: [{field: 'question', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'question', destination: 'destination.title', media: 'heroImage'},
    prepare: ({title, destination, media}) => ({
      title: title || 'New question',
      subtitle: destination ? `Destination: ${destination}` : 'General',
      media,
    }),
  },
})
