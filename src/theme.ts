import { createTheme } from "@mantine/core";

const theme = createTheme({
  colors: {
    brand: [
      "#e7f0ff",
      "#cedbff",
      "#9bb4ff",
      "#648bff",
      "#3768fe",
      "#1952fe",
      "#0347ff",
      "#0039e4",
      "#0031cc",
      "#002ab5",
    ],
  },
  primaryColor: "brand",
  primaryShade: 6,
});

export default theme;
