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
  taxAccountNumber: "",
  taxAccountName: "",
  taxRate: "",
};

const inputFields = [
  {
    id: "taxAccountNumber",
    label: "Tax Account Number",
    placeholder: "Tax Account Number",
    type: "text",
  },
  {
    id: "taxAccountName",
    label: "Tax Account Name",
    placeholder: "Tax Account Name",
    type: "text",
  },
  {
    id: "taxRate",
    label: "Tax Rate (%)",
    placeholder: "e.g. 10.00",
    type: "text",
  },
];

const SubmitButton = ({ isUpdateMode = false }) => {
  const { pending } = useFormStatus();

  let title = isUpdateMode ? "Update" : "Save";
  if (pending) title = isUpdateMode ? "Updating..." : "Saving...";

  return <Button type="submit" title={title} disabled={pending} />;
};

export default function TaxRateAddUpdate({ open, onHide, refreshFunc }) {
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  const taxRateId = searchParam.get("tax-rate-id");
  const isUpdateMode = !!taxRateId;

  const [form, setForm] = useState(defaultForm);

  /*  ========================= All Functions ========================= */

  const getTaxRateById = async () => {
    try {
      const { data } = await API.get(`/tax-rate/${taxRateId}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        const d = data.data;
        setForm({
          taxAccountNumber: d.taxAccountNumber || "",
          taxAccountName: d.taxAccountName || "",
          taxRate: d.taxRate || "",
        });
      } else {
        notify(data.message || "Failed to fetch tax rate", "error", 3000);
      }
    } catch (error) {
      notify(error.message || "Failed to fetch tax rate", "error", 3000);
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
          `/tax-rate`,
          { ...form, id: taxRateId },
          { headers: authHeader() },
        );
        response = data;
      } else {
        const { data } = await API.post(`/tax-rate`, form, {
          headers: authHeader(),
        });
        response = data;
      }

      if (response?.success) {
        notify(
          isUpdateMode
            ? "Tax rate updated successfully"
            : "Tax rate added successfully",
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
    updateParam("tax-rate-id", null);
    onHide();
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (open && isUpdateMode) {
      getTaxRateById();
    }
    if (!open) {
      setForm(defaultForm);
    }
  }, [open, taxRateId]);

  return (
    <Modal open={open} onHide={handleClose} position="right" size="full">
      <Modal.Header>
        {isUpdateMode ? "Update Tax Rate" : "Add Tax Rate"}
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
