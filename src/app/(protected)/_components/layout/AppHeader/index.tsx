"use client";

import React from "react";
import { Button, Paper, UnstyledButton } from "@mantine/core";
import { Search } from "./search";
import { PageTitle } from "./pageTitle";
import Image from "next/image";
import JoinZoomCall from "@/app/(protected)/_components/page/joinZoomCall";
import { IconCross, IconX } from "@tabler/icons-react";

export default function AppHeader() {
  const [showZoom, setShowZoom] = React.useState(false);
  return (
    <Paper
      className="px-4 py-2 transition-all ease-in-out delay-650"
      bg="dark.6"
    >
      <div
        className="h-full flex justify-between items-center"
      >
        <div className="flex-1">
          <PageTitle />
        </div>
        <div className="flex-1">
          <Search />
        </div>

        {/* TODO: See if this can be modularised */}
        {/* I want to make it so that all actions collapse in to one close button if any action is active*/}
        <div className="flex-1 flex flex-row-reverse items-center">
          <Button
            variant={showZoom ? "light" : "subtle"}
            color="dark.0"
            className="h-10 w-10 p-0 hover:shadow-md"
            onClick={() => setShowZoom(!showZoom)}
          >
            {!showZoom ? <Image
                src="/zoom/zoom.svg"
                width={36}
                height={36}
                alt="Zoom logo"
                className="rounded-md"
              /> :
              <IconX
                size={24}
                stroke={1.5}
              />}
          </Button>
        </div>
      </div>
      {showZoom && (
        <div className="py-2">
          <JoinZoomCall />
        </div>
      )}
    </Paper>
  );
}
