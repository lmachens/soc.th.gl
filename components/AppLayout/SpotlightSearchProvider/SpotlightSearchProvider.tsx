import { SpotlightProvider } from "@mantine/spotlight";
import { SearchIcon } from "@primer/octicons-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { CollectionLink } from "../../../lib/staticProps";
import { getTerm } from "../../../lib/terms";

type Props = {
  collectionLinks: CollectionLink[];
  children: ReactNode;
};
const SpotlightSearchProvider = ({ collectionLinks, children }: Props) => {
  const router = useRouter();

  const actions = collectionLinks
    .map((collectionLink) =>
      collectionLink.docs.slice(1).map((doc) => ({
        title: doc.label,
        description: doc.description
          ? `${collectionLink.label} ${doc.description}`
          : collectionLink.label,
        onTrigger: () => router.push(doc.to),
      }))
    )
    .flat();

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<SearchIcon size={18} />}
      searchPlaceholder={ getTerm("SearchDocumentation", router.locale!) }
      shortcut={["mod + K", "mod + P", "/"]}
      highlightQuery
      transition={{
        in: { transform: "translateY(0)", opacity: 1 },
        out: { transform: "translateY(-20px)", opacity: 0 },
        transitionProperty: "transform, opacity",
      }}
    >
      {children}
    </SpotlightProvider>
  );
};

export default SpotlightSearchProvider;
