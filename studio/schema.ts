import blog from './schemas/blog'
import footer from './schemas/footer'
import ctaBanner from './schemas/ctaBanner'
import techStack from './schemas/techStack'
import projectPortal from './schemas/projectPortal'
import testimonial from './schemas/testimonial'
import hero from './schemas/hero'
import journey from './schemas/journey'
import blockContent from './schemas/blockContent'
import region from './schemas/region'
import country from './schemas/country'
import featuredJourney from './schemas/featuredJourney'
import whyChoose from './schemas/whyChoose'
import destination from './schemas/destination'
import megamenu from './schemas/megaMenu'
import sitePages from './schemas/sitePages'
import ambassador from './schemas/ambassador'
import globalsettings from './schemas/globalSettings'
import comments from './schemas/comments'
import privacyPolicy from './schemas/privacyPolicy'
import table from './schemas/objects/table'

// 🆕 Modular Content Blocks
import heroImage from './schemas/blocks/heroImage'
import textImage from './schemas/blocks/textImage'
import quoteBlock from './schemas/blocks/quoteBlock'
import galleryBlock from './schemas/blocks/galleryBlock'
import videoEmbed from './schemas/blocks/videoEmbed'
import textBlock from './schemas/blocks/textBlock'
import ctaBlock from './schemas/blocks/ctaBlock'
import mapBlock from './schemas/blocks/mapBlock'
import zohoForm from './schemas/blocks/zohoForm'
import smartCarousel from './schemas/blocks/smartCarousel'
import author from './schemas/author'
import teamMember from './schemas/teamMember'
import foundersPromise from './schemas/founderPromise'
import dest_slug from './schemas/dest_slug'

const schemaTypes = [
  blog,
  comments,
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
  dest_slug,
  privacyPolicy,
  megamenu,
  sitePages,
  ambassador,
  globalsettings,
  // ⬇️ Registering new blocks
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
  author,
  teamMember,
  foundersPromise,
]

// ✅ This is the only change:
export default schemaTypes
