import { sortContentEntryPositions } from "./actions";
import { Context } from "@uniformdev/context";
import { DoPersonalizeResult, PzConfig } from "./types";

export type DoPersonalizeOptions<TEntry, TContentEntry, TRuleEntry> = {
  context: Context;
  pzConfig: PzConfig<TEntry, TContentEntry, TRuleEntry>;
  getRuleType: (ruleEntry: TRuleEntry) => string | undefined;
}

export function doPersonalize<TEntry, TContentEntry, TRuleEntry>(entry: TEntry, options: DoPersonalizeOptions<TEntry, TContentEntry, TRuleEntry>): DoPersonalizeResult<TContentEntry> {
  const { context, pzConfig, getRuleType } = options;
  //
  //
  const original: TContentEntry[] = [];
  const personalized: TContentEntry[] = [];
  //
  //
  if (pzConfig) {
    const { getRulesForVisitor, getContentEntries } = pzConfig;
    const ruleEntries = getRulesForVisitor(context, entry, pzConfig);
    const contentEntryPositions = getContentEntries(entry);
    contentEntryPositions.forEach((contentEntryPosition, index) => {
      ruleEntries.forEach(ruleEntry => {
        const ruleType = getRuleType(ruleEntry);
        if (ruleType) {
          const pzRuleConfig = pzConfig.pzRuleConfigs.get(ruleType);
          if (pzRuleConfig) {
            const { isContentApplicable, getActionHandler } = pzRuleConfig;
            if (isContentApplicable(ruleEntry, contentEntryPosition.entry)) {
              const actionHandler = getActionHandler(ruleEntry);
              if (actionHandler) {
                actionHandler(index, contentEntryPositions);
              }
            }
          }
        }
      })
    })
    contentEntryPositions.forEach(position => {
      original.push(position.entry);
    })
    contentEntryPositions
      .filter(position => position.hide !== true)
      .sort(sortContentEntryPositions)
      .forEach(position => {
        personalized.push(position.entry);
      });
  }
  return {
    original,
    personalized,
  }
}
