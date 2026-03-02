export default {
  name: 'privacyPolicy',
  title: 'Fair Trade Safaris Privacy Policy',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Privacy Policy',
      readOnly: true,
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
