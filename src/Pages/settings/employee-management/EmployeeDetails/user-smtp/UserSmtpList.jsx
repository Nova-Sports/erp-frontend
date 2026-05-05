import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/modal/Modal";
import DeleteModalButton from "@/components/delete-modal/DeleteModalButton";
import Button from "@/components/buttons/Button";
import { useNotification } from "@/contexts/NotificationContext";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import UserSmtpForm from "./UserSmtpForm";
import Table from "@/components/table/Table";

export default function UserSmtpList({
  locationsList,
  selectedUser,
  selectedLocation,
  onSelectSmtp,
  selectedSmtpItem,
  userSmtpList,
  setUserSmtpList,
  getUserSmtpList,
}) {
  const { notify } = useNotification();

  /* ========================= All States ========================= */
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selected, setSelected] = useState(null);

  /*  ========================= All Functions ========================= */

  // Delete SMTP
  const deleteSmtpData = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const { data } = await API.delete(`/user-location-smtp/${id}`, {
          headers: authHeader(),
        });
        if (data?.success) {
          await getUserSmtpList();
          notify(data?.message || "SMTP deleted successfully", "success", 3000);
          return;
        }
        notify(data?.message || "Failed to delete SMTP", "error", 3000);
      } catch (err) {
        notify(err.message, "error", 3000);
      } finally {
        setLoading(false);
      }
    },
    [getUserSmtpList, notify],
  );

  /* ========================= Table Configuration ========================= */

  const tableHeaders = [
    {
      id: "smtpName",
      label: "SMTP Name",
      render: (row) => <span className="text-nowrap">{row.smtpName}</span>,
    },
    {
      id: "smtpEmail",
      label: "SMTP Email",
      render: (row) => <span className="text-nowrap">{row.smtpEmail}</span>,
    },
    {
      id: "actions",
      label: "Actions",
      customHClasses: "!g-red-300",
      sortBy: false,
      render: (row) => (
        <div className="flex justify-end items-center gap-2">
          <Button
            title="Edit"
            variant="primary"
            size="sm"
            onClick={() => {
              setSelected(row);
              setShowAddModal(true);
            }}
          />
          <DeleteModalButton
            loading={loading}
            onDeleteConfirm={() => deleteSmtpData(row.id)}
          />
        </div>
      ),
    },
  ];

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    let timeout = setTimeout(() => {
      getUserSmtpList();
    }, 50);
    return () => clearTimeout(timeout);
  }, [getUserSmtpList]);

  /* ========================= Render ========================= */

  return (
    <div className="border h-full py-4 rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 border-b pb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-600">
          User SMTP Settings
        </h3>
        <Button
          title="Add"
          onClick={() => {
            setSelected(null);
            setShowAddModal(true);
          }}
          size="sm"
        />
      </div>

      {/* Table */}
      <Table
        appendClass={"!bg-transparent !shadow-none h-full"}
        headers={tableHeaders}
        data={userSmtpList}
      />

      {/* Add/Edit Modal */}
      <Modal open={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <h2 className="text-lg font-bold text-gray-700">
            {selected ? "Edit SMTP Settings" : "Add SMTP Settings"}
          </h2>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <UserSmtpForm
              selectedUser={selectedUser}
              selectedLocation={selectedLocation}
              selected={selected}
              refreshFunc={getUserSmtpList}
              showModal={setShowAddModal}
              locationsList={locationsList}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
