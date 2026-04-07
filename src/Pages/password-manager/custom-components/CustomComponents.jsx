import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../../../components/buttons/Button";

export default function CustomComponents() {
  /* ******************** All States ************************* */

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

  return (
    <div>
      <h2 className="text-2xl font-bold ">Buttons</h2>
      <div className="flex flex-wrap gap-4 mt-4">
        <Button
          title="Primary"
          variant="primary"
          onClick={() => alert("Primary clicked")}
          appendClasses="flex-center gap-2"
          afterTitle={() => <ArrowRight />}
          beforeTitle={() => <ArrowLeft />}
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
    </div>
  );
}
