// Existing imports
import blog from '../.sanity/schemas/blog'
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
import destination from '../.sanity/schemas/destination'
import privacyPolicy from '../.sanity/schemas/privacyPolicy'
import megamenu from '../.sanity/schemas/megaMenu'
import sitePages from '../.sanity/schemas/sitePages'
import ambassador from '../.sanity/schemas/ambassador'
import globalsettings from '../.sanity/schemas/globalSettings'
import comments from '../.sanity/schemas/comments'
import team from '../.sanity/schemas/teamMember'

// 🆕 Modular Blocks (must match names from ./blocks)
import table from '../.sanity/schemas/objects/table'
import heroImage from '../.sanity/schemas/blocks/heroImage'
import textImage from '../.sanity/schemas/blocks/textImage'
import quoteBlock from '../.sanity/schemas/blocks/quoteBlock'
import galleryBlock from '../.sanity/schemas/blocks/galleryBlock'
import videoEmbed from '../.sanity/schemas/blocks/videoEmbed'
import textBlock from '../.sanity/schemas/blocks/textBlock'
import ctaBlock from '../.sanity/schemas/blocks/ctaBlock'
import mapBlock from '../.sanity/schemas/blocks/mapBlock'
import zohoForm from '../.sanity/schemas/blocks/zohoForm'
import smartCarousel from '../.sanity/schemas/blocks/smartCarousel'
import teamMember from '../.sanity/schemas/teamMember'
import foundersPromise from '../.sanity/schemas/founderPromise'

export const schemaTypes = [
  blog,
  comments,
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
  destination,
  privacyPolicy,
  megamenu,
  sitePages,
  ambassador,
  globalsettings,

  // 🧱 Register content blocks
  table,
  heroImage,
  textImage,
  quoteBlock,
  galleryBlock,
  videoEmbed,
  textBlock,
  ctaBlock,
  mapBlock,
  zohoForm,
  smartCarousel,
  teamMember,
  team,
  foundersPromise,
]
