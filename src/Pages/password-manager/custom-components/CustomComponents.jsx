import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/components/buttons/Button";
import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import FormInput from "@/components/form-input/FormInput";
import { Accordion } from "@/components/Accordion/Accordion";
import { Modal } from "@/components/Modal/Modal";

const RenderButtons = () => {
  const { notify, dismiss } = useNotification();
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      <Button
        title="Primary sm"
        variant="primary"
        size="sm"
        onClick={() => notify("Primary clicked", "primary", 3000)}
      />
      <Button
        title="Primary md"
        variant="primary"
        size="md"
        onClick={() => notify("Primary clicked", "primary", 3000)}
      />
      <Button
        title="Primary lg"
        variant="primary"
        size="lg"
        onClick={() => notify("Primary clicked", "primary", 3000)}
      />
      <Button
        title="Secondary"
        variant="secondary"
        onClick={() => notify("Secondary clicked", "secondary", 3000)}
      />
      <Button
        title="Info"
        variant="info"
        onClick={() => notify("Info clicked", "info", 3000)}
      />
      <Button
        title="Success"
        variant="success"
        onClick={() => notify("Success clicked", "success", 3000)}
      />
      <Button
        title="Warning"
        variant="warning"
        onClick={() => notify("Warning clicked", "warning", 3000)}
      />
      <Button
        title="Danger"
        variant="danger"
        onClick={() => notify("Danger clicked", "danger", 3000)}
      />
      <Button
        title="Primary with icons"
        variant="primary"
        onClick={() => dismiss()}
        appendClasses="flex-center gap-2"
        afterTitle={() => <ArrowRight size={15} />}
        beforeTitle={() => <ArrowLeft size={15} />}
      />
    </div>
  );
};

const RenderInputs = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <input type="text" placeholder="Enter text" className="form-control" />
      <input
        type="text"
        placeholder="Enter text"
        className="form-control form-control-sm"
      />
      <FormInput type="email" />
      <FormInput type="password" />
      <input
        type="number"
        placeholder="Enter number"
        className="form-control"
      />
      <input type="email" placeholder="Enter email" className="form-control" />
      <input
        type="password"
        placeholder="Enter password"
        className="form-control"
      />
      <input type="date" placeholder="Select date" className="form-control" />
      <input type="file" className="form-control" />
      <textarea
        className="form-control"
        rows={4}
        placeholder="Enter text here..."
      />
      <select className="form-control">
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
      </select>
    </div>
  );
};

const RenderModals = () => {
  const [openCenterModal, setOpenCenterModal] = useState(true);
  return (
    <div>
      <Modal
        open={openCenterModal}
        onHide={() => {
          setOpenCenterModal(false);
        }}
      >
        {" "}
        child
      </Modal>
    </div>
  );
};

const RenderAccordion = () => {
  return (
    <div>
      <Accordion>
        <Accordion.Header>What is a compound component?</Accordion.Header>
        <Accordion.Content>
          It's a pattern where a parent component shares implicit state with its
          sub-components via Context.
        </Accordion.Content>
      </Accordion>
    </div>
  );
};

export default function CustomComponents() {
  /* ******************** All States ************************* */

  const { notify, dismiss } = useNotification();

  const components = [
    {
      name: "Buttons",
      render: <RenderButtons />,
    },
    {
      name: "Modals",
      render: <RenderModals />,
    },
    {
      name: "Accordion",
      render: <RenderAccordion />,
    },
    {
      name: "Inputs",
      render: <RenderInputs />,
    },

    // Future components can be added here
  ];

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

  useEffect(() => {
    notify(
      "This page is under construction. Check back later for new components!",
      "danger",
      5000,
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase text-gray-500 mb-8 border-b-4 border-slate-300  rounded-lg w-fit px-2 pe-8 pb-2">
        Custom Components
      </h1>
      {components.map(({ name, render }, index) => (
        <div key={name} className="mb-4">
          <Accordion>
            <Accordion.Header appendClasses={"font-extrabold"}>
              {name}
            </Accordion.Header>
            <Accordion.Content>{render}</Accordion.Content>
          </Accordion>
          {/* {index < components.length - 1 && (
            <hr className="border-1 my-4 rounded-full border-neutral-400" />
          )} */}
        </div>
      ))}
    </div>
  );
}
