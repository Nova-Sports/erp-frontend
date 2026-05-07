import Button from "@/components/buttons/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function TemplateAddUpdate({
  setShowAddUpdatePage,
  refreshFunc,
  getDataByIdApi,
  addDataApi,
  updateDataApi,
  RenderFilterTabs,
}) {
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  let isUpdateMode = searchParam.get("template-id") ? true : false;

  const [templateData, setTemplateData] = useState(null);

  const [formData, setFormData] = useState({
    col1: "",
    col2: "",
    col3: "",
  });

  /*  ========================= All Functions ========================= */

  const getTemplateById = async () => {
    try {
      const id = searchParam.get("template-id");

      if (!id) {
        notify("Invalid template ID", "error", 3000);
        return;
      }

      const { data } = await API.get(`${getDataByIdApi}/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        setTemplateData(data.data);
      } else {
        notify(data.message || "Failed to fetch template data", "error", 3000);
      }
    } catch (error) {
      console.log("Get Template By Id Error: ", error);
      notify(error.message || "Failed to fetch template data", "error", 3000);
    }
  };

  const handleBack = () => {
    setShowAddUpdatePage(false);
    updateParam("template-id", null);
  };

  const handleSubmit = async (_prevState, _e) => {
    try {
      let response;
      if (isUpdateMode) {
        response = await updateTemplate();
      } else {
        response = await addTemplate();
      }

      if (response.success) {
        notify(
          isUpdateMode
            ? "Template updated successfully"
            : "Template added successfully",
          "success",
          3000,
        );
        updateParam("template-id", response.data.id);
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

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  const addTemplate = async () => {
    try {
      const { data } = await API.post(
        addDataApi,
        { formData },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateTemplate = async () => {
    try {
      const { data } = await API.patch(
        updateDataApi,
        { formData, id: templateData.id },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (isUpdateMode) {
      getTemplateById();
    }
  }, [isUpdateMode]);

  return (
    <div className="flex flex-col overflow-y-hidden">
      {/*=======================================
               Template Header    
           ========================================= */}
      <div
        className={`mb-3 hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
      >
        <div>
          <div className="hidden lg:flex text-2xl text-gray-500 font-bold">
            Template
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            title="Save"
            variant="success"
            appendClasses="py-1.5"
            size="sm"
            onClick={handleSubmit}
          />
          <Button
            onClick={handleBack}
            size="sm"
            title="Back"
            variant="outlineDanger"
          />
        </div>
      </div>
      {/*=======================================
             Content Area    
         ========================================= */}
      <div className="bg-white p-4 lg:p-6 max-md:m-3 rounded-lg h-[84svh] lg:h-[86svh] overflow-y-auto">
        <form autoComplete="off" action={formAction} noValidate>
          {/* Add form fields here */}
        </form>
      </div>
      <div className="lg:hidden flex justify-between items-center px-3 h-full gap-3">
        <div className="bg-white shadow-sm py-2 rounded-lg flex-1 px-3 flex items-center justify-between">
          <div className="flex items-center justify-between gap-2 w-full">
            <Button
              title="Save"
              variant="success"
              appendClasses="py-1.5"
              size="sm"
              onClick={handleSubmit}
            />
            <Button
              onClick={handleBack}
              size="sm"
              title="Back"
              variant="outlineDanger"
            />
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg w-fit">
          <RenderFilterTabs />
        </div>
      </div>
    </div>
  );
}
