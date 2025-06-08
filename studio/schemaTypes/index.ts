import post from '../.sanity/schemas/post'
import hero from '../.sanity/schemas/hero'
import whyChoose from '../.sanity/schemas/whyChoose'
import journey from '../.sanity/schemas/journey'
import featuredJourney from '../.sanity/schemas/featuredJourney'
import footer from '../.sanity/schemas/footer' // ✅ Add this line

export const schemaTypes = [
  post,
  hero,
  whyChoose,
  journey,
  featuredJourney,
  footer, // ✅ And register it here
]
