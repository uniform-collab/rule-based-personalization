import { RuleBasedPersonalizationActionCollection, RuleBasedPersonalizeOptionsResolver } from "@uniformdev-collab/rule-based-personalization";
import React from "react";

export type RuleBasedPersonalizationContextValue<TEntry> = {
  optionsResolver: RuleBasedPersonalizeOptionsResolver<TEntry>;
  actions?: RuleBasedPersonalizationActionCollection<TEntry>;
};

export const RuleBasedPersonalizationContext = React.createContext<
  RuleBasedPersonalizationContextValue<any> | undefined
>(undefined);
