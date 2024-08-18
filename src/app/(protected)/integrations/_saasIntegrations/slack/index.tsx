import { ConnectedBanner, UnknownBanner } from "../_componenets/statusBanners";
import InstallButton from "./installButton";

export const dynamic = "force-dynamic";

export async function SlackAction({ installed }: { installed: boolean }) {
  try {
    if (installed) {
      console.log("Slack is installed");
      return <ConnectedBanner />;
    } else {
      return <InstallButton />;
    }
  } catch (error) {
    console.error("Can't find out if Slack is installed", error);
  }

  return <UnknownBanner />;
}
