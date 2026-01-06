import { rx } from "@/tests/test-utils/vitest-browser.helpers";

export type InputControllerLike = {
  id?: string;
  name?: string;
  task?: string;
  label?: string;
  title?: string;
  placeholder?: string;
  apiEndpoint?: unknown;
  dataReshapeFn?: unknown;
  useCommands?: boolean;
  useButtonAddNew?: boolean;
  creationButtonText?: string | false;
};

export function controllerLabel(controller: InputControllerLike): string {
  return String(controller.label ?? controller.title ?? "");
}

export function controllerTriggerText(controller: InputControllerLike): string {
  const raw = String(
    controller.placeholder ?? controller.label ?? controller.title ?? ""
  ).trim();

  // Avoid brittle matching on ellipsis differences ("..." vs "…").
  return raw.replace(/[.…]+$/u, "").trim();
}

export function controllerTriggerRegex(
  controller: InputControllerLike
): RegExp {
  const text = controllerTriggerText(controller);
  if (!text) return /.+/i;
  return rx(text);
}

export function controllerLabelRegex(controller: InputControllerLike): RegExp {
  const text = controllerLabel(controller);
  if (!text) return /.+/i;
  return rx(text);
}
