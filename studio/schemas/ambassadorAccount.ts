// studio/schemas/ambassadorAccount.ts (batch 24, new type only)
// One document per approved ambassador. It links their referral code to
// their website login. Only the code and the login ID (Clerk user ID) are
// stored: no names, emails, phone numbers or money. Those stay in Zoho.
//
// How it works:
//  1. Devon creates an account here with the code (e.g. JANE25) and publishes.
//  2. The ambassador signs in on the website and enters the code once at
//     /client-home/ambassador/. The website fills in "Website login ID" and
//     "Claimed on", and emails the team the person's verified email.
//  3. Devon checks that email is the right person, ticks "Link approved"
//     and publishes. Their dashboard opens straight away.
import {defineField, defineType} from 'sanity'

const CODE_RE = /^[A-Z0-9_-]{2,32}$/

export default defineType({
  name: 'ambassadorAccount',
  title: 'Ambassador Account',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Referral code',
      type: 'string',
      description:
        'Capital letters and numbers, e.g. JANE25. This is the code in their link (?ref=JANE25) and the one they type when they claim their account.',
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (typeof value !== 'string') return true
          if (!CODE_RE.test(value)) return 'Use 2–32 capital letters, numbers, - or _ (no spaces).'
          const client = context.getClient({apiVersion: '2023-08-01'})
          const id = String(context.document?._id || '').replace(/^drafts\./, '')
          const dupes = await client.fetch(
            `count(*[_type == "ambassadorAccount" && upper(code) == $code && !(_id in [$id, "drafts." + $id])])`,
            {code: value.toUpperCase(), id},
          )
          return dupes > 0 ? 'Another ambassador account already uses this code.' : true
        }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Paused', value: 'paused'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      description: 'Paused: they can still sign in, but their dashboard says the account is paused.',
    }),
    defineField({
      name: 'linkApproved',
      title: 'Link approved',
      type: 'boolean',
      initialValue: false,
      description:
        'Tick this after checking the claim email from the website (the email address belongs to this ambassador). Their dashboard opens once this is ticked and published.',
    }),
    defineField({
      name: 'clerkUserId',
      title: 'Website login ID',
      type: 'string',
      description:
        'Filled in by the website when the ambassador claims the code. To undo a wrong claim: clear this, untick "Link approved" and publish.',
    }),
    defineField({
      name: 'claimedAt',
      title: 'Claimed on',
      type: 'datetime',
      readOnly: true,
      description: 'Filled in by the website.',
    }),
    defineField({
      name: 'profile',
      title: 'Public ambassador profile (optional)',
      type: 'reference',
      to: [{type: 'ambassador'}],
      description: 'Only if they also have a page under Ambassadors & Collaborators.',
    }),
  ],
  orderings: [{title: 'Code A–Z', name: 'codeAsc', by: [{field: 'code', direction: 'asc'}]}],
  preview: {
    select: {code: 'code', status: 'status', approved: 'linkApproved', uid: 'clerkUserId'},
    prepare({code, status, approved, uid}) {
      const state = !uid ? 'Waiting for claim' : approved ? 'Linked' : 'Claimed – needs approval'
      return {
        title: code || 'New ambassador account',
        subtitle: `${state}${status === 'paused' ? ' · Paused' : ''}`,
      }
    },
  },
})
