type ErrorMap = Record<string, string>;

export function translateError(message: string, errorMap: ErrorMap): string {
  if (!message) return message;

  // Exact match
  if (errorMap[message]) return errorMap[message];

  // Partial match — replace known substrings
  let translated = message;
  for (const [key, value] of Object.entries(errorMap)) {
    if (translated.includes(key)) {
      translated = translated.replace(key, value);
    }
  }

  return translated;
}

export function translateErrors(
  messages: string[],
  errorMap: ErrorMap
): string[] {
  return messages.map((msg) => translateError(msg, errorMap));
}
