"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from "@mantine/core";
import { GoogleButton } from "./GoogleButton";
import { GithubButton } from "./GithubButton";
import { signUp, signIn } from "supertokens-web-js/recipe/emailpassword";
import { notifications } from "@mantine/notifications";
import Session from "supertokens-web-js/recipe/session";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdparty";
import { getGoogleOauthUrl } from "./helprs";

export default function AuthenticationForm(props: PaperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, toggle] = useToggle(["login", "register"]);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  useEffect(() => {
    // if a signed in user visits the sign in page, we redirect them to the home page
    void Session.doesSessionExist().then((hasSession) => {
      if (hasSession) {
        router.replace("/");
      }
    });
  }, [router]);

  async function signInClicked(formValues: {
    email: string;
    password: string;
  }) {
    const { email, password } = formValues;
    try {
      let response = await signIn({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax).
            notifications.show({
              color: "red",
              title: "Failed to sign in",
              message: formField.error,
            });
          }
        });
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        notifications.show({
          color: "red",
          title: "Failed to sign in",
          message: "Email password combination is incorrect.",
        });
      } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
        // the reason string is a user friendly message
        // about what went wrong. It can also contain a support code which users
        // can tell you so you know why their sign in was not allowed.
        notifications.show({
          color: "red",
          title: "Failed to sign in",
          message: response.reason,
        });
      } else {
        // sign in successful. The session tokens are automatically handled by
        // the frontend SDK.
        router.replace("/");
      }
    } catch (err: any) {
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
          message: "Oops! Something went wrong.",
        });
      }
    }
  }

  async function signUpClicked(formValues: {
    email: string;
    password: string;
    // name: string;
  }) {
    const { email, password } = formValues;
    try {
      let response = await signUp({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
          },
          // {
          //   id: "name",
          //   value: name,
          // },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        // one of the input formFields failed validaiton
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax),
            // or the email is not unique.
            notifications.show({
              color: "red",
              title: "Failed to sign in",
              message: formField.error,
            });
          } else if (formField.id === "password") {
            // Password validation failed.
            // Maybe it didn't match the password strength
            notifications.show({
              color: "red",
              title: "Failed to sign in",
              message: formField.error,
            });
          }
        });
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        // the reason string is a user friendly message
        // about what went wrong. It can also contain a support code which users
        // can tell you so you know why their sign up was not allowed.
        notifications.show({
          color: "red",
          title: "Failed to sign in",
          message: response.reason,
        });
      } else {
        // sign up successful. The session tokens are automatically handled by
        // the frontend SDK.
        router.replace("/");
      }
    } catch (err: any) {
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
          message: "Oops! Something went wrong.",
        });
      }
    }
  }

  async function socialLogin(thirdPartyId: "google" | "github") {
    try {
      let authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId,

        // This is where Google should redirect the user back after login or error.
        // This URL goes on the Google's dashboard as well.
        frontendRedirectURI: process.env
          .NEXT_PUBLIC_AUTH_SOCIAL_CALLBACK as string,
      });

      /*
      Example value of authUrl: https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&client_id=1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com&state=5a489996a28cafc83ddff&redirect_uri=https%3A%2F%2Fsupertokens.io%2Fdev%2Foauth%2Fredirect-to-app&flowName=GeneralOAuthFlow
      */

      if (thirdPartyId === "google") {
        authUrl = getGoogleOauthUrl(authUrl);
      }
      router.push(authUrl);
    } catch (err: any) {
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
          message: "Oops! Something went wrong.",
        });
      }
    }
  }

  return (
    <Paper className="max-w-lg mx-auto mt-48 p-6" withBorder {...props}>
      <h1 className="text-5xl font-bold text-center">Welcome to Shoja!</h1>

      <Group grow mb="md" className="mt-12">
        <GoogleButton size="lg" onClick={() => socialLogin("google")}>
          Google
        </GoogleButton>
        <GithubButton size="lg" onClick={() => socialLogin("github")}>
          Github
        </GithubButton>
      </Group>

      <Divider
        label={
          <Text className="font-normal text-base">Or continue with email</Text>
        }
        labelPosition="center"
        my="lg"
      />

      <form
        onSubmit={form.onSubmit(async () => {
          console.log("Values : ", form.values);
          setLoading(true);
          try {
            if (type === "login") {
              await signInClicked(form.values);
            } else {
              await signUpClicked(form.values);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        })}
      >
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              size="lg"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@shoja.app"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            size="lg"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            size="lg"
          />

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
              size="md"
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="md"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            type="submit"
            size="lg"
            disabled={type === "register" && !form.values.terms}
            loading={loading}
          >
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
