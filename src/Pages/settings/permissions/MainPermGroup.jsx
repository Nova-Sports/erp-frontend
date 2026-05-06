import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import FormLabel from "@/components/form-label/FormLabel";
import { Modal } from "@/components/modal/Modal";
import { useNotification } from "@/contexts/NotificationContext";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { ArrowDown01, ArrowUp01, Plus } from "lucide-react";
import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ isUpdateMode = false }) => {
  const { pending } = useFormStatus();

  let title = isUpdateMode ? "Save Permission" : "Add Permission";
  if (pending) {
    title = isUpdateMode ? "Saving..." : "Adding...";
  }

  return <Button type="submit" title={title} size="sm" disabled={pending} />;
};

export default function MainPermGroup({
  mainGroups,
  activeGroup,
  setActiveGroup,
  refreshFunc,
}) {
  /* ========================= All States ========================= */
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { notify } = useNotification();

  /*  ========================= All Functions ========================= */

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setShowAddModal(false);
    setIsUpdateMode(false);
    setFormData({ name: "", description: "" });
  };

  const handleOpenAddModal = () => {
    setIsUpdateMode(false);
    setFormData({ name: "", description: "" });
    setShowAddModal(true);
  };

  const handleOpenUpdateModal = () => {
    if (!activeGroup?.id) {
      notify("Please select a main group first.", "warning", 3000);
      return;
    }

    setIsUpdateMode(true);
    setFormData({
      name: activeGroup?.name || "",
      description: activeGroup?.description || "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (_prevState, _e) => {
    const name = formData.name?.trim();
    if (!name) {
      return { error: "Group name is required." };
    }

    try {
      let response;
      if (isUpdateMode) {
        response = await updatePermission();
      } else {
        response = await addPermission();
      }

      if (response.success) {
        handleBack();
        notify(
          isUpdateMode
            ? "Main group updated successfully"
            : "Main group added successfully",
          "success",
          3000,
        );

        if (refreshFunc) {
          await refreshFunc();
        }

        return { error: null };
      }

      const errorMessage = response.message || "An error occurred";
      notify(errorMessage, "error", 3000);
      return { error: errorMessage };
    } catch (err) {
      const errorMessage = err?.message || "An error occurred";
      notify(errorMessage, "error", 3000);
      return { error: errorMessage };
    }
  };

  const sortUp = async (group) => {
    try {
      const { data } = await API.post(
        "/permissions-sort-up",
        { id: group.id, parentId: group.parentId ?? null },
        { headers: authHeader() },
      );

      if (data?.success) {
        notify(
          data.message || "Main group moved up successfully",
          "success",
          3000,
        );
        if (refreshFunc) {
          await refreshFunc();
        }
      } else {
        notify(data?.message || "Failed to move main group up", "error", 3000);
      }
    } catch (err) {
      notify(err?.message || "Failed to move main group up", "error", 3000);
    }
  };

  const sortDown = async (group) => {
    try {
      const { data } = await API.post(
        "/permissions-sort-down",
        { id: group.id, parentId: group.parentId ?? null },
        { headers: authHeader() },
      );

      if (data?.success) {
        notify(
          data.message || "Main group moved down successfully",
          "success",
          3000,
        );
        if (refreshFunc) {
          await refreshFunc();
        }
      } else {
        notify(
          data?.message || "Failed to move main group down",
          "error",
          3000,
        );
      }
    } catch (err) {
      notify(err?.message || "Failed to move main group down", "error", 3000);
    }
  };

  // Main group is root-level permission, so parentId is intentionally omitted.
  const addPermission = async () => {
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
      };

      const { data } = await API.post("/permissions", payload, {
        headers: authHeader(),
      });
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Main group update only sends id/name/description; no parentId for root group.
  const updatePermission = async () => {
    try {
      const payload = {
        id: activeGroup.id,
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
      };

      const { data } = await API.patch("/permissions", payload, {
        headers: authHeader(),
      });
      return data;
    } catch (err) {
      throw err;
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (!showAddModal) {
      setFormData({ name: "", description: "" });
      setIsUpdateMode(false);
    }
  }, [showAddModal]);

  return (
    <div>
      {state?.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {state.error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {mainGroups &&
            mainGroups.length > 0 &&
            mainGroups.map((group, index) => {
              const isFirst = index === 0;
              const isLast = index === mainGroups.length - 1;

              return (
                <button
                  key={group.id}
                  className={`px-4 py-0 text-sm font-semibold uppercase transition-colors ${
                    activeGroup?.id === group.id
                      ? "bg-blue-600 text-white"
                      : "bg-primary-light shadow-md text-gray-600 border-r border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveGroup(group)}
                >
                  <div className="flex items-center justify-between gap-3 py-1">
                    <h4 className="m-0">{group.name}</h4>
                    <div className="flex items-center gap-1">
                      <Button
                        title=""
                        size="sm"
                        disabled={isFirst}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFirst) return;
                          sortUp(group);
                        }}
                        appendClasses={`!px-1.5 py-1 ${activeGroup?.id === group.id ? "bg-white hover:bg-primary-light" : ""}`}
                        afterTitle={() => {
                          return (
                            <ArrowUp01
                              className={`size-4 ${activeGroup?.id === group.id ? "text-primary" : "text-white"}`}
                            />
                          );
                        }}
                      />

                      <Button
                        title=""
                        size="sm"
                        disabled={isLast}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLast) return;
                          sortDown(group);
                        }}
                        appendClasses={`!px-1.5 py-1 ${activeGroup?.id === group.id ? "bg-white hover:bg-primary-light" : ""}`}
                        afterTitle={() => {
                          return (
                            <ArrowDown01
                              className={`size-4 ${activeGroup?.id === group.id ? "text-primary" : "text-white"}`}
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="flex items-center gap-2">
          <Button title="Edit Main Group" onClick={handleOpenUpdateModal} />
          <Button
            title="Add Main Group"
            onClick={handleOpenAddModal}
            beforeTitle={() => <Plus size={15} />}
          />
        </div>
      </div>

      <Modal
        open={showAddModal}
        onHide={() => setShowAddModal(false)}
        position="right"
        size="full"
      >
        <Modal.Header>
          {isUpdateMode ? "Update Main Group" : "Add Main Group"}
        </Modal.Header>
        <Modal.Body appendClass={"!p-0 flex flex-col"}>
          <form action={formAction} className="space-y-4 flex-1 flex flex-col">
            <div className="p-6 flex-1">
              <FormLabel>Group Name</FormLabel>
              <FormInput
                name="name"
                value={formData.name}
                onChange={onChange}
                autoFocus={true}
                placeholder="Enter group name"
              />

              <div className="mt-4">
                <FormLabel>Description</FormLabel>
                <FormInput
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="border-t border-gray-500 p-6 flex justify-end">
              <Button
                title="Cancel"
                variant="outlineSecondary"
                onClick={handleBack}
                appendClasses="mr-2"
              />
              <SubmitButton isUpdateMode={isUpdateMode} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
