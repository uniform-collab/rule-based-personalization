import { LookupConfig } from "@uniformdev-collab/rule-based-personalization";

export type ContentfulPzRuleConfig = {
  nameFieldId: string;
  actionFieldId: string;
  contentCriteriaMatchTypeFieldId?: string;
}

export type ContentfulPzConfig = {
  contentEntriesFieldId: string;
  pzRulesFieldId: string;
}

export interface ContentfulPzRuleLookupConfig extends LookupConfig<ContentfulPzRuleConfig> {
}

export interface ContentfulPzConfigLookupConfig extends LookupConfig<ContentfulPzConfig> {
}