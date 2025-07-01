import blog from './schemas/blog'
import footer from './schemas/footer'
import ctaBanner from './schemas/ctaBanner'
import techStack from './schemas/techStack'
import projectPortal from './schemas/projectPortal'
import table from './schemas/objects/table'
import privacyPolicy from './schemas/privacyPolicy'

// 👉 Add other schemas as needed:
import testimonial from './schemas/testimonial'
import hero from './schemas/hero'
import journey from './schemas/journey'
import blockContent from './schemas/blockContent'
import region from './schemas/region'
import country from './schemas/country'
import featuredJourney from '../.sanity/schemas/featuredJourney'
import whyChoose from './schemas/whyChoose'
import destination from './schemas/destination'
import megamenu from '../.sanity/schemas/megaMenu'

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
  featuredJourney,
  whyChoose,
  destination,
  privacyPolicy,
  megamenu,
]

export const schema = {
  types: schemaTypes,
}
