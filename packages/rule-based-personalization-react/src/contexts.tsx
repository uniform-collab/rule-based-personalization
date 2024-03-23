import { RuleActionCollection, RuleBasedPersonalizeOptionsResolver, RuleMatchHandlerCollection } from "@uniformdev-collab/rule-based-personalization";
import React from "react";

export type RuleBasedPersonalizationContextValue<TEntry> = {
  optionsResolver: RuleBasedPersonalizeOptionsResolver<TEntry>;
  actions?: RuleActionCollection<TEntry>;
  matchHandlers?: RuleMatchHandlerCollection<TEntry>;
};

export const RuleBasedPersonalizationContext = React.createContext<
  RuleBasedPersonalizationContextValue<any> | undefined
>(undefined);
