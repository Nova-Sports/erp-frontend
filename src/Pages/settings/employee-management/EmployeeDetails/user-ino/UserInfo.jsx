import React from "react";
import UserForm from "./UserForm";
import UserPermissions from "./UserPermissions";

export default function UserInfo({ isUpdateMode }) {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-l-lg h-full">
      {/* User Form */}
      <UserForm isUpdateMode={isUpdateMode} />

      {/* <div className=""></div> */}

      {/* Permissions */}
      <UserPermissions isUpdateMode={isUpdateMode} />
    </div>
  );
}
