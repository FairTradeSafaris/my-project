export default {
  name: 'techStack',
  title: 'Tech Stack Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'intro',
      title: 'Intro Text',
      type: 'text',
    },
    {
      name: 'stack',
      title: 'Technology List',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
}
