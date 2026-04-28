import { Delete, RotateCw, ShieldAlert, Trash, Trash2 } from "lucide-react";
import React, { useState } from "react";
import Button from "../buttons/Button";
import { Modal } from "../modal/Modal";

export default function DeleteModalButton({
  onDeleteConfirm = async () => {},
}) {
  /* ========================= All States ========================= */

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  /*  ========================= All Functions ========================= */

  const handleDeleteConfirm = async () => {
    setLoading(true);
    await onDeleteConfirm();
    setLoading(false);
    setShowDeleteModal(false);
  };

  /* ========================= All UseEffects ========================= */

  return (
    <div>
      <Button
        title=""
        variant="outlineDanger"
        size="sm"
        disabled={loading}
        onClick={() => {
          setShowDeleteModal(true);
        }}
        appendClasses="h-7 !px-1.5 flex-center"
        afterTitle={() => {
          return loading ? (
            <RotateCw size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          );
        }}
      />
      <Modal
        open={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        position="center"
      >
        <Modal.Header>
          <div className="flex text-xl items-center gap-3">
            Confirm Deletion{" "}
            <ShieldAlert
              size={30}
              className="animate-pulse text-warning"
            />{" "}
          </div>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item? <br />
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            title="Cancel"
            variant="outlineSecondary"
            onClick={() => setShowDeleteModal(false)}
          />
          <Button
            title="Delete"
            variant="danger"
            onClick={handleDeleteConfirm}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
