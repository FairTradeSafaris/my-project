import blog from './schemas/blog' // 👈 Import your blog schema
import footer from './schemas/footer'
import ctaBanner from './schemas/ctaBanner'
// (other schema imports)

export const schemaTypes = [blog, footer, ctaBanner] // 👈 Add `blog` to this array

export const schema = {
  types: schemaTypes,
}
