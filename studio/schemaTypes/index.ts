import blog from '../.sanity/schemas/blog' // 👈 Add this line
import hero from '../.sanity/schemas/hero'
import whyChoose from '../.sanity/schemas/whyChoose'
import journey from '../.sanity/schemas/journey'
import featuredJourney from '../.sanity/schemas/featuredJourney'
import footer from '../.sanity/schemas/footer'
import testimonial, {testimonialSettings} from '../.sanity/schemas/testimonial'
import blockContent from '../.sanity/schemas/blockContent'
import ctaBanner from '../.sanity/schemas/ctaBanner'
import techStack from '../.sanity/schemas/techStack'
import projectPortal from '../.sanity/schemas/projectPortal'

export const schemaTypes = [
  blog, // 👈 And add it here too
  hero,
  whyChoose,
  journey,
  featuredJourney,
  footer,
  testimonial,
  testimonialSettings,
  blockContent,
  ctaBanner,
  techStack,
  projectPortal,
]
