"use client";

import React from "react";
import InstallButton from "../../_components/installButton";
import { useRouter } from "next/navigation";

export default function ZoomInstallButton() {
  const router = useRouter();
  const slackAuthUrl = process.env.NEXT_PUBLIC_SLACK_AUTH_URL!;
  function onClick() {
    console.log("Install Slack", slackAuthUrl);
    router.push(slackAuthUrl);
  }
  return <InstallButton onClick={onClick} />;
}
