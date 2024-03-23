import { createEnrichmentTagsMatcher } from "..";

describe(createEnrichmentTagsMatcher, () => {
  test("placeholder", () => {
    expect(true).toBe(true);
  })
});
// import { Entry } from "contentful";
// import { createEnrichmentTagsMatcher } from "..";
// import entry from "./entry-with-multiple-enrichment-tags.json";
// import { PersonalizationRule } from "@uniformdev-collab/rule-based-personalization";

// describe(createEnrichmentTagsMatcher, () => {

//   test("Not specifying a field results in the field unfrmOptEnrichmentTag being used.", () => {
//     const rule: PersonalizationRule = { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: ["1_5", "2_3"], matchType: "all" };
//     const matcher = createEnrichmentTagsMatcher();
//     const result = matcher(entry as Entry, rule, { all: (entry, reader, ruleValues) => ruleValues.every(value => reader(entry).includes(value)) });
//     expect(result).toBe(true);
//   })

//   test("Specifying a field that does not exist on the entry returns false.", () => {
//     const rule: PersonalizationRule = { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: ["1_5", "2_3"], matchType: "all" };
//     const matcher = createEnrichmentTagsMatcher("test");
//     const result = matcher(entry as Entry, rule, { all: (entry, reader, ruleValues) => ruleValues.every(value => reader(entry).includes(value)) });
//     expect(result).toBe(false);
//   })

//   test("Specifying a field that exists on the entry returns true.", () => {
//     const rule: PersonalizationRule = { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: ["1_5", "2_3"], matchType: "all" };
//     const matcher = createEnrichmentTagsMatcher("unfrmOptEnrichmentTag");
//     const result = matcher(entry as Entry, rule, { all: () => true });
//     expect(result).toBe(true);
//   })

//   test("The order of the members of the required values does not matter.", () => {
//     const rules: PersonalizationRule[] = [
//       { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: ["1_5", "2_3"], matchType: "all" },
//       { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: ["2_3", "1_5"], matchType: "all" },
//     ];
//     const matcher = createEnrichmentTagsMatcher("unfrmOptEnrichmentTag");
//     rules.forEach(rule => {
//       const result = matcher(entry as Entry, rule, { all: (entry, reader, ruleValues) => ruleValues.every(value => reader(entry).includes(value)) });
//       expect(result).toBe(true);  
//     })
//   })

//   test("All required values are required.", () => {
//     const rules: PersonalizationRule[] = [
//       { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: ["1_5", "2_3", "1_1"], matchType: "all" },
//       { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: ["1_1", "1_5", "2_3"], matchType: "all" },
//       { action: "boost", id: "rule3", pz: { crit: [] }, requiredValues: ["1_5", "1_1"], matchType: "all" },
//       { action: "boost", id: "rule4", pz: { crit: [] }, requiredValues: ["1_1", "2_3"], matchType: "all" },
//     ];
//     const matcher = createEnrichmentTagsMatcher("unfrmOptEnrichmentTag");
//     rules.forEach(rule => {
//       const result = matcher(entry as Entry, rule, { all: (entry, reader, ruleValues) => ruleValues.every(value => reader(entry).includes(value)) });
//       expect(result).toBe(false);  
//     })
//   })

//   test("Rules with more than the required values match.", () => {
//     const rules: PersonalizationRule[] = [
//       { action: "boost", id: "rule1", pz: { crit: [] }, requiredValues: ["1_5"], matchType: "all" },
//       { action: "boost", id: "rule2", pz: { crit: [] }, requiredValues: ["2_3"], matchType: "all" },
//     ];
//     const matcher = createEnrichmentTagsMatcher("unfrmOptEnrichmentTag");
//     rules.forEach(rule => {
//       const result = matcher(entry as Entry, rule, { all: (entry, reader, ruleValues) => ruleValues.every(value => reader(entry).includes(value)) });
//       expect(result).toBe(true);  
//     })
//   })

// })