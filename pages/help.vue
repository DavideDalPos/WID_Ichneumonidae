<template>
  <section class="bg-base-foreground mb-10">
    <div class="container mx-auto p-4 sm:pt-10 sm:pb-2 relative box-border">

      <!-- Title section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
          How can you help?
        </h1>
        <p class="mt-2 text-lg text-base-soft">
          The database grows through its community — here is how you can contribute
        </p>
      </div>

      <div class="prose !container dark:prose-invert">
        <div class="text-lg text-justify text-gray-600 space-y-6 leading-relaxed max-w-7xl mx-auto px-4">

          <p>
            The <strong class="text-gray-800 font-semibold">World Ichneumonidae Database (WID)</strong> depends on the
            expertise and generosity of the entomological community. Every correction, record, and reference helps keep
            the database accurate, complete, and useful to researchers worldwide.
          </p>

          <!-- Submission callout -->
          <div class="bg-gray-100 border-l-4 border-red-800 p-4 rounded-md shadow-sm">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-red-700 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-gray-800 font-semibold text-lg !my-0">
                  Submit a missing publication
                </p>
                <p class="!mb-0">
                  Know of a published paper that is not yet included in WID? Please let us know. No account is needed —
                  just paste the full citation or a DOI, and we will take care of the rest.
                </p>
              </div>
            </div>

            
            <a  href="https://benevolent-cuchufli-47bd77.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mt-4 ml-9 rounded-md bg-red-800 px-6 py-3 text-white font-medium no-underline hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Submit a published paper
            </a>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
// nothing needed — the button is a simple link
</script>