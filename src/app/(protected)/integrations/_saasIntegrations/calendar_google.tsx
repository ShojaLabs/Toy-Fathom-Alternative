"use client";

import React from "react";
import InstallButton from "../_components/installButton";

export function CalendarGoogleAction({ installed }: { installed: boolean }) {
  function onClick() {
    console.log("Install Google Calendar");
  }
  return <InstallButton onClick={onClick} />;
}
