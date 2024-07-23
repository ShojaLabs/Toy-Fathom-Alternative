"use client";
import React, { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { Loader } from "@mantine/core";

function usePageLoadEffect() {
  const router = useRouter();
  useEffect(() => {}, []); // Empty dependency array means this effect will only run once (on page load)
}

function HandleCallback() {
  usePageLoadEffect();
  return <Loader className="block mx-auto mt-64" size={40} />;
}

export default HandleCallback;
