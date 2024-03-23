import { getAllRules } from "../rules";

describe(getAllRules, () => {

  test('Empty entries array returns empty array.', () => {
    const allRules = getAllRules<string>([], (entry) => {
      return {
        action: "boost",
        id: entry,
        pz: { crit: [] },
        requiredValues: [],
        matchType: "all",
      }
    })
    expect(Array.isArray(allRules)).toBe(true);
    expect(allRules.length).toBe(0);
  })

  test('Rule converter throws error.', () => {
    const convert = () => {
      getAllRules<string>(["entry1"], (entry) => {
        throw "This error"
      })
    }
    expect(convert).toThrow("This error");
  })

  test('Entries are converted correctly.', () => {
    const entries = ["entry1", "entry2"];
    const pz = { crit: [] };
    const requiredValues = ["entry1", "entry2"];  
    const allRules = getAllRules<string>(entries, (entry) => {
      return {
        action: "boost",
        id: entry,
        pz,
        requiredValues,
        matchType: "all",
      }
    })
    expect(Array.isArray(allRules)).toBe(true);
    expect(allRules.length === entries.length);
    for (let i = 0; i < allRules.length; i++) {
      const entry = entries[i];
      const rule = allRules[i]!;
      expect(rule.action).toBe("boost");
      expect(rule.id).toBe(entry);
      expect(rule.pz).toBe(pz);
      expect(rule.requiredValues).toBe(requiredValues);
    }
  })
})