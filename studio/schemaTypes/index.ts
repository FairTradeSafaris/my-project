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
import foundersPromise from '../schemas/founderPromise'
import dest_slug from '../schemas/dest_slug'
import faqQuestion from '../schemas/faqQuestion'
import faqCategory from '../schemas/faqCategory'
import nonProfit from '../schemas/nonProfit'
import redirect from '../schemas/redirect'
import organization from '../schemas/organization'
import customJourneyCta from '../schemas/customJourneyCta' // ✅ NEW
import tag from '../schemas/tag'
import {imageOrGallery} from '../schemas/objects/imageOrGallery'
import leadMagnetPopup from '../schemas/leadMagnetPopup'
import pillarPage from '../schemas/pillarPage'
import teamPage from '../schemas/teamPage'
import category from '../schemas/category'
import safariBuilderBlock from '../schemas/blocks/safariBuilderBlock'

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
  team,
  foundersPromise,
  faqQuestion,
  faqCategory,
  nonProfit,
  redirect,
  organization,
  customJourneyCta,
  tag,
  imageOrGallery,
  leadMagnetPopup,
  pillarPage,
  teamPage,
  category,
  safariBuilderBlock,
]
