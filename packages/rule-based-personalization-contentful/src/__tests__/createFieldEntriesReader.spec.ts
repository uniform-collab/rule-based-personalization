import { Entry } from "contentful";
import { createFieldEntriesReader } from "..";
import entry from "./entry-with-reference-field.json";

describe(createFieldEntriesReader, () => {

  test("Reading a field that does not exist returns an empty array.", () => {
    const reader = createFieldEntriesReader("test");
    const result = reader(entry as Entry);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  })

  test("Reading a field that is not a reference field returns an empty array.", () => {
    const reader = createFieldEntriesReader("name");
    const result = reader(entry as Entry);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  })

  test("Reading a field that is a reference field returns an array of entries.", () => {
    const reader = createFieldEntriesReader("articles");
    const result = reader(entry as Entry);
    const expected = entry.fields.articles as Entry[];
    expect(Array.isArray(result)).toBe(true);
    expect(result).toStrictEqual(expected);
  })

})