import { EntryPosition, PersonalizationRule } from "../types";
import { ApplyRulesToListEntriesArgs, applyRulesToListEntries } from "../rules";

describe(applyRulesToListEntries, () => {

  test("Empty entries array returns empty array.", () => {
    const rules: PersonalizationRule[] = [
      { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = [];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules, 
      listEntries, 
      doesRuleApply: (entry, rule) => true,
    }
    const result = applyRulesToListEntries<string>(args)
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  })

  test("Empty rules array results in no changes.", () => {
    const rules: PersonalizationRule[] = [];
    const listEntries: string[] = ["entry1", "entry2"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules, 
      listEntries, 
      doesRuleApply: (entry, rule) => true,
    }
    const result = applyRulesToListEntries<string>(args);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(listEntries.length);
  })

  test("boost rules that don't apply to any entry results in no changes", () => {
    const rules: PersonalizationRule[] = [
      { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 1, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 2, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 3, hide: false },
    ];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => false,
    }
    const result = applyRulesToListEntries<string>(args);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === listEntries.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test("1 boost rule applies", () => {
    const rules: PersonalizationRule[] = [
      { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => entry === "entryB",
    }
    const result = applyRulesToListEntries<string>(args)
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryB", originalPosition: 2, newPosition: 1, hide: false },
      { listEntry: "entryA", originalPosition: 1, newPosition: 2, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 3, hide: false },
    ];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === listEntries.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test("Multiple boost rules apply", () => {
    const rules: PersonalizationRule[] = [
      { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => (entry === "entryA" || entry === "entryC"),
    }
    const result = applyRulesToListEntries<string>(args);
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 1, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 2, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 3, hide: false },
    ];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === expected.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test("Overriding the default hide action works.", () => {
    const rules: PersonalizationRule[] = [
      { action: "hide", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => true,
      actions: {
        hide: (position) => {
          position.hide = position.listEntry !== "entryB";
        },
      }
    }
    const result = applyRulesToListEntries<string>(args);
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 1, hide: true },
      { listEntry: "entryB", originalPosition: 2, newPosition: 2, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 3, hide: true },
    ];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === expected.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test("Adding a new action that is registered works.", () => {
    const rules: PersonalizationRule[] = [
      { action: "custom", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => true,
      actions: {
        custom: (position) => {
          if (position.listEntry === "entryB") {
            position.newPosition = 10;
          }
        },
      }
    }
    const result = applyRulesToListEntries<string>(args);
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 1, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 2, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 3, hide: false },
    ];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === expected.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test("Adding a new action that is not registered is ignored.", () => {
    const rules: PersonalizationRule[] = [
      { action: "custom", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => true,
    }
    const result = applyRulesToListEntries<string>(args);
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 1, hide: false },
      { listEntry: "entryB", originalPosition: 2, newPosition: 2, hide: false },
      { listEntry: "entryC", originalPosition: 3, newPosition: 3, hide: false },
    ];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === expected.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

  test("Adding a new action that is registered works but not used is ignored.", () => {
    const rules: PersonalizationRule[] = [
      { action: "hide", id: "rule1", pz: { crit: [] }, requiredValues: [], matchType: "all" },
    ];
    const listEntries: string[] = ["entryA", "entryB", "entryC"];
    const args: ApplyRulesToListEntriesArgs<string> = {
      rules,
      listEntries,
      doesRuleApply: (entry, rule) => true,
      actions: {
        custom: (position) => {
          if (position.listEntry === "entryB") {
            position.newPosition = 10;
          }
        },
      }
    }
    const result = applyRulesToListEntries<string>(args);
    const expected: EntryPosition<string>[] = [
      { listEntry: "entryA", originalPosition: 1, newPosition: 1, hide: true },
      { listEntry: "entryB", originalPosition: 2, newPosition: 2, hide: true },
      { listEntry: "entryC", originalPosition: 3, newPosition: 3, hide: true },
    ];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length === expected.length).toBe(true);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

})