import {StructureBuilder} from 'sanity/desk'
import filterLabels from './schemas/settings/filterLabels'
import leadMagnetPopup from './schemas/leadMagnetPopup'

export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // 🏠 Home Page
      // 🏠 Home Page
      // 🏠 Home Page (SINGLETON)
      S.listItem()
        .title('🏠 Home Page')
        .child(S.editor().schemaType('homePage').documentId('homePage')),

      // 📝 Blog Setup
      S.listItem()
        .title('📝 Blog Setup')
        .child(
          S.list()
            .title('Blog Setup')
            .items([
              S.documentTypeListItem('blog').title('📝 Blog'),
              S.documentTypeListItem('comment').title('💬 Comments'),
              S.documentTypeListItem('author').title('✍️ Author'),
              S.documentTypeListItem('tag').title('🏷️ Tags'),
              S.documentTypeListItem('category').title('Category'),
            ]),
        ),
      // 🏛️ Core / Flagship Pages
      S.listItem()
        .title('🏛️ Core Pages')
        .child(
          S.list()
            .title('Core Commercial Pages')
            .items([S.documentTypeListItem('pillarPage').title('Pillar Pages')]),
        ),
      // 👥 People
      S.listItem()
        .title('👥 People')
        .child(
          S.list()
            .title('People & Partners')
            .items([
              S.documentTypeListItem('teamMember').title('Team Members'),
              S.documentTypeListItem('teamPage').title('Team Page Setup'),
              S.documentTypeListItem('ambassador').title('Ambassadors'),
              S.documentTypeListItem('nonProfit').title('Non-Profit Partners'),
            ]),
        ),

      // 📦 Modular Blocks
      S.listItem()
        .title('📦 Modular Blocks')
        .child(
          S.list()
            .title('Blocks')
            .items([
              S.documentTypeListItem('heroImage').title('Hero Image Block'),
              S.documentTypeListItem('textImage').title('Text & Image Block'),
              S.documentTypeListItem('quoteBlock').title('Quote Block'),
              S.documentTypeListItem('galleryBlock').title('Gallery Block'),
              S.documentTypeListItem('videoEmbed').title('Video Embed'),
              S.documentTypeListItem('textBlock').title('Text Block'),
              S.documentTypeListItem('ctaBlock').title('CTA Block'),
              S.documentTypeListItem('mapBlock').title('Map Block'),
              S.documentTypeListItem('zohoForm').title('Zoho Form Block'),
              S.documentTypeListItem('smartCarousel').title('Smart Carousel'),
            ]),
        ),

      // ⚙️ Settings
      S.listItem()
        .title('⚙️ Settings')
        .child(
          S.list()
            .title('Global Settings')
            .items([
              S.documentTypeListItem('globalSettings').title('Global Settings'),
              S.documentTypeListItem('hero').title('HEro Setup'),
              S.documentTypeListItem('megaMenu').title('Mega Menu'),
              S.documentTypeListItem('privacyPolicy').title('Privacy Policy'),
              S.documentTypeListItem('footer').title('Footer'),

              S.documentTypeListItem('filterLabels').title('Filter Labels'),
              S.documentTypeListItem('redirect').title('Redirects'),

              // ✅ NEW: Lead Magnet Popup
              S.documentTypeListItem('leadMagnetPopup').title('Lead Magnet Popup'),

              S.listItem()
                .title('Travel Interests')
                .schemaType('travelInterest')
                .child(
                  S.documentList()
                    .title('Travel Interests')
                    .filter('_type == "travelInterest"')
                    .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
                ),
            ]),
        ),

      // 🌍 Destinations
      S.listItem()
        .title('🌍 Destinations')
        .child(
          S.list()
            .title('Locations')
            .items([
              S.documentTypeListItem('destination').title('Destinations'),
              S.documentTypeListItem('region').title('Regions'),
              S.documentTypeListItem('country').title('Countries'),
              S.documentTypeListItem('featuredJourney').title('Featured Journeys'),
              S.documentTypeListItem('customJourneyCta').title('Custom Journey CTA'),
              S.documentTypeListItem('dest_slug').title('Destination Slugs'),
              S.listItem()
                .title('🧭 Journeys')
                .child(S.documentTypeList('journey').title('Journeys')),
            ]),
        ),

      // 📬 Contact Us
      S.listItem()
        .title('📬 Contact Us')
        .child(
          S.editor()
            .id('contactSettings')
            .schemaType('contactSettings')
            .documentId('contactSettings'),
        ),

      // 🧑‍💼 User Activity
      S.listItem()
        .title('🧑‍💼 User Activity')
        .child(
          S.list()
            .title('User Activity')
            .items([
              S.documentTypeListItem('leadMagnetClaim').title('Lead Magnet Downloads'),
              S.documentTypeListItem('travelInterest').title('Travel Interest Form'),
              S.documentTypeListItem('wishlist').title('User Wishlists'),
            ]),
        ),

      // 📚 Media & Testimonials
      S.listItem()
        .title('📚 Media & Testimonials')
        .child(
          S.list()
            .title('Media & Testimonials')
            .items([
              S.documentTypeListItem('videoTestimonial').title('Video Testimonials'),
              S.documentTypeListItem('galleryImage').title('Gallery Images'),
              S.documentTypeListItem('book').title('Books'),
            ]),
        ),

      // 🌍 Travel & Trip Details
      S.listItem()
        .title('🌍 Travel Details')
        .child(
          S.list()
            .title('Trips & Experiences')
            .items([
              S.documentTypeListItem('trip').title('Trip Info'),

              // ✅ NEW: Best Time Section
              S.documentTypeListItem('bestTimeSection').title('Best Time Section'),
            ]),
        ),

      // ❓ FAQs
      S.listItem()
        .title('❓ FAQs')
        .child(
          S.list()
            .title('FAQs')
            .items([
              S.documentTypeListItem('faqQuestion').title('FAQ Questions'),
              S.documentTypeListItem('faqCategory').title('FAQ Categories'),
            ]),
        ),
    ])

export default myStructure
