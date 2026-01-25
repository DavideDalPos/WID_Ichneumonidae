<template>
  <section class="bg-base-foreground py-6">
    <div class="mx-auto prose !container dark:prose-invert">
      
      <h2 class="text-center text-amber-400 mb-2">Ichneumonidae Subfamily Updates</h2>
      <span class="block text-center text-base-soft mb-6">
        Current status of subfamily updates in WID
      </span>

      <div class="flex flex-col gap-4">

        <VCard>
          <VCardContent>
            <p>
              Because <strong>Ichneumonidae</strong> is extremely diverse (<strong>&gt;24,000 species described</strong>) 
              and has a huge literature (<strong>&gt;12,000 papers</strong>), it can take many years to fully 
              and precisely update a subfamily, especially the very diverse ones.
            </p>
            <p>
              The table below provides information about the <strong>current updates</strong> on the 
              <strong>World Ichneumonid Database (WID)</strong> according to subfamilies.
            </p>
          </VCardContent>
        </VCard>

<VCard>
  <VCardContent>
    <h3 class="mt-0 mb-4 text-lg font-semibold">Abbreviations used in the table</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div 
        v-for="({ abbr, label, description }, index) in sortedABBR" 
        :key="abbr" 
        class="flex gap-3 items-start p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
      >
        <!-- Abbreviation box -->
        <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-400 text-white font-bold rounded">
          {{ abbr }}
        </div>

        <!-- Label and description -->
        <div>
          <div class="font-semibold text-sm text-gray-800 dark:text-gray-200">
            {{ label }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ description }}
          </div>
        </div>
      </div>
    </div>

<!-- Symbol legend with intro -->
<div class="mt-4 text-xs text-gray-600 dark:text-gray-400 italic">
  <p class="mb-2">
    Each subfamily in the table shows a progress status using the following symbols:
  </p>
  <span class="flex items-center gap-1"><span>✅</span> Complete</span>
  <span class="flex items-center gap-1"><span>⏳</span> In progress</span>
  <span class="flex items-center gap-1"><span>❌</span> Not started</span>
</div>


    <p class="mt-3 text-xs text-gray-600 dark:text-gray-400 italic">
      Clicking on any abbreviation in the table header will display its definition.
    </p>
  </VCardContent>
</VCard>






        <VCard>
          <VCardContent>
            <p class="italic text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              WID is open to contributions from anyone with specimen records and images.
            </p>
          </VCardContent>
        </VCard>

      </div>
    </div>
  </section>
</template>

<script setup>
const ABBR = {
  V: { label: 'Valid names', description: 'Shows whether the valid names for the taxon are recorded in WID.' },
  S: { label: 'Synonyms, Homonyms & Other Unavailable/Invalid Names', description: 'Indicates whether synonyms, homonyms, and unavailable/invalid names are documented.' },
  L: { label: 'Literature coverage', description: 'Shows whether the primary literature for the taxon has been reviewed.' },
  T: { label: 'Type species designation status', description: 'Indicates if the type species has been designated and recorded.' },
  R: { label: 'References (Main Citations)', description: 'Indicates if the main references for the taxon are available.' },
  P: { label: 'Photographs', description: 'Indicates whether photos of the taxa are available.' },
  C: { label: 'Citations (Full Taxonomic History)', description: 'Shows if the full taxonomic history and citations are documented.' },
  D: { label: 'Geographic distribution', description: 'Indicates whether geographic distribution data is available.' },
  B: { label: 'Biological association', description: 'Indicates whether biological and ecological information is recorded.' },
  O: { label: 'Original Type Series Info', description: 'Indicates if original type series information (specimens, repositories) is available.' }
};

// Convert to an array and sort alphabetically by abbreviation
const sortedABBR = Object.entries(ABBR)
  .map(([abbr, info]) => ({ abbr, ...info }))
  .sort((a, b) => a.abbr.localeCompare(b.abbr));


</script>