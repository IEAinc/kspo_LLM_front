const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftBoundary = Math.max(2, currentPage - 2);
      const rightBoundary = Math.min(totalPages - 1, currentPage + 2);

      pages.push(1);
      if (leftBoundary > 2) pages.push('left-ellipsis');
      for (let i = leftBoundary; i <= rightBoundary; i++) pages.push(i);
      if (rightBoundary < totalPages - 1) pages.push('right-ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center">
      <button onClick={() => handlePageClick(1)} disabled={currentPage === 1} className="flex px-1">
        ««
      </button>
      <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} className="flex mr-[8px] px-1">
        «
      </button>

      {pageNumbers.map((page, index) =>
        page === 'left-ellipsis' || page === 'right-ellipsis' ? (
          <span key={page + index} className="min-w-[28px] h-[28px] flex justify-center items-center text-center text-[14px] font-medium text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`min-w-[28px] h-[28px] flex justify-center items-center text-center text-[14px] font-medium ${
              currentPage === page ? 'bg-primary-blue text-white rounded-[4px]' : 'text-black border-black'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} className="flex ml-[8px] px-1">
        »
      </button>
      <button onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages} className="flex px-1">
        »»
      </button>
    </div>
  );
};

export default Pagination;
