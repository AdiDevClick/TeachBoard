export function getNextStepTestButton() {
  return document.querySelector<HTMLButtonElement>(
    'button[data-name="next-step"]',
  );
}

export function getPreviousStepTestButton() {
  return document.querySelector<HTMLButtonElement>(
    'button[data-name="previous-step"]',
  );
}
