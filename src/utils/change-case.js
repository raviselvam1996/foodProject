// ----------------------------------------------------------------------

export function paramCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ----------------------------------------------------------------------

export function snakeCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// ----------------------------------------------------------------------

export function sentenceCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// ----------------------------------------------------------------------
export function formatString(str) {
  return str ? str
      .split('_') // Split by underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ') // Join words with space
      : '' ;
}
