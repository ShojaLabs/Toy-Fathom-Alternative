"use client";
import React, { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { Loader } from "@mantine/core";
import { useUserContext } from "supertokens-auth-react";

function usePageLoadEffect() {
  const router = useRouter();
  const userContext = useUserContext();

  useEffect(() => {
    console.log({ userContext });
  }, [userContext]); // Empty dependency array means this effect will only run once (on page load)
}

function HandleCallback() {
  usePageLoadEffect();
  return <Loader className="block mx-auto mt-64" size={40} />;
}

export default HandleCallback;
