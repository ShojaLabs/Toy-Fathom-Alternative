"use client";

import React from "react";
import InstallButton from "../_components/installButton";

function generateAuthUrl(redirectUri: string, zoomAppClientId: string): string {
  const baseUrl = "https://zoom.us/oauth/authorize";
  const queryParams = {
    response_type: "code",
    redirect_uri: redirectUri,
    client_id: zoomAppClientId,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  return `${baseUrl}?${queryString}`;
}

export function ZoomAction() {
  function onClick() {
    console.log("Install Zoom");
  }
  return <InstallButton onClick={onClick} />;
}
