import Spinner from "@/components/spinner/Spinner";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { useEffect, useMemo, useState } from "react";

export default function UserPermissions({
  isUpdateMode,
  userData,
  selectedPermissions = [],
  setSelectedPermissions,
}) {
  /* ========================= All States ========================= */
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMainGroup, setActiveMainGroup] = useState(null);

  /*  ========================= All Functions ========================= */

  const getPermissionsList = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/permissions", {
        headers: authHeader(),
      });
      if (data?.success) {
        setPermissionsList(data.data || []);
      }
    } catch (err) {
      console.log("Get Permissions List Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const mainGroups = useMemo(
    () => permissionsList.filter((p) => p.parentId === null),
    [permissionsList],
  );

  const subGroups = useMemo(() => {
    if (!activeMainGroup) return [];
    return permissionsList.filter((p) => p.parentId === activeMainGroup.id);
  }, [permissionsList, activeMainGroup]);

  const getItemsForSubGroup = (subGroupId) =>
    permissionsList.filter((p) => p.parentId === subGroupId);

  const isSelected = (name) => selectedPermissions.includes(name);

  const togglePermission = (name) => {
    if (!setSelectedPermissions) return;
    setSelectedPermissions((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const toggleSelectAll = (subGroupId) => {
    if (!setSelectedPermissions) return;
    const items = getItemsForSubGroup(subGroupId);
    const allSelected = items.every((item) =>
      selectedPermissions.includes(item.name),
    );
    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((n) => !items.find((item) => item.name === n)),
      );
    } else {
      const toAdd = items
        .filter((item) => !selectedPermissions.includes(item.name))
        .map((item) => item.name);
      setSelectedPermissions((prev) => [...prev, ...toAdd]);
    }
  };

  const isAllSelected = (subGroupId) => {
    const items = getItemsForSubGroup(subGroupId);
    return (
      items.length > 0 &&
      items.every((item) => selectedPermissions.includes(item.name))
    );
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    getPermissionsList();
  }, []);

  useEffect(() => {
    if (mainGroups.length > 0 && !activeMainGroup) {
      setActiveMainGroup(mainGroups[0]);
    }
  }, [mainGroups]);

  // Pre-populate permissions when editing
  useEffect(() => {
    if (isUpdateMode && userData?.em_permissions && setSelectedPermissions) {
      try {
        const perms = Array.isArray(userData.em_permissions)
          ? userData.em_permissions
          : JSON.parse(userData.em_permissions || "[]");
        setSelectedPermissions(perms);
      } catch {
        setSelectedPermissions([]);
      }
    }
  }, [isUpdateMode, userData?.em_permissions]);

  if (userData?.em_isAdmin) {
    return (
      <div className="h-full border rounded-lg bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Admin users have all permissions by default.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b-2 mb-3">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-600 mb-2">
          Assign Permissions
        </h3>
      </div>

      <div className="relative flex-1 flex flex-col min-h-0">
        <Spinner loading={loading} />

        {/* Main Group Tabs */}
        {mainGroups.length > 0 && (
          <div className="flex flex-wrap gap-0 w-fit rounded-md overflow-hidden shadow-sm mb-4">
            {mainGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveMainGroup(group)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeMainGroup?.id === group.id
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "text-primary bg-primary-light hover:bg-primary-hover hover:text-white"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}

        {/* Sub Groups and Permission Items */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {subGroups.length === 0 && !loading && (
            <p className="text-sm text-gray-400">No sub-groups found.</p>
          )}
          {subGroups.map((subGroup) => {
            const items = getItemsForSubGroup(subGroup.id);
            return (
              <div
                key={subGroup.id}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <h4 className="font-semibold text-gray-700 mb-2">
                  {subGroup.name}
                </h4>
                <ul className="space-y-1.5">
                  {/* Select All */}
                  <li className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`select-all-${subGroup.id}`}
                      checked={isAllSelected(subGroup.id)}
                      onChange={() => toggleSelectAll(subGroup.id)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <label
                      htmlFor={`select-all-${subGroup.id}`}
                      className="text-sm text-gray-600 cursor-pointer select-none"
                    >
                      Select All
                    </label>
                  </li>
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`perm-${item.id}`}
                        checked={isSelected(item.name)}
                        onChange={() => togglePermission(item.name)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <label
                        htmlFor={`perm-${item.id}`}
                        className="text-sm text-gray-600 cursor-pointer select-none"
                      >
                        {item.description}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
