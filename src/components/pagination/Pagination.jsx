import React, { useEffect, useState } from "react";

/**
 * Pagination component styled with Tailwind and custom theme.
 * Shows 10 pages at a time, arrows go to first/last page.
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
  const [visiblePages, setVisiblePages] = useState([]);

  let totalPageNumToShow = 10; // Show 10 pages at a time

  useEffect(() => {
    if (!totalPages || totalPages <= 1) {
      setVisiblePages([]);
      return;
    }

    let pageArr = Array.from({ length: totalPages }, (_, idx) => idx + 1);
    let currPageAr;
    if (page > pageArr.length) {
      currPageAr = pageArr.slice(
        pageArr.length - totalPageNumToShow,
        pageArr.length,
      );
    } else if (page > Math.floor(totalPageNumToShow / 2)) {
      const start = Math.max(0, page - Math.floor(totalPageNumToShow / 2) - 1);
      const end = Math.min(totalPages, start + totalPageNumToShow);
      currPageAr = pageArr.slice(start, end);
    } else {
      currPageAr = pageArr.slice(0, totalPageNumToShow);
    }
    setVisiblePages(currPageAr);
  }, [totalPages, page]);

  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (p) => {
    if (p !== page && p >= 1 && p <= totalPages) {
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
        {/* First Page Button */}
        <button
          className="px-3 py-1 rounded-l-md border z-10 border-primary hover:bg-primary hover:text-primary-foreground bg-white text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => goToPage(1)}
          disabled={page === 1}
          aria-label="First Page"
        >
          &laquo;
        </button>

        {/* Page Numbers */}
        {visiblePages.map((p) => (
          <button
            key={p}
            className={`px-3 py-1 border-y border-primary -ml-px ${
              p === page
                ? "bg-primary text-primary-foreground font-bold z-10"
                : "bg-white text-primary hover:bg-primary hover:text-primary-foreground"
            } transition-colors`}
            onClick={() => goToPage(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            disabled={p === page}
          >
            {p}
          </button>
        ))}

        {/* Last Page Button */}
        <button
          className="px-3 py-1 z-10 rounded-r-md border border-primary hover:bg-primary hover:text-primary-foreground bg-white text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors -ml-px"
          onClick={() => goToPage(totalPages)}
          disabled={page === totalPages}
          aria-label="Last Page"
        >
          &raquo;
        </button>
      </div>
    </nav>
  );
}
