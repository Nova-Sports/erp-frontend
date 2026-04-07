import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../../../components/buttons/Button";

const RenderButtons = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      <Button
        title="Primary with icons"
        variant="primary"
        onClick={() => alert("Primary clicked")}
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

export default function CustomComponents() {
  /* ******************** All States ************************* */

  const components = [
    {
      name: "Buttons",
      render: <RenderButtons />,
    },
    // Future components can be added here
  ];

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

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
