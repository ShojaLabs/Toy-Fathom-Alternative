"use client";
import { useState } from "react";
import { Menu, rem, useMantineTheme, Button } from "@mantine/core";
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconUser,
} from "@tabler/icons-react";
import Session from "supertokens-web-js/recipe/session";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import testEmail from "./testEmail";

export default function AppHeader() {
  const router = useRouter();
  // const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  async function logout() {
    await Session.signOut();
    router.push("/auth");
  }

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <Button className={clsx("p-0 w-10 h-10")} variant="default">
          <IconUser
            className={clsx(
              "mx-auto",
              userMenuOpened ? "text-white" : "text-gray-500",
            )}
            size="24px"
          />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {/* <Menu.Item */}
        {/*   leftSection={ */}
        {/*     <IconHeart */}
        {/*       style={{ width: rem(16), height: rem(16) }} */}
        {/*       color={theme.colors.red[6]} */}
        {/*       stroke={1.5} */}
        {/*     /> */}
        {/*   } */}
        {/* > */}
        {/*   Liked posts */}
        {/* </Menu.Item> */}
        {/* <Menu.Item */}
        {/*   leftSection={ */}
        {/*     <IconStar */}
        {/*       style={{ width: rem(16), height: rem(16) }} */}
        {/*       color={theme.colors.yellow[6]} */}
        {/*       stroke={1.5} */}
        {/*     /> */}
        {/*   } */}
        {/* > */}
        {/*   Saved posts */}
        {/* </Menu.Item> */}
        {/* <Menu.Item */}
        {/*   leftSection={ */}
        {/*     <IconMessage */}
        {/*       style={{ width: rem(16), height: rem(16) }} */}
        {/*       color={theme.colors.blue[6]} */}
        {/*       stroke={1.5} */}
        {/*     /> */}
        {/*   } */}
        {/* > */}
        {/*   Your comments */}
        {/* </Menu.Item> */}

        <Menu.Label>Profile Settings</Menu.Label>
        <Menu.Item
          hidden
          leftSection={
            <IconSettings
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Account settings
        </Menu.Item>
        {/* <Menu.Item */}
        {/*   leftSection={ */}
        {/*     <IconSwitchHorizontal */}
        {/*       style={{ width: rem(16), height: rem(16) }} */}
        {/*       stroke={1.5} */}
        {/*     /> */}
        {/*   } */}
        {/* > */}
        {/*   Change account */}
        {/* </Menu.Item> */}
        <Menu.Item
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          onClick={logout}
        >
          Logout
        </Menu.Item>
        <form action={() => testEmail()}>
          <Menu.Item
            hidden
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            type="submit"
          >
            Test Email
          </Menu.Item>
        </form>

        {/* <Menu.Divider /> */}
        {/**/}
        {/* <Menu.Label>Danger zone</Menu.Label> */}
        {/* <Menu.Item */}
        {/*   leftSection={ */}
        {/*     <IconPlayerPause */}
        {/*       style={{ width: rem(16), height: rem(16) }} */}
        {/*       stroke={1.5} */}
        {/*     /> */}
        {/*   } */}
        {/* > */}
        {/*   Pause subscription */}
        {/* </Menu.Item> */}
        {/* <Menu.Item */}
        {/*   color="red" */}
        {/*   leftSection={ */}
        {/*     <IconTrash */}
        {/*       style={{ width: rem(16), height: rem(16) }} */}
        {/*       stroke={1.5} */}
        {/*     /> */}
        {/*   } */}
        {/* > */}
        {/*   Delete account */}
        {/* </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
}
