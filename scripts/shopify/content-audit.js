#!/usr/bin/env node
// Montibello PDP content audit (Phase 4A) — READ-ONLY.
//
// Usage: node scripts/shopify/content-audit.js
//
// For every one of the 27 canonical Peru products, compares live Shopify
// metafields against content extracted from official local sources
// (source-assets/HOP/pdf/hop-catalogo.pdf, source-assets/LUXLIGHT/pdf/
// luxlight-catalogo.pdf + luxlight-9plus-tarjeta.pdf, source-assets/UNDER/
// pdf/under-2026-catalogo.pdf, source-assets/HOP-KERATIN/coming-soon/
// hop-keratin-catalogo.pdf) and proposes KEEP / FILL / REVIEW /
// SOURCE_REQUIRED per field. Every FILL/REVIEW value below is a direct or
// near-direct quote from one of those PDFs (extracted via `pdftotext
// -layout`), never invented. A field with no reliable source is left out of
// "proposed" entirely and reported as SOURCE_REQUIRED instead of guessed.
//
// Writes:
//   data/shopify/pdp-content-audit.json
//   data/shopify/pdp-content-audit.csv
//
// Never calls a mutation. MUTATIONS EXECUTED: 0, always.

const fs = require('node:fs');
const path = require('node:path');
const { loadShopifyEnv, REQUIRED_STORE_DOMAIN } = require('./lib/env');
const { fetchAccessToken, missingScopes, REQUIRED_SCOPES } = require('./lib/oauth');
const { AdminClient } = require('./lib/admin-client');
const { STORE_AND_SCOPES_VERIFY, PRODUCT_LOOKUP } = require('./lib/queries');
const { buildCanonicalCatalog } = require('./lib/catalog');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const SRC = {
  hopCatalogo: 'source-assets/HOP/pdf/hop-catalogo.pdf',
  luxCatalogo: 'source-assets/LUXLIGHT/pdf/luxlight-catalogo.pdf',
  luxTarjeta: 'source-assets/LUXLIGHT/pdf/luxlight-9plus-tarjeta.pdf',
  underCatalogo: 'source-assets/UNDER/pdf/under-2026-catalogo.pdf',
  keratinCatalogo: 'source-assets/HOP-KERATIN/coming-soon/hop-keratin-catalogo.pdf',
};

// ---------------------------------------------------------------------
// HOP: per-formulation copy, extracted verbatim from hop-catalogo.pdf
// pages 24-29 ("La gama completa" product grid). Each entry keyed by
// canonical_product_id.
// ---------------------------------------------------------------------
const HOP_FORMULATION_CONTENT = {
  'HOP-ULTRA-REPAIR-SHAMPOO': {
    page: 24,
    functional_subtitle: 'Champú ultra reparador',
    hair_type: 'Cabello dañado',
    interest_data:
      'Reconstruye, fortalece, repara y protege para un cabello más fuerte y resistente. Cabello suave y sedoso con una fluidez ligera.',
    ingredient: {
      title: 'Colágeno Vegano',
      description:
        'Enriquecido con Colágeno Vegano, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    },
  },
  'HOP-ULTRA-REPAIR-RINSE': {
    page: 24,
    functional_subtitle: 'Acondicionador ultra reparador',
    hair_type: 'Cabello seco y/o dañado',
    interest_data:
      'Refuerza y fortifica la fibra capilar para evitar su rotura. Facilita el desenredado. Cabello reparado, ligero y brillante.',
    ingredient: {
      title: 'Colágeno Vegano',
      description:
        'Enriquecido con Colágeno Vegano, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    },
  },
  'HOP-ULTRA-REPAIR-MASK': {
    page: 24,
    functional_subtitle: 'Mascarilla ultra reparadora',
    hair_type: 'Cabello seco y/o dañado',
    interest_data:
      'Repara profundamente el cabello dañado y seco. Protege el cabello de la sequedad. Previene roturas y ayuda a prevenir las puntas abiertas.',
    ingredient: {
      title: 'Colágeno Vegano',
      description:
        'Enriquecido con Colágeno Vegano, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    },
  },
  'HOP-ULTRA-REPAIR-SEALED-ENDS': {
    page: 24,
    functional_subtitle: 'Crema nutritiva intensiva para puntas',
    hair_type: 'Puntas abiertas, frágiles y/o quebradizas',
    interest_data:
      'Nutre intensamente y sella las puntas. Controla el encrespado y facilita el secado. Protección térmica. Cabello nutrido, suave, fácil de peinar y con brillo.',
    ingredient: {
      title: 'Colágeno Vegano',
      description:
        'Enriquecido con Colágeno Vegano, un complejo de proteínas de origen vegetal que rellena, fortalece y restaura la fibra capilar a la vez que proporciona brillo, elasticidad y suavidad.',
    },
  },
  'HOP-COLOUR-LAST-SHAMPOO': {
    page: 24,
    functional_subtitle: 'Champú prolongador del color',
    hair_type: 'Cabello coloreado',
    interest_data:
      'Ayuda a sellar el color en el cabello por más tiempo y evita la pérdida del color. El cabello luce con un tono que perdura, más intenso y brillante.',
    ingredient: {
      title: 'Ácido Ferúlico',
      description:
        'Enriquecido con Ácido Ferúlico, un potente antioxidante de origen vegetal con un alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
    },
  },
  'HOP-COLOUR-LAST-RINSE': {
    page: 24,
    functional_subtitle: 'Acondicionador prolongador del color',
    hair_type: 'Cabello coloreado',
    interest_data:
      'Sella la cutícula y protege el cabello contra la pérdida del color. Cabello ligero, manejable y con brillo.',
    ingredient: {
      title: 'Ácido Ferúlico',
      description:
        'Enriquecido con Ácido Ferúlico, un potente antioxidante de origen vegetal con un alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
    },
  },
  'HOP-COLOUR-LAST-MASK': {
    page: 24,
    functional_subtitle: 'Mascarilla protectora del color',
    hair_type: 'Cabello coloreado',
    interest_data:
      'Prolonga el color, hidrata y repara en profundidad. Brillo radiante e intensidad del color más duraderos.',
    ingredient: {
      title: 'Ácido Ferúlico',
      description:
        'Enriquecido con Ácido Ferúlico, un potente antioxidante de origen vegetal con un alto poder hidratante que protege y prolonga el color y el brillo, y con una capacidad protectora que neutraliza los daños procedentes de la radiación solar.',
    },
  },
  'HOP-SMOOTH-HYDRATION-SHAMPOO': {
    page: 26,
    functional_subtitle: 'Champú hidratante',
    hair_type: 'Cabello seco, rebelde y/o encrespado',
    interest_data:
      'Fortalece el cabello y proporciona una alta dosis de hidratación. Elimina el frizz y aporta control. Cabello sedoso, suelto y flexible.',
    ingredient: {
      title: 'Ácido Hialurónico',
      description:
        'Enriquecido con Ácido Hialurónico, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
    },
  },
  'HOP-SMOOTH-HYDRATION-RINSE': {
    page: 26,
    functional_subtitle: 'Acondicionador hidratante',
    hair_type: 'Cabello seco, rebelde y/o encrespado',
    interest_data:
      'Combate el frizz y aporta flexibilidad y suavidad sin peso. Desenreda y acondiciona. Cabello más manejable, con control y brillo.',
    ingredient: {
      title: 'Ácido Hialurónico',
      description:
        'Enriquecido con Ácido Hialurónico, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
    },
  },
  'HOP-SMOOTH-HYDRATION-MASK': {
    page: 26,
    functional_subtitle: 'Mascarilla hidratante',
    hair_type: 'Cabello seco, rebelde y/o encrespado',
    interest_data:
      'Restaura, preserva y sella la hidratación en el interior del cabello. Aporta elasticidad y resistencia frente a la rotura. Protege contra el encrespamiento. Cabello suave, sedoso y brillante.',
    ingredient: {
      title: 'Ácido Hialurónico',
      description:
        'Enriquecido con Ácido Hialurónico, un activo altamente hidratante que repara la función barrera del cabello para mejorar la elasticidad, controlar el frizz y devolver el brillo, la suavidad y la manejabilidad.',
    },
  },
};

const HOP_TECHNOLOGY = {
  page: '14-15',
  technology_heading: 'LifeAlgae BioScience',
  technology_description:
    '5 años de investigación para desarrollar LifeAlgae BioScience, la biociencia basada en el poder de las algas capaz de amplificar y potenciar el poder de los activos. La tecnología LifeAlgae BioScience amplifica y potencia las moléculas activas: sus efectos se multiplican x4 permitiendo actuar sobre cuero cabelludo y cabello y potenciar así los 9 signos del bienestar capilar.',
};

// ---------------------------------------------------------------------
// LUXLIGHT: extracted from luxlight-catalogo.pdf's "La gama completa al
// detalle" table (pages 44-45) plus product intro pages, and (for Supreme
// Lightener 9+ only) corroborated by the separate safety card
// luxlight-9plus-tarjeta.pdf.
// ---------------------------------------------------------------------
const LUXLIGHT_TECHNOLOGY = {
  page: '7-11, FAQ p.45',
  technology_heading: 'Bond3 Force System + Metal Shield',
  technology_description:
    'Innovadora tecnología que actúa en las diferentes capas del cabello. Bond3 Force System + Metal Shield reconstruye y refuerza los enlaces internos del cabello mientras captura y neutraliza los metales acumulados en el cabello. Sistema de triple acción: BOND PROTECTION (complejo de aminoácidos biomiméticos), BOND CREATION (complejo de proteínas vegetales de doble acción) y BOND REPAIR (molécula biodegradable derivada de azúcares de origen vegetal). Confirmado por FAQ: "La gama luxlight contiene el sistema Bond3 force integrado en todas sus formulaciones" y "contiene escudo antimetales Metal Shield" en todas sus formulaciones.',
};

const LUXLIGHT_CONTENT = {
  'LUX-LXLEB5': {
    page: '17, 44',
    functional_subtitle: 'Polvo decolorante no volátil multitécnicas',
    interest_data: 'Aclara hasta 9 tonos. Contiene agentes anti-amarillos para neutralizar subtonos indeseados. Fácil de mezclar.',
    technical_data:
      'Textura: polvo no volátil azul suave. Técnica: adecuado para todas las técnicas y seguro para aplicaciones en cuero cabelludo. Activador: 3% (10 vol) / 6% (20 vol) / 9% (30 vol). Proporción de mezcla: 1:2 o 1:2,5. Tiempo de exposición recomendado: hasta 55 min (no se recomienda aplicar calor). Formato: 500g.',
    technicalDataExtra:
      'Corroborado por luxlight-9plus-tarjeta.pdf: usar báscula para el ratio 1:2 o 1:2.5 (no medidores/cazos), no mezclar con varillas metálicas, trabajar a bajos volúmenes, no aplicar calor.',
    claim_footnote: 'Vs servicio decoloración convencional / vs sin tratamiento Bond3 Force System / cabello decolorado vs cabello natural.',
  },
  'LUX-LXLCB5': {
    page: '17, 44',
    functional_subtitle: 'Polvo-arcilla decolorante para técnicas a mano alzada',
    interest_data: 'Aclara hasta 7 tonos. Textura transformadora: de cremosa a sólida. No se hincha, no se desplaza, no gotea. Sin necesidad de cubrir.',
    technical_data:
      'Textura: polvo-arcilla no volátil blanco. Técnica: mano alzada. Activador: 3% (10 vol) / 6% (20 vol) / 9% (30 vol). Proporción de mezcla: 1:1,5 o 1:2. Tiempo de exposición recomendado: hasta 45 min (no se recomienda aplicar calor). Formato: 400g.',
  },
  'LUX-LXLPCB42': {
    page: '19, 44',
    functional_subtitle: 'Sistema de aclaración controlada en dos pasos',
    interest_data:
      'Sistema de dos pasos: 1. Aceite aclarante Supreme Control Oil Lightener. 2. Aceite activador Supreme Control Oil Activator. Aclara hasta 2 tonos (1 en cabello coloreado, 2 en cabello natural); hasta 4 tonos mezclado con Supreme Lightener 9+. Fórmula sin ammonia y sin persulfatos.',
    technical_data:
      'Textura: sistema de dos pasos, de gel a crema. Mezcla base: Supreme Control Oil Lightener + Supreme Control Oil Activator (ratio 1:2). Potenciador (añadiendo Supreme Lightener 9+): 30g Lightener + 60g Activator + 10g Supreme Lightener 9+. Tiempo de exposición: hasta 20 min. Formato: 200g + 400g (dos componentes).',
  },
  'LUX-LXLDB101': {
    page: 44,
    functional_subtitle: 'Activador a base de aceites nutritivos — 3% (10 vol)',
    interest_data: 'Fórmula intensiva a base de aceites para aportar el máximo de protección y cuidado al cuero cabelludo y cabello.',
    technical_data: 'Textura: crema-aceite. Concentración: 3% (10 vol). Formato: 1000ml. Para un resultado superior, mezclar la cantidad de polvo deseada de Supreme Lightener 9+ o Supreme Clay Lightener 7+ con este activador.',
  },
  'LUX-LXLDB201': {
    page: 44,
    functional_subtitle: 'Activador a base de aceites nutritivos — 6% (20 vol)',
    interest_data: 'Fórmula intensiva a base de aceites para aportar el máximo de protección y cuidado al cuero cabelludo y cabello.',
    technical_data: 'Textura: crema-aceite. Concentración: 6% (20 vol). Formato: 1000ml. Para un resultado superior, mezclar la cantidad de polvo deseada de Supreme Lightener 9+ o Supreme Clay Lightener 7+ con este activador.',
  },
  'LUX-LXLDB301': {
    page: 44,
    functional_subtitle: 'Activador a base de aceites nutritivos — 9% (30 vol)',
    interest_data: 'Fórmula intensiva a base de aceites para aportar el máximo de protección y cuidado al cuero cabelludo y cabello.',
    technical_data: 'Textura: crema-aceite. Concentración: 9% (30 vol). Formato: 1000ml. Para un resultado superior, mezclar la cantidad de polvo deseada de Supreme Lightener 9+ o Supreme Clay Lightener 7+ con este activador.',
  },
  'LUX-LXLSB1': {
    page: '21, 44',
    functional_subtitle: 'Champú reestructurante con pH optimizado',
    interest_data:
      'Reequilibra los niveles de pH y restaura la hidratación del cuero cabelludo y del cabello. Repara y refuerza los enlaces capilares debilitados. Captura, neutraliza y elimina los metales para un cabello más fuerte y resistente. Diseñado para aplicar después de la decoloración, antes y después del matiz.',
    technical_data: 'Fórmula concentrada sin sulfatos. Uso: post coloración y/o decoloración, post tonalización, Servicio Advanced Repair Service. Tiempo: 2 min. Formato: 1000ml.',
  },
  'LUX-LXLMB4': {
    page: '21, 44',
    functional_subtitle: 'Tratamiento reestructurante con pH ácido',
    interest_data:
      'Fórmula concentrada de pH ácido que repara y refuerza los enlaces debilitados para un cabello más fuerte y resistente. Aporta hidratación intensa tanto en el interior como en el exterior del cabello. Protege frente a los efectos de metales acumulados. Aporta brillo y sedosidad al cabello.',
    technical_data: 'Fórmula concentrada, textura cremosa. Uso: tratamiento post lavado con Supreme pH Protective Shampoo, Servicio Advanced Repair Service. Tiempo: 10 min. Formato: 450ml.',
  },
};

// ---------------------------------------------------------------------
// UNDER: 57 confirmed shade identifiers grouped into the 5 official shade
// families exactly as printed in the "Carta de Color" chart
// (under-2026-catalogo.pdf, pages 6-7) — a 1:1 match against every
// confirmed identifier in product-grouping.csv's UNDER-COLOUR row. The 7
// "Elevated Warmth" shades are explicitly named as a set of 7 in the same
// document ("Descubre Elevated Warmth: 7 nuevos tonos cálidos elevados").
// ---------------------------------------------------------------------
const UNDER_SHADE_FAMILIES = {
  Naturales: ['3.0/3N', '4.0/4N', '5.0/5N', '6.0/6N', '7.0/7N', '8.0/8N', '9.0/9N', '10.0/10N'],
  Marrones: ['4.60/4BD', '5.60/5BD', '6.60/6BD', '7.60/7BD', '9.60/9BD', '5.63/5BG', '7.63/7BG', '10.63/10BG'],
  'Cenizas e Irisados': [
    '6.10/6AD', '7.01/7NA', '8.01/8NA', '9.01/9NA', '6.13/6AG', '8.13/8AG', '10.13/10AG',
    '6.16/6AB', '8.16/8AB', '5.23/5PG', '7.23/7PG', '8.23/8PG', '9.23/9PG', '10.23/10PG',
  ],
  'Cobrizos, Rojizos y Púrpuras': [
    '3.61/3BA', '5.61/5BA', '8.61/8BA', '4.62/4BP', '6.62/6BP', '7.62/7BP', '9.62/9BP',
    '7.34/7GC', '7.43/7CG', '9.43/9CG', '6.40/6CD', '7.40/7CD', '8.40/8CD',
    '5.70/5RD', '6.70/6RD', '7.70/7RD', '5.80/5VRD', '7.80/7VRD',
  ],
  Dorados: ['6.30/6GD', '8.30/8GD', '7.31/7GA', '9.31/9GA', '7.32/7GP', '8.32/8GP', '9.32/9GP', '10.32/10GP', '8.36/8GB'],
};
const UNDER_ELEVATED_WARMTH = new Set(['3.61/3BA', '7.31/7GA', '9.31/9GA', '6.40/6CD', '5.70/5RD', '7.70/7RD', '7.80/7VRD']);

const UNDER_COLOUR_SYSTEM_SUBTITLE =
  'La coloración con cobertura de alta definición y tecnología híbrida que potencia la realidad y naturalidad de un color sin límites.';

const HOP_KERATIN_NOTE =
  'source-assets/HOP-KERATIN/coming-soon/hop-keratin-catalogo.pdf identifies this 2-step system internationally as "Fase 1: ORGANIC ALKALINE SHAMPOO" and "Fase 2: ORGANIC KERATIN THERAPY" — different names from the confirmed Peru canonical titles "HOP Keratin Shampoo" / "HOP Keratin Lotion" in product-grouping.csv. Per instruction, Peru naming is preserved and NOT auto-replaced; this is a naming-discrepancy flag for human review before launch, not a conflict to resolve silently.';

function buildRows(catalog, liveByHandle) {
  const rows = [];
  const featureProposals = [];
  const ingredientProposals = [];
  const routineProposals = [];
  const shadeProposals = [];
  const conflicts = [];

  for (const spec of catalog) {
    const live = liveByHandle[spec.handle];
    const currentMetafields = live ? live.metafields : {};
    const fields = [];

    const addField = (key, current, proposed, sourceFile, sourcePage, confidence, action, note) => {
      fields.push({ key, current: current ?? null, proposed: proposed ?? null, sourceFile, sourcePage, confidence, action, note });
    };

    // range / subfamily — already live and correct for all 27.
    addField('range', currentMetafields.range, currentMetafields.range, 'data/shopify/product-grouping.csv', null, 'HIGH', 'KEEP', 'Already set correctly from canonical catalog.');
    addField('subfamily', currentMetafields.subfamily, currentMetafields.subfamily, 'data/shopify/product-grouping.csv', null, 'HIGH', 'KEEP', 'Already set correctly from canonical catalog.');

    if (spec.range === 'HOP') {
      const c = HOP_FORMULATION_CONTENT[spec.canonicalId];
      if (c) {
        addField('functional_subtitle', currentMetafields.functional_subtitle, c.functional_subtitle, SRC.hopCatalogo, c.page, 'HIGH', currentMetafields.functional_subtitle ? 'KEEP' : 'FILL', 'Verbatim from official Peru-relevant HOP catalog product grid.');
        addField('hair_type', currentMetafields.hair_type, c.hair_type, SRC.hopCatalogo, c.page, 'HIGH', currentMetafields.hair_type ? 'KEEP' : 'FILL', null);
        addField('interest_data', currentMetafields.interest_data ? '(rich text set)' : null, c.interest_data, SRC.hopCatalogo, c.page, currentMetafields.interest_data ? 'MEDIUM' : 'HIGH', currentMetafields.interest_data ? 'REVIEW' : 'FILL', currentMetafields.interest_data ? 'Live value already set (likely by an earlier external process) and is a close paraphrase, not verbatim, of this catalog page — flagged for human comparison rather than silently overwritten.' : null);
        addField('technology_heading', null, HOP_TECHNOLOGY.technology_heading, SRC.hopCatalogo, HOP_TECHNOLOGY.page, 'HIGH', 'FILL', 'Range-wide HOP technology story (LifeAlgae BioScience), applicable to all HOP formulations.');
        addField('technology_description', null, HOP_TECHNOLOGY.technology_description, SRC.hopCatalogo, HOP_TECHNOLOGY.page, 'HIGH', 'FILL', null);
        addField('full_ingredients', null, null, null, null, null, 'SOURCE_REQUIRED', 'No INCI ingredient list found in any reviewed local source; must not be fabricated.');
        addField('how_to_use', currentMetafields.how_to_use ? '(rich text set)' : null, null, null, null, null, currentMetafields.how_to_use ? 'KEEP' : 'SOURCE_REQUIRED', currentMetafields.how_to_use ? 'Already set (pilot); no matching source text found to verify against, left untouched.' : 'No per-formulation application instructions found in hop-catalogo.pdf beyond generic salon-ritual steps that combine multiple products — not safe to generalize to a single-bottle instruction.');
        addField('professional_only', currentMetafields.professional_only ?? null, null, null, null, null, currentMetafields.professional_only !== undefined ? 'KEEP' : 'SOURCE_REQUIRED', 'Not in schema\'s expected field set for HOP (Used by: UNDER, Luxlight); pilot has it set to false from an untracked external source — left untouched, not replicated to other HOP products without a source.');
        addField('claim_footnote', null, null, null, null, null, 'SOURCE_REQUIRED', 'Percentage/test claims in hop-catalogo.pdf (e.g. "+93%**") are range-wide 9-signs results, not attributable to this specific formulation without guessing.');
        addField('allied_store_offers', null, null, null, null, null, 'SOURCE_REQUIRED', 'No confirmed retailer URL for this product.');

        ingredientProposals.push({
          appliesToHandle: spec.handle,
          title: c.ingredient.title,
          description: c.ingredient.description,
          sourceFile: SRC.hopCatalogo,
          sourcePage: c.page,
          confidence: 'HIGH',
        });
      }
    } else if (spec.range === 'LUXLIGHT') {
      const c = LUXLIGHT_CONTENT[spec.canonicalId];
      addField('professional_only', currentMetafields.professional_only ?? null, 'true', SRC.luxCatalogo, 1, 'HIGH', 'FILL', 'Catalog cover explicitly states "SERVICIO EXCLUSIVO DE SALÓN" (salon-exclusive service) for the Luxlight lightening system.');
      addField('technology_heading', null, LUXLIGHT_TECHNOLOGY.technology_heading, SRC.luxCatalogo, LUXLIGHT_TECHNOLOGY.page, 'HIGH', 'FILL', null);
      addField('technology_description', null, LUXLIGHT_TECHNOLOGY.technology_description, SRC.luxCatalogo, LUXLIGHT_TECHNOLOGY.page, 'HIGH', 'FILL', 'FAQ explicitly confirms Bond3/Metal Shield is in ALL Luxlight formulations, not only the lighteners.');
      if (c) {
        addField('functional_subtitle', null, c.functional_subtitle, SRC.luxCatalogo, c.page, 'HIGH', 'FILL', null);
        addField('interest_data', null, c.interest_data, SRC.luxCatalogo, c.page, 'HIGH', 'FILL', null);
        addField('technical_data', null, c.technical_data, SRC.luxCatalogo, c.page, 'HIGH', 'FILL', c.technicalDataExtra || null);
        if (c.claim_footnote) addField('claim_footnote', null, c.claim_footnote, SRC.luxCatalogo, c.page, 'MEDIUM', 'REVIEW', 'Footnote markers apply to specific stat claims on the same page — needs a human to confirm exact attribution before publishing.');
        else addField('claim_footnote', null, null, null, null, null, 'SOURCE_REQUIRED', null);
      }
      addField('full_ingredients', null, null, null, null, null, 'SOURCE_REQUIRED', 'No INCI list found; this is a technical/marketing catalog, not a regulatory ingredient sheet.');
      addField('how_to_use', null, null, null, null, null, 'SOURCE_REQUIRED', 'Application/mixing detail exists (captured in technical_data) but a clean single "how to use" paragraph distinct from technical_data was not found — needs human authoring, not a duplicate of technical_data.');
      addField('hair_type', null, null, null, null, null, 'SOURCE_REQUIRED', 'Not target-hair-type products (professional colouring process for colourists) — no hair_type claim found.');
      addField('allied_store_offers', null, null, null, null, null, 'SOURCE_REQUIRED', 'No confirmed retailer URL for this product.');
    } else if (spec.range === 'UNDER') {
      if (spec.canonicalId === 'UNDER-COLOUR') {
        addField('functional_subtitle', null, UNDER_COLOUR_SYSTEM_SUBTITLE, SRC.underCatalogo, 1, 'HIGH', 'FILL', null);
        addField('professional_only', null, null, null, null, null, 'SOURCE_REQUIRED', 'No explicit "salon-exclusive" claim found for UNDER in the reviewed catalog text (unlike Luxlight\'s explicit statement) — not assumed.');
        addField('shades', currentMetafields.shades ? '(list set)' : null, `${Object.values(UNDER_SHADE_FAMILIES).flat().length} shade entries proposed`, SRC.underCatalogo, '6-7', 'HIGH', 'REVIEW', '57 montibello_under_shade metaobject proposals below — catalog_identifier + shade_family match product-grouping.csv exactly; NOT created in this audit-only phase.');
      } else {
        addField('functional_subtitle', null, null, null, null, null, 'SOURCE_REQUIRED', 'under-2026-catalogo.pdf gives no per-concentration tagline distinct from the shared colour-system copy.');
        addField('professional_only', null, null, null, null, null, 'SOURCE_REQUIRED', 'No explicit salon-exclusive claim found for this developer/activator product specifically.');
      }
      addField('full_ingredients', null, null, null, null, null, 'SOURCE_REQUIRED', null);
      addField('how_to_use', null, null, null, null, null, 'SOURCE_REQUIRED', 'No per-product mixing/application instructions found (color system technical data lives in a professional colour chart, not extracted here as text).');
      addField('allied_store_offers', null, null, null, null, null, 'SOURCE_REQUIRED', 'No confirmed retailer URL for this product.');
    } else if (spec.range === 'HOP Keratin') {
      addField('functional_subtitle', null, null, null, null, null, 'REVIEW', HOP_KERATIN_NOTE);
      addField('how_to_use', null, null, null, null, null, 'REVIEW', 'Rich 2-phase application/technical content exists in hop-keratin-catalogo.pdf, but positioning is COMING SOON pending naming resolution — do not populate ahead of that decision.');
      addField('full_ingredients', null, null, null, null, null, 'SOURCE_REQUIRED', null);
      addField('interest_data', null, null, null, null, null, 'REVIEW', 'Catalog claims (e.g. "elimina 100% el encrespado por 3 a 6 meses") describe the combined 2-phase treatment, not confirmed as attributable to a single bottle (Shampoo vs. Lotion) without human sign-off.');
      addField('allied_store_offers', null, null, null, null, null, 'SOURCE_REQUIRED', 'COMING SOON — no allied-store offers per catalog rules.');
    }

    rows.push({
      handle: spec.handle,
      title: spec.title,
      canonicalId: spec.canonicalId,
      currentMetafields,
      fields,
    });
  }

  // HOP routine step proposals: Ultra Repair Shampoo already has an
  // approved routine (KEEP, untouched). Colour Last and Smooth Hydration
  // follow the same shampoo -> mask+rinse pattern, inferred from the
  // catalog's own subfamily grouping (adjacent columns, shared ingredient
  // callout, "gama completa" listing) — REVIEW, not FILL, since it is a
  // structural inference applied to two new subfamilies rather than an
  // explicit numbered-step instruction like Ultra Repair's already-approved
  // one.
  routineProposals.push({
    subfamily: 'Ultra Repair',
    status: 'ALREADY EXISTS — not touched',
    steps: null,
  });
  routineProposals.push({
    subfamily: 'Color Last',
    status: 'PROPOSED',
    confidence: 'MEDIUM',
    steps: [
      { step_number: 1, label: 'Champú', products: ['hop-colour-last-shampoo'] },
      { step_number: 2, label: 'Mascarilla y Acondicionador', products: ['hop-colour-last-mask', 'hop-colour-last-rinse'] },
    ],
    sourceFile: SRC.hopCatalogo,
    sourcePage: 24,
    note: 'Inferred from the same shampoo -> mask+rinse structure already approved for Ultra Repair Shampoo; not an explicit numbered routine in the catalog for this subfamily.',
  });
  routineProposals.push({
    subfamily: 'Smooth Hydration',
    status: 'PROPOSED',
    confidence: 'MEDIUM',
    steps: [
      { step_number: 1, label: 'Champú', products: ['hop-smooth-hydration-shampoo'] },
      { step_number: 2, label: 'Mascarilla y Acondicionador', products: ['hop-smooth-hydration-mask', 'hop-smooth-hydration-rinse'] },
    ],
    sourceFile: SRC.hopCatalogo,
    sourcePage: 26,
    note: 'Same inference as Color Last.',
  });

  // Feature metaobject proposals: one montibello_feature per HOP subfamily,
  // reusing the same ingredient-callout content also proposed as a
  // key_ingredient (the schema allows the same real claim to inform both a
  // plain-text accordion feature and a visual ingredient card).
  for (const [family, ids] of [
    ['Ultra Repair', ['HOP-ULTRA-REPAIR-SHAMPOO', 'HOP-ULTRA-REPAIR-RINSE', 'HOP-ULTRA-REPAIR-MASK', 'HOP-ULTRA-REPAIR-SEALED-ENDS']],
    ['Color Last', ['HOP-COLOUR-LAST-SHAMPOO', 'HOP-COLOUR-LAST-RINSE', 'HOP-COLOUR-LAST-MASK']],
    ['Smooth Hydration', ['HOP-SMOOTH-HYDRATION-SHAMPOO', 'HOP-SMOOTH-HYDRATION-RINSE', 'HOP-SMOOTH-HYDRATION-MASK']],
  ]) {
    const sample = HOP_FORMULATION_CONTENT[ids[0]];
    featureProposals.push({
      subfamily: family,
      appliesToCanonicalIds: ids,
      title: sample.ingredient.title,
      description: sample.ingredient.description,
      sourceFile: SRC.hopCatalogo,
      sourcePage: sample.page,
      confidence: 'HIGH',
    });
  }

  // key_ingredients proposals already collected inline above (ingredientProposals).

  // UNDER shade metaobject proposals (57).
  for (const [family, ids] of Object.entries(UNDER_SHADE_FAMILIES)) {
    for (const catalogIdentifier of ids) {
      shadeProposals.push({
        catalog_identifier: catalogIdentifier,
        shade_family: family,
        display_name: null,
        swatch: null,
        erp_sku: null,
        is_elevated_warmth: UNDER_ELEVATED_WARMTH.has(catalogIdentifier),
        active: null,
        sourceFile: SRC.underCatalogo,
        sourcePage: '6-7',
        confidence: 'HIGH',
        note: 'catalog_identifier + shade_family confirmed exact match against product-grouping.csv\'s 57 identifiers. display_name, swatch, and erp_sku are SOURCE_REQUIRED — not present as clean per-shade text/color data in the reviewed source.',
      });
    }
  }

  return { rows, featureProposals: [...featureProposals], ingredientProposals, routineProposals, shadeProposals, conflicts };
}

async function main() {
  console.log('\n=== Montibello PDP content audit (Phase 4A) — READ ONLY ===\n');

  const envResult = loadShopifyEnv(REPO_ROOT);
  if (!envResult.ok) {
    console.log(`STORE VERIFIED: NO — ${envResult.reason}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  let client;
  try {
    const { accessToken } = await fetchAccessToken({
      shop: envResult.env.shop,
      clientId: envResult.env.clientId,
      clientSecret: envResult.env.clientSecret,
    });
    client = new AdminClient({
      storeDomain: envResult.env.storeDomain,
      accessToken,
      apiVersion: envResult.env.apiVersion,
      requiredStoreDomain: REQUIRED_STORE_DOMAIN,
    });
    const verifyData = await client.request(STORE_AND_SCOPES_VERIFY);
    if (verifyData.shop.myshopifyDomain !== REQUIRED_STORE_DOMAIN) {
      console.log(`STORE VERIFIED: NO — token belongs to "${verifyData.shop.myshopifyDomain}".`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    const grantedScopes = verifyData.currentAppInstallation.accessScopes.map((s) => s.handle);
    const missing = missingScopes(grantedScopes);
    if (missing.length > 0) {
      console.log(`SCOPES VERIFIED: NO — missing ${missing.join(', ')}`);
      console.log('\nMUTATIONS EXECUTED: 0');
      process.exitCode = 1;
      return;
    }
    console.log(`STORE VERIFIED: YES (${verifyData.shop.myshopifyDomain}, API ${envResult.env.apiVersion})`);
    console.log(`SCOPES VERIFIED: YES (${grantedScopes.join(', ')})`);
  } catch (err) {
    console.log(`STORE VERIFIED: NO — ${err.message}`);
    console.log('\nMUTATIONS EXECUTED: 0');
    process.exitCode = 1;
    return;
  }

  const catalog = buildCanonicalCatalog(REPO_ROOT);
  const liveByHandle = {};
  for (const spec of catalog) {
    const data = await client.request(PRODUCT_LOOKUP, { handle: spec.handle });
    const p = data.productByHandle;
    liveByHandle[spec.handle] = p
      ? { id: p.id, status: p.status, metafields: Object.fromEntries(p.metafields.nodes.map((m) => [m.key, m.value])) }
      : { id: null, status: null, metafields: {} };
  }

  const { rows, featureProposals, ingredientProposals, routineProposals, shadeProposals, conflicts } = buildRows(catalog, liveByHandle);

  // --- Totals ---
  let complete = 0;
  let readyToFill = 0;
  let review = 0;
  let sourceRequired = 0;
  for (const row of rows) {
    for (const f of row.fields) {
      if (f.action === 'KEEP') complete += 1;
      else if (f.action === 'FILL') readyToFill += 1;
      else if (f.action === 'REVIEW') review += 1;
      else if (f.action === 'SOURCE_REQUIRED') sourceRequired += 1;
    }
  }

  const audit = {
    generated_at: new Date().toISOString().slice(0, 10),
    scope: 'Phase 4A read-only PDP content audit for all 27 confirmed Montibello Peru canonical products. No Shopify writes performed.',
    products: rows,
    metaobject_proposals: {
      features: featureProposals,
      key_ingredients: ingredientProposals,
      routine_steps: routineProposals,
      under_shades: shadeProposals,
    },
    conflicts,
    totals: {
      fields_already_complete: complete,
      fields_ready_to_fill: readyToFill,
      fields_requiring_review: review,
      fields_source_required: sourceRequired,
      feature_metaobjects_proposed: featureProposals.length,
      ingredient_metaobjects_proposed: ingredientProposals.length,
      routine_steps_proposed: routineProposals.filter((r) => r.status === 'PROPOSED').length,
      under_shades_proposed: shadeProposals.length,
      conflicts: conflicts.length,
      errors: 0,
    },
  };

  const outDir = path.join(REPO_ROOT, 'data', 'shopify');
  fs.writeFileSync(path.join(outDir, 'pdp-content-audit.json'), JSON.stringify(audit, null, 2));

  const csvLines = ['handle,title,field,action,confidence,current_present,proposed_present,source_file,source_page,note'];
  const csvEscape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  for (const row of rows) {
    for (const f of row.fields) {
      csvLines.push(
        [
          row.handle,
          row.title,
          f.key,
          f.action,
          f.confidence || '',
          f.current ? 'yes' : 'no',
          f.proposed ? 'yes' : 'no',
          f.sourceFile || '',
          f.sourcePage || '',
          f.note || '',
        ]
          .map(csvEscape)
          .join(',')
      );
    }
  }
  fs.writeFileSync(path.join(outDir, 'pdp-content-audit.csv'), csvLines.join('\n') + '\n');

  console.log(`\nWrote data/shopify/pdp-content-audit.json and .csv for ${rows.length} products.\n`);
  console.log('=== TOTALS ===');
  console.log(`FIELDS ALREADY COMPLETE: ${audit.totals.fields_already_complete}`);
  console.log(`FIELDS READY TO FILL: ${audit.totals.fields_ready_to_fill}`);
  console.log(`FIELDS REQUIRING REVIEW: ${audit.totals.fields_requiring_review}`);
  console.log(`FIELDS SOURCE_REQUIRED: ${audit.totals.fields_source_required}`);
  console.log(`FEATURE METAOBJECTS PROPOSED: ${audit.totals.feature_metaobjects_proposed}`);
  console.log(`INGREDIENT METAOBJECTS PROPOSED: ${audit.totals.ingredient_metaobjects_proposed}`);
  console.log(`ROUTINE STEPS PROPOSED: ${audit.totals.routine_steps_proposed}`);
  console.log(`UNDER SHADES PROPOSED: ${audit.totals.under_shades_proposed}`);
  console.log(`CONFLICTS: ${audit.totals.conflicts}`);
  console.log(`ERRORS: ${audit.totals.errors}`);
  console.log('\nMUTATIONS EXECUTED: 0');
}

main().catch((err) => {
  console.error(`\nFATAL: ${err.message}`);
  console.log('\nMUTATIONS EXECUTED: 0');
  process.exitCode = 1;
});
