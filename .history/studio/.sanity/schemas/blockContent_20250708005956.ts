export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {type: 'block'}, // 💬 Rich text (headings, bold, italics, links, etc.)
    {type: 'code'}, // 👨‍💻 Code blocks
    {type: 'table'}, // 📊 Tables (custom object)
  ],
}
