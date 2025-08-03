// web/lib/client.ts

import {createClient} from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'jw971r14',
  dataset: 'production',
  apiVersion: '2023-08-01',
  useCdn: false,
  perspective: 'published',
})
