import { Entry } from "contentful";
import { createEnrichmentTagsReader } from "..";
import entry from "./entry-with-multiple-enrichment-tags.json";

describe(createEnrichmentTagsReader, () => {

  test("Reading a field that does not exist returns an empty array.", () => {
    const reader = createEnrichmentTagsReader("test");
    const result = reader(entry as Entry);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  })

  test("Reading a field that is not an enrichment tags field returns an empty array.", () => {
    const reader = createEnrichmentTagsReader("name");
    const result = reader(entry as Entry);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  })

  test("Reading a field that is an enrichment tags field returns an array of enrichment tags.", () => {
    const reader = createEnrichmentTagsReader("unfrmOptEnrichmentTag");
    const result = reader(entry as Entry);
    const expected = ["1_5", "2_3"];
    expect(Array.isArray(result)).toBe(true);
    expect(result).toStrictEqual(expected);
  })

  test("Not specifying a field results in the field unfrmOptEnrichmentTag being used.", () => {
    const reader = createEnrichmentTagsReader();
    const result = reader(entry as Entry);
    const expected = ["1_5", "2_3"];
    expect(Array.isArray(result)).toBe(true);
    expect(result).toStrictEqual(expected);
  })

})