import { Context, VariantMatchCriteria } from "@uniformdev/context";

/**
 * Determines if the personalization rule applies based 
 * on the state of the entry.
 */
export type DoesRuleApplyHandler<TEntry> = (entry: TEntry, rule: PersonalizationRule) => boolean;

/**
 * Represents a list entry that can be (or has been) personalized.
 */
export type EntryPosition<TEntry> = {
  listEntry: TEntry;
  originalPosition: number;
  newPosition?: number;
  hide: boolean;
}

/**
 * Resolves values from the entry.
 */
export type EntryValueReader<TEntry, TReturn> = (entry: TEntry) => TReturn;

/**
 * 
 */
export type RuleActionCollection<TEntry> = {
  [id: string]: (position: EntryPosition<TEntry>) => void;
}

/**
 * 
 */
export type RuleMatchHandler<TEntry> = (entry: TEntry, contentValueReader: EntryValueReader<TEntry, string[]>, ruleValues: string[]) => boolean;
/**
 * 
 */
export type RuleMatchHandlerCollection<TEntry> = { [id: string]: RuleMatchHandler<TEntry> }

/**
 * Represents the combination of personalization conditions 
 * and the action to take if the conditions are met.
 */
export type PersonalizationRule = {
  id: string;
  pz: VariantMatchCriteria;
  action: string;
  requiredValues: string[];
}
/**
 * Converts an entry into a presonalization rule.
 */
export type RuleConverter<TEntry> = (ruleEntry: TEntry) => (PersonalizationRule | undefined)

/**
 * Type that can make it reasier to create new PersonalizationRuleConverter types.
 */
export type RulePropertyReaders<TEntry> = {
  getRequiredValues: EntryValueReader<TEntry, string[]>;
  getId?: EntryValueReader<TEntry, string>;
  getPz?: EntryValueReader<TEntry, VariantMatchCriteria>;
  getAction?: EntryValueReader<TEntry, string>;
  idFieldId?: string;
  pzFieldId?: string;
  actionFieldId?: string;
}

/**
 * Resolves referenced entries.
 */
export type ReferencedEntriesReader<TEntry> = (entry: TEntry) => TEntry[];

/**
 * The result from running personalization, which contains 
 * the original entries and the personalized entries.
 */
export type RuleBasedPersonalizeResult<TEntry> = {
  original?: TEntry[];
  personalized?: TEntry[];
  error?: any;
}

/**
 * Controls the way personalization runs.
 */
export type RuleBasedPersonalizeArgs<TEntry> = {
  /**
   * Value used for the personalization event that is 
   * triggered as a result of personalization running.
   */
  name: string;
  /**
   * Entry with the list of entries to personalize, 
   * and the personalization rules.
   */
  entry: TEntry;
  /**
   * Tracker used to run personalization.
   */
  context: Context;
  /**
   * 
   */
  optionsResolver: RuleBasedPersonalizeOptionsResolver<TEntry>;
  /**
   * 
   */
  actions?: RuleActionCollection<TEntry>;
  /**
   * 
   */
  matchHandlers?: RuleMatchHandlerCollection<TEntry>;
}

/**
 * 
 */
export type RuleBasedPersonalizeOptions<TEntry> = {
  /**
   * Gets the list entries to personalize.
   */
  getListEntries: ReferencedEntriesReader<TEntry>;
  /**
   * Gets the entries that represent the personalization rules.
   */
  getRuleEntries: ReferencedEntriesReader<TEntry>;
  /**
   * Converts the entry that represents a personalization 
   * rule into an object that can be used during the 
   * personalization process.
   */
  convertToRule: RuleConverter<TEntry>;
  /**
   * Determines whether a personalization rule applies 
   * to the entry based on the visitor context.
   */
  doesRuleApply: DoesRuleApplyHandler<TEntry>;
}

/**
 * 
 */
export type RuleBasedPersonalizeOptionsResolver<TEntry> = (entry: TEntry) => (RuleBasedPersonalizeOptions<TEntry> | undefined);
