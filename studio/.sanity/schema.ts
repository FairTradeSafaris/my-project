// schema.ts
import post from './schemas/post'
import footer from './schemas/footer'
// (other schema imports)

export const schemaTypes = [post, footer] // add all schemas here

export const schema = {
  types: schemaTypes,
}
