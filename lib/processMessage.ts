import { mkdir, writeFile, stat } from "fs";
import { formatDateForFileName } from "./dateHelpers.js";
import path from "path";
import config from "./config.js";

const createFile = (dataset: string, fileName: string, content: string) => {
  const directory = path.join(config.downloadDirectory, dataset);
  const filePath = path.join(directory, fileName);

  stat(directory, (err) => {
    // Create directory if it doesn't already exist
    if (err) {
      console.log(`Creating directory "${directory}"`);
      mkdir(directory, { recursive: true }, () => {
        console.log(`Created directory "${directory}"`);
      });
    }

    writeFile(filePath, content, () => {
      console.log(`Created file "${fileName}"`);
    });
  });
};

const processMessage = async (messageReceived: { subject?: string; messageId?: string | number | Buffer<ArrayBufferLike>; body: string }) => {
  const now = new Date();
  const dataset = messageReceived.subject ?? "unknown";
  const fileName = messageReceived.messageId ?? `${dataset}_${formatDateForFileName(now)}.json`;

  const body = JSON.parse(messageReceived.body);

  const content = JSON.stringify(body, null, 2);
  createFile(dataset, fileName.toString(), content);
};

export { processMessage };