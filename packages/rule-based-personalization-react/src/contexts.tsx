import { DoPersonalizeResult, LookupConfig } from "@uniformdev-collab/rule-based-personalization";
import React from "react";
import { Context } from "@uniformdev/context";

export type RuleBasedPersonalizationContextValue<TEntry, TContentEntry, TOptions, TPzConfig, TPzRuleConfig> = {
  context: Context;
  pzConfigs: LookupConfig<TPzConfig>;
  pzRuleConfigs: LookupConfig<TPzRuleConfig>;
};

export const RuleBasedPersonalizationContext = React.createContext<
  RuleBasedPersonalizationContextValue<any, any, any, any, any> | undefined
>(undefined);

