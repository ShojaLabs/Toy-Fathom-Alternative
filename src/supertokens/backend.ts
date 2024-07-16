import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";

export let backendConfig = (): TypeInput => {
  return {
    supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: process.env.NEXT_PUBLIC_SUPERTOKENS_CONNECTION_URI!,
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      EmailPasswordNode.init(),
      ThirdPartyNode.init({
        signInAndUpFeature: {
          providers: [
            // We have provided you with development keys which you can use for testing.
            // IMPORTANT: Please replace them with your own OAuth keys for production use.
            {
              config: {
                thirdPartyId: "google",
                clients: [
                  {
                    clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: "github",
                clients: [
                  {
                    clientId: process.env.AUTH_GITHUB_CLIENT_ID!,
                    clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET!,
                  },
                ],
              },
            },
          ],
        },
      }),
      SessionNode.init(),
      Dashboard.init(),
      UserRoles.init(),
    ],
    isInServerlessEnv: true,
    framework: "custom",
  };
};

let initialized = false;
export function ensureSuperTokensInit() {
  if (!initialized) {
    SuperTokens.init(backendConfig());
    initialized = true;
  }
}
