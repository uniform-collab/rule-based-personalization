import { EntryPosition } from "../types";
import { sortEntryPositions } from "../sort";

describe(sortEntryPositions, () => {

  test('Empty entry positions array returns empty array.', () => {
    const result = sortEntryPositions<string>([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  })

  test('Entry positions are sorted by new position.', () => {
    const original: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 2, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 3, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 1, hide: false },
    ];
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryC", originalPosition: 3, newPosition: 1, hide: false },
      { listEntry: "entryA", originalPosition: 1, newPosition: 2, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 3, hide: false },
    ];
    const result = sortEntryPositions<string>(original);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(original.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test('Entry positions are sorted by new position and original position.', () => {
    const original: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 3, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 4, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 1, hide: false },
      { listEntry: "entryD", originalPosition: 4, newPosition: 5, hide: false },
      { listEntry: "entryE", originalPosition: 5, newPosition: 2, hide: false },
    ];
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryC", originalPosition: 3, newPosition: 1, hide: false },
      { listEntry: "entryE", originalPosition: 5, newPosition: 2, hide: false },
      { listEntry: "entryA", originalPosition: 1, newPosition: 3, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 4, hide: false },
      { listEntry: "entryD", originalPosition: 4, newPosition: 5, hide: false },
    ];
    const result = sortEntryPositions<string>(original);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(original.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

})