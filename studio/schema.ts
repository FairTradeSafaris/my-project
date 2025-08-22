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

import {galleryImage} from './schemas/galleryImages'
import videoTestimonial from './schemas/videoTestimonial'

// 🆕 Modular Content Blocks
import heroImage from './schemas/blocks/heroImage'
import heroBlock from './schemas/blocks/heroBlock'
import privacyPolicy from './schemas/privacyPolicy'
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
import trip from './schemas/trip'
import book from './schemas/book'
import leadMagnetClaim from './schemas/leadMagnetClaim'
import faqQuestion from './schemas/faqQuestion'
import faqCategory from './schemas/faqCategory'
import travelInterest from './schemas/journeys/travelInterest'
import contactSettings from './schemas/contactSettings'
import filterLabels from './schemas/settings/filterLabels'

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
  galleryImage,
  heroBlock,
  trip,
  videoTestimonial,
  book,
  leadMagnetClaim,
  faqQuestion,
  faqCategory,
  travelInterest,
  contactSettings,
  filterLabels,
]

// ✅ This is the only change:
export default schemaTypes
