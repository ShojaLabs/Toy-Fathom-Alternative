import { Title as Heading, TitleProps } from "@mantine/core";
import clsx from "clsx";
import React from "react";

export function Title(
  props: TitleProps & React.ComponentPropsWithoutRef<"h1">,
) {
  return (
    <Heading
      order={1}
      className={clsx("font-bold text-2xl leading-loose", props.className)}
      {...props}
    />
  );
}
