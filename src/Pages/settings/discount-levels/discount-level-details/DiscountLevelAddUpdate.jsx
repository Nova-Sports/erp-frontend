import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import { Modal } from "@/components/modal/Modal";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "react-router-dom";

const defaultForm = {
  discountName: "",
};

const inputFields = [
  {
    id: "discountName",
    label: "Discount Name",
    placeholder: "Enter discount name",
    type: "text",
  },
];

const SubmitButton = ({ isUpdateMode = false }) => {
  const { pending } = useFormStatus();

  let title = isUpdateMode ? "Update" : "Save";
  if (pending) title = isUpdateMode ? "Updating..." : "Saving...";

  return <Button type="submit" title={title} disabled={pending} />;
};

export default function DiscountLevelAddUpdate({ open, onHide, refreshFunc }) {
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  const discountLevelId = searchParam.get("discount-level-id");
  const isUpdateMode = !!discountLevelId;

  const [form, setForm] = useState(defaultForm);

  const getDiscountLevelById = async () => {
    try {
      const { data } = await API.get(`/discount-level/${discountLevelId}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        const d = data.data;
        setForm({
          discountName: d.discountName || "",
        });
      } else {
        notify(data.message || "Failed to fetch discount level", "error", 3000);
      }
    } catch (error) {
      notify(error.message || "Failed to fetch discount level", "error", 3000);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (_prevState, e) => {
    e.preventDefault();
    try {
      let response;
      if (isUpdateMode) {
        const { data } = await API.patch(
          `/discount-level`,
          { ...form, id: discountLevelId },
          { headers: authHeader() },
        );
        response = data;
      } else {
        const { data } = await API.post(`/discount-level`, form, {
          headers: authHeader(),
        });
        response = data;
      }

      if (response?.success) {
        notify(
          isUpdateMode
            ? "Discount level updated successfully"
            : "Discount level added successfully",
          "success",
          3000,
        );
        if (refreshFunc) refreshFunc();
        handleClose();
        return { error: null };
      } else {
        notify(response?.message || "Operation failed", "error", 3000);
        return { error: response?.message || "Operation failed" };
      }
    } catch (error) {
      notify(error.message || "Operation failed", "error", 3000);
      return { error: error.message };
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  const handleClose = () => {
    setForm(defaultForm);
    updateParam("discount-level-id", null);
    onHide();
  };

  useEffect(() => {
    if (open && isUpdateMode) {
      getDiscountLevelById();
    }
    if (!open) {
      setForm(defaultForm);
    }
  }, [open, discountLevelId]);

  return (
    <Modal open={open} onHide={handleClose} position="right" size="full">
      <Modal.Header>
        {isUpdateMode ? "Update Discount Level" : "Add Discount Level"}
      </Modal.Header>
      <Modal.Body appendClass={"!p-0"}>
        <form onSubmit={formAction} noValidate className="h-full flex flex-col">
          <div className="flex-1 p-5">
            {inputFields.map((field) => (
              <div
                key={field.id}
                className="mb-3 bg-neutral-200 p-3 rounded-md"
              >
                <label htmlFor={field.id} className="block mb-1 font-medium">
                  {field.label}
                </label>
                <FormInput
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Modal.Footer>
            <SubmitButton isUpdateMode={isUpdateMode} />
            <Button
              title="Cancel"
              variant="outlineDanger"
              type="button"
              onClick={handleClose}
            />
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
}
