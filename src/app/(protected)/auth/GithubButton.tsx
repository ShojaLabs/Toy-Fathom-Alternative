import { Button, ButtonProps } from "@mantine/core";
import { GithubIcon } from "@mantinex/dev-icons";

export function GithubButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<"button">,
) {
  return (
    <Button
      leftSection={
        <GithubIcon
          style={{ width: "1.5rem", height: "1.5rem" }}
          color="#000000"
        />
      }
      variant="default"
      {...props}
    />
  );
}
