import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import Paths from "@/constants/paths";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } =
  {};

export function setRouter(
  router: ReturnType<typeof useRouter>,
  pathName: string,
) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
  return {
    appInfo,
    getRedirectionURL: async (context) => {
      if (context.action === "SUCCESS" && context.newSessionCreated) {
        if (context.redirectToPath !== undefined) {
          // we are navigating back to where the user was before they authenticated
          return context.redirectToPath;
        }
        if (context.createdNewUser) {
          return Paths.dashboard.integrations();
        }
        return context.redirectToPath || Paths.dashboard.home();
      }
    },
    recipeList: [
      EmailPasswordReact.init(),
      ThirdPartyReact.init({
        signInAndUpFeature: {
          providers: [
            ThirdPartyReact.Google.init(),
            ThirdPartyReact.Github.init(),
          ],
        },
      }),
      Session.init(),
    ],
    windowHandler: (orig) => {
      return {
        ...orig,
        location: {
          ...orig.location,
          getPathName: () => routerInfo.pathName!,
          assign: (url) => routerInfo.router!.push(url.toString()),
          setHref: (url) => routerInfo.router!.push(url.toString()),
        },
      };
    },
  };
};
