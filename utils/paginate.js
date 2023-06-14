export default function paginate(items, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = items.slice(startIndex, endIndex);
  const nextPageItems = items.slice(endIndex, endIndex + itemsPerPage);

  return {
    currentPage,
    totalPages: Math.ceil(items.length / itemsPerPage),
    totalItems: items.length,
    itemsPerPage,
    items: paginatedItems,
    nextPageItems: nextPageItems.length > 0 ? nextPageItems : null,
  };
}
