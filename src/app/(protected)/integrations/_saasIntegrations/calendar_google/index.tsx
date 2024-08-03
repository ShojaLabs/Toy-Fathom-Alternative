import { ConnectedBanner, UnknownBanner } from "../_componenets/statusBanners";
import InstallButton from "./installButton";

export const dynamic = "force-dynamic";

export async function CalendarGoogleAction({
  installed,
}: {
  installed: boolean;
}) {
  try {
    if (installed) {
      console.log("Google Calendar is installed");
      return <ConnectedBanner />;
    } else {
      return <InstallButton />;
    }
  } catch (error) {
    console.error("Can't find out if Google Calendar is installed", error);
  }

  return <UnknownBanner />;
}
