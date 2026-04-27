import React from "react";

/**
 * Pagination component styled with Tailwind and custom theme.
 * @param {Object} props
 * @param {number} props.page - Current page (1-based)
 * @param {function} props.setPage - Setter for page
 * @param {number} props.totalPages - Total number of pages
 * @param {number} [props.totalResults] - Optional: total number of results
 */
export default function Pagination({
  page,
  setPage,
  totalPages,
  totalResults,
}) {
  if (totalPages <= 1) return null;

  // Helper to generate page numbers (with ellipsis for large sets)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (p) => {
    if (typeof p === "number" && p !== page && p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  return (
    <nav
      className="flex items-center md:justify-between justify-center gap-2"
      aria-label="Pagination Navigation"
    >
      {/* Page Info */}
      <div className="text-sm hidden md:block text-gray-500 mt-1">
        Page <span className="font-semibold text-primary">{page}</span> of{" "}
        <span className="font-semibold text-primary">{totalPages}</span>
        {typeof totalResults === "number" && (
          <span>
            {" "}
            &middot;{" "}
            <span className="font-semibold text-primary">
              {totalResults}
            </span>{" "}
            results
          </span>
        )}
      </div>
      <div className="flex items-center gap-0">
        {/* Previous Button */}
        <button
          className="px-3 py-1 rounded-l-md border z-10 border-primary hover:bg-primary hover:text-primary-foreground bg-white text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous Page"
        >
          &larr;
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span
              key={"ellipsis-" + idx}
              className="px-2 text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              className={`px-3 py-1 border-y border-primary -ml-px ${
                p === page
                  ? "bg-primary text-primary-foreground font-bold z-10"
                  : "bg-white text-primary hover:bg-primary hover:text-primary-foreground"
              } transition-colors`}
              onClick={() => handlePageChange(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              disabled={p === page}
            >
              {p}
            </button>
          ),
        )}

        {/* Next Button */}
        <button
          className="px-3 py-1 z-10 rounded-r-md border border-primary hover:bg-primary hover:text-primary-foreground bg-white text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors -ml-px"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next Page"
        >
          &rarr;
        </button>
      </div>
    </nav>
  );
}
