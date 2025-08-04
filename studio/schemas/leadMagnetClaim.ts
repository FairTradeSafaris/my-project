const leadMagnetClaim = {
  name: 'leadMagnetClaim',
  title: 'Lead Magnet Claim',
  type: 'document',
  fields: [
    {
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'bookTitle',
      title: 'Book Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'bookUrl',
      title: 'Book Preview URL',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'claimedAt',
      title: 'Claimed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
}

export default leadMagnetClaim
