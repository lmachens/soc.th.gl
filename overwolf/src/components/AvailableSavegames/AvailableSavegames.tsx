import { List, ScrollArea, Text } from "@mantine/core";
import { HubotIcon } from "@primer/octicons-react";
import { File } from "../../utils/io";
import useListFolder from "../../utils/useListFolder";
import useStyles from "./AvailableSavegames.styles";

const SAVEGAMES_FOLDER_PATH = `${overwolf.io.paths.localAppData}\\..\\LocalLow\\Lavapotion\\SongsOfConquest\\Savegames`;

type Props = {
  // eslint-disable-next-line no-unused-vars
  onFileClick: (file: File) => void;
};
const AvailableSavegames = ({ onFileClick }: Props) => {
  const { classes } = useStyles();
  const files = useListFolder(SAVEGAMES_FOLDER_PATH);

  return (
    <>
      <Text size="lg" transform="uppercase">
        Savegames
      </Text>
      <ScrollArea>
        <List spacing="xs" listStyleType="none">
          {files?.map((file) => (
            <List.Item
              key={file.path}
              className={classes.listItem}
              p="xs"
              onClick={() => onFileClick(file)}
            >
              {file.name}
            </List.Item>
          ))}
          {files?.length === 0 && (
            <Text color="dimmed" align="center">
              No files found <HubotIcon />
            </Text>
          )}
        </List>
      </ScrollArea>
    </>
  );
};

export default AvailableSavegames;
