import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import { Modal } from "@/components/modal/Modal";
import { useNotification } from "@/contexts/NotificationContext";
import React, { useActionState, useEffect, useState } from "react";
import { generatePassword } from "./passwordUtils";
import { Shuffle } from "lucide-react";
import { useFormStatus } from "react-dom";
import API from "@/services/axios";
import authHeader from "@/services/auth-header";

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

const SubmitButton = ({ isUpdateMode = false }) => {
  const { pending } = useFormStatus();

  let title = isUpdateMode ? "Update" : "Add";
  if (pending) {
    title = isUpdateMode ? "Updating..." : "Adding...";
  }

  return (
    <>
      <Button type="submit" title={title} disabled={pending} />
    </>
  );
};

export default function PsAddUpdate({
  isUpdateMode,
  setShowAddUpdateModal,
  setIsUpdateMode,
  setCurrentRowData,
  currentRowData,
  filterByTab,
  getPasswordType,
  refreshFunc,
}) {
  const { notify } = useNotification();
  /* ========================= All States ========================= */

  const [form, setForm] = useState({
    ps_title: "",
    ps_url: "",
    ps_username: "",
    ps_passwordValue: "",
  });

  /*  ========================= All Functions ========================= */

  const handleSubmit = async (_prevState, e) => {
    e.preventDefault();

    try {
      let response;
      if (isUpdateMode) {
        response = await updatePassword();
      } else {
        response = await addPassword();
      }

      if (response.success) {
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
        if (refreshFunc) refreshFunc();
        return { error: null };
      } else {
        notify(response.message || "An error occurred", "error", 3000);
        return { error: response.message || "An error occurred" };
      }
    } catch (err) {
      notify(err.message, "error", 3000);
      return { error: err.message };
    }
  };

  const generateRandomPassword = () => {
    let randomPassword = generatePassword();
    setForm({
      ...form,
      ps_passwordValue: randomPassword,
    });
    notify("Random password generated", "success", 3000);
  };

  const addPassword = async () => {
    try {
      const { data } = await API.post(
        "/sales/password",
        { ...form, ps_passwordType: getPasswordType(filterByTab) },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updatePassword = async () => {
    try {
      const { data } = await API.patch(
        "/sales/password",
        { ...form, id: currentRowData.id },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    setForm({
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
      <Modal.Body appendClass={"!p-0"}>
        {/* Form fields for adding/updating entry go here */}
        <form onSubmit={formAction} noValidate className="h-full flex flex-col">
          <div className="flex-1  p-5">
            {inputFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-3 bg-neutral-200 p-3 rounded-md"
              >
                <div className="flex items-center justify-between ">
                  <label htmlFor={field.id} className="block mb-1 font-medium">
                    {field.label}
                  </label>
                  {field.id === "ps_passwordValue" && (
                    <div className="mb-1">
                      <Button
                        title="Generate"
                        size="sm"
                        type="button"
                        onClick={generateRandomPassword}
                        // beforeTitle={() => {
                        //   return <Shuffle size={15} />;
                        // }}
                        afterTitle={() => {
                          return <Shuffle size={15} />;
                        }}
                      />
                    </div>
                  )}
                </div>
                <FormInput
                  type={field.type}
                  {...(index === 0 && { autoFocus: true })}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      [field.id]: e.target.value,
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <Modal.Footer>
            <SubmitButton isUpdateMode={isUpdateMode} />
            <Button
              title="Cancel"
              variant="secondary"
              onClick={() => {
                setShowAddUpdateModal(false);
                setIsUpdateMode(false);
                setCurrentRowData(null);
              }}
            />
          </Modal.Footer>
        </form>
      </Modal.Body>
    </div>
  );
}
