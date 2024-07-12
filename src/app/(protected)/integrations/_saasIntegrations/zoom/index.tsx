"use client";

import React from "react";
import InstallButton from "../../_components/installButton";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const redirectUri = process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URL!;
  const zoomAppClientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID!;
  const zoomAuthURL = generateAuthUrl(redirectUri, zoomAppClientId);
  function onClick() {
    console.log("Install Zoom", zoomAuthURL);
    router.push(zoomAuthURL);
  }
  return <InstallButton onClick={onClick} />;
}
