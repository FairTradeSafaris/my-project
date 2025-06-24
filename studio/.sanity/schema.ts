import blog from './schemas/blog' // 👈 Import your blog schema
import footer from './schemas/footer'
// (other schema imports)

export const schemaTypes = [blog, footer] // 👈 Add `blog` to this array

export const schema = {
  types: schemaTypes,
}
