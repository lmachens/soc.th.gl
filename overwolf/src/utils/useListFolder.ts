import { useEffect, useState } from "react";
import { File, listFolder } from "./io";

function useListFolder(folderPath: string): File[] | null {
  const [filesAndFolders, setFilesAndFolders] = useState<File[] | null>(null);

  useEffect(() => {
    listFolder(folderPath, true, ".sav").then(setFilesAndFolders);
  }, [folderPath]);

  return filesAndFolders;
}

export default useListFolder;
