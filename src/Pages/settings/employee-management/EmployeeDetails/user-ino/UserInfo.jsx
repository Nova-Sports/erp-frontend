import React, { useState } from "react";
import UserForm from "./UserForm";
import UserPermissions from "./UserPermissions";

export default function UserInfo({
  isUpdateMode,
  setIsUpdateMode,
  refreshFunc,
  handleBack,
  userData,
  setUserData,
  locations = [],
  userFormRef,
}) {
  /* ========================= All States ========================= */
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-l-lg flex-1">
      {/* User Form */}
      <UserForm
        isUpdateMode={isUpdateMode}
        setIsUpdateMode={setIsUpdateMode}
        refreshFunc={refreshFunc}
        handleBack={handleBack}
        userData={userData}
        setUserData={setUserData}
        locations={locations}
        selectedPermissions={selectedPermissions}
        formRef={userFormRef}
      />

      {/* Permissions */}
      <UserPermissions
        isUpdateMode={isUpdateMode}
        userData={userData}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
    </div>
  );
}
