import { Context, VariantMatchCriteria } from "@uniformdev/context";

export type MapWithDefault<T> = {
  get(id: string): T | undefined;
}

export type MapWithDefaultConfig<T> = {
  defaultElement?: T;
  elements?: { [id: string]: T };
}

export type ContentEntryPosition<TContentEntry> = {
  entry: TContentEntry;
  originalPosition: number;
  currentPosition: number;
  hide?: boolean;
  notes?: any;
}

export type GetEntryId<TEntry> = (entry: TEntry) => string;
export type GetContentEntries<TEntry, TContentEntry> = (entry: TEntry) => ContentEntryPosition<TContentEntry>[];
export type GetRuleEntries<TEntry, TRuleEntry> = (entry: TEntry) => TRuleEntry[];
export type GetRulesForVisitor<TEntry, TContentEntry, TRuleEntry> = (context: Context, entry: TEntry, pzConfig: PzConfig<TEntry, TContentEntry, TRuleEntry>) => TRuleEntry[];
export type PzConfig<TEntry, TContentEntry, TRuleEntry> = {
  getEntryId: GetEntryId<TEntry>;
  getContentEntries: GetContentEntries<TEntry, TContentEntry>;
  getRuleEntries: GetRuleEntries<TEntry, TRuleEntry>;
  getRulesForVisitor: GetRulesForVisitor<TEntry, TContentEntry, TRuleEntry>;
  pzRuleConfigs: MapWithDefault<PzRuleConfig<TRuleEntry, TContentEntry>>;
}

export type EntryValueReader<TEntry, TReturn> = (entry: TEntry) => TReturn;

export type ContentCriteriaMatchTypeHandler<TValue> = (ruleValues: TValue[], contentValues: TValue[]) => boolean;
export type ContentCriteriaMatchTypeHandlers<TValue> = { [id: string]: ContentCriteriaMatchTypeHandler<TValue> }

export type PzRuleActionHandler<TContentEntry> = (index: number, positions: ContentEntryPosition<TContentEntry>[]) => void;
export type PzRuleActionHandlers<TContentEntry> = { [id: string]: PzRuleActionHandler<TContentEntry> }

export type PzRule<TRuleEntry> = {
  id: string;
  pz: VariantMatchCriteria;
  ruleEntry: TRuleEntry;
}

export type CreatePzRuleFromEntry<TRuleEntry> = (ruleEntry: TRuleEntry) => (PzRule<TRuleEntry> | undefined);
export type PzRuleConfig<TRuleEntry, TContentEntry> = {
  getRuleName: (ruleEntry: TRuleEntry) => string;
  createPzRuleFromEntry: CreatePzRuleFromEntry<TRuleEntry>;
  isContentApplicable: (ruleEntry: TRuleEntry, contentEntry: TContentEntry) => boolean;
  getActionHandler: (ruleEntry: TRuleEntry) => PzRuleActionHandler<TContentEntry> | undefined;
}

export type DoPersonalizeResult<TContentEntry> = {
  original?: TContentEntry[];
  personalized?: TContentEntry[];
  error?: string;
}

export type DoPersonalize<TEntry, TContentEntry, TOptions> = (entry: TEntry, options: TOptions) => DoPersonalizeResult<TContentEntry>;