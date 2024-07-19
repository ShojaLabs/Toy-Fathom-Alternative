"use client";

import React from "react";
import InstallButton from "../_components/installButton";

export function SlackAction() {
  function onClick() {
    console.log("Install Slack");
  }
  return <InstallButton onClick={onClick} />;
}
