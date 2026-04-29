import { Search, Trash2 } from "lucide-react";
import { memo, useEffect, useState } from "react";
import Button from "../buttons/Button";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

function CSearch({
  updateText = null,
  placeholder = "Search...",
  customClasses = "",
}) {
  /* ========================= All States ========================= */
  const [searchParam] = useSearchParams();

  const [query, setQuery] = useState(() => {
    const q = searchParam.get("query");
    return q ? decodeURIComponent(q) : "";
  });

  /*  ========================= All Functions ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    let url_encoded_query = encodeURIComponent(query ? query.trim() : "");

    let trimmedQuery = url_encoded_query ? url_encoded_query.trim() : "";
    if (updateText) {
      updateText(trimmedQuery);
    }
  };

  /* ========================= All UseEffects ========================= */

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`form-control min-w-40 2xl:!w-96 ${customClasses}`}
      />

      <Button
        title=""
        type="submit"
        afterTitle={() => {
          return <Search size={18} />;
        }}
        variant="info"
        appendClasses="xl:hidden"
      />
      <Button
        title="Search"
        type="submit"
        variant="info"
        appendClasses="hidden xl:block"
      />
      <AnimatePresence initial={false}>
        {Boolean(query) && (
          <motion.div
            key="clear-button"
            initial={{ opacity: 0, scale: 0.2, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.2, x: 50 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              title="Clear"
              type="button"
              variant="outlineDanger"
              appendClasses="hidden lg:block"
              onClick={() => {
                setQuery(""); // triggers animation
                setTimeout(() => {
                  updateText(""); // triggers parent update AFTER animation
                }, 200);
              }}
            />
            <Button
              title=""
              afterTitle={() => {
                return <Trash2 size={15} />;
              }}
              type="button"
              variant="outlineDanger"
              appendClasses="lg:hidden !px-2"
              onClick={() => {
                setQuery(""); // triggers animation
                setTimeout(() => {
                  updateText(""); // triggers parent update AFTER animation
                }, 200);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default memo(CSearch);
