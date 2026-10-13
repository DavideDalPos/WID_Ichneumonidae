// Number of described species in the world for each subfamily, used on the
// Subfamilies page to show how much of each group is already in WID.
//
// Source: Broad, G.R., Shaw, M.R. & Fitton, M.G. (2018) Ichneumonid wasps
// (Hymenoptera: Ichneumonidae): their classification and biology. Handbooks for
// the Identification of British Insects, 7(12). Royal Entomological Society.
// Figures are as stated in each subfamily account ("about", "a little over"…
// are flagged approx). Update a number here and the page follows.
//
// genera = described genera in the world (extant). `source` overrides the
// default citation for that line. null = no world total available.

export const WORLD_SPECIES_SOURCE = {
  short: 'Broad, Shaw & Fitton (2018)',
  full: 'Broad, G.R., Shaw, M.R. & Fitton, M.G. (2018) Ichneumonid wasps (Hymenoptera: Ichneumonidae): their classification and biology. Handbooks for the Identification of British Insects, 7(12). Royal Entomological Society, St Albans.'
}

export default {
  Acaenitinae: { species: 281, genera: 29, approx: true },
  Adelognathinae: { species: 46, genera: 1 },
  Agriotypinae: { species: 16, genera: 1 },
  Anomaloninae: { species: 750, genera: 45 },
  Ateleutinae: { species: 46, genera: 2, note: 'Ateleute 41 + Tamaulipeca 5' },
  Banchinae: { species: 1760, genera: 64, approx: true },
  Brachycyrtinae: { species: 22, genera: 1 },
  Campopleginae: { species: 2100, genera: 66, approx: true },
  Claseinae: { species: 2, genera: 2 },
  Collyriinae: { species: 10, genera: 3, approx: true, note: 'Collyria 9 + Aubertiella 1; Bicurta not counted in the source' },
  Cremastinae: { species: 790, genera: 35 },
  Cryptinae: { species: 3100, genera: 275, approx: true },
  Ctenopelmatinae: { species: 1350, genera: 105, approx: true },
  Cylloceriinae: { species: 38, genera: 4 },
  Diacritinae: { species: 7, genera: 3 },
  Diplazontinae: { species: 355, genera: 22, approx: true },
  Eucerotinae: { species: 49, genera: 2, note: 'Euceros 48 + Barronia 1' },
  Hybrizontinae: { species: 13, genera: 3 },
  Ichneumoninae: { species: 4100, genera: 440, approx: true },
  Labeninae: { species: 150, genera: 12, approx: true },
  Lycorininae: { species: 34, genera: 1 },
  Mesochorinae: { species: 880, genera: 9, approx: true },
  Metopiinae: { species: 840, genera: 27, approx: true },
  Microleptinae: { species: 14, genera: 1 },
  Neorhacodinae: { species: 6, genera: 3 },
  Nesomesochorinae: { species: 60, genera: 3, source: 'D. Dal Pos (WID), 2026' },
  Ophioninae: { species: 1000, genera: 31, approx: true },
  Orthocentrinae: { species: 470, genera: 30, approx: true },
  Orthopelmatinae: { species: 8, genera: 1 },
  Oxytorinae: { species: 23, genera: 1 },
  Pedunculinae: { species: 3, genera: 3 },
  Phygadeuontinae: { species: 1928, genera: 125, approx: true, source: 'D. Dal Pos (WID), 2026' },
  Pimplinae: { species: 1700, genera: 79, approx: true },
  Poemeniinae: { species: 80, genera: 10, approx: true },
  Rhyssinae: { species: 250, genera: 8, approx: true },
  Sisyrostolinae: { species: 49, genera: 6, source: 'D. Dal Pos (WID), 2026' },
  Stilbopinae: { species: 30, genera: 3 },
  Tatogastrinae: { species: 1, genera: 1 },
  Tersilochinae: { species: 524, genera: 34, source: 'D. Dal Pos (WID), 2026' },
  Tryphoninae: { species: 1250, genera: 54, approx: true },
  Xoridinae: { species: 210, genera: 4, approx: true }
}
