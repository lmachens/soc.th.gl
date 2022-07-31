import { ActionIcon, Button, Popover, Stack } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

const flags: {
  [locale: string]: string;
} = {
  en: "https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
  ru: "https://purecatamphetamine.github.io/country-flag-icons/3x2/RU.svg",
  cs: "https://purecatamphetamine.github.io/country-flag-icons/3x2/CZ.svg",
  fr: "https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg",
  de: "https://purecatamphetamine.github.io/country-flag-icons/3x2/DE.svg",
  it: "https://purecatamphetamine.github.io/country-flag-icons/3x2/IT.svg",
  pl: "https://purecatamphetamine.github.io/country-flag-icons/3x2/PL.svg",
  es: "https://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg",
  "zh-CN": "https://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg",
  ja: "https://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg",
  ko: "https://purecatamphetamine.github.io/country-flag-icons/3x2/KR.svg",
  "pt-BR": "https://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg",
  uk: "https://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg",
};
const LocaleSelector = () => {
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpened(false);
  }, [router.locale]);

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      width={260}
      position="bottom"
      withArrow
    >
      <Popover.Target>
        <ActionIcon variant="transparent" onClick={() => setOpened((o) => !o)}>
          <Image
            alt="United States"
            src={flags[router.locale || "en"]}
            width={26}
            height={17}
          />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {router.locales?.map((locale) => (
            <Link
              key={locale}
              href={router.asPath}
              locale={locale}
              passHref
              prefetch={false}
            >
              <Button
                component="a"
                compact
                variant="subtle"
                uppercase
                fullWidth
                styles={{
                  inner: {
                    justifyContent: "flex-start",
                  },
                }}
                leftIcon={
                  <Image
                    alt="United States"
                    src={flags[locale]}
                    width={26}
                    height={17}
                  />
                }
              >
                {locale}
              </Button>
            </Link>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default LocaleSelector;
