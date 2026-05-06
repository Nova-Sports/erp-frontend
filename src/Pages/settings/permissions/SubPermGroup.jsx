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

  let title = isUpdateMode ? "Save Sub Group" : "Add Sub Group";
  if (pending) title = isUpdateMode ? "Saving..." : "Adding...";

  return <Button type="submit" title={title} size="sm" disabled={pending} />;
};

export default function SubPermGroup({
  permissionsList,
  activeGroup,
  activeSubGroup,
  setActiveSubGroup,
  refreshFunc,
}) {
  /* ========================= All States ========================= */
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editTarget, setEditTarget] = useState(null);

  const { notify } = useNotification();

  // Sub-groups are items whose parentId matches the active main group
  const subGroups = useMemo(() => {
    if (!permissionsList || !activeGroup?.id) return [];
    return permissionsList.filter((p) => p.parentId === activeGroup.id);
  }, [permissionsList, activeGroup?.id]);

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
    if (!activeGroup?.id) {
      notify("Please select a main group first.", "warning", 3000);
      return;
    }
    setIsUpdateMode(false);
    setEditTarget(null);
    setFormData({ name: "", description: "" });
    setShowAddModal(true);
  };

  const handleOpenUpdateModal = (subGroup) => {
    setIsUpdateMode(true);
    setEditTarget(subGroup);
    setFormData({
      name: subGroup.name || "",
      description: subGroup.description || "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (_prevState, _e) => {
    const name = formData.name?.trim();
    if (!name) {
      return { error: "Sub group name is required." };
    }

    try {
      const response = isUpdateMode
        ? await updateSubGroup()
        : await addSubGroup();

      if (response.success) {
        handleBack();
        notify(
          isUpdateMode
            ? "Sub group updated successfully"
            : "Sub group added successfully",
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

  const addSubGroup = async () => {
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        parentId: activeGroup.id,
      };
      const { data } = await API.post("/permissions", payload, {
        headers: authHeader(),
      });
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateSubGroup = async () => {
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
          data.message || "Sub group deleted successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
      } else {
        notify(data?.message || "Failed to delete sub group", "error", 3000);
      }
    } catch (err) {
      notify(err?.message || "Failed to delete sub group", "error", 3000);
    }
  };

  const sortUp = async (subGroup) => {
    try {
      const { data } = await API.post(
        "/permissions-sort-up",
        { id: subGroup.id, parentId: subGroup.parentId },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify(
          data.message || "Sub group moved up successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
      } else {
        notify(data?.message || "Failed to move sub group up", "error", 3000);
      }
    } catch (err) {
      notify(err?.message || "Failed to move sub group up", "error", 3000);
    }
  };

  const sortDown = async (subGroup) => {
    try {
      const { data } = await API.post(
        "/permissions-sort-down",
        { id: subGroup.id, parentId: subGroup.parentId },
        { headers: authHeader() },
      );
      if (data?.success) {
        notify(
          data.message || "Sub group moved down successfully",
          "success",
          3000,
        );
        if (refreshFunc) await refreshFunc();
      } else {
        notify(data?.message || "Failed to move sub group down", "error", 3000);
      }
    } catch (err) {
      notify(err?.message || "Failed to move sub group down", "error", 3000);
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  /* ========================= All UseEffects ========================= */

  // When main group changes, reset activeSubGroup to first sub-group of the new group
  useEffect(() => {
    if (!activeGroup?.id) {
      setActiveSubGroup(null);
      return;
    }
    if (!activeSubGroup || activeSubGroup.parentId !== activeGroup.id) {
      setActiveSubGroup(subGroups[0] || null);
    }
  }, [activeGroup?.id, subGroups]);

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
          Sub Groups
          {activeGroup ? (
            <span className="normal-case font-normal text-gray-400 ml-1">
              — {activeGroup.name}
            </span>
          ) : null}
        </h4>
        <Button
          title="Add Sub Group"
          size="sm"
          onClick={handleOpenAddModal}
          beforeTitle={() => <Plus size={14} />}
        />
      </div>

      {/* List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {!activeGroup ? (
          <p className="text-sm text-gray-400 p-4 text-center">
            Select a main group above.
          </p>
        ) : subGroups.length === 0 ? (
          <p className="text-sm text-gray-400 p-4 text-center">
            No sub groups yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {subGroups.map((sg, index) => {
                const isFirst = index === 0;
                const isLast = index === subGroups.length - 1;
                const isActive = activeSubGroup?.id === sg.id;

                return (
                  <tr
                    key={sg.id}
                    className={`cursor-pointer transition-colors ${
                      isActive ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveSubGroup(sg)}
                  >
                    <td className="px-3 py-2">
                      <p
                        className={`font-medium ${isActive ? "text-blue-600" : "text-gray-800"}`}
                      >
                        {sg.name}
                      </p>
                      {sg.description && (
                        <p className="text-xs text-gray-400 font-normal">
                          {sg.description}
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          title=""
                          size="sm"
                          disabled={isFirst}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isFirst) sortUp(sg);
                          }}
                          appendClasses="!px-1.5 py-1"
                          afterTitle={() => <ArrowUp01 className="size-4" />}
                        />
                        <Button
                          title=""
                          size="sm"
                          disabled={isLast}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLast) sortDown(sg);
                          }}
                          appendClasses="!px-1.5 py-1"
                          afterTitle={() => <ArrowDown01 className="size-4" />}
                        />
                        <Button
                          title=""
                          size="sm"
                          variant="outlinePrimary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUpdateModal(sg);
                          }}
                          appendClasses="!px-1.5 py-1"
                          afterTitle={() => <Pencil className="size-4" />}
                        />
                        <DeleteModalButton
                          onDeleteConfirm={() => handleDelete(sg.id)}
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
          {isUpdateMode ? "Update Sub Group" : "Add Sub Group"}
        </Modal.Header>
        <Modal.Body appendClass="!p-0 flex flex-col">
          {state?.error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {state.error}
            </div>
          )}
          <form action={formAction} className="space-y-4 flex-1 flex flex-col">
            <div className="p-6 flex-1">
              <FormLabel>Sub Group Name</FormLabel>
              <FormInput
                name="name"
                value={formData.name}
                onChange={onChange}
                autoFocus={true}
                placeholder="Enter sub group name"
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
