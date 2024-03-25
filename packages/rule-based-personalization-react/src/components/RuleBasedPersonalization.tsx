import React from "react";
import { RuleBasedPersonalizationContext } from "../contexts";
import { Context } from "@uniformdev/context";
import { LookupConfig } from "@uniformdev-collab/rule-based-personalization";

export type RuleBasedPersonalizationProps<TPzConfig, TPzRuleConfig> = {
  context: Context;
  pzConfigs: LookupConfig<TPzConfig>;
  pzRuleConfigs: LookupConfig<TPzRuleConfig>;
};

export function RuleBasedPersonalization<TPzConfig, TPzRuleConfig>(props: React.PropsWithChildren<RuleBasedPersonalizationProps<TPzConfig, TPzRuleConfig>>) {
  const { context, pzConfigs, pzRuleConfigs, children } = props;
  return (
    <RuleBasedPersonalizationContext.Provider value={{ pzConfigs, pzRuleConfigs, context }}>
      {children}
    </RuleBasedPersonalizationContext.Provider>
  );
}
