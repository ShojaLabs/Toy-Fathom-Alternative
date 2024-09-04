import React from "react";
import { Button, Paper, UnstyledButton } from "@mantine/core";
import { Search } from "./search";
import UserProfileMenu from "./userProfileMenu";
import Link from "next/link";
import { IconPlugConnected } from "@tabler/icons-react";
import Paths from "@/constants/paths";
import { PageTitle } from "./pageTitle";
import CallNow from "./callNow";
import Image from "next/image";
import db from "@/services/db";
import { eq } from "drizzle-orm";
import { ZoomOAuth } from "@/services/db/schema/zoom_oauth";
import { server_GetUserSession } from "@/supertokens/utils";

export default async function AppHeader() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  if (!userId) return null;

  const isZoomInstalled = await db.query.ZoomOAuth.findFirst({
    where: eq(ZoomOAuth.userId, userId),
  });

  return (
    <Paper className="transition-all ease-in-out delay-650">
      <div className="h-full flex justify-between items-center">
        <div className="flex-1 flex gap-4 items-center">
          <Link href="/">
            <UnstyledButton className="h-10 flex items-center">
              <Image
                src="/shoja/logo-mono.png"
                alt="logo"
                width={32}
                height={32}
              />
              &nbsp; Shoja AI
            </UnstyledButton>
          </Link>
          <PageTitle />
        </div>
        <div className="flex-1 flex align-middle justify-center">
          <Search />
        </div>
        <div className="flex-1 flex flex-row-reverse gap-2">
          {!!userId && <UserProfileMenu />}
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
          {!!isZoomInstalled && <CallNow />}
        </div>
      </div>
    </Paper>
  );
}
