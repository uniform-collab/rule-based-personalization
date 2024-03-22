import { RuleBasedPersonalizeResult, RuleBasedPersonalizeOptionsResolver, RuleBasedPersonalizationActionCollection } from "@uniformdev-collab/rule-based-personalization";
import { Context } from "@uniformdev/context";

export type DoPersonalizeArgs<TEntry> = {
  name: string;
  entry: TEntry;
  context: Context;
}
export type DoPersonalize<TEntry> = (args: DoPersonalizeArgs<TEntry>) => DoPersonalizeResult<TEntry>;
export type DoPersonalizeResult<TEntry> = {
  result: RuleBasedPersonalizeResult<TEntry>;
}

export type RuleBasedPersonalizationProps<TEntry> = {
  optionsResolver: RuleBasedPersonalizeOptionsResolver<TEntry>;
  actions?: RuleBasedPersonalizationActionCollection<TEntry>;
};

