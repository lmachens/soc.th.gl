import { Box } from "@mantine/core";
import { useEffect } from "react";
import { nitroAds } from "../../lib/nitroAds";
import { useAccountStore } from "../../lib/store/account";

const BannerAd = () => {
  const accountStore = useAccountStore();

  useEffect(() => {
    if (accountStore.isPatron) {
      return;
    }
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
  }, [accountStore.isPatron]);

  if (accountStore.isPatron) {
    return <></>;
  }

  return <Box id="soc-banner" sx={{ height: 90 }} />;
};

export default BannerAd;
