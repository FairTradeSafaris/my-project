export const faqCategoriesQuery = /* groq */ `
*[_type == "faqCategory"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  "items": coalesce(
    questions[]->{
      _id, question, answer, keywords, order
    } | order(order asc)[0...6],
    *[_type=="faqQuestion" && references(^._id)]{
      _id, question, answer, keywords, order
    } | order(order asc, question asc)[0...6]
  )
}
`;
