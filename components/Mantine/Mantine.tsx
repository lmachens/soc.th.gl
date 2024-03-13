import {
  Global,
  MantineProvider,
  MantineThemeColors,
  MantineThemeOverride,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const THEME_CONSTANTS: Omit<MantineThemeOverride, "colors"> & {
  colors: {
    brand: MantineThemeColors[string];
  };
} = {
  colorScheme: "dark",
  fontFamily: '"Roboto", sans-serif',
  colors: {
    brand: [
      "#fef4e7",
      "#fbddb6",
      "#f8c786",
      "#f6b156",
      "#f39a25",
      "#da810c",
      "#a96409",
      "#794707",
      "#492b04",
      "#180e01",
    ],
  },
  primaryColor: "brand",
  headings: { fontFamily: '"Averia Serif Libre", cursive' },
};

const Mantine = ({ children }: Props) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        ...THEME_CONSTANTS,
        components: {
          Title: {
            styles: (theme) => ({
              root: {
                color: theme.colors[theme.primaryColor][4],
              },
            }),
          },
        },
      }}
    >
      <Global
        styles={() => ({
          ".highlight": {
            color: "#f28f0d",
          },
          ".positive": {
            color: "#177c13",
          },
          ".negative": {
            color: "#c51b1b",
          },
        })}
      />
      <NotificationsProvider>{children}</NotificationsProvider>
    </MantineProvider>
  );
};

export default Mantine;
