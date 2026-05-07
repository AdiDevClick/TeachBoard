import { debugLogs } from "@/configs/app-components.config";
import type { FileDownloaderState } from "@/hooks/types/use-file-downloader.types";
import { safeStringify } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
      case "print":
        url = matchElementType(fileState.data, "image/png");
        break;
      default:
        toast.error("Type de fichier non supporté pour le téléchargement.");
        debugLogs(`Unsupported file type: ${fileState.type}`, {
          type: "forbiddenProp",
        });
        return;
    }

    if (fileState.type === "print") {
      const printWindow = window.open("");
      if (printWindow) {
        const image = document.createElement("img");
        image.src = url;
        printWindow.document.body.appendChild(image);

        image.onload = () => {
          printWindow.print();
        };

        printWindow.onafterprint = () => {
          URL.revokeObjectURL(url);
          printWindow.close();
        };
      }
    } else {
      linkElement.href = url;
      linkElement.download = fileState.fileName ?? defaultState.fileName;
      linkElement.click();
      URL.revokeObjectURL(url);
    }
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
    toast.error("Données non supportées pour le téléchargement.");
    debugLogs("Unsupported data type for download", {
      type: "forbiddenProp",
      element,
    });
  }

  return url;
}
