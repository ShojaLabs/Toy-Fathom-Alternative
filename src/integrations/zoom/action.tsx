"use client";
import { Action as ActionSection } from "@/components/Card/integration";

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

export const Action = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ActionSection
        onClick={() => {
          console.log("Install Zoom");
        }}
      />
    </>
  );
};
