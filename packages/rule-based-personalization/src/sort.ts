import { EntryPosition } from "./types";

/**
 * Returns a new array of entry positions that are sorted 
 * by the new position. For entries with the same new 
 * position, the sort falls back to the original position.
 * @param positions 
 * @returns 
 */
export function sortEntryPositions<TEntry>(positions: EntryPosition<TEntry>[]): EntryPosition<TEntry>[] {
  if (!positions) return positions;
  const sorted = [...positions].sort((a, b) => {
    if (a.newPosition! < b.newPosition!) return -1;
    if (a.newPosition! > b.newPosition!) return 1;
    if (a.originalPosition! < b.originalPosition!) return -1;
    if (a.originalPosition! > b.originalPosition!) return 1;
    return 0;
  })
  return sorted.map((entry, index) => {
    entry.newPosition = (index + 1);
    return entry;
  });
}
