// Batch 4: footer query shared by the root layout (server-side fetch, so the
// footer links are in the HTML) and SafariFactFooter (client fallback).
// Same fields as before.
export const FOOTER_QUERY = `*[_type == "footer"][0]{
            facts,
            lineArt{asset},
            logo{asset},
            logoSmall{asset},
            exploreLinks,
            socialLinks[]{
              platform,
              icon{asset},
              alt,
              url
            },
            connectLinks
          }`;
