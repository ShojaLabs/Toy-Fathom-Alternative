import ZoomInstallButton from "./zoomInstallButton";
import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

function ConnectedBanner() {
  return (
    <div className="flex gap-1 justify-center text-green-600">
      <IconCircleCheckFilled size={24} />
      Connected
    </div>
  );
}

function UnknownBanner() {
  return (
    <div className="flex gap-1 justify-center text-orange-400">
      <IconAlertTriangleFilled size={24} /> Unknown please, refresh!
    </div>
  );
}

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
