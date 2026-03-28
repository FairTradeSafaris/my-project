// schemas/journeySteps.ts

export default {
  name: 'journeySteps',
  title: 'Journey Steps',
  type: 'object',
  fields: [
    {
      name: 'headline',
      type: 'string',
      title: 'Headline',
    },
    {
      name: 'intro',
      type: 'text',
      title: 'Intro Text',
    },
    {
      name: 'steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string'},
            {name: 'description', type: 'text'},
          ],
        },
      ],
    },
  ],
}
