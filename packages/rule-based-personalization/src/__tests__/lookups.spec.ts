import { createLookup } from "../lookups";

describe(createLookup, () => {

  test("Lookup with no elements or default element works as expected.", () => {
    const lookup = createLookup<string>({});
    expect(lookup.get("")).toBeUndefined();
    expect(lookup.get("one")).toBeUndefined();
    expect(Array.isArray(lookup.keys)).toBe(true);
    expect(lookup.keys.length).toBe(0);
  })

  test("Lookup with no default element only returns an element when a valid key is used.", () => {
    const lookup = createLookup<string>({ elements: { one: "1", two: "2" } });
    expect(lookup.get("")).toBeUndefined();
    expect(lookup.get("one")).toBe("1");
    expect(lookup.get("two")).toBe("2");
    expect(lookup.get("three")).toBeUndefined();
  })

  test("Lookup with no elements always returns the default element.", () => {
    const lookup = createLookup<string>({ defaultElement: "default" });
    expect(lookup.get("")).toBe("default");
    expect(lookup.get("one")).toBe("default");
    expect(lookup.get("two")).toBe("default");
    expect(lookup.get("three")).toBe("default");
  })

  test("Lookup with elements returns the default element when an invalid key is used.", () => {
    const lookup = createLookup<string>({ defaultElement: "default", elements: { one: "1", two: "2" } });
    expect(lookup.get("")).toBe("default");
    expect(lookup.get("one")).toBe("1");
    expect(lookup.get("two")).toBe("2");
    expect(lookup.get("three")).toBe("default");
  })

  test("Lookup does not return the default element when the disable fallback option is used.", () => {
    const lookup1 = createLookup<string>({ defaultElement: "default" });
    expect(lookup1.get("", true)).toBeUndefined();
    expect(lookup1.get("", false)).toBe("default");
    expect(lookup1.get("one", true)).toBeUndefined();
    expect(lookup1.get("one", false)).toBe("default");
    const lookup2 = createLookup<string>({ defaultElement: "default", elements: {} });
    expect(lookup2.get("", true)).toBeUndefined();
    expect(lookup2.get("", false)).toBe("default");
    expect(lookup2.get("one", true)).toBeUndefined();
    expect(lookup2.get("one", false)).toBe("default");
    const lookup3 = createLookup<string>({ defaultElement: "default", elements: { one: "1", two: "2" } });
    expect(lookup3.get("", true)).toBeUndefined();
    expect(lookup3.get("", false)).toBe("default");
    expect(lookup3.get("one", true)).toBe("1");
    expect(lookup3.get("one", false)).toBe("1");
    expect(lookup3.get("two", true)).toBe("2");
    expect(lookup3.get("two", false)).toBe("2");
    expect(lookup3.get("three", true)).toBeUndefined();
    expect(lookup3.get("three", false)).toBe("default");
  })

})