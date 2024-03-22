import { Entry } from "contentful";
import { VariantMatchCriteria } from "@uniformdev/context";
import { createPersonalizationRuleReader } from "..";
import entry from "./entry-personalization-rule.json";

describe(createPersonalizationRuleReader, () => {

  test("Personalization rule is returned when the ", () => {
    const requiredValues = ["value1", "value2"];
    const reader = createPersonalizationRuleReader({
      getAction: (entry) => entry.fields.action as string,
      getId: (entry) => entry.fields.name as string,
      getPz: (entry) => entry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
      getRequiredValues: (entry) => requiredValues,
    });

    const result = reader(entry as Entry);
    expect(result).toBeDefined()
    expect(result!.action).toStrictEqual(entry.fields.action);
    expect(result!.id).toStrictEqual(entry.fields.name);
    expect(result!.pz).toStrictEqual(entry.fields.unfrmOptPersonalizationCriteria);
    expect(result!.requiredValues).toStrictEqual(requiredValues);
  })

  test("No personalization rule is returned when optional parameters are set.", () => {
    const reader = createPersonalizationRuleReader({
      getRequiredValues: (entry) => ["value1", "value2"]
    })
    const result = reader(entry as Entry);
    expect(result).toBeUndefined();
  })

  describe("Action property tests", () => {
    test("Action field id has priority over the getAction function.", () => {
      const reader = createPersonalizationRuleReader({
        actionFieldId: "action",
        getAction: (entry) => "boost",
        getId: (entry) => entry.fields.name as string,
        getPz: (entry) => entry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
        getRequiredValues: (entry) => ["value1", "value2"],
      })
      const result = reader(entry as Entry);
      expect(result).toBeDefined();
      expect(result?.action).toBe("hide");
      expect(entry.fields.action).toBe("hide");
    })
  
    test("Action field id is optional if the getAction function is set.", () => {
      const reader = createPersonalizationRuleReader({
        getAction: (entry) => "boost",
        getId: (entry) => entry.fields.name as string,
        getPz: (entry) => entry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
        getRequiredValues: (entry) => ["value1", "value2"],
      })
      const result = reader(entry as Entry);
      expect(result).toBeDefined();
      expect(result?.action).toBe("boost");
      expect(entry.fields.action).toBe("hide");
    })
  
    test("getAction function is optional is the action field id is set.", () => {
      const reader = createPersonalizationRuleReader({
        actionFieldId: "action",
        getId: (entry) => entry.fields.name as string,
        getPz: (entry) => entry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
        getRequiredValues: (entry) => ["value1", "value2"],
      })
      const result = reader(entry as Entry);
      expect(result).toBeDefined();
      expect(result?.action).toBe("hide");
      expect(entry.fields.action).toBe("hide");
    })  
  })

  describe("ID property tests", () => {
    test("ID field id has priority over the getId function.", () => {
      const reader = createPersonalizationRuleReader({
        getAction: (entry) => entry.fields.action as string,
        idFieldId: "name",
        getId: (entry) => "not the expected value",
        getPz: (entry) => entry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
        getRequiredValues: (entry) => ["value1", "value2"],
      })
      const result = reader(entry as Entry);
      expect(result).toBeDefined();
      expect(result?.id).toBe(entry.fields.name);
    })
  })

  describe("Pz property tests", () => {
    test("Pz field id has priority over the getPz function.", () => {
      const reader = createPersonalizationRuleReader({
        getAction: (entry) => entry.fields.action as string,
        getId: (entry) => entry.fields.name as string,
        pzFieldId: "unfrmOptPersonalizationCriteria",
        getPz: (entry) => ({
          crit: [
            {
              l: "1_1",
              r: "100",
              op: "="
            }
          ]
        }) as VariantMatchCriteria,
        getRequiredValues: (entry) => ["value1", "value2"],
      })
      const result = reader(entry as Entry);
      expect(result).toBeDefined();
      expect(result?.pz).toStrictEqual(entry.fields.unfrmOptPersonalizationCriteria);
    })
  
    test("Default value for pz field id is used if no value is set for the field id or the getPz function.", () => {
      const reader = createPersonalizationRuleReader({
        getAction: (entry) => entry.fields.action as string,
        getId: (entry) => entry.fields.name as string,
        getRequiredValues: (entry) => ["value1", "value2"],
      })
      const result = reader(entry as Entry);
      expect(result).toBeDefined();
      expect(result?.pz).toStrictEqual(entry.fields.unfrmOptPersonalizationCriteria);
    })
  })

})