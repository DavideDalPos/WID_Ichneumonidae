<template>
  <div>
    <p class="text-sm font-semibold text-base-content mb-3">Classification</p>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="rank in DWC_CLASSIFICATION_HIERARCHY"
        :key="rank"
        class="flex flex-col"
      >
        <label>{{ LABELS[rank] || rank }}</label>
        <InputText
          placeholder="Type name..."
          v-model="parameters[rank]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const DWC_CLASSIFICATION_HIERARCHY = [
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'subgenus',
  'specificEpithet',
  'infraspecificEpithet'
]

const LABELS = {
  specificEpithet: 'Species epithet',
  infraspecificEpithet: 'Infraspecific epithet'
}

const parameters = defineModel({
  type: Object,
  required: true
})
</script>
