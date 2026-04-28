import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import FormInput from "../form-input/FormInput";

let hoverClasses =
  "bg-white !text-primary  hover:!bg-primary-hover hover:!text-white";

const LG = 1024;
const isMobile = () => window.innerWidth < LG;

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

  const [goToPageInput, setGoToPageInput] = useState(null);

  let totalPageNumToShow = isMobile() ? 8 : 10; // Show 10 pages at a time

  useEffect(() => {
    if (!totalPages || totalPages < 1) {
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

  if (!totalPages || totalPages < 1) return null;

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
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-0">
          {/* First Page Button */}
          <Button
            onClick={() => goToPage(1)}
            disabled={page === 1}
            aria-label="First Page"
            appendClasses={`!border-primary !py-0 !px-2 border !shadow-none rounded-none rounded-l-md bg-white !text-primary ${hoverClasses}`}
            title={""}
            size="sm"
            beforeTitle={(e) => (
              <div className="w-4 h-7 flex-center">
                <ChevronsLeft size={20} />
              </div>
            )}
          />

          {/* Page Numbers */}
          {visiblePages.map((p) => (
            <Button
              key={p}
              // className={`px-3 py-1 border-y border-primary -ml-px ${
              //   p === page
              //     ? "bg-primary text-primary-foreground font-bold z-10"
              //     : "bg-white text-primary hover:bg-primary hover:text-primary-foreground"
              // } transition-colors`}
              appendClasses={`!border-y-primary border border-x-0 !shadow-none rounded-none disabled:bg-primary disabled:!text-white disabled:opacity-100 ${hoverClasses}`}
              size="sm"
              onClick={() => goToPage(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              disabled={p === page}
              title={p}
            />
          ))}

          {/* Last Page Button */}
          <Button
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
            aria-label="Last Page"
            appendClasses={`!border-primary !py-0 !px-2 border !shadow-none rounded-none rounded-r-md bg-white !text-primary ${hoverClasses}`}
            title={""}
            size="sm"
            beforeTitle={(e) => (
              <div className="w-4 h-7 flex-center">
                <ChevronsRight size={18} />
              </div>
            )}
          />
        </div>
        {/* Go to page input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToPage(Number(goToPageInput));
            setGoToPageInput(null);
          }}
          className="hidden md:flex items-center gap-2"
        >
          <label htmlFor="goto-page" className="text-sm text-gray-500">
            Go to :
          </label>
          <FormInput
            id="goto-page"
            type="number"
            min="1"
            max={totalPages}
            value={goToPageInput || page}
            onChange={(e) => setGoToPageInput(e.target.value)}
            appendClasses="form-control-sm"
          />
          <Button size="sm" title="Go" />
        </form>
      </div>
    </nav>
  );
}
