import { RuleBasedPersonalizeArgs, RuleBasedPersonalizeResult } from "./types";
import { applyRulesToListEntries, getAllRules, getApplicableRules } from "./rules";

/**
 * Performs a rules-based personalization on a list of entries.
 * The list of entries and rules to apply are determined by the
 * args passed to the function.
 * @param args 
 * @returns 
 */
export function ruleBasedPersonalize<TEntry>(args: RuleBasedPersonalizeArgs<TEntry>): RuleBasedPersonalizeResult<TEntry> {
  const { name, entry, context, optionsResolver, actions, matchHandlers } = args ?? {};
  const resolver = optionsResolver(entry);
  if (!resolver) {
    return { error: `No option resolver found.` };
  }
  const { getRuleEntries, convertToRule, getListEntries, doesRuleApply } = resolver;
  const ruleEntries = getRuleEntries(entry);


  const allRules = getAllRules(ruleEntries, convertToRule);
  const applicableRules = getApplicableRules(name, context, allRules);
  const allListEntries = getListEntries(entry);
  const positions = applyRulesToListEntries<TEntry>({ rules: applicableRules, listEntries: allListEntries, doesRuleApply, actions });
  const sortedEntries = positions.filter(info => info.hide !== true).map(info => info.listEntry);
  return {
    original: allListEntries,
    personalized: sortedEntries,
  }
}