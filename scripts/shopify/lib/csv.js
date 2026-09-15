// Minimal RFC 4180-ish CSV parser (handles quoted fields with embedded
// commas, e.g. product-grouping.csv's `notes` column). No external
// dependency, since this repo has no package installs set up.

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r') {
      // skip, \n handles the line break
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

/** Parses a CSV file into an array of objects keyed by its header row. */
function parseCsvToObjects(text) {
  const rows = parseCsv(text);
  const [header, ...rest] = rows;
  return rest.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = row[i] ?? '';
    });
    return obj;
  });
}

module.exports = { parseCsv, parseCsvToObjects };
