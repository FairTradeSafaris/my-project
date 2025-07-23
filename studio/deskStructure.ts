// studio/deskStructure.ts

import {StructureBuilder} from 'sanity/desk'

export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Home Page Group
      S.listItem()
        .title('🏠 Home Page')
        .child(
          S.list()
            .title('Home Sections')
            .items([
              S.documentTypeListItem('hero').title('Hero Section'),
              S.documentTypeListItem('whyChoose').title('Why Choose Section'),
              S.documentTypeListItem('foundersPromise').title("Founder's Promise"),
              S.documentTypeListItem('ctaBanner').title('CTA Banner'),
              S.documentTypeListItem('journey').title('Featured Journeys'),
              S.documentTypeListItem('testimonial').title('Testimonials'),
              S.documentTypeListItem('sitePages').title('SEO / Meta Settings'),
            ]),
        ),

      // Blog
      S.listItem()
        .title('📝 Blog Setup')
        .child(
          S.list()
            .title('Blog Setup')
            .items([
              S.documentTypeListItem('blog').title('📝 Blog'),
              S.documentTypeListItem('comment').title('💬 Comments'),
              S.documentTypeListItem('author').title('💬 Author'),
            ]),
        ),

      // People Group
      S.listItem()
        .title('👥 People')
        .child(
          S.list()
            .title('Team & Ambassadors')
            .items([
              S.documentTypeListItem('teamMember').title('Team Members'),
              S.documentTypeListItem('ambassador').title('Ambassadors'),
            ]),
        ),

      // Content Blocks
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

      // Settings
      S.listItem()
        .title('⚙️ Settings')
        .child(
          S.list()
            .title('Global Settings')
            .items([
              S.documentTypeListItem('globalSettings').title('Global Settings'),
              S.documentTypeListItem('megaMenu').title('Mega Menu'),
              S.documentTypeListItem('privacyPolicy').title('Privacy Policy'),
            ]),
        ),

      // Geography
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
              S.documentTypeListItem('dest_slug').title('Destination Slugs'),
            ]),
        ),

      // Comments

      // Catch-all: Show all remaining types not listed above
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'hero',
            'whyChoose',
            'foundersPromise',
            'ctaBanner',
            'journey',
            'testimonial',
            'sitePages',
            'blog',
            'teamMember',
            'ambassador',
            'heroImage',
            'textImage',
            'quoteBlock',
            'galleryBlock',
            'videoEmbed',
            'textBlock',
            'ctaBlock',
            'mapBlock',
            'zohoForm',
            'smartCarousel',
            'globalsettings',
            'megaMenu',
            'privacyPolicy',
            'destination',
            'region',
            'country',
            'featuredJourney',
            'dest_slug',
            'comment',
            'author',
          ].includes(listItem.getId() ?? ''),
      ),
    ])
export default myStructure
