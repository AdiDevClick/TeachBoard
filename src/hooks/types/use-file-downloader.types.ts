/**
 * Type definitions for the useFileDownloader hook.
 */

import type { util } from "zod/v4/core";

/**
 * Props for the useFileDownloader hook.
 *
 * @template T - The type of the data to be downloaded, which should be an object.
 */
export type FileDownloaderState = {
  /**
   * Optional name for the downloaded file.
   *
   * @default "download.json"
   */
  fileName?: string;
  /**
   * The MIME type of the file to be downloaded.
   *
   * @default "application/json"
   */
  type?: util.MimeTypes | "print";
  /**
   * The data to be downloaded, which can be of any type.
   */
  data: unknown;
};
