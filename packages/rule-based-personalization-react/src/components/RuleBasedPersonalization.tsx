import React from "react";
import { RuleBasedPersonalizationContext } from "../contexts";
import { RuleBasedPersonalizationProps } from "../types";

export function RuleBasedPersonalization<TEntry>(props: React.PropsWithChildren<RuleBasedPersonalizationProps<TEntry>>) {
  const { optionsResolver, actions, matchHandlers, children } = props;
  return (
    <RuleBasedPersonalizationContext.Provider value={{ optionsResolver, actions, matchHandlers }}>
      {children}
    </RuleBasedPersonalizationContext.Provider>
  );
}
