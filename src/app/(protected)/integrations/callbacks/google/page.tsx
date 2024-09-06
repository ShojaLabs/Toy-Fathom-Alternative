"use client";
import React, { useEffect } from "react";
// import { notifications } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@mantine/core";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { install } from "./action";
import Paths from "@/constants/paths";

function usePageLoadEffect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { userId }: any = useSessionContext();

  useEffect(() => {
    if (userId && code) {
      install(code as string, userId as string).then((status) => {
        if (!status) {
          // notifications.show({
          //   title: "Failed to install Google Services",
          //   message: "Please try again",
          //   color: "red",
          // });
          router.push(Paths.dashboard.integrations());
        }
      });
    }
  }, [userId, code, router]); // Empty dependency array means this effect will only run once (on page load)
}

function HandleCallback() {
  usePageLoadEffect();
  return <Loader className="block mx-auto mt-64" size={40} />;
}

export default HandleCallback;
