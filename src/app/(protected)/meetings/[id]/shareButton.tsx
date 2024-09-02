"use client";
import { ActionIcon, Button, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export function ShareButton() {
  return (
    <CopyButton value={window.location.toString()}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
          <Button
            color={copied ? "teal" : "dark.0"}
            variant="light"
            onClick={copy}
            className="h-8 px-2"
          >
            {copied ? (
              <IconCheck size={20} stroke={1.5} />
            ) : (
              <IconCopy size={20} stroke={1.5} />
            )}
            &nbsp; Share URL
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
}
