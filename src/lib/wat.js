export function normalizeWATWord(value) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function dedupeWATWords(words) {
  const seen = new Set();
  return words.filter((item) => {
    const word = typeof item === 'string' ? item : item.word;
    const normalized = normalizeWATWord(word || '');
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
