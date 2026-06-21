// Accepts: 01XXXXXXXXX  — local format with leading 0 (most common in BD)
//          1XXXXXXXXX   — 10-digit format without leading 0
//          +8801XXXXXXXX or 8801XXXXXXXXX — international format with/without +
// Rejects everything else.
const BD_PHONE_REGEX = /^(?:\+?880|0)?1[3-9]\d{8}$/

export function validateBDPhone(raw: string): boolean {
  return BD_PHONE_REGEX.test(raw.trim())
}

// Normalizes any accepted format to the canonical 01XXXXXXXXX form
// used for display, storage, and API submission.
export function normalizeBDPhone(raw: string): string {
  const stripped = raw
    .trim()
    .replace(/^\+?880/, "")
    .replace(/^0/, "")
  return `0${stripped}`
}
