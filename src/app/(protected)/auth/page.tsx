"use client";
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
  Title,
} from "@mantine/core";
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
import { font } from "@/theme/font";

export default function AuthenticationForm(props: PaperProps) {
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

  return (
    <Paper className="max-w-lg mx-auto mt-48 p-6" withBorder {...props}>
      <h1 className="text-5xl font-bold text-center">Welcome to Shoja!</h1>

      <Group grow mb="md" className="mt-12">
        <GoogleButton size="lg">Google</GoogleButton>
        <TwitterButton size="lg">Twitter</TwitterButton>
      </Group>

      <Divider
        label={
          <Text className="font-normal text-base">Or continue with email</Text>
        }
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(() => {})}>
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
          <Button type="submit" size="lg">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
