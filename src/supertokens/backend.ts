import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";
import {
  addNewUser,
  installGoogleCalendar,
  updateGoogleCalendar,
} from "@/supertokens/_actions";

export let backendConfig = (): TypeInput => {
  return {
    supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      EmailPassword.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              // override the email password sign up function
              signUp: async function (input) {
                // console.log("EMAIL SIGNUP", { input });
                // Pre Sign Up logic
                // TODO: allow one user email to sign up with only one recipe
                // This will stop from creating different users for same email id.
                // Check in the db if user with same email exists, if yes then return error.
                // const users = await getUserByEmail(input.email);
                // console.log({ users })
                // if (users.length > 0) {
                //   throw new Error("User with this email already exists, try signing in :)");
                // }
                // This is creating a bit of an issue it throws 500 error instead of custom error message.

                let response = await originalImplementation.signUp(input);

                if (
                  response.status === "OK" &&
                  response.user.loginMethods.length === 1 &&
                  input.session === undefined
                ) {
                  // TODO: some post sign up logic
                  const { user } = response;
                  const { email } = input;
                  // console.log(JSON.stringify(rawUserInfoFromProvider))
                  await addNewUser(user.id, email, "email");
                }

                return response;
              },

              // override the email password sign in function
              signIn: async function (input) {
                console.log("Social SIGNUP", { input });
                // TODO: some pre sign in logic

                let response = await originalImplementation.signIn(input);

                if (response.status === "OK" && input.session === undefined) {
                  // TODO: some post sign in logic
                  // console.log(JSON.stringify(response.user))
                }

                return response;
              },
            };
          },
          // apis: (originalImplementation) => {
          //   return {
          //     ...originalImplementation,
          //     emailExistsGET: async (input) => {
          //       console.log("EMAIL EXISTS GET", { input })
          //       return {
          //         status: "OK",
          //         exists: false
          //       }
          //     }
          //   }
          //
          // }
        },
      }),
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
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              // override the third-party sign in / up function
              signInUp: async function (input) {
                // TODO: Some pre sign in / up logic
                // TODO: allow one user email to sign up with only one recipe
                // This will stop from creating different users for same email id.
                // Check in the db if user with same email exists, if yes then return error.
                let response = await originalImplementation.signInUp(input);

                // console.log("input", JSON.stringify(input));
                if (response.status === "OK") {
                  if (input.session === undefined) {
                    if (
                      response.createdNewRecipeUser &&
                      response.user.loginMethods.length === 1
                    ) {
                      // POST Sign Up Logic
                      const { user } = response;
                      const { thirdPartyId, email } = input;
                      // console.log(JSON.stringify(rawUserInfoFromProvider))
                      await addNewUser(user.id, email, thirdPartyId);
                      if (thirdPartyId === "google") {
                        installGoogleCalendar(user.id, input);
                      }
                    } else {
                      // POST Sign IN Logic
                      // TODO: update the calendar
                      const { user } = response;
                      const { thirdPartyId } = input;
                      if (thirdPartyId === "google") {
                        updateGoogleCalendar(user.id, input);
                      }
                    }
                  }
                }

                return response;
              },
            };
          },
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
