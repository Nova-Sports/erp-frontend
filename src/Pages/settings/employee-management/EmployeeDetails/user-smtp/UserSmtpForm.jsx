import React, { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import FormLabel from "@/components/form-label/FormLabel";

export default function UserSmtpForm({
  selected,
  selectedUser,
  selectedLocation,
  locationsList,
  refreshFunc,
  showModal,
}) {
  const { notify } = useNotification();

  /* ========================= All States ========================= */
  const [smtpSettings, setSmtpSettings] = useState({
    smtpName: "",
    smtpEmail: "",
    smtpPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);

  /*  ========================= All Functions ========================= */

  const normalizeLocationIds = (ids = []) =>
    (Array.isArray(ids) ? ids : [ids])
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));

  const toggleLocationSelection = (locationId) => {
    const normalizedId = Number(locationId);
    if (!Number.isFinite(normalizedId)) return;

    setSelectedLocations((prev) => {
      const normalizedPrev = normalizeLocationIds(prev);

      if (normalizedPrev.includes(normalizedId)) {
        return normalizedPrev.filter((id) => id !== normalizedId);
      } else {
        return [...normalizedPrev, normalizedId];
      }
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post(
        "/user-location-smtp",
        {
          ...smtpSettings,
          userId: selectedUser.id,
          locationIdList: normalizeLocationIds(selectedLocations),
        },
        {
          headers: authHeader(),
        },
      );
      if (data?.success) {
        await refreshFunc();
        setSmtpSettings({
          smtpName: "",
          smtpEmail: "",
          smtpPassword: "",
        });
        setSelectedLocations([]);
        notify(data?.message || "SMTP added successfully", "success", 3000);
        showModal(false);
      } else {
        throw new Error(data?.message || "Failed to add SMTP");
      }
    } catch (err) {
      notify(err.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.patch(
        `/user-location-smtp`,
        {
          id: selected.id,
          ...smtpSettings,
          userId: selectedUser.id,
          locationIdList: normalizeLocationIds(selectedLocations),
        },
        {
          headers: authHeader(),
        },
      );
      if (data?.success) {
        await refreshFunc();
        notify(data?.message || "SMTP updated successfully", "success", 3000);
        showModal(false);
      } else {
        throw new Error(data?.message || "Failed to update SMTP");
      }
    } catch (err) {
      notify(err.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (selected) {
      setSmtpSettings({
        smtpName: selected.smtpName || "",
        smtpEmail: selected.smtpEmail || "",
        smtpPassword: selected.smtpPassword || "",
      });
      // Set selected locations if they exist
      if (selected.locationIdList && Array.isArray(selected.locationIdList)) {
        setSelectedLocations(normalizeLocationIds(selected.locationIdList));
      } else if (selected.locations && Array.isArray(selected.locations)) {
        // In case locations are returned as objects with id property
        setSelectedLocations(
          normalizeLocationIds(selected.locations.map((loc) => loc.id)),
        );
      }
    } else {
      setSmtpSettings({
        smtpName: "",
        smtpEmail: "",
        smtpPassword: "",
      });
      setSelectedLocations(
        selectedLocation ? normalizeLocationIds([selectedLocation]) : [],
      );
    }
  }, [selected, selectedLocation]);

  /* ========================= Render ========================= */

  return (
    <form onSubmit={selected ? handleUpdate : handleAdd} noValidate>
      <div className="mb-4 pb-4 border-b flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-700">SMTP Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Form Fields */}
        <div>
          {/* SMTP Name */}
          <div className="mb-4">
            <FormLabel htmlFor="smtpName">SMTP Name</FormLabel>
            <FormInput
              id="smtpName"
              type="text"
              placeholder="Enter SMTP name"
              value={smtpSettings.smtpName}
              onChange={(e) =>
                setSmtpSettings({
                  ...smtpSettings,
                  smtpName: e.target.value,
                })
              }
            />
          </div>

          {/* SMTP Email */}
          <div className="mb-4">
            <FormLabel htmlFor="smtpEmail">SMTP Email</FormLabel>
            <FormInput
              id="smtpEmail"
              type="email"
              placeholder="Enter SMTP email"
              value={smtpSettings.smtpEmail}
              onChange={(e) =>
                setSmtpSettings({
                  ...smtpSettings,
                  smtpEmail: e.target.value,
                })
              }
            />
          </div>

          {/* SMTP Password */}
          <div className="mb-4">
            <FormLabel htmlFor="smtpPassword">SMTP Password</FormLabel>
            <FormInput
              id="smtpPassword"
              type="password"
              placeholder="Enter SMTP password"
              value={smtpSettings.smtpPassword}
              onChange={(e) =>
                setSmtpSettings({
                  ...smtpSettings,
                  smtpPassword: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Right Column - Locations Multi-Select */}
        <div>
          <FormLabel>Select Locations</FormLabel>
          <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
            {locationsList && locationsList.length > 0 ? (
              <div className="space-y-2">
                {locationsList.map((location) => (
                  <label
                    key={location.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location.id)}
                      onChange={() => toggleLocationSelection(location.id)}
                      className="w-4 h-4 accent-primary rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      {location.locationName ||
                        location.name ||
                        `Location ${location.id}`}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No locations available
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {selectedLocations.length} location(s) selected
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          title="Close"
          variant="secondary"
          size="sm"
          onClick={() => showModal(false)}
        />
        <Button
          type="submit"
          title={selected ? "Update" : "Add"}
          variant="success"
          size="sm"
          disabled={loading}
        />
      </div>
    </form>
  );
}
