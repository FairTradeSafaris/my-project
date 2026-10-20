// studio/schemas/ambassadorClickCount.ts (batch 26, new type only)
// Written by the website: one document per referral code per month, holding
// only how many visits came through that ambassador's ?ref= link. Nothing
// about the visitors is stored. Read-only here; nothing to fill in.
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ambassadorClickCount',
  title: 'Ambassador Link Visits',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'code', title: 'Referral code', type: 'string'}),
    defineField({name: 'month', title: 'Month (YYYY-MM)', type: 'string'}),
    defineField({name: 'count', title: 'Visits', type: 'number'}),
  ],
  orderings: [{title: 'Newest month first', name: 'monthDesc', by: [{field: 'month', direction: 'desc'}]}],
  preview: {
    select: {code: 'code', month: 'month', count: 'count'},
    prepare({code, month, count}) {
      return {title: `${code || '?'} · ${month || ''}`, subtitle: `${count ?? 0} visits`}
    },
  },
})
