import React from "react";
import { RuleBasedPersonalizationContext } from "../contexts";
import { Context } from "@uniformdev/context";
import { MapWithDefaultConfig } from "@uniformdev-collab/rule-based-personalization";

export type RuleBasedPersonalizationProps<TPzConfig, TPzRuleConfig> = {
  context: Context;
  pzConfigs: MapWithDefaultConfig<TPzConfig>;
  pzRuleConfigs: MapWithDefaultConfig<TPzRuleConfig>;
};

export function RuleBasedPersonalization<TPzConfig, TPzRuleConfig>(props: React.PropsWithChildren<RuleBasedPersonalizationProps<TPzConfig, TPzRuleConfig>>) {
  const { context, pzConfigs, pzRuleConfigs, children } = props;
  return (
    <RuleBasedPersonalizationContext.Provider value={{ pzConfigs, pzRuleConfigs, context }}>
      {children}
    </RuleBasedPersonalizationContext.Provider>
  );
}
