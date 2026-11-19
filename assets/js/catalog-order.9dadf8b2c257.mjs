// One release-order rule for generated pages and the enhanced catalog.
// ISO dates are audiobook release dates, never file-copy or print-edition dates.
export function sortCatalog(catalog) {
  for (const book of catalog) {
    const date = book.releaseDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date || !book.releaseDateSource) {
      throw new Error(`Verified audiobook release date and source required: ${book.id}`);
    }
  }
  return [...catalog].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.id.localeCompare(b.id));
}
