import { Entry } from "contentful";
import { useContext } from "react";
import { RuleBasedPersonalizationContext, RuleBasedPersonalizationContextValue } from "@uniformdev-collab/rule-based-personalization-react";
import { ContentfulPzConfig, ContentfulPzRuleConfig, DoContentfulPersonalizeOptions, doContentfulPersonalize } from "@uniformdev-collab/rule-based-personalization-contentful";
import { DoPersonalizeResult, MapWithDefaultConfig } from "@uniformdev-collab/rule-based-personalization";

export type UseContentfulRuleBasedPzHookOptions = {
  pzConfigs?: MapWithDefaultConfig<ContentfulPzConfig>;
  pzRuleConfigs?: MapWithDefaultConfig<ContentfulPzRuleConfig>
}
export type UseContentfulRuleBasedPzHookResult = {
  doPersonalize: (entry: Entry, options?: UseContentfulRuleBasedPzHookOptions) => DoPersonalizeResult<Entry>;
}

export function useContentfulRuleBasedPz(): UseContentfulRuleBasedPzHookResult {
  const value = useContext(RuleBasedPersonalizationContext) as RuleBasedPersonalizationContextValue<Entry, Entry, DoContentfulPersonalizeOptions, ContentfulPzConfig, ContentfulPzRuleConfig>;
  if (!value) {
    throw new Error("No RuleBasedPersonalizationContext was found.");
  }
  const { context, pzConfigs, pzRuleConfigs } = value;
  return {
    doPersonalize: (entry, options) => {
      return doContentfulPersonalize(entry, { 
        context, 
        pzConfigs: options?.pzConfigs ?? pzConfigs , 
        pzRuleConfigs: options?.pzRuleConfigs ?? pzRuleConfigs, 
      });
    }
  }
}
