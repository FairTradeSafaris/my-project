// Existing imports
import blog from '../schemas/blog'
import hero from '../schemas/hero'
import whyChoose from '../schemas/whyChoose'
import journey from '../schemas/journey'
import featuredJourney from '../schemas/featuredJourney'
import footer from '../schemas/footer'
import testimonial from '../schemas/testimonial'
import blockContent from '../schemas/blockContent'
import ctaBanner from '../schemas/ctaBanner'
import techStack from '../schemas/techStack'
import projectPortal from '../schemas/projectPortal'
import destination from '../schemas/destination'
import privacyPolicy from '../schemas/privacyPolicy'
import megamenu from '../schemas/megaMenu'
import sitePages from '../schemas/sitePages'
import ambassador from '../schemas/ambassador'
import globalsettings from '../schemas/globalSettings'
import comments from '../schemas/comments'
import team from '../schemas/teamMember'

// 🆕 Modular Blocks (must match names from ./blocks)
import table from '../schemas/objects/table'
import heroImage from '../schemas/blocks/heroImage'
import textImage from '../schemas/blocks/textImage'
import quoteBlock from '../schemas/blocks/quoteBlock'
import galleryBlock from '../schemas/blocks/galleryBlock'
import videoEmbed from '../schemas/blocks/videoEmbed'
import textBlock from '../schemas/blocks/textBlock'
import ctaBlock from '../schemas/blocks/ctaBlock'
import mapBlock from '../schemas/blocks/mapBlock'
import zohoForm from '../schemas/blocks/zohoForm'
import smartCarousel from '../schemas/blocks/smartCarousel'
import teamMember from '../schemas/teamMember'
import foundersPromise from '../schemas/founderPromise'
import dest_slug from '../schemas/dest_slug'

export const schemaTypes = [
  blog,
  comments,
  hero,
  whyChoose,
  journey,
  featuredJourney,
  footer,
  testimonial,

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
  dest_slug,
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
