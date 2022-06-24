import { Anchor } from "@mantine/core";
import { useEffect } from "react";

const ConsentLink = () => {
  useEffect(() => {
    // @ts-ignore
    if (window["__cmp"]) {
      // @ts-ignore
      window["__cmp"]("addConsentLink");
    }
  }, []);

  return (
    <Anchor
      id="ncmp-consent-link"
      color="gray"
      sx={{
        button: {
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          ":hover": {
            textDecoration: "underline",
          },
        },
      }}
    />
  );
};

export default ConsentLink;
