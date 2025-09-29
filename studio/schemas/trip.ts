import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Trip Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientEmail',
      title: 'Client Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
      description: 'Used to identify which client this trip belongs to',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'destination',
      title: 'Destination Country',
      type: 'reference',
      to: [{type: 'country'}],
    }),
    defineField({
      name: 'passportUploads',
      title: 'Passport Uploads',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {storeOriginalFilename: true},
        },
      ],
    }),
    defineField({
      name: 'flightTicketUploads',
      title: 'Flight Ticket Uploads',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {storeOriginalFilename: true},
        },
      ],
    }),

    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
    }),
    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Document Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Signed Itinerary', value: 'signedItinerary'},
                  {title: 'Signed T&Cs', value: 'signedTerms'},
                  {title: 'Invoice', value: 'invoice'},
                  {title: 'Free Travel Book', value: 'travelBook'},
                  {title: 'Travel Info', value: 'travelInfo'},
                  {title: 'Checklist', value: 'checklist'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'file',
              title: 'Upload File',
              type: 'file',
              options: {storeOriginalFilename: true},
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'originalFilename',
              title: 'Original Filename',
              type: 'string',
              readOnly: true,
              description: 'Captured from upload to preserve filename',
            },
          ],
          preview: {
            select: {
              title: 'label',
              media: 'file',
            },
          },
        },
      ],
      description: 'Upload documents like Signed Itinerary, Invoice, Travel Info, Checklist, etc.',
    }),
  ],
})
