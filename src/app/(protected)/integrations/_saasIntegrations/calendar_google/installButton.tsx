"use client";

import React from "react";
import InstallButton from "../../_components/installButton";
import { useRouter } from "next/navigation";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdparty";
import { getGoogleOauthUrl } from "@/app/(public)/auth/helprs";

export default function ZoomInstallButton() {
  const router = useRouter();

  async function onClick() {
    let authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId: "google",
      frontendRedirectURI: process.env
        .NEXT_PUBLIC_INTEGRATION_GOOGLE_CALENDAR_CALLBACK as string,
    });

    authUrl = getGoogleOauthUrl(authUrl);
    router.push(authUrl);
  }
  return <InstallButton onClick={onClick} />;
}
