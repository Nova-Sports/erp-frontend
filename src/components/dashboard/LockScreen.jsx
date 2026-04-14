import { Lock } from "lucide-react";
import { useState } from "react";
import { Modal } from "../modal/Modal";
import { Dropdown } from "../dropdown/Dropdown";

export default function LockScreen() {
  /* ========================= All States ========================= */
  const [lockModal, setLockModal] = useState(false);

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div className="w-full">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setLockModal(true);
        }}
        className="flex items-center cursor-pointer w-full"
      >
        <Lock size={14} className="mr-2" />
        Lock
      </div>
      {/*=======================================
          Lock Screen Modal    
      ========================================= */}
      <Modal
        open={lockModal}
        onHide={() => setLockModal(false)}
        position="center"
        size="xl"
        type="lock"
      >
        <Modal.Header>Lock Screen</Modal.Header>
        <Modal.Body>Lock screen content goes here</Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setLockModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
