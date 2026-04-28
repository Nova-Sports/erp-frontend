import React, { useEffect, useState } from "react";
import Button from "../buttons/Button";
import { Search } from "lucide-react";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import { useSearchParams } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

export default function CSearch({
  updateText = null,
  placeholder = "Search...",
  customClasses = "",
}) {
  /* ========================= All States ========================= */
  const [query, setQuery] = useState(null);
  const updateParam = useUpdateParams();
  const [searchParams] = useSearchParams();

  /*  ========================= All Functions ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    let url_encoded_query = encodeURIComponent(query ? query.trim() : "");

    let trimmedQuery = url_encoded_query ? url_encoded_query.trim() : "";
    if (updateText) {
      updateText(trimmedQuery);
    }
    updateParam("query", trimmedQuery);
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    let _query = searchParams.get("query") || "";

    if (_query) {
      setQuery(_query);
    }
  }, [searchParams]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.2, x: 50 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              title="Clear"
              type="button"
              variant="outlineDanger"
              onClick={() => {
                setQuery("");
                updateParam("query", "");
                if (updateText) {
                  updateText("");
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
