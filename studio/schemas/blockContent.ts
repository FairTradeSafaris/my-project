export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'URL',
            fields: [{name: 'href', type: 'url', title: 'URL'}],
          },
        ],
      },
    },
    {type: 'code'}, // 👨‍💻 Code blocks
    {type: 'table'}, // 📊 Tables (custom object)
  ],
}
