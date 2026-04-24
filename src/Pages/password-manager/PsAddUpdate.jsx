import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import { Modal } from "@/components/modal/Modal";
import { useNotification } from "@/contexts/NotificationContext";
import React, { useEffect, useState } from "react";

// ps_title
// ps_url
// ps_username
// ps_passwordValue

let inputFields = [
  {
    id: "ps_title",
    label: "Title",
    placeholder: "Enter Title...",
    type: "text",
  },
  {
    id: "ps_url",
    label: "URL",
    placeholder: "Enter URL...",
    type: "text",
  },
  {
    id: "ps_username",
    label: "Username",
    placeholder: "Enter Username...",
    type: "text",
  },
  {
    id: "ps_passwordValue",
    label: "Password",
    placeholder: "Enter Password...",
    type: "password",
  },
];

export default function PsAddUpdate({
  isUpdateMode,
  setShowAddUpdateModal,
  setIsUpdateMode,
  setCurrentRowData,
  currentRowData,
}) {
  const { notify } = useNotification();
  /* ========================= All States ========================= */

  const [formData, setFormData] = useState({
    ps_title: "",
    ps_url: "",
    ps_username: "",
    ps_passwordValue: "",
  });

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    setFormData({
      ps_title: currentRowData?.ps_title || "",
      ps_url: currentRowData?.ps_url || "",
      ps_username: currentRowData?.ps_username || "",
      ps_passwordValue: currentRowData?.ps_passwordValue || "",
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Modal.Header>
        {isUpdateMode ? "Update Entry" : "Add New Entry"}
      </Modal.Header>
      <Modal.Body>
        {/* Form fields for adding/updating entry go here */}
        <form>
          {inputFields.map((field) => (
            <div key={field.id} className="mb-3 bg-neutral-200 p-3 rounded-md">
              <label htmlFor={field.id} className="block mb-1 font-medium">
                {field.label}
              </label>
              <FormInput
                type={field.type}
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    [field.id]: e.target.value,
                  });
                }}
              />
            </div>
          ))}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          title={isUpdateMode ? "Update" : "Add"}
          variant="primary"
          onClick={() => {
            // Handle add/update logic here
            setShowAddUpdateModal(false);
            setIsUpdateMode(false);
            setCurrentRowData(null);
            notify(
              isUpdateMode
                ? "Entry updated successfully"
                : "Entry added successfully",
              "success",
              3000,
            );
          }}
        />
        <Button
          title="Cancel"
          variant="secondary"
          onClick={() => {
            setShowAddUpdateModal(false);
            setIsUpdateMode(false);
            setCurrentRowData(null);
            notify("Action cancelled", "warning", 3000);
          }}
        />
      </Modal.Footer>
    </div>
  );
}
