"use client";

import React from "react";
import { Button, Paper, UnstyledButton } from "@mantine/core";
import { Search } from "./search";
import UserProfileMenu from "./userProfileMenu";
import Link from "next/link";
import { IconPlugConnected, IconTopologyStar3 } from "@tabler/icons-react";
import Paths from "@/constants/paths";
import { PageTitle } from "./pageTitle";

export default function AppHeader() {
  return (
    <Paper className="transition-all ease-in-out delay-650">
      <div className="h-full flex justify-between items-center">
        <div className="flex-1 flex gap-4 items-center">
          <Link href="/">
            <UnstyledButton className="h-10 flex items-center">
              <IconTopologyStar3 width={24} /> &nbsp; Shoja AI
            </UnstyledButton>
          </Link>
          <PageTitle />
        </div>
        <div className="flex-1 flex align-middle justify-center">
          <Search />
        </div>
        <div className="flex-1 flex flex-row-reverse gap-2">
          <UserProfileMenu />
          <Link href={Paths.dashboard.integrations()}>
            <Button
              className="h-10"
              color="teal.7"
              // variant="default"
              leftSection={<IconPlugConnected size={20} />}
            >
              Integrations
            </Button>
          </Link>
        </div>
      </div>
    </Paper>
  );
}
