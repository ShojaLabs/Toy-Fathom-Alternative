import db from "@/services/db";
import { eq } from "drizzle-orm";
import ZoomInstallButton from "./zoomInstallButton";
import { server_GetUserSession } from "@/supertokens/utils";
import { recallZoomOauthCreds } from "@/services/db/schema/zoom";
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

export async function ZoomAction() {
  try {
    const session = await server_GetUserSession();
    const userId = session?.getUserId();

    if (userId) {
      const zoomOAuth = await db
        .select({
          id: recallZoomOauthCreds.id,
        })
        .from(recallZoomOauthCreds)
        .where(eq(recallZoomOauthCreds.userId, userId));

      if (zoomOAuth.length > 0) {
        console.log("Zoom is installed");
        return <ConnectedBanner />;
      } else {
        return <ZoomInstallButton />;
      }
    }
  } catch (error) {
    console.error("Can't find out if Zoom is installed", error);
  }

  return <UnknownBanner />;
}
