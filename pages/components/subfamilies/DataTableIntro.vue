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
            <h3 class="mt-0 mb-2">Abbreviations</h3>
            <ul class="flex flex-col gap-2">
              <li class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <strong>Complete:</strong> The information for this subfamily is fully updated.
              </li>
              <li class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                <strong>In Progress:</strong> Updates are ongoing.
              </li>
              <li class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <strong>Incomplete:</strong> No updates have been added yet.
              </li>
            </ul>
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
