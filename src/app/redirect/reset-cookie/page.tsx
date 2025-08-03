"use client";

import { useLogoutUser } from "@/hooks/employees.hook";
import { useEffect } from "react";

export default function RedirectResetCookie() {
  // this page dedicated to reset cookie if the token is abnormal/invalid/expired
  useEffect(() => {
    const logoutUser = async () => {
      await useLogoutUser();
      window.location.href = "/";
    };
    logoutUser();
  }, []);

  return <></>;
}
