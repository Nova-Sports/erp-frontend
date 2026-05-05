import React, { useCallback, useEffect, useState } from "react";
import UserSmtpList from "./UserSmtpList";
import API from "@/services/axios";
import authHeader from "@/services/auth-header";

export default function UserSmtp({
  locationsList,
  selectedUser,
  selectedLocation,
}) {
  /* ========================= All States ========================= */
  const [userSmtpList, setUserSmtpList] = useState([]);
  const [selectedSmtpItem, setSelectedSmtpItem] = useState(null);

  /*  ========================= All Functions ========================= */

  const getUserSmtpList = useCallback(async () => {
    if (!selectedUser?.id) return;
    try {
      const { data } = await API.post(
        `/user-location-smtps`,
        {
          userId: selectedUser.id,
        },
        {
          headers: authHeader(),
        },
      );
      if (data?.success) {
        setUserSmtpList(data.data || []);
      }
    } catch (err) {
      console.log("Get User SMTP List Error: ", err);
    }
  }, [selectedUser?.id]);

  const onSelectSmtp = (item) => {
    setSelectedSmtpItem(item);
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    let timeout = setTimeout(() => {
      getUserSmtpList();
    }, 50);
    return () => clearTimeout(timeout);
  }, [getUserSmtpList]);

  return (
    <div className="h-full  overflow-y-auto">
      <UserSmtpList
        locationsList={locationsList}
        selectedUser={selectedUser}
        selectedLocation={selectedLocation}
        onSelectSmtp={onSelectSmtp}
        selectedSmtpItem={selectedSmtpItem}
        userSmtpList={userSmtpList}
        setUserSmtpList={setUserSmtpList}
        getUserSmtpList={getUserSmtpList}
      />
    </div>
  );
}
