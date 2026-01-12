<template>
  <section class="bg-base-foreground p-4 py-10">
    <div class="prose !container mx-auto dark:prose-invert">
      <h2>Referencing this website</h2>
<p>
  We kindly ask that any use of data or content from this website be acknowledged using the citation below:
  <br><br>

  <CitationBlock />
</p>

<hr class="my-10 border-gray-300 dark:border-gray-700" />

      <h2>Terms of use</h2>

      <p>
        Except where otherwise noted, content on this site is licensed under a
        the terms of the
        <a href="https://creativecommons.org/licenses/by/4.0/"
          >Creative Commons Attribution License (CC-BY)</a
        >. Images are by default open-access under the terms of the
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          >CC BY-NC-SA license</a
        >, unless stated otherwise
      </p>

<hr class="my-10 border-gray-300 dark:border-gray-700" />
      <h2>Find out more</h2>
      <p>
      Learn how to collaborate with the 
      World Ichneumonidae Database. 
      Contact information, technical details, and more are available 
      <RouterLink to="about">here</RouterLink>.
      </p>

    </div>
  </section>
</template>

<script setup>
import CitationBlock from './CitationBlock.vue';

const { project_url } = __APP_ENV__
</script>
