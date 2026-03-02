export const faqCategoriesQuery = /* groq */ `
*[_type == "faqCategory"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  "items": coalesce(
    questions[]->{
      _id, question, answer, keywords, order
    } | order(order asc),
    *[_type=="faqQuestion" && references(^._id)]{
      _id, question, answer, keywords, order
    } | order(order asc, question asc)
  )
}
`;
export const journeyFilterBoundsQuery = /* groq */ `
*[_type == "journey"]{
  price,
  duration
}
`;
