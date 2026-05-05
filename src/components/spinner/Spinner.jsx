import { motion, AnimatePresence } from "framer-motion";
import { LoaderPinwheel } from "lucide-react";
import React from "react";

export default function Spinner({ loading }) {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-black/20 absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 999999999999999 }}
          role="status"
        >
          <LoaderPinwheel size={40} className="animate-spin bg-transparent " />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
