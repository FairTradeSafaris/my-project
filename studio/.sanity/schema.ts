import blog from './schemas/blog'
import footer from './schemas/footer'
import ctaBanner from './schemas/ctaBanner'
import techStack from './schemas/techStack'
import projectPortal from './schemas/projectPortal'
import table from './schemas/objects/table'

// 👉 Add other schemas as needed:
import testimonial from './schemas/testimonial'
import hero from './schemas/hero'
import journey from './schemas/journey'
import blockContent from './schemas/blockContent'
import region from './schemas/region'
import country from './schemas/country'

export const schemaTypes = [
  blog,
  footer,
  ctaBanner,
  techStack,
  projectPortal,
  testimonial,
  hero,
  journey,
  blockContent,
  table,
  country,
  region,
]

export const schema = {
  types: schemaTypes,
}
