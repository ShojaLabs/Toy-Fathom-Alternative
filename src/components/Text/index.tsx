import { Title as Heading, TitleProps } from "@mantine/core";

export function Title(
  props: TitleProps & React.ComponentPropsWithoutRef<"h1">,
) {
  return <Heading order={1} className="font-bold text-2xl" {...props} />
}