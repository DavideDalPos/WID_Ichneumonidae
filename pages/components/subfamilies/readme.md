---

title: "Ichneumonidae Project Progress Dashboard"
layout: archive
permalink: /pages/project-progress/
author_profile: false
---------------------

# Ichneumonidae Project Progress Dashboard

This page documents the **Vue component used to track the progress of the Ichneumonidae data compilation project**.
The interface allows filtering by subfamily, displays progress across several data categories, and provides links to overview and taxon pages.

## Features

* 🔎 **Search filter** for subfamily names
* 📊 **Automatic progress calculation** based on completed data tasks
* 📈 **Visual progress bars** with color coding
* 📚 **Abbreviation pop-ups** explaining each data category
* 🔗 **Links to overview and WID taxon pages**
* ⬆️ **Sortable table** by progress or status

## Data Categories

The dashboard tracks progress across several taxonomic data components:

| Category     | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| Genera       | Valid genera, synonyms, and supporting literature           |
| Type species | Presence, references, and specimen photographs              |
| Species      | Valid species, synonyms, references, and citations          |
| OTU data     | Distribution data, type series information, and photographs |
| Biology      | Biological traits, host records, and supporting citations   |

## Status Indicators

The system uses three status states:

| Symbol | Meaning     |
| ------ | ----------- |
| ✔      | Completed   |
| ⏳      | In progress |
| ✘      | Not started |

Progress is automatically calculated based on completed tasks.

## Example Component Code

Below is the main Vue component used to generate the progress table.

```vue
// TableProgress.vue
<script setup>
import { computed, onMounted, ref } from 'vue';
import SearchForm from './SearchForm.vue';

/* Abbreviation dictionary */
const ABBR = {
  V: { label: 'Valid names', description: 'Names currently considered valid.' },
  S: { label: 'Synonyms', description: 'Synonyms or invalid names.' },
  R: { label: 'References', description: 'Main supporting references.' },
  C: { label: 'Citations', description: 'Full taxonomic citation history.' },
  T: { label: 'Type species', description: 'Status of type species designation.' },
  P: { label: 'Photographs', description: 'Availability of specimen photographs.' },
  D: { label: 'Geographic distribution', description: 'Known geographic range.' },
  B: { label: 'Biological association', description: 'Host and ecological associations.' },
  O: { label: 'Original Type Series', description: 'Information on original type specimens.' }
};
</script>
```

## Repository Integration

To use this component in your Vue project:

1. Place the file inside your component directory:

```
src/components/TableProgress.vue
```

2. Import it into your page:

```vue
import TableProgress from "@/components/TableProgress.vue"
```

3. Pass the dataset containing subfamily progress information:

```vue
<TableProgress :items="subfamilyData" />
```

## Related Resources

* World Ichneumonidae Database (WID)
* Subfamily overview pages
* Taxon database entries

---

*This dashboard is part of the ongoing effort to track progress in compiling taxonomic information for Ichneumonidae.*
