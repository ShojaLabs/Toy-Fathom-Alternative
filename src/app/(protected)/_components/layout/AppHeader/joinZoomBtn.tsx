"use client";

import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import JoinZoomCallOnDemand from "./quickActions/JoinZoomCallOnDemand";

export default function onDemandZoomCall() {
  /* TODO: See if this can be modularised */
  /* I want to make it so that all actions collapse in to one close button if any action is active*/
  const [showZoom, setShowZoom] = React.useState(false);
  return (
    <div className="flex-1 flex flex-row-reverse items-center">
      <Button
        variant={showZoom ? "light" : "subtle"}
        color="dark.0"
        className="h-10 w-10 p-0 hover:shadow-md"
        onClick={() => setShowZoom(!showZoom)}
      >
        {!showZoom ? (
          <Image
            src="/zoom/zoom.svg"
            width={36}
            height={36}
            alt="Zoom logo"
            className="rounded-md"
          />
        ) : (
          <IconX size={24} stroke={1.5} />
        )}
      </Button>
      {showZoom && (
        <div className="mt-2">
          <JoinZoomCallOnDemand />
        </div>
      )}
    </div>
  );
}
