import { ConnectedBanner, UnknownBanner } from "../_componenets/statusBanners";
import ZoomInstallButton from "./zoomInstallButton";

export const dynamic = "force-dynamic";

export async function ZoomAction({ installed }: { installed: boolean }) {
  try {
    if (installed) {
      console.log("Zoom is installed");
      return <ConnectedBanner />;
    } else {
      return <ZoomInstallButton />;
    }
  } catch (error) {
    console.error("Can't find out if Zoom is installed", error);
  }

  return <UnknownBanner />;
}
