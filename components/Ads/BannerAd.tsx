import { Box } from "@mantine/core";
import { useEffect } from "react";
import { nitroAds } from "../../lib/nitroAds";

const BannerAd = () => {
  useEffect(() => {
    nitroAds.createAd("soc-banner", {
      refreshLimit: 10,
      refreshTime: 30,
      renderVisibleOnly: true,
      refreshVisibleOnly: true,
      sizes: [
        ["728", "90"],
        ["970", "90"],
      ],
    });
  }, []);

  return <Box id="soc-banner" sx={{ height: 90 }} />;
};

export default BannerAd;
