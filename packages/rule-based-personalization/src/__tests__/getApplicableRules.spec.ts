import { Context } from "@uniformdev/context";
import { PersonalizationRule } from "../types";
import { getApplicableRules } from "../rules";

function getContext(): Context {
  return new Context({
    manifest: {
      "project": {
        "pz": {
          "enr": {
            "1": {
              "cap": 100
            },
            "2": {
              "cap": 100
            }
          },
        },
        "test": {}
      }
    }
  })
}

describe(getApplicableRules, () => {

  test('Empty personalization rules array returns empty array.', () => {
    const context = getContext();
    const rules = getApplicableRules("test", context, []);
    expect(rules.length).toBe(0);
  })

  test('Multiple personalization rules match.', () => {
    const context = getContext();
    context.update({
      enrichments: [
        { cat: "1", key: "1", str: 5}
      ]
    })
    const original: PersonalizationRule[] = [
      { action: "boost", id: "rule1", pz: { crit: [{ l: "1_1", op: "=", r: 5 }] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule2", pz: { crit: [{ l: "2_2", op: "=", r: 5 }] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule3", pz: { crit: [{ l: "1_1", op: ">", r: 0 }] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule4", pz: { crit: [{ l: "1_1", op: ">", r: 4 }] }, requiredValues: [], matchType: "all" },
    ];
    const expected: PersonalizationRule[] = [
      { action: "boost", id: "rule1", pz: { crit: [{ l: "1_1", op: "=", r: 5 }] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule3", pz: { crit: [{ l: "1_1", op: ">", r: 0 }] }, requiredValues: [], matchType: "all" },
      { action: "boost", id: "rule4", pz: { crit: [{ l: "1_1", op: ">", r: 4 }] }, requiredValues: [], matchType: "all" },
    ];
    const result = getApplicableRules("test", context, original);
    expect(result.length).toBe(expected.length);
    for (let i=0; i<result.length; i++) {
      expect(result[i]).toStrictEqual(expected[i]);
    }
  })

})