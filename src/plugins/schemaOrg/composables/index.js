import { useHead } from '@unhead/vue'

function provideResolver(input, resolver) {
  if (!input) input = {}

  input._resolver = resolver

  return input
}

export function defineTaxon(input) {
  return provideResolver(input, 'taxon')
}

export function useSchemaOrg(nodes, head) {
  return useHead(
    {
      script: [
        {
          type: 'application/ld+json',
          key: 'schema-org-graph',
          nodes
        }
      ]
    },
    { head }
  )
}
