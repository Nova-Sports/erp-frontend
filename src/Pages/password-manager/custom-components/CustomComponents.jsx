import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/components/buttons/Button";
import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import FormInput from "@/components/form-input/FormInput";
import { Accordion } from "@/components/Accordion/Accordion";
import { Modal } from "@/components/modal/Modal";
import { Dropdown } from "@/components/dropdown/Dropdown";
import Table from "@/components/table/Table";

/*=======================================
    API Search Demo
    Uses JSONPlaceholder /users?q= as a fake API
========================================= */
const ApiSearchDemo = () => {
  const [selected, setSelected] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term) => {
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
      const data = await res.json();
      // Client filter to simulate server search (real API would filter server-side)
      const filtered = data.filter((u) =>
        u.name.toLowerCase().includes(term.toLowerCase()),
      );
      setResults(filtered);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm">
      <Dropdown
        value={selected}
        onChange={setSelected}
        onSearch={handleSearch}
        loading={loading}
        debounce={400}
        placeholder="Search users..."
      >
        <Dropdown.Trigger />
        <Dropdown.Menu>
          {results.length > 0
            ? results.map((user) => (
                <Dropdown.Item key={user.id} value={user.name}>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </Dropdown.Item>
              ))
            : !loading && (
                <Dropdown.Empty>Type to search users...</Dropdown.Empty>
              )}
        </Dropdown.Menu>
      </Dropdown>
      <p className="text-xs text-gray-400 mt-1">
        Selected: {selected || "none"}
      </p>
    </div>
  );
};

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
  const [inputs, setInputs] = useState({
    text1: "",
    text2: "",
    email1: "",
    email2: "",
    password1: "",
    password2: "",
    number: "",
    date: "",
    file: null,
    textarea: "",
    select: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <input
        type="text"
        name="text1"
        value={inputs.text1}
        onChange={handleChange}
        placeholder="Enter text"
        className="form-control"
      />
      <input
        type="text"
        name="text2"
        value={inputs.text2}
        onChange={handleChange}
        placeholder="Enter text"
        className="form-control form-control-sm"
      />
      <FormInput
        type="email"
        value={inputs.email1}
        onChange={(e) =>
          setInputs((prev) => ({ ...prev, email1: e.target.value }))
        }
      />
      <FormInput
        type="password"
        value={inputs.password1}
        onChange={(e) =>
          setInputs((prev) => ({ ...prev, password1: e.target.value }))
        }
      />
      <input
        type="number"
        name="number"
        value={inputs.number}
        onChange={handleChange}
        placeholder="Enter number"
        className="form-control"
      />
      <input
        type="email"
        name="email2"
        value={inputs.email2}
        onChange={handleChange}
        placeholder="Enter email"
        className="form-control"
      />
      <input
        type="password"
        name="password2"
        value={inputs.password2}
        onChange={handleChange}
        placeholder="Enter password"
        className="form-control"
      />
      <input
        type="date"
        name="date"
        value={inputs.date}
        onChange={handleChange}
        placeholder="Select date"
        className="form-control"
      />
      <input
        type="file"
        name="file"
        onChange={handleChange}
        className="form-control"
      />
      <textarea
        name="textarea"
        value={inputs.textarea}
        onChange={handleChange}
        className="form-control"
        rows={4}
        placeholder="Enter text here..."
      />
      <select
        name="select"
        value={inputs.select}
        onChange={handleChange}
        className="form-control"
      >
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
      </select>
    </div>
  );
};

const RenderModals = () => {
  const [openCenterSm, setOpenCenterSm] = useState(false);
  const [openCenterMd, setOpenCenterMd] = useState(false);
  const [openCenterLg, setOpenCenterLg] = useState(false);
  const [openCenterXl, setOpenCenterXl] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  const [openBottom, setOpenBottom] = useState(false);
  const [openBottomLeft, setOpenBottomLeft] = useState(false);
  const [openBottomRight, setOpenBottomRight] = useState(false);
  const [openBottomFull, setOpenBottomFull] = useState(false);

  const [openNestedModal, setOpenNestedModal] = useState(false);

  const centerModals = [
    {
      label: "Center SM",
      position: "center",
      size: "sm",
      open: openCenterSm,
      setOpen: setOpenCenterSm,
    },
    {
      label: "Center MD",
      position: "center",
      size: "md",
      open: openCenterMd,
      setOpen: setOpenCenterMd,
    },
    {
      label: "Center LG",
      position: "center",
      size: "lg",
      open: openCenterLg,
      setOpen: setOpenCenterLg,
    },
    {
      label: "Center XL",
      position: "center",
      size: "xl",
      open: openCenterXl,
      setOpen: setOpenCenterXl,
    },
  ];

  const rightModals = [
    {
      label: "Right",
      position: "right",
      open: openRight,
      setOpen: setOpenRight,
    },
  ];

  const bottomModals = [
    {
      label: "Bottom",
      position: "bottom",
      open: openBottom,
      setOpen: setOpenBottom,
    },
    {
      label: "Bottom-Left",
      position: "bottom-left",
      open: openBottomLeft,
      setOpen: setOpenBottomLeft,
    },
    {
      label: "Bottom-Right",
      position: "bottom-right",
      open: openBottomRight,
      setOpen: setOpenBottomRight,
    },

    {
      label: "Bottom-Full",
      position: "bottom",
      size: "full",
      open: openBottomFull,
      setOpen: setOpenBottomFull,
    },
  ];

  return (
    <div className="mt-4 space-y-4">
      {/* Center Variants */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Center Variants
        </p>
        <div className="flex flex-wrap gap-3">
          {centerModals.map(({ label, position, size, open, setOpen }) => (
            <div key={label}>
              <Button
                title={label}
                variant="primary"
                size="sm"
                onClick={() => setOpen(true)}
              />
              <Modal
                position={position}
                size={size}
                open={open}
                onHide={() => setOpen(false)}
              >
                <Modal.Header>{label} Modal</Modal.Header>
                <Modal.Body>
                  <Button
                    title="Open Nested Modal"
                    variant="info"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenNestedModal(true);
                    }}
                  />
                  {/* Open Center modal inside modal */}
                  <Modal
                    position="center"
                    size="sm"
                    open={openNestedModal}
                    onHide={() => setOpenNestedModal(false)}
                  >
                    <Modal.Header>Nested Modal</Modal.Header>
                    <Modal.Body>
                      This is a nested modal inside the {label} modal. It should
                      work without issues!
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        title="Close"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenNestedModal(false);
                        }}
                      />
                    </Modal.Footer>
                  </Modal>
                  Position: <strong>{position}</strong> &middot; Size:{" "}
                  <strong>{size}</strong>
                  <br />
                  Click outside or press ESC to close.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    title="Close"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpen(false)}
                  />
                </Modal.Footer>
              </Modal>
            </div>
          ))}
        </div>
      </div>

      {/* Right Variants (h-full) */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Right Variants (h-full)
        </p>
        <div className="flex flex-wrap gap-3">
          {rightModals.map(({ label, position, open, setOpen }) => (
            <div key={label}>
              <Button
                title={label}
                variant="info"
                size="sm"
                onClick={() => setOpen(true)}
              />
              <Modal
                position={position}
                open={open}
                onHide={() => setOpen(false)}
                appendClass="h-full"
              >
                <Modal.Header>{label} Modal</Modal.Header>
                <Modal.Body>
                  Position: <strong>{position}</strong>
                  <br />
                  This panel is full-height. Click outside or press ESC to
                  close.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    title="Close"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpen(false)}
                  />
                </Modal.Footer>
              </Modal>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Variants (slides up) */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Bottom Variants (slides up)
        </p>
        <div className="flex flex-wrap gap-3">
          {bottomModals.map(({ label, position, size, open, setOpen }) => (
            <div key={label}>
              <Button
                title={label}
                variant="warning"
                size="sm"
                onClick={() => setOpen(true)}
              />
              <Modal
                position={position}
                size={size}
                open={open}
                onHide={() => setOpen(false)}
              >
                <Modal.Header>{label} Modal</Modal.Header>
                <Modal.Body>
                  Position: <strong>{position}</strong>
                  <br />
                  Slides up from the bottom. Click outside or press ESC to
                  close.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    title="Close"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpen(false)}
                  />
                </Modal.Footer>
              </Modal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FRUITS = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
];

const RenderDropdowns = () => {
  const [single, setSingle] = useState("");
  const [multi, setMulti] = useState([]);
  const [searchSingle, setSearchSingle] = useState("");
  const [searchMulti, setSearchMulti] = useState([]);

  return (
    <div className="mt-4 space-y-6">
      {/* Single Select */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Single Select
        </p>
        <div className="max-w-xs">
          <Dropdown
            value={single}
            onChange={setSingle}
            placeholder="Pick a fruit"
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {FRUITS.map((f) => (
                <Dropdown.Item key={f} value={f}>
                  {f}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <p className="text-xs text-gray-400 mt-1">
            Selected: {single || "none"}
          </p>
        </div>
      </div>

      {/* Multi Select */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Multi Select
        </p>
        <div className="max-w-sm">
          <Dropdown
            value={multi}
            onChange={setMulti}
            mode="multi"
            placeholder="Pick fruits"
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {FRUITS.map((f) => (
                <Dropdown.Item key={f} value={f}>
                  {f}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <p className="text-xs text-gray-400 mt-1">
            Selected: {multi.length ? multi.join(", ") : "none"}
          </p>
        </div>
      </div>

      {/* Single Select with Search */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Single Select + Search
        </p>
        <div className="max-w-xs">
          <Dropdown
            value={searchSingle}
            onChange={setSearchSingle}
            searchable
            placeholder="Search fruits..."
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {FRUITS.map((f) => (
                <Dropdown.Item key={f} value={f}>
                  {f}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <p className="text-xs text-gray-400 mt-1">
            Selected: {searchSingle || "none"}
          </p>
        </div>
      </div>

      {/* Multi Select with Search */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Multi Select + Search
        </p>
        <div className="max-w-sm">
          <Dropdown
            value={searchMulti}
            onChange={setSearchMulti}
            mode="multi"
            searchable
            placeholder="Search & pick fruits..."
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {FRUITS.map((f) => (
                <Dropdown.Item key={f} value={f}>
                  {f}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <p className="text-xs text-gray-400 mt-1">
            Selected: {searchMulti.length ? searchMulti.join(", ") : "none"}
          </p>
        </div>
      </div>

      {/* API Search (simulated) */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          API Search (simulated with JSONPlaceholder)
        </p>
        <ApiSearchDemo />
      </div>
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

const RenderTable = () => {
  const headers = [
    { id: "name", label: "Name", render: (row) => row.name },
    { id: "age", label: "Age", render: (row) => row.age },
    { id: "email", label: "Email", render: (row) => row.email },
  ];

  const data = [
    { name: "Alice", age: 30, email: "alice@example.com" },
    { name: "Bob", age: 25, email: "bob@example.com" },
    { name: "Charlie", age: 35, email: "charlie@example.com" },
  ];

  return <Table headers={headers} data={data} />;
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
      name: "Dropdowns",
      render: <RenderDropdowns />,
    },
    {
      name: "Accordion",
      render: <RenderAccordion />,
    },
    {
      name: "Inputs",
      render: <RenderInputs />,
    },
    {
      name: "Table",
      render: <RenderTable />,
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
