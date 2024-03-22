import React from "react";
import { RuleBasedPersonalizationContext } from "../contexts";
import { RuleBasedPersonalizationProps } from "../types";

export function RuleBasedPersonalization<TEntry>(props: React.PropsWithChildren<RuleBasedPersonalizationProps<TEntry>>) {
  const { optionsResolver, children } = props;
  return (
    <RuleBasedPersonalizationContext.Provider value={{ optionsResolver }}>
      {children}
    </RuleBasedPersonalizationContext.Provider>
  );
}
