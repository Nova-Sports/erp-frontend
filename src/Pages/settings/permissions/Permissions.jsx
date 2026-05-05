import Button from "@/components/buttons/Button";
import { ArrowDown01, ArrowUp01 } from "lucide-react";
import React, { useEffect, useState } from "react";
import MainPermGroup from "./MainPermGroup";
import API from "@/services/axios";
import authHeader from "@/services/auth-header";
import Spinner from "@/components/spinner/Spinner";

// let permissionsList = [
//   // Main Permission Group
//   {
//     id: 1,
//     name: "Admin",
//     description: "",
//     sortId: 1,
//     parentId: null,
//   },
//   {
//     id: 2,
//     name: "Sales",
//     description: "",
//     sortId: 2,
//     parentId: null,
//   },
//   {
//     id: 3,
//     name: "Manufacturing",
//     description: "",
//     sortId: 3,
//     parentId: null,
//   },
//   // Sub-Group for Admin
//   {
//     id: 4,
//     name: "User Management",
//     description: "Add, edit, and delete users",
//     sortId: 1,
//     parentId: 1,
//   },
//   // Permission under Sub Group for User Management
//   {
//     id: 6,
//     name: "Create User",
//     description: "Permission to create new users",
//     sortId: 1,
//     parentId: 4,
//   },
//   {
//     id: 7,
//     name: "Edit User",
//     description: "Permission to edit existing users",
//     sortId: 2,
//     parentId: 4,
//   },

//   // Sub-Group for Sales
//   {
//     id: 5,
//     name: "Passwords",
//     description: "",
//     sortId: 1,
//     parentId: 2,
//   },
//   // Permission under Sub Group for Passwords
//   {
//     id: 8,
//     name: "Add",
//     description: "Permission to add new passwords",
//     sortId: 1,
//     parentId: 5,
//   },
//   {
//     id: 9,
//     name: "Edit",
//     description: "Permission to edit existing passwords",
//     sortId: 2,
//     parentId: 5,
//   },
//   {
//     id: 10,
//     name: "Delete",
//     description: "Permission to delete passwords",
//     sortId: 3,
//     parentId: 5,
//   },
// ];

export default function Permissions({ RenderFilterTabs }) {
  /* ========================= All States ========================= */
  const [permissionsList, setPermissionsList] = useState(null);

  const [mainGroups, setMainGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);

  const [loading, setLoading] = useState(true);

  /*  ========================= All Functions ========================= */

  // Get Permissions List from API
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

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (permissionsList && permissionsList.length > 0) {
      let _mainGroups = permissionsList.filter(
        (perm) => perm.parentId === null,
      );
      setMainGroups(_mainGroups);
      if (_mainGroups.length > 0) {
        if (!activeGroup) {
          setActiveGroup(_mainGroups[0]);
        } else {
          let _activeGroup = _mainGroups.find(
            (group) => group.id === activeGroup.id,
          );
          setActiveGroup(_activeGroup);
        }
      }
    }
  }, [permissionsList, activeGroup]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      getPermissionsList();
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Spinner loading={loading} />
      <div className="flex-1 bg-white p-4 rounded-xl">
        <MainPermGroup
          mainGroups={mainGroups}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          refreshFunc={getPermissionsList}
        />
      </div>

      <div className="lg:hidden mb-2 px-3 flex justify-end w-full">
        <RenderFilterTabs />
      </div>
    </div>
  );
}
