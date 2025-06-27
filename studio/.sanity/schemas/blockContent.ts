import table from './objects/table' // 👈 Add this import

export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {type: 'block'},
    {type: 'code'},
    {type: 'table'}, // 👈 Add this
  ],
}
