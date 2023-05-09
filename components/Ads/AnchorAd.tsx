import { Box } from "@mantine/core";
import { useEffect } from "react";
import { nitroAds } from "../../lib/nitroAds";

const AnchorAd = () => {
  useEffect(() => {
    nitroAds.createAd("soc-anchor", {
      refreshLimit: 10,
      refreshTime: 30,
      format: "anchor",
      anchor: "bottom",
      anchorPersistClose: false,
      anchorBgColor: "#343a40",
      report: {
        enabled: true,
        wording: "Report Ad",
        position: "top-right",
      },
      mediaQuery:
        "(min-width: 1025px), (min-width: 768px) and (max-width: 1024px), (min-width: 320px) and (max-width: 767px)",
    });
  }, []);

  return <Box id="nitro-anchor" />;
};

export default AnchorAd;
