const sitePages = {
  name: 'sitePages',
  title: 'Site Pages',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Page Slug',
      type: 'string',
      description:
        "Use path names like '/', 'contact', 'privacy', etc. Do not include '/' at the end.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(60),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required().max(160),
    },
  ],
}

export default sitePages
