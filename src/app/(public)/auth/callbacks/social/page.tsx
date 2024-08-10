"use client";
import React, { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { signInAndUp } from "supertokens-web-js/recipe/thirdparty";
import { Loader } from "@mantine/core";

function usePageLoadEffect() {
  const router = useRouter();
  useEffect(() => {
    signInAndUp()
      .then((response) => {
        // console.log({ response });
        if (response.status === "OK") {
          // console.log(response.user);
          if (
            response.createdNewRecipeUser &&
            response.user.loginMethods.length === 1
          ) {
            // sign up successful
          } else {
            // sign in successful
          }
          router.replace("/");
        } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
          // the reason string is a user friendly message
          // about what went wrong. It can also contain a support code which users
          // can tell you so you know why their sign in / up was not allowed.
          notifications.show({
            color: "red",
            title: "Failed to sign in",
            message: response.reason,
          });
        } else {
          // SuperTokens requires that the third party provider
          // gives an email for the user. If that's not the case, sign up / in
          // will fail.

          // As a hack to solve this, you can override the backend functions to create a fake email for the user.
          notifications.show({
            color: "red",
            title: "Failed to sign in",
            message:
              "No email provided by social login. Please use another form of login",
          });
          router.replace("/auth"); // redirect back to login page
        }
      })
      .catch((err: any) => {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          notifications.show({
            color: "red",
            title: "Failed to sign in",
            message: err.message,
          });
        } else {
          notifications.show({
            color: "red",
            title: "Failed to sign in",
            message: "Oops! Something went wrong. Please try Again",
          });
          router.replace("/auth");
        }
      });
  }, [router]); // Empty dependency array means this effect will only run once (on page load)
}

function HandleCallback() {
  usePageLoadEffect();
  return <Loader className="block mx-auto mt-64" size={40} />;
}

export default HandleCallback;
