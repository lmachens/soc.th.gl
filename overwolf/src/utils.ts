export async function readFile(filePath: string) {
  const content = await new Promise<string>((resolve, reject) => {
    overwolf.io.readFileContents(
      filePath,
      overwolf.io.enums.eEncoding.UTF8,
      (result) => {
        if (typeof result.content === "undefined") {
          reject(result.error);
        } else {
          resolve(result.content);
        }
      }
    );
  });
  return content;
}

export async function writeFile(filePath: string, content: string) {
  await new Promise((resolve, reject) => {
    overwolf.io.writeFileContents(
      filePath,
      content,
      overwolf.io.enums.eEncoding.UTF8,
      true,
      (result) =>
        result.success ? resolve(result.success) : reject(result.error)
    );
  });
}
