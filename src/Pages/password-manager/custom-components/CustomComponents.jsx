import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/components/buttons/Button";
import { useEffect } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import FormInput from "@/components/form-input/FormInput";

const RenderButtons = () => {
  const { notify, dismiss } = useNotification();
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      <Button
        title="Primary with icons"
        variant="primary"
        onClick={() => dismiss()}
        appendClasses="flex-center gap-2"
        afterTitle={() => <ArrowRight size={15} />}
        beforeTitle={() => <ArrowLeft size={15} />}
      />
      <Button
        title="Primary sm"
        variant="primary"
        size="sm"
        onClick={() => alert("Primary clicked")}
      />
      <Button
        title="Primary md"
        variant="primary"
        size="md"
        onClick={() => alert("Primary clicked")}
      />
      <Button
        title="Primary lg"
        variant="primary"
        size="lg"
        onClick={() => alert("Primary clicked")}
      />
      <Button
        title="Secondary"
        variant="secondary"
        onClick={() => alert("Secondary clicked")}
      />
      <Button
        title="Info"
        variant="info"
        onClick={() => alert("Info clicked")}
      />
      <Button
        title="Success"
        variant="success"
        onClick={() => alert("Success clicked")}
      />
      <Button
        title="Warning"
        variant="warning"
        onClick={() => alert("Warning clicked")}
      />
      <Button
        title="Danger"
        variant="danger"
        onClick={() => alert("Danger clicked")}
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

export default function CustomComponents() {
  /* ******************** All States ************************* */

  const { notify, dismiss } = useNotification();

  const components = [
    {
      name: "Buttons",
      render: <RenderButtons />,
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
      <h1 className="text-2xl font-bold uppercase text-gray-500 mb-4 border-b-4 border-slate-300  rounded-lg w-fit px-2 pb-2">
        Custom Components
      </h1>
      {components.map(({ name, render }) => (
        <div key={name} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{name}</h2>
          {render}
          <hr className="border-2 my-4 rounded-full border-slate-300" />
        </div>
      ))}
    </div>
  );
}
