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
    codex: MantineThemeColors[string];
  };
} = {
  colorScheme: "dark",
  fontFamily: '"Crimson Text", Georgia, serif',
  colors: {
    brand: [
      "#fef9f0",
      "#fcecd0",
      "#f9d9a3",
      "#f5c576",
      "#e8a940",
      "#d4922a",
      "#a8711d",
      "#7c5214",
      "#50340c",
      "#281a06",
    ],
    codex: [
      "#f5f3ef",
      "#e8e4db",
      "#d4cfc2",
      "#b8b0a0",
      "#938979",
      "#6e6455",
      "#524a3f",
      "#3a342c",
      "#252119",
      "#15120d",
    ],
  },
  primaryColor: "brand",
  headings: {
    fontFamily: '"Cinzel", "Averia Serif Libre", serif',
    fontWeight: 600,
  },
  other: {
    headerHeight: 70,
  },
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
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(232, 169, 64, 0.15)",
              },
            }),
          },
          Text: {
            styles: () => ({
              root: {
                lineHeight: 1.7,
              },
            }),
          },
          Anchor: {
            styles: (theme) => ({
              root: {
                color: theme.colors.brand[4],
                transition: "color 0.2s ease, text-shadow 0.2s ease",
                "&:hover": {
                  color: theme.colors.brand[3],
                  textShadow: "0 0 12px rgba(232, 169, 64, 0.4)",
                },
              },
            }),
          },
          Button: {
            styles: (theme) => ({
              root: {
                fontFamily: '"Cinzel", serif',
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 20px ${theme.fn.rgba(
                    theme.colors.brand[5],
                    0.3
                  )}`,
                },
              },
            }),
          },
          Paper: {
            styles: (theme) => ({
              root: {
                backgroundColor: theme.fn.rgba(theme.colors.dark[8], 0.6),
                backdropFilter: "blur(8px)",
              },
            }),
          },
          Blockquote: {
            styles: (theme) => ({
              root: {
                borderLeftColor: theme.colors.brand[6],
                backgroundColor: theme.fn.rgba(theme.colors.dark[8], 0.4),
                borderRadius: theme.radius.sm,
                padding: theme.spacing.lg,
                fontStyle: "italic",
              },
            }),
          },
          Table: {
            styles: (theme) => ({
              root: {
                "& thead tr th": {
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase" as const,
                  fontSize: 11,
                  color: theme.colors.brand[4],
                  borderBottomColor: theme.fn.rgba(theme.colors.brand[6], 0.3),
                },
                "& tbody tr": {
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: theme.fn.rgba(theme.colors.brand[9], 0.15),
                  },
                },
                "& tbody tr td": {
                  borderBottomColor: theme.fn.rgba(theme.colors.dark[4], 0.3),
                },
              },
            }),
          },
          Tooltip: {
            styles: (theme) => ({
              tooltip: {
                backgroundColor: theme.colors.dark[8],
                border: `1px solid ${theme.fn.rgba(theme.colors.brand[6], 0.3)}`,
                color: theme.colors.gray[3],
                fontSize: theme.fontSizes.sm,
                padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
              },
            }),
          },
          Popover: {
            styles: (theme) => ({
              dropdown: {
                backgroundColor: theme.colors.dark[8],
                border: `1px solid ${theme.fn.rgba(theme.colors.brand[6], 0.3)}`,
              },
              arrow: {
                backgroundColor: theme.colors.dark[8],
                borderColor: theme.fn.rgba(theme.colors.brand[6], 0.3),
              },
            }),
          },
          ActionIcon: {
            styles: (theme) => ({
              root: {
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: theme.fn.rgba(theme.colors.brand[7], 0.2),
                },
              },
            }),
          },
        },
      }}
    >
      <Global
        styles={(theme) => ({
          "*, *::before, *::after": {
            boxSizing: "border-box",
          },
          body: {
            background: `
              radial-gradient(ellipse at 20% 0%, ${theme.fn.rgba(
                theme.colors.brand[9],
                0.15
              )} 0%, transparent 50%),
              radial-gradient(ellipse at 80% 100%, ${theme.fn.rgba(
                theme.colors.brand[9],
                0.1
              )} 0%, transparent 50%),
              linear-gradient(180deg, #0d0b08 0%, #151210 50%, #0d0b08 100%)
            `,
            backgroundAttachment: "fixed",
            minHeight: "100vh",
          },
          "::selection": {
            backgroundColor: theme.fn.rgba(theme.colors.brand[5], 0.3),
            color: theme.colors.brand[2],
          },
          "::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "::-webkit-scrollbar-track": {
            background: theme.colors.dark[8],
          },
          "::-webkit-scrollbar-thumb": {
            background: `linear-gradient(180deg, ${theme.colors.brand[7]} 0%, ${theme.colors.brand[8]} 100%)`,
            borderRadius: 4,
            "&:hover": {
              background: `linear-gradient(180deg, ${theme.colors.brand[6]} 0%, ${theme.colors.brand[7]} 100%)`,
            },
          },
          ".highlight": {
            color: theme.colors.brand[4],
            textShadow: `0 0 8px ${theme.fn.rgba(theme.colors.brand[5], 0.4)}`,
          },
          ".positive": {
            color: "#4ade80",
            textShadow: "0 0 6px rgba(74, 222, 128, 0.3)",
          },
          ".negative": {
            color: "#f87171",
            textShadow: "0 0 6px rgba(248, 113, 113, 0.3)",
          },
          "@keyframes fadeInUp": {
            from: {
              opacity: 0,
              transform: "translateY(20px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
          "@keyframes shimmer": {
            "0%": {
              backgroundPosition: "-200% 0",
            },
            "100%": {
              backgroundPosition: "200% 0",
            },
          },
          "@keyframes glowPulse": {
            "0%, 100%": {
              boxShadow: `0 0 20px ${theme.fn.rgba(theme.colors.brand[5], 0.1)}`,
            },
            "50%": {
              boxShadow: `0 0 30px ${theme.fn.rgba(theme.colors.brand[5], 0.2)}`,
            },
          },
        })}
      />
      <NotificationsProvider>{children}</NotificationsProvider>
    </MantineProvider>
  );
};

export default Mantine;
