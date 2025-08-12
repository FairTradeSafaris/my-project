export const faqCategoriesQuery = /* groq */ `
*[_type == "faqCategory"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  // Prefer manually curated list; otherwise pull linked questions via backrefs
  "items": coalesce(
    questions[]->{
      _id, question, keywords, order
    } | order(order asc)[0...6],
    *[_type=="faqQuestion" && references(^._id)]{
      _id, question, keywords, order
    } | order(order asc, question asc)[0...6]
  )
}
`;
