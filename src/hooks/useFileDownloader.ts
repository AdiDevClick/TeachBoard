import type { FileDownloaderState } from "@/hooks/types/use-file-downloader.types.";
import { safeStringify } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";

const defaultState = {
  fileName: "download.json",
  type: "application/json",
  data: null,
} satisfies FileDownloaderState;

/**
 * Custom hook to download a file from data.
 *
 * @description This hook creates a downloadable file
 * from the provided data and triggers the download.
 *
 * @param setState - Function to update the state after the download.
 * @param fileName - Optional name for the downloaded file, defaults to 'download.json'.
 */
export function useFileDownloader() {
  const [fileState, setFileState] = useState<FileDownloaderState>(defaultState);
  const link = useRef<HTMLAnchorElement>(document.createElement("a"));

  useEffect(() => {
    const linkElement = link.current;

    if (!fileState.data || !linkElement) {
      return;
    }

    let url = "";

    switch (fileState.type) {
      case "application/json":
        url = matchElementType(safeStringify(fileState.data), fileState.type);
        break;
      case "image/png":
      case "image/jpeg":
        url = matchElementType(fileState.data, fileState.type);
        break;
      default:
        console.warn(`Unsupported file type: ${fileState.type}`);
    }

    linkElement.href = url;
    linkElement.download = fileState.fileName ?? defaultState.fileName;

    linkElement.click();
    URL.revokeObjectURL(url);
  }, [fileState]);

  return { fileState, setFileState };
}

function matchElementType(element: unknown, type: string) {
  let url = "";

  if (element instanceof HTMLCanvasElement) {
    url = element.toDataURL(type);
  } else if (typeof element === "string") {
    url = element;
  } else if (element instanceof Blob) {
    url = URL.createObjectURL(element);
  } else if (element instanceof ArrayBuffer) {
    const blob = new Blob([element], { type });
    url = URL.createObjectURL(blob);
  } else {
    console.warn("Unsupported image download data", element);
  }

  return url;
}
