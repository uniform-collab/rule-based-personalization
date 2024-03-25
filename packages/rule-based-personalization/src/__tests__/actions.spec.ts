import { sortContentEntryPositions } from "../actions";
import { ContentEntryPosition } from "../types";

describe(sortContentEntryPositions, () => {

  test("Pre-sorted array is not changed.", () => {
    const positions: ContentEntryPosition<string>[] = [
      { entry: "a", currentPosition: 1, originalPosition: 1 },
      { entry: "b", currentPosition: 2, originalPosition: 2 },
      { entry: "c", currentPosition: 3, originalPosition: 3 },
      { entry: "d", currentPosition: 4, originalPosition: 4 },
    ];
    const expected: ContentEntryPosition<string>[] = [
      { entry: "a", currentPosition: 1, originalPosition: 1 },
      { entry: "b", currentPosition: 2, originalPosition: 2 },
      { entry: "c", currentPosition: 3, originalPosition: 3 },
      { entry: "d", currentPosition: 4, originalPosition: 4 },
    ];
    positions.sort(sortContentEntryPositions);
    expect(expected.length).toBe(positions.length);
    expect(expected).toStrictEqual(positions);
  })

  test("Sorting changes the order of the members to match the current position.", () => {
    const positions: ContentEntryPosition<string>[] = [
      { entry: "d", currentPosition: 4, originalPosition: 1 },
      { entry: "c", currentPosition: 3, originalPosition: 2 },
      { entry: "b", currentPosition: 2, originalPosition: 3 },
      { entry: "a", currentPosition: 1, originalPosition: 4 },
    ];
    const expected: ContentEntryPosition<string>[] = [
      { entry: "a", currentPosition: 1, originalPosition: 4 },
      { entry: "b", currentPosition: 2, originalPosition: 3 },
      { entry: "c", currentPosition: 3, originalPosition: 2 },
      { entry: "d", currentPosition: 4, originalPosition: 1 },
    ];
    positions.sort(sortContentEntryPositions);
    expect(expected.length).toBe(positions.length);
    expect(expected).toStrictEqual(positions);
  })

  test("Sorting falls back to original position if current position values are repeated.", () => {
    const positions: ContentEntryPosition<string>[] = [
      { entry: "c", currentPosition: 4, originalPosition: 3 },
      { entry: "d", currentPosition: 4, originalPosition: 4 },
      { entry: "a", currentPosition: 3, originalPosition: 1 },
      { entry: "b", currentPosition: 3, originalPosition: 2 },
    ];
    const expected: ContentEntryPosition<string>[] = [
      { entry: "a", currentPosition: 3, originalPosition: 1 },
      { entry: "b", currentPosition: 3, originalPosition: 2 },
      { entry: "c", currentPosition: 4, originalPosition: 3 },
      { entry: "d", currentPosition: 4, originalPosition: 4 },
    ];
    positions.sort(sortContentEntryPositions);
    expect(expected.length).toBe(positions.length);
    expect(expected).toStrictEqual(positions);
  })

})