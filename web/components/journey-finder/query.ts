// Batch 16: the itinerary finder's journey query, shared by the server page
// (app/africansafariitineraries/page.tsx) and the client finder.
export const JOURNEY_FINDER_QUERY = `*[_type == "journey" && (isActive != false)]{
          _id,
          title,
          slug,
          summary,
          duration,
          price,
          star,
          "starIcon": starIcon.asset->url,
          region->{ title },
          destinations[]->{ title, region },
          "interests": travelStyleRefs[]->{ title, isTopInterest, category },
          "heroUrl": heroImage.asset->url,
          alt,
          featuredOnHome
        }`;
