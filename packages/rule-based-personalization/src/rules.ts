import { Context } from "@uniformdev/context";
import { sortEntryPositions } from "./sort";
import { PersonalizationRule, DoesRuleApplyHandler, EntryPosition, RuleConverter, RuleActionCollection } from "./types";

/**
 * Converts the entries into personalization rules.
 * @param ruleEntries 
 * @param convertToRule 
 * @returns 
 */
export function getAllRules<TEntry>(ruleEntries: TEntry[], convertToRule: RuleConverter<TEntry>): PersonalizationRule[] {
  const result: PersonalizationRule[] = [];
  if (Array.isArray(ruleEntries)) {
    ruleEntries.forEach((ruleEntry) => {
      const rule = convertToRule(ruleEntry);
      if (rule) {
        result.push(rule);
      }
    });
  }
  return result;
}

/**
 * Returns the personalization rules that apply based on the visitor context.
 * @param name Personalization requires a name, which 
 *              is included in the event the tracker 
 *              fires when personalization runs.
 * @param context 
 * @param rules 
 * @returns 
 */
export function getApplicableRules(name: string, context: Context, rules: PersonalizationRule[]): PersonalizationRule[] {
  const { variations } = context.personalize({
    name,
    variations: rules,
    take: rules?.length ?? 0,
  });
  return variations;
}

export type ApplyRulesToListEntriesArgs<TEntry> = {
  rules: PersonalizationRule[];
  listEntries: TEntry[];
  doesRuleApply: DoesRuleApplyHandler<TEntry>;
  actions?: RuleActionCollection<TEntry>;
}

/**
 * 
 * @param rules Personalization rules that are applied to the list entries.
 * @param listEntries Array of list entries that are personalized
 * @param doesRuleApply Function that determines whether a 
 *                      personalization rule should be applied 
 *                      to a specific list entry.
 * @returns 
 */
export function applyRulesToListEntries<TEntry>(args: ApplyRulesToListEntriesArgs<TEntry>): EntryPosition<TEntry>[] {
  const { rules, listEntries, doesRuleApply, actions = {} } = args;
  const result: EntryPosition<TEntry>[] = listEntries.map((listEntry, position) => {
    return {
      listEntry,
      originalPosition: position + 1,
      newPosition: position + 1,
      hide: false,
    }
  })
  rules.forEach((rule) => {
    result.forEach((position) => {
      const { listEntry } = position ?? {};
      const ruleApplies = doesRuleApply(listEntry, rule);
      if (ruleApplies) {
        const action = actions[rule.action];
        if (action) {
          action(position);
          return;
        }
        if (rule.action === "hide") {
          position.hide = true;
          return;
        }
        if (rule.action === "boost") {
          position.newPosition = 0;
          return;
        }
      }
    });
  });
  return sortEntryPositions(result);
}

/**
 * Returns a new array of entry positions with hidden entries removed.
 * @param positions 
 * @returns 
 */
function removeHiddenEntries<TEntry>(positions: EntryPosition<TEntry>[]): EntryPosition<TEntry>[] {
  const result: EntryPosition<TEntry>[] = [];
  if (positions) {
    positions.forEach(position => {
      if (!position.hide) {
        result.push(position);
      }
    })
  }
  return result;
}

