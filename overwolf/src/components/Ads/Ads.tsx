import { Anchor, Box } from "@mantine/core";
import type { OwAd } from "@overwolf/types/owads";
import { useEffect, useRef, useState } from "react";
import { useAccountStore } from "../../utils/store/account";
import useWindowIsVisible from "../../utils/useWindowIsVisible";
import useStyles from "./Ads.styles";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    OwAd?: typeof OwAd;
  }
}

function Ads() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [owAd, setOwAd] = useState<OwAd>();
  const isDisplayedFirstTime = useRef(true);
  const windowIsVisible = useWindowIsVisible();
  const { classes } = useStyles();
  const accountState = useAccountStore();

  useEffect(() => {
    if (accountState.isPatron) {
      return;
    }
    function onOwAdReady() {
      if (typeof window.OwAd === "undefined" || containerRef.current === null) {
        return;
      }
      const ad = new window.OwAd(containerRef.current, {
        size: { width: 400, height: 300 },
      });
      ad.addEventListener("ow_internal_rendered", () => {
        setOwAd(ad);
      });
    }

    const script = document.createElement("script");
    script.src = "https://content.overwolf.com/libs/ads/latest/owads.min.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = onOwAdReady;

    return () => {
      document.body.removeChild(script);
    };
  }, [accountState.isPatron]);

  useEffect(() => {
    if (!owAd || accountState.isPatron) {
      return;
    }
    if (isDisplayedFirstTime.current) {
      isDisplayedFirstTime.current = false;
      return;
    }
    if (windowIsVisible) {
      owAd.refreshAd({});
    } else {
      owAd.removeAd();
    }
  }, [owAd, windowIsVisible, accountState.isPatron]);

  if (accountState.isPatron) {
    return <></>;
  }

  return (
    <>
      <Anchor
        href="https://www.th.gl/support-me"
        target="_blank"
        align="center"
      >
        Get rid of ads and support me on Patreon
      </Anchor>
      <Box className={classes.container}>
        <Box ref={containerRef} className={classes.ads} />
      </Box>
    </>
  );
}

export default Ads;
