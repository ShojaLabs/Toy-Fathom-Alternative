"use client";

import { Button, Popover } from "@mantine/core";
import { IconDeviceLandlinePhone } from "@tabler/icons-react";
import React from "react";
import JoinZoomCallOnDemand from "./quickActions/JoinZoomCallOnDemand";

export default function CallNow() {
  /* TODO: See if this can be modularised */
  /* I want to make it so that all actions collapse in to one close button if any action is active*/
  return (
    <Popover trapFocus position="bottom-end" shadow="md">
      <Popover.Target>
        <Button
          className="h-10"
          leftSection={<IconDeviceLandlinePhone size={20} />}
        >
          Call Now
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <JoinZoomCallOnDemand />
      </Popover.Dropdown>
    </Popover>
  );
}
