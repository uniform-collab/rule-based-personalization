import { createContentfulEnrichmentTagsReader } from "../readers";
import { createEntry } from "./utils";

describe(createContentfulEnrichmentTagsReader, () => {
  test("Enrichment tags are read when no field name is specified.", () => {
    const entry = createEntry("entryId", "entry", {
      unfrmOptEnrichmentTag: [
        { "cat": "1", "key": "5", "str": 50 },
        { "cat": "1", "key": "1", "str": 50 },
      ]
    })
    const reader = createContentfulEnrichmentTagsReader();
    expect(reader).toBeDefined();
    const tags = reader(entry);
    expect(Array.isArray(tags)).toBe(true);
    const expectedTags = ["1_5", "1_1"];
    expect(tags.length).toBe(expectedTags.length);
    for (let i = 0; i < tags.length; i++) {
      const actual = tags[i];
      const expected = expectedTags[i];
      expect(actual).toBe(expected);
    }
  })
  test("Enrichment tags are read when field name is specified.", () => {
    const entry = createEntry("entryId", "entry", {
      tags: [
        { "cat": "1", "key": "5", "str": 50 },
        { "cat": "1", "key": "1", "str": 50 },
      ]
    })
    const reader = createContentfulEnrichmentTagsReader("tags");
    expect(reader).toBeDefined();
    const tags = reader(entry);
    expect(Array.isArray(tags)).toBe(true);
    const expectedTags = ["1_5", "1_1"];
    expect(tags.length).toBe(expectedTags.length);
    for (let i = 0; i < tags.length; i++) {
      const actual = tags[i];
      const expected = expectedTags[i];
      expect(actual).toBe(expected);
    }
  })

  test("No enrichment tags are read when the specified field does not exist.", () => {
    const entry = createEntry("entryId", "entry", {});
    const reader = createContentfulEnrichmentTagsReader("tags");
    expect(reader).toBeDefined();
    const tags = reader(entry);
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBe(0);
  })

  test("No enrichment tags are read when the default field does not exist.", () => {
    const entry = createEntry("entryId", "entry", {});
    const reader = createContentfulEnrichmentTagsReader();
    expect(reader).toBeDefined();
    const tags = reader(entry);
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBe(0);
  })

  test("No enrichment tags are read when the specified field is not the proper shape.", () => {
    const entries = [
      createEntry("entryId", "entry", { tags: {} }),
      createEntry("entryId", "entry", { tags: undefined }),
      createEntry("entryId", "entry", { tags: 10 }),
      createEntry("entryId", "entry", { tags: true }),
      createEntry("entryId", "entry", { tags: [{ enabled: true }] }),
    ];
    const reader = createContentfulEnrichmentTagsReader("tags");
    expect(reader).toBeDefined();
    entries.forEach(entry => {
      const tags = reader(entry);
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBe(0);
    })
  })

})