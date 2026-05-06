import Button from "@/components/buttons/Button";
import DeleteModalButton from "@/components/delete-modal/DeleteModalButton";
import FormInput from "@/components/form-input/FormInput";
import FormLabel from "@/components/form-label/FormLabel";
import { Modal } from "@/components/modal/Modal";
import { useNotification } from "@/contexts/NotificationContext";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { ArrowDown01, ArrowUp01, Pencil, Plus } from "lucide-react";
import React, { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ isUpdateMode = false }) => {
  const { pending } = useFormStatus();

  let title = isUpdateMode ? "Save Permission" : "Add Permission";
  if (pending) title = isUpdateMode ? "Saving..." : "Adding...";

  return <Button type="submit" title={title} size="sm" disabled={pending} />;
};

export default function PermItems({
  permissionsList,
  activeSubGroup,
  refreshFunc,
}) {
  /* ========================= All States ========================= */
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editTarget, setEditTarget] = useState(null);

  const { notify } = useNotification();

  // Permissions whose parentId matches the active sub-group
  const permItems = useMemo(() => {
    if (!permissionsList || !activeSubGroup?.id) return [];
    return permissionsList.filter((p) => p.parentId === activeSubGroup.id);
  }, [permissionsList, activeSubGroup?.id]);

  /* ========================= All Functions ========================= */

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setShowAddModal(false);
    setIsUpdateMode(false);
    setEditTarget(null);
    setFormData({ name: "", description: "" });
  };

  const handleOpenAddModal = () => {
    if (!activeSubGroup?.id) {
      notify("Please select a sub group first.", "warning", 3000);
      return;
    }
    setIsUpdateMode(false);
    setEditTarget(null);
    setFormData({ name: "", description: "" });
    setShowAddModal(true);
  };

  const handleOpenUpdateModal = (item) => {
    setIsUpdateMode(true);
    setEditTarget(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (_prevState, _e) => {
    const name = formData.name?.trim();
    if (!name) {
      return { error: "Permission name is required." };
    }

    try {
      const response = isUpdateMode ? await updateItem() : await addItem();

      if (response.success) {
        handleBack();
        notify(
          isUpdateMode
            ? "Permission updated successfully"
            : "Permission added successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
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

  const addItem = async () => {
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        parentId: activeSubGroup.id,
      };
      const { data } = await API.post("/permissions", payload, {
        headers: authHeader(),
      });
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateItem = async () => {
    try {
      const payload = {
        id: editTarget.id,
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

  const handleDelete = async (id) => {
    try {
      const { data } = await API.delete(`/permissions/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        notify(
          data.message || "Permission deleted successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
      } else {
        notify(data?.message || "Failed to delete permission", "error", 3000);
      }
    } catch (err) {
      notify(err?.message || "Failed to delete permission", "error", 3000);
    }
  };

  const sortUp = async (item) => {
    try {
      const { data } = await API.post(
        "/permissions-sort-up",
        { id: item.id, parentId: item.parentId },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify(
          data.message || "Permission moved up successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
      } else {
        notify(data?.message || "Failed to move permission up", "error", 3000);
      }
    } catch (err) {
      notify(err?.message || "Failed to move permission up", "error", 3000);
    }
  };

  const sortDown = async (item) => {
    try {
      const { data } = await API.post(
        "/permissions-sort-down",
        { id: item.id, parentId: item.parentId },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify(
          data.message || "Permission moved down successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
      } else {
        notify(
          data?.message || "Failed to move permission down",
          "error",
          3000,
        );
      }
    } catch (err) {
      notify(err?.message || "Failed to move permission down", "error", 3000);
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (!showAddModal) {
      setFormData({ name: "", description: "" });
      setIsUpdateMode(false);
      setEditTarget(null);
    }
  }, [showAddModal]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase">
          Permissions
          {activeSubGroup ? (
            <span className="normal-case font-normal text-gray-400 ml-1">
              — {activeSubGroup.name}
            </span>
          ) : null}
        </h4>
        <Button
          title="Add Permission"
          size="sm"
          onClick={handleOpenAddModal}
          beforeTitle={() => <Plus size={14} />}
        />
      </div>

      {/* List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {!activeSubGroup ? (
          <p className="text-sm text-gray-400 p-4 text-center">
            Select a sub group first.
          </p>
        ) : permItems.length === 0 ? (
          <p className="text-sm text-gray-400 p-4 text-center">
            No permissions yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {permItems.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === permItems.length - 1;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 font-normal">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          title=""
                          size="sm"
                          disabled={isFirst}
                          onClick={() => {
                            if (!isFirst) sortUp(item);
                          }}
                          appendClasses="!px-1.5 py-1"
                          afterTitle={() => <ArrowUp01 className="size-4" />}
                        />
                        <Button
                          title=""
                          size="sm"
                          disabled={isLast}
                          onClick={() => {
                            if (!isLast) sortDown(item);
                          }}
                          appendClasses="!px-1.5 py-1"
                          afterTitle={() => <ArrowDown01 className="size-4" />}
                        />
                        <Button
                          title=""
                          size="sm"
                          variant="outlinePrimary"
                          onClick={() => handleOpenUpdateModal(item)}
                          appendClasses="!px-1.5 py-1"
                          afterTitle={() => <Pencil className="size-4" />}
                        />
                        <DeleteModalButton
                          onDeleteConfirm={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={showAddModal}
        onHide={() => setShowAddModal(false)}
        position="right"
        size="full"
      >
        <Modal.Header>
          {isUpdateMode ? "Update Permission" : "Add Permission"}
        </Modal.Header>
        <Modal.Body appendClass="!p-0 flex flex-col">
          {state?.error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {state.error}
            </div>
          )}
          <form action={formAction} className="space-y-4 flex-1 flex flex-col">
            <div className="p-6 flex-1">
              <FormLabel>Permission Name</FormLabel>
              <FormInput
                name="name"
                value={formData.name}
                onChange={onChange}
                autoFocus={true}
                placeholder="Enter permission name"
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
