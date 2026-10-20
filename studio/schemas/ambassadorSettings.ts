// studio/schemas/ambassadorSettings.ts
// NEW (batch 12). Singleton that drives the Ambassador / affiliate programme
// page (/affiliate-program) and the "Become an Ambassador" strip on
// /ambassadors. Separate from the existing "ambassador" type (the showcase
// profiles), which is NOT changed.
//
// Every field has a starting value (initialValue), and the website also has
// its own fallback for every field, so nothing ever shows blank. Keep these
// defaults in step with web/lib/ambassadorSettings.ts (DEFAULTS).

/* eslint-disable @typescript-eslint/no-explicit-any */
const D = {
  "enabled": true,
  "commissionPercent": 5,
  "excludedText": "international flights, park fees and visas",
  "friendDiscount": 250,
  "minTripValue": 5000,
  "friendDiscountMinText": "Applies to their first safari of US${minTrip} or more",
  "groupMinGuests": 8,
  "groupRuleText": "Host a group of {groupMin} or more paying guests and your own place on the safari is covered, instead of commission on that trip.",
  "cookieDays": 90,
  "minPayout": 50,
  "payoutTerms": "Commission is earned when your referral pays their deposit, and paid 30 days after they return home. We pay monthly once at least US${minPayout} is owed.",
  "heroEyebrow": "The Fair Trade Safaris Ambassador Programme",
  "heroTitle": "Become a Fair Trade Safaris Ambassador",
  "heroSubtitle": "Share the Africa you love. Earn {commission}% on every safari you refer, and your friends get US${discount} off their first trip.",
  "introTitle": "Your stories brought you here. Now they can bring others.",
  "introText": "Our safari affiliate program is built for people, not platforms. Past guests, travel creators and community leaders recommend the safaris they believe in, and we look after every detail of the custom journey. You earn {commission}% of the safari package, your friend gets US${discount} off, and every trip supports local guides and communities.",
  "stepsTitle": "How it works",
  "steps": [
    {
      "_key": "steps1",
      "_type": "ambassadorStep",
      "title": "Apply in two minutes",
      "text": "Tell us a little about you and the people you'd share with. We read every application personally and reply within a few working days."
    },
    {
      "_key": "steps2",
      "_type": "ambassadorStep",
      "title": "Share your link",
      "text": "You get a personal code and link. Anyone who enquires within {days} days of clicking is linked to you, and your friends get US${discount} off."
    },
    {
      "_key": "steps3",
      "_type": "ambassadorStep",
      "title": "Earn {commission}%",
      "text": "When your referral books, you earn {commission}% of their safari package. We pay you after they're home with their stories."
    }
  ],
  "calculatorTitle": "See what you could earn",
  "calculatorText": "Slide to a typical custom safari and how many friends might book in a year. Commission is on the safari package, not {excluded}.",
  "whoTitle": "Who it's for",
  "whoFor": [
    {
      "_key": "whoFor4",
      "_type": "ambassadorAudience",
      "title": "Past guests",
      "text": "You've been on safari with us and your friends keep asking about it."
    },
    {
      "_key": "whoFor5",
      "_type": "ambassadorAudience",
      "title": "Travel creators",
      "text": "Bloggers, photographers and storytellers with an audience that loves meaningful travel."
    },
    {
      "_key": "whoFor6",
      "_type": "ambassadorAudience",
      "title": "Group leaders",
      "text": "Clubs, churches, alumni and community groups who'd love to travel together."
    },
    {
      "_key": "whoFor7",
      "_type": "ambassadorAudience",
      "title": "Wildlife lovers",
      "text": "Conservation and photography people who want their trips to do some good."
    }
  ],
  "impactTitle": "Every safari you share does some good",
  "impactPoints": [
    {
      "_key": "impactPoints8",
      "_type": "ambassadorImpactPoint",
      "title": "Locally guided",
      "text": "Your referrals travel with local guides and partners who know the land best."
    },
    {
      "_key": "impactPoints9",
      "_type": "ambassadorImpactPoint",
      "title": "Fair by design",
      "text": "Fair pay and fair partnerships are built into every safari we plan."
    },
    {
      "_key": "impactPoints10",
      "_type": "ambassadorImpactPoint",
      "title": "Community first",
      "text": "Each journey supports the communities and wildlife that make Africa extraordinary."
    }
  ],
  "formTitle": "Apply to become an ambassador",
  "formIntro": "No big following needed, just a genuine love for Africa. We'll be in touch within a few working days with your personal code and link.",
  "closedText": "Applications are paused for now. Leave us a note on the contact page and we'll let you know when they reopen.",
  "faqTitle": "Questions, answered",
  "faqs": [
    {
      "_key": "faqs11",
      "_type": "ambassadorFaq",
      "question": "Who can become an ambassador?",
      "answer": "Anyone who loves Africa and travel that does good: past guests, travel creators, group leaders and wildlife lovers. You don't need a big following."
    },
    {
      "_key": "faqs12",
      "_type": "ambassadorFaq",
      "question": "How much can I earn?",
      "answer": "{commission}% of the safari package your referral books, not including {excluded}. On a US${exampleTrip} safari that's US${exampleEarn}."
    },
    {
      "_key": "faqs13",
      "_type": "ambassadorFaq",
      "question": "What does my friend get?",
      "answer": "US${discount} off their first safari of US${minTrip} or more when they book through your link or code."
    },
    {
      "_key": "faqs14",
      "_type": "ambassadorFaq",
      "question": "How long does my link last?",
      "answer": "{days} days from the moment someone clicks it. Your friend can also give your code when they enquire, by form, phone or WhatsApp."
    },
    {
      "_key": "faqs15",
      "_type": "ambassadorFaq",
      "question": "When do I get paid?",
      "answer": "Commission is earned when your referral pays their deposit, and paid 30 days after they return home. We pay monthly once at least US${minPayout} is owed."
    },
    {
      "_key": "faqs16",
      "_type": "ambassadorFaq",
      "question": "What if I bring a whole group?",
      "answer": "Host {groupMin} or more paying guests and your own place on the safari is covered, instead of commission on that trip."
    },
    {
      "_key": "faqs17",
      "_type": "ambassadorFaq",
      "question": "Does it cost anything to join?",
      "answer": "No. It's free to join and there's nothing to buy."
    }
  ],
  "terms": [
    {
      "_type": "block",
      "_key": "t1",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t1s",
          "text": "Commission is {commission}% of the safari package price paid by the client you refer. It does not include {excluded}, taxes or third-party fees.",
          "marks": []
        }
      ]
    },
    {
      "_type": "block",
      "_key": "t2",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t2s",
          "text": "A referral counts when a new client enquires within {days} days of clicking your link, or gives your referral code when they enquire.",
          "marks": []
        }
      ]
    },
    {
      "_type": "block",
      "_key": "t3",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t3s",
          "text": "Commission is earned when the client pays their deposit and becomes payable 30 days after they return home. No commission is due on any amount that is cancelled or refunded.",
          "marks": []
        }
      ]
    },
    {
      "_type": "block",
      "_key": "t4",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t4s",
          "text": "We pay monthly once at least US${minPayout} is owed to you.",
          "marks": []
        }
      ]
    },
    {
      "_type": "block",
      "_key": "t5",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t5s",
          "text": "Your friend's US${discount} discount applies once per new client, on a first booking of US${minTrip} or more, and cannot be combined with other offers.",
          "marks": []
        }
      ]
    },
    {
      "_type": "block",
      "_key": "t6",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t6s",
          "text": "Group hosts: when you host {groupMin} or more paying guests, your own place is covered instead of commission on that trip.",
          "marks": []
        }
      ]
    },
    {
      "_type": "block",
      "_key": "t7",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "t7s",
          "text": "Please don't bid on the Fair Trade Safaris name in paid search, make claims we haven't agreed, or send spam. We may update or end the programme or an ambassadorship at any time; commission you have already earned will still be paid.",
          "marks": []
        }
      ]
    }
  ],
  "stripTitle": "Love Africa as much as we do?",
  "stripText": "Join our Ambassador Programme. Earn {commission}% on every safari you refer, and your friends get US${discount} off their first trip.",
  "stripButtonLabel": "Become an Ambassador",
  "seoTitle": "Safari Affiliate & Ambassador Program – Earn {commission}% | Fair Trade Safaris",
  "seoDescription": "Join our safari affiliate and ambassador programme. Earn {commission}% on every safari you refer, and your friends get ${discount} off."
}

const ambassadorSettings = {
  name: 'ambassadorSettings',
  title: 'Ambassador Settings',
  type: 'document',
  groups: [
    {name: 'programme', title: 'Programme rules', default: true},
    {name: 'page', title: 'Page content'},
    {name: 'faq', title: 'FAQs & terms'},
    {name: 'strip', title: 'Ambassadors page strip'},
    {name: 'seo', title: 'SEO'},
    {name: 'earnings', title: 'Earnings rules'}, // batch 28
  ],
  fields: [
    // ── Programme rules ──
    {
      name: 'enabled',
      title: "Programme open for applications",
      type: 'boolean',
      group: 'programme',
      description: "Switch off to pause new applications. The page stays up and says applications are paused.",
      initialValue: D.enabled,
    },
    {
      name: 'commissionPercent',
      title: "Commission (%)",
      type: 'number',
      group: 'programme',
      validation: (R: any) => R.required().min(0).max(50),
      description: "Percentage of the safari package the ambassador earns. Example: 5",
      initialValue: D.commissionPercent,
    },
    {
      name: 'excludedText',
      title: "What the commission does not include",
      type: 'string',
      group: 'programme',
      description: "Lower case, reads inside a sentence. Example: international flights, park fees and visas",
      initialValue: D.excludedText,
    },
    {
      name: 'friendDiscount',
      title: "Friend's discount (US$)",
      type: 'number',
      group: 'programme',
      validation: (R: any) => R.required().min(0),
      description: "Amount off a referred friend's first booking. Example: 250",
      initialValue: D.friendDiscount,
    },
    {
      name: 'minTripValue',
      title: "Friend's discount: minimum trip value (US$)",
      type: 'number',
      group: 'programme',
      validation: (R: any) => R.required().min(0),
      description: "The friend discount only applies to bookings of at least this much. Example: 5000",
      initialValue: D.minTripValue,
    },
    {
      name: 'friendDiscountMinText',
      title: "Friend's discount wording",
      type: 'string',
      group: 'programme',
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.friendDiscountMinText,
    },
    {
      name: 'groupMinGuests',
      title: "Group rule: paying guests needed",
      type: 'number',
      group: 'programme',
      validation: (R: any) => R.required().min(1).max(500),
      description: "Example: 8",
      initialValue: D.groupMinGuests,
    },
    {
      name: 'groupRuleText',
      title: "Group rule wording",
      type: 'text',
      group: 'programme',
      rows: 2,
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.groupRuleText,
    },
    {
      name: 'cookieDays',
      title: "Referral link lasts (days)",
      type: 'number',
      group: 'programme',
      validation: (R: any) => R.required().min(1).max(365),
      description: "How long a click on an ambassador link is remembered. Example: 90",
      initialValue: D.cookieDays,
    },
    {
      name: 'minPayout',
      title: "Minimum payout (US$)",
      type: 'number',
      group: 'programme',
      validation: (R: any) => R.required().min(0),
      description: "We pay once at least this much is owed. Example: 50",
      initialValue: D.minPayout,
    },
    {
      name: 'payoutTerms',
      title: "How ambassadors get paid",
      type: 'text',
      group: 'programme',
      rows: 3,
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.payoutTerms,
    },
    // ── Page content ──
    {
      name: 'heroEyebrow',
      title: "Hero small heading",
      type: 'string',
      group: 'page',
      initialValue: D.heroEyebrow,
    },
    {
      name: 'heroTitle',
      title: "Hero title",
      type: 'string',
      group: 'page',
      initialValue: D.heroTitle,
    },
    {
      name: 'heroSubtitle',
      title: "Hero subtitle",
      type: 'text',
      group: 'page',
      rows: 3,
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.heroSubtitle,
    },
    {
      name: 'heroImage',
      title: "Hero image",
      type: 'image',
      group: 'page',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text (describe the photo)', type: 'string'}],
      description: "Large landscape photo, at least 2000px wide. Leave empty to use the cheetah photo.",
    },
    {
      name: 'introTitle',
      title: "Intro heading",
      type: 'string',
      group: 'page',
      initialValue: D.introTitle,
    },
    {
      name: 'introText',
      title: "Intro paragraph",
      type: 'text',
      group: 'page',
      rows: 4,
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.introText,
    },
    {
      name: 'stepsTitle',
      title: "How it works: heading",
      type: 'string',
      group: 'page',
      initialValue: D.stepsTitle,
    },
    {
      name: 'steps',
      title: "How it works: steps",
      type: 'array',
      group: 'page',
      of: [
        {
          type: 'object',
          name: 'ambassadorStep',
          fields: [
            {name: 'title', title: 'Title', type: 'string', validation: (R: any) => R.required()},
            {name: 'text', title: 'Text', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        },
      ],
      validation: (R: any) => R.min(1).max(6),
      description: "Three steps look best. Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.steps,
    },
    {
      name: 'calculatorTitle',
      title: "Earnings calculator: heading",
      type: 'string',
      group: 'page',
      initialValue: D.calculatorTitle,
    },
    {
      name: 'calculatorText',
      title: "Earnings calculator: text",
      type: 'text',
      group: 'page',
      rows: 2,
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.calculatorText,
    },
    {
      name: 'whoTitle',
      title: "Who it's for: heading",
      type: 'string',
      group: 'page',
      initialValue: D.whoTitle,
    },
    {
      name: 'whoFor',
      title: "Who it's for: cards",
      type: 'array',
      group: 'page',
      of: [
        {
          type: 'object',
          name: 'ambassadorAudience',
          fields: [
            {name: 'title', title: 'Title', type: 'string', validation: (R: any) => R.required()},
            {name: 'text', title: 'Text', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        },
      ],
      validation: (R: any) => R.max(6),
      description: "Four cards look best.",
      initialValue: D.whoFor,
    },
    {
      name: 'impactTitle',
      title: "Impact band: heading",
      type: 'string',
      group: 'page',
      initialValue: D.impactTitle,
    },
    {
      name: 'impactQuote',
      title: "Impact band: quote (optional)",
      type: 'object',
      group: 'page',
      fields: [
        {name: 'quote', title: 'Quote', type: 'text', rows: 3},
        {name: 'name', title: 'Name', type: 'string'},
        {name: 'role', title: 'Role / trip', type: 'string'},
        {name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}},
      ],
      description: "Only add a REAL quote from a past guest or ambassador, with their OK. Leave empty to show the impact points instead.",
    },
    {
      name: 'impactPoints',
      title: "Impact band: points",
      type: 'array',
      group: 'page',
      of: [
        {
          type: 'object',
          name: 'ambassadorImpactPoint',
          fields: [
            {name: 'title', title: 'Title', type: 'string', validation: (R: any) => R.required()},
            {name: 'text', title: 'Text', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        },
      ],
      validation: (R: any) => R.max(4),
      description: "Shown when there is no quote. Three look best.",
      initialValue: D.impactPoints,
    },
    {
      name: 'formTitle',
      title: "Application form: heading",
      type: 'string',
      group: 'page',
      initialValue: D.formTitle,
    },
    {
      name: 'formIntro',
      title: "Application form: intro",
      type: 'text',
      group: 'page',
      rows: 3,
      initialValue: D.formIntro,
    },
    {
      name: 'closedText',
      title: "Text when applications are paused",
      type: 'text',
      group: 'page',
      rows: 2,
      initialValue: D.closedText,
    },
    // ── FAQs & terms ──
    {
      name: 'faqTitle',
      title: "FAQ heading",
      type: 'string',
      group: 'faq',
      initialValue: D.faqTitle,
    },
    {
      name: 'faqs',
      title: "FAQs",
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          name: 'ambassadorFaq',
          fields: [
            {name: 'question', title: 'Question', type: 'string', validation: (R: any) => R.required()},
            {name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (R: any) => R.required()},
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        },
      ],
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above. Also {exampleTrip} and {exampleEarn} (US$10,000 and its commission).",
      initialValue: D.faqs,
    },
    {
      name: 'terms',
      title: "Programme terms",
      type: 'array',
      group: 'faq',
      of: [{type: 'block'}],
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.terms,
    },
    // ── Strip on /ambassadors ──
    {
      name: 'stripTitle',
      title: "Strip heading",
      type: 'string',
      group: 'strip',
      initialValue: D.stripTitle,
    },
    {
      name: 'stripText',
      title: "Strip text",
      type: 'text',
      group: 'strip',
      rows: 2,
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.stripText,
    },
    {
      name: 'stripButtonLabel',
      title: "Strip button label",
      type: 'string',
      group: 'strip',
      initialValue: D.stripButtonLabel,
    },
    {
      name: 'stripImage',
      title: "Strip image (optional)",
      type: 'image',
      group: 'strip',
      options: {hotspot: true},
      description: "Leave empty to use the default safari photo.",
    },
    // ── Earnings rules (batch 28, new optional fields; empty = website default) ──
    {
      name: 'earnBasis',
      title: 'How commission is worked out',
      type: 'string',
      group: 'earnings',
      options: {
        list: [
          {title: '% of trip price', value: 'percentTrip'},
          {title: '% of profit (needs a Profit number field on Zoho Deals)', value: 'percentProfit'},
          {title: 'Fixed amount per booking (US$)', value: 'fixed'},
        ],
        layout: 'radio',
      },
      description: 'Empty = % of trip price. Used on the ambassador dashboard to work out each Zoho Deal (trip price = Deal Amount).',
    },
    {
      name: 'earnValue',
      title: 'Commission value',
      type: 'number',
      group: 'earnings',
      validation: (R: any) => R.min(0),
      description:
        'The % (for "% of trip price" or "% of profit") or the US$ amount (for "Fixed amount"). Empty = the Commission % under Programme rules.',
    },
    {
      name: 'earnWhen',
      title: 'When commission is earned',
      type: 'string',
      group: 'earnings',
      options: {
        list: [
          {title: 'When the friend pays their deposit', value: 'deposit'},
          {title: 'When the friend has paid in full', value: 'fullPayment'},
          {title: 'After the friend has travelled', value: 'afterTravel'},
        ],
        layout: 'radio',
      },
      description: 'Empty = when paid in full. Shown to ambassadors as a plain sentence. In Zoho, a Deal counts as earned when its Stage is Closed Won.',
    },
    {
      name: 'payoutMethodsText',
      title: 'How ambassadors are paid',
      type: 'string',
      group: 'earnings',
      description: 'For example: "By PayPal, Wise or bank transfer, once a month." Empty = that sentence. (The minimum payout is under Programme rules.)',
    },
    {
      name: 'repeatBookingsEarn',
      title: 'Repeat bookings by the same friend earn commission again',
      type: 'boolean',
      group: 'earnings',
      description: 'Off (default): only a friend's first booking (first Zoho Deal for the same contact) earns commission.',
    },
    {
      name: 'rewardEnabled',
      title: 'Show a reward goal',
      type: 'boolean',
      group: 'earnings',
      description: 'Off (default): no reward goal on the dashboard.',
    },
    {
      name: 'rewardType',
      title: 'Reward goal is counted in',
      type: 'string',
      group: 'earnings',
      options: {
        list: [
          {title: 'Number of paid bookings', value: 'bookings'},
          {title: 'US$ value of paid bookings', value: 'value'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}: any) => !parent?.rewardEnabled,
    },
    {
      name: 'rewardTarget',
      title: 'Reward goal (number of bookings or US$)',
      type: 'number',
      group: 'earnings',
      validation: (R: any) => R.min(1),
      hidden: ({parent}: any) => !parent?.rewardEnabled,
    },
    {
      name: 'rewardLabel',
      title: 'Reward wording',
      type: 'string',
      group: 'earnings',
      description: 'For example: "A free safari for two".',
      hidden: ({parent}: any) => !parent?.rewardEnabled,
    },
    // ── SEO ──
    {
      name: 'seoTitle',
      title: "Google title",
      type: 'string',
      group: 'seo',
      validation: (R: any) => R.max(80).warning('Google shows about 60 characters'),
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.seoTitle,
    },
    {
      name: 'seoDescription',
      title: "Google description",
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (R: any) => R.max(170).warning('Google shows about 155 characters'),
      description: "Tokens you can use: {commission} {discount} {minTrip} {minPayout} {groupMin} {days} {excluded}. They fill in from the numbers above.",
      initialValue: D.seoDescription,
    },
  ],
  preview: {
    prepare: () => ({title: 'Ambassador Settings'}),
  },
}

export default ambassadorSettings
