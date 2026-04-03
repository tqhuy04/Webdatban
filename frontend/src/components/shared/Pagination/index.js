import React from 'react';
import './index.css';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="pagination-nav" aria-label="Phân trang">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Trang trước"
      >
        ‹
      </button>

      {getPageNumbers()[0] > 1 && (
        <>
          <button
            className="pagination-btn pagination-number"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="pagination-ellipsis">...</span>
          )}
        </>
      )}

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`pagination-btn pagination-number ${
            page === currentPage ? 'active' : ''
          }`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="pagination-ellipsis">...</span>
          )}
          <button
            className="pagination-btn pagination-number"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
