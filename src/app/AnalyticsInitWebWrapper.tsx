// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export default function AnalyticsInitWebWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PostHogProvider client={posthog}>
      <UserAnalyticsWrapper>{children}</UserAnalyticsWrapper>
    </PostHogProvider>
  );
}

function UserAnalyticsWrapper({ children }: { children: ReactNode }) {
  const { userId }: any = useSessionContext();
  useEffect(() => {
    if (userId) {
      posthog.identify(userId);
    }
  }, [userId]);
  return children;
}
