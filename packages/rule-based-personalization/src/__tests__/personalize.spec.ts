import { Context } from "@uniformdev/context";
import { doPersonalize } from "../personalize";
import { ContentEntryPosition } from "../types";

type Entry = {
  entryId: string;
}
type ContentEntry = {
  contentEntryId: string;
}
type RuleEntry = {
  ruleEntryId: string;
}
const context = new Context({ manifest: { project: {} } });

describe(doPersonalize, () => {

  test("???", () => {
    const entry: Entry = { entryId: "entryA" };
    const contentEntryA: ContentEntry = { contentEntryId: "contentEntryA" };
    const contentEntryB: ContentEntry = { contentEntryId: "contentEntryB" };
    //
    //These are the entries that are personalized.
    const contentEntries: ContentEntryPosition<ContentEntry>[] = [
      { currentPosition: 1, entry: contentEntryA, originalPosition: 1 },
      { currentPosition: 2, entry: contentEntryB, originalPosition: 2 },
    ];
    const ruleEntry: RuleEntry = { ruleEntryId: "ruleEntryA" };
    const result = doPersonalize<Entry, ContentEntry, RuleEntry>(entry, {
      context,
      getRuleType: () => {
        /** Ignored for the purpose of this test. */
        return "ruleType";
      },
      pzConfig: {
        getContentEntries: (entry) => contentEntries,
        getEntryId: (entry) => {
          /** Ignored for the purpose of this test. */
          return entry.entryId;
        },
        getRuleEntries: (entry) => {
          /** Ignored for the purpose of this test. */
          return [];
        },
        getRulesForVisitor: (context, entry, pzConfig) => {
          //
          //At least 1 rule needs to be returned in order for the action handler to be triggered.
          return [ruleEntry];
        },
        pzRuleConfigs: {
          get: (key, disableFallBack) => {
            return {
              isContentApplicable: (ruleEntry, contentEntry) => {
                //
                //This makes the rules apply to all content entries.
                return true;
              },
              getActionHandler: (ruleEntry) => {
                //
                //This changes the current position for each member of the array.
                return (index, positions) => {
                  positions.forEach(position => position.currentPosition = 10 - position.originalPosition);
                }
              },
              createPzRuleFromEntry: (ruleEntry) => {
                //
                //This turns the rule into a format that it can be used in personalization.
                return { id: ruleEntry.ruleEntryId, pz: { crit: [] }, ruleEntry };
              },
              getRuleName: (ruleEntry) => {
                /** Ignored for the purpose of this test. */
                return ruleEntry.ruleEntryId;
              },
            };
          },
          /** Ignored for the purpose of this test. */
          keys: [],
        },
      }
    })
    expect(result).toBeDefined();
    const { error, original, personalized } = result;
    expect(error).toBeUndefined();
    expect(original).toStrictEqual([contentEntryA, contentEntryB]);
    expect(personalized).toStrictEqual([contentEntryB, contentEntryA]);
  })

})