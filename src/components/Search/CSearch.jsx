import React from "react";
import Button from "../buttons/Button";
import { Search } from "lucide-react";

export default function CSearch() {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="form-control min-w-40 2xl:!w-96"
      />

      <Button
        title=""
        afterTitle={() => {
          return <Search size={18} />;
        }}
        variant="info"
        appendClasses="xl:hidden"
      />
      <Button title="Search" variant="info" appendClasses="hidden xl:block" />
    </div>
  );
}
