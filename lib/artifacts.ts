import artifactsCollection from "./collections/artifacts.json";

import { getTerm } from "./terms";
import { SpriteDTO } from "./sprites";
import { BacteriaDTO, getLocaleBacteria } from "./bacterias";

export const getArtifacts = (locale: string) => {
  const artifacts = artifactsCollection
    .map<ArtifactSimpleDTO>((artifact) => ({
      type: artifact.type,
      name: getTerm(`Artifacts/${artifact.type}/Name`, locale),
      description: getTerm(`Artifacts/${artifact.type}/Description`, locale),
      icon: artifact.icon,
      bacterias: artifact.bacterias.map((bacteria) =>
        getLocaleBacteria(bacteria, locale)
      ),
    }))
    .filter((a) => a.name);
  return artifacts;
};

export const getArtifact = (type: string, locale: string) => {
  const artifactSrc = artifactsCollection.find(
    (artifact) => artifact.type === type
  );
  if (!artifactSrc) {
    return null;
  }

  const artifact: ArtifactDTO = {
    type: artifactSrc.type,
    name: getTerm(`Artifacts/${artifactSrc.type}/Name`, locale),
    description: getTerm(`Artifacts/${artifactSrc.type}/Description`, locale),
    icon: artifactSrc.icon,
    bacterias: artifactSrc.bacterias.map((bacteria) =>
      getLocaleBacteria(bacteria, locale)
    ),
  };
  return artifact;
};

export type ArtifactSimpleDTO = {
  type: string;
  name: string;
  description: string;
  icon: SpriteDTO;
  bacterias: BacteriaDTO[];
};

export type ArtifactDTO = {
  type: string;
  name: string;
  description: string;
  icon: SpriteDTO;
  bacterias: BacteriaDTO[];
};
