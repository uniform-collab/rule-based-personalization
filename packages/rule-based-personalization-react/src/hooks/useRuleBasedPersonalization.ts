import { RuleBasedPersonalizeArgs, ruleBasedPersonalize } from "@uniformdev-collab/rule-based-personalization";
import { useContext } from "react";
import { RuleBasedPersonalizationContext, RuleBasedPersonalizationContextValue } from "../contexts";
import { DoPersonalize, DoPersonalizeArgs, DoPersonalizeResult } from "../types";

type UseRuleBasedPersonalizationHookResult<TEntry> = {
  doPersonalize: DoPersonalize<TEntry>;
}

export function useRuleBasedPersonalization<TEntry>(): UseRuleBasedPersonalizationHookResult<TEntry> {
  const value = useContext(RuleBasedPersonalizationContext) as RuleBasedPersonalizationContextValue<TEntry>;
  if (!value) {
    return {
      doPersonalize: () => {
        return {
          result: {
            error: "No RuleBasedPersonalizationContext was found.",
          }
        }
      }
    };
  }
  const doPersonalize = (args: DoPersonalizeArgs<TEntry>): DoPersonalizeResult<TEntry> => {
    const args2: RuleBasedPersonalizeArgs<TEntry> = {
      ...args,
      ...value,
    }
    return { result: ruleBasedPersonalize(args2) }
  }
  return { doPersonalize };
}