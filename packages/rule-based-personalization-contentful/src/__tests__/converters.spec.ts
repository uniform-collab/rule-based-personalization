import { Entry } from "contentful";
import { Context } from "@uniformdev/context";
import { LookupConfig, PzRuleActionHandlers } from "@uniformdev-collab/rule-based-personalization";
import { convertContentfulPzConfig } from "../converters";
import { ContentfulPzConfig, ContentfulPzRuleConfig } from "../types";
import { createEntry } from "./utils";

const context = new Context({ manifest: { project: {} } });

const entryA = createEntry("entryAId", "entry", {
  entries: [
    createEntry("contentEntryAId", "contentEntry", {
      name: "Content entry A",
    }),
  ],
  rules: [
    createEntry("ruleEntryAId", "ruleEntryA", {
      action: "actionA",
      name: "Action A for rule entry A",
    }),
    createEntry("ruleEntryBId", "ruleEntryB", {
      action: "actionB",
      name: "Action B for rule entry B",
    }),
  ],
})

const pzRuleConfigsConfig: LookupConfig<ContentfulPzRuleConfig> = {
  defaultElement: {
    nameFieldId: "name",
    actionFieldId: "action",
    contentCriteriaMatchTypeFieldId: "contentCriteriaMatchType",
  },
  elements: {
    ruleEntryB: {
      nameFieldId: "name",
      actionFieldId: "action",
      contentCriteriaMatchTypeFieldId: "contentCriteriaMatchType",
    }
  },
}

const pzRuleActionHandlers: PzRuleActionHandlers<Entry> = {
  actionA: (index, positions) => { }
}


describe(convertContentfulPzConfig, () => {
  test("Conversion successful when all required values are set.", () => {
    const pzConfig: ContentfulPzConfig = {
      contentEntriesFieldId: "entries",
      pzRulesFieldId: "rules",
    }
    const result = convertContentfulPzConfig(pzConfig, pzRuleConfigsConfig, pzRuleActionHandlers);
    expect(result).toBeDefined();
    //
    //
    const { getEntryId } = result;
    expect(getEntryId).toBeDefined();
    expect(getEntryId(entryA)).toBe(entryA.sys.id);
    //
    //
    const { getContentEntries } = result;
    expect(getContentEntries).toBeDefined();
    const contentEntries = getContentEntries(entryA);
    expect(contentEntries).toBeDefined();
    expect(contentEntries.length).toBe((entryA.fields.entries as []).length);
    //
    //
    const { getRuleEntries } = result;
    expect(getRuleEntries).toBeDefined();
    const ruleEntries = getRuleEntries(entryA);
    expect(ruleEntries).toBeDefined();
    expect(ruleEntries.length).toBe((entryA.fields.rules as []).length);
    //
    //no criteria is assigned to the rules so all
    //rules will be applicable for the visitor.
    const { getRulesForVisitor } = result;
    expect(getRulesForVisitor).toBeDefined();
    const ruleEntriesForVisitor = getRulesForVisitor(context, entryA, result);
    expect(Array.isArray(ruleEntriesForVisitor)).toBe(true);
    expect(ruleEntriesForVisitor.length).toBe((entryA.fields.rules as []).length);
    for (let i = 0; i < ruleEntriesForVisitor.length; i++) {
      const actual = ruleEntriesForVisitor[i];
      const expected = (entryA.fields.rules as [])[i];
      expect(actual).toStrictEqual(expected);
    }
    //
    //
    const { pzRuleConfigs } = result;
    expect(pzRuleConfigs).toBeDefined();
    const expectedKeys = Object.keys(pzRuleConfigsConfig.elements ?? {});
    expect(pzRuleConfigs.keys).toStrictEqual(expectedKeys);

    const defaultConfig = pzRuleConfigs.get("unknown");
    expect(defaultConfig).toBeDefined();
    expect(pzRuleConfigs.get("unknown")).toBe(defaultConfig);
    expect(pzRuleConfigs.get("test 1")).toBe(defaultConfig);
    expect(pzRuleConfigs.get("test 2")).toBe(defaultConfig);

    const knownConfig = pzRuleConfigs.get("ruleEntryB");
    expect(knownConfig).toBeDefined();
    expect(pzRuleConfigs.get("ruleEntryB")).toBe(knownConfig);
    expect(pzRuleConfigs.get("ruleEntryB")).not.toBe(defaultConfig);
  })

})