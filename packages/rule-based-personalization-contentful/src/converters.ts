import { Context, VariantMatchCriteria } from "@uniformdev/context";
import { Entry } from "contentful";
import { ContentCriteriaMatchTypeHandlers, ContentEntryPosition, Lookup, LookupConfig, PzConfig, PzRule, PzRuleActionHandlers, PzRuleConfig, createLookup, createPzRuleActionLookup, createContentCriteriaMatchTypeLookup } from "@uniformdev-collab/rule-based-personalization";
import { ContentfulPzConfig, ContentfulPzRuleConfig } from "./types";
import { createContentfulEnrichmentTagsReader } from "./readers";

export type ConvertContentfulPzRuleConfigOptions = {
  pzRuleActionHandlers?: PzRuleActionHandlers<Entry>;
  ruleEntryEnrichmentTagsFieldId?: string;
  contentEntryEnrichmentTagsFieldId?: string;
  contentCriteriaMatchTypeHandlers?: ContentCriteriaMatchTypeHandlers<string>; 
}

export function convertContentfulPzRuleConfig(pzRuleConfig: ContentfulPzRuleConfig, options: ConvertContentfulPzRuleConfigOptions = {}): PzRuleConfig<Entry, Entry> {
  const { pzRuleActionHandlers, ruleEntryEnrichmentTagsFieldId, contentEntryEnrichmentTagsFieldId, contentCriteriaMatchTypeHandlers } = options;
  const { nameFieldId, actionFieldId, contentCriteriaMatchTypeFieldId } = pzRuleConfig;
  const pzRuleActionLookup = createPzRuleActionLookup(pzRuleActionHandlers);
  const ruleEntryEnrichmentTagReader = createContentfulEnrichmentTagsReader(ruleEntryEnrichmentTagsFieldId);
  const contentEntryEnrichmentTagReader = createContentfulEnrichmentTagsReader(contentEntryEnrichmentTagsFieldId);
  const contentCriteriaMatchTypeLookup = createContentCriteriaMatchTypeLookup(contentCriteriaMatchTypeHandlers);
  return {
    getRuleName: (ruleEntry: Entry) => ruleEntry.fields[nameFieldId] as string,
    createPzRuleFromEntry: (ruleEntry: Entry) => {
      return { 
        id: ruleEntry.sys.id as string,
        ruleName: ruleEntry.fields[nameFieldId] as string,
        pz: ruleEntry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
        ruleEntry,
      }
    },
    isContentApplicable: (ruleEntry: Entry, contentEntry: Entry) => {
      const ruleValues = ruleEntryEnrichmentTagReader(ruleEntry);
      const contentValues = contentEntryEnrichmentTagReader(contentEntry);
      let contentCriteriaMatchTypeValue;
      if (contentCriteriaMatchTypeFieldId) {
        contentCriteriaMatchTypeValue = ruleEntry.fields[contentCriteriaMatchTypeFieldId] as string;
      }
      const handler = contentCriteriaMatchTypeLookup.get(contentCriteriaMatchTypeValue ?? "all");
      if (!handler) return false;
      return handler(ruleValues, contentValues);
    },
    getActionHandler: (ruleEntry: Entry) => {
      const action = ruleEntry.fields[actionFieldId] as string;
      return pzRuleActionLookup.get(action);
    }
  }
}

export type ConvertContentfulPzRuleConfigsOptions = {
  pzRuleActionHandlers?: PzRuleActionHandlers<Entry>;
}
export function convertContentfulPzRuleConfigs(pzRuleConfigs: LookupConfig<ContentfulPzRuleConfig>, options: ConvertContentfulPzRuleConfigsOptions = {}): Lookup<PzRuleConfig<Entry, Entry>> {
  const { pzRuleActionHandlers } = options;
  const converted: LookupConfig<PzRuleConfig<Entry, Entry>> = {};
  if (pzRuleConfigs.defaultElement) {
    converted.defaultElement = convertContentfulPzRuleConfig(pzRuleConfigs.defaultElement, pzRuleActionHandlers);
  }
  const elements: { [id: string]: PzRuleConfig<Entry, Entry> } = {};
  if (pzRuleConfigs.elements) {
    Object.keys(pzRuleConfigs.elements).forEach(key => {
      const contentfulPzRuleConfig = pzRuleConfigs.elements![key];
      if (contentfulPzRuleConfig) {
        const pzRuleConfig = convertContentfulPzRuleConfig(contentfulPzRuleConfig, pzRuleActionHandlers);
        elements[key] = pzRuleConfig;  
      }
    })
  }
  converted.elements = elements;
  return createLookup(converted);
}

export function convertContentfulPzRuleEntries(ruleEntries: Entry[], pzRuleConfigs: Lookup<PzRuleConfig<Entry, Entry>>): PzRule<Entry>[] {
  const pzRules: PzRule<Entry>[] = []
  ruleEntries.forEach(ruleEntry => {
    const pzRuleConfig = pzRuleConfigs.get(ruleEntry.sys.contentType.sys.id);
    if (pzRuleConfig) {
      const pzRule = pzRuleConfig.createPzRuleFromEntry(ruleEntry);
      if (pzRule) {
        pzRules.push(pzRule);
      }
    }
  })
  return pzRules;
}
export function convertContentfulPzConfig(pzConfig: ContentfulPzConfig, pzRuleConfigs: LookupConfig<ContentfulPzRuleConfig>, pzRuleActionHandlers: PzRuleActionHandlers<Entry>): PzConfig<Entry, Entry, Entry> {
  const { contentEntriesFieldId, pzRulesFieldId } = pzConfig;
  return {
    getContentEntries: (entry: Entry) => {
      const positions: ContentEntryPosition<Entry>[] = [];
      const contentEntries = entry.fields[contentEntriesFieldId] as Entry[];
      if (Array.isArray(contentEntries)) {
        contentEntries.forEach((contentEntry, index) => {
          positions.push({
            entry: contentEntry,
            originalPosition: index + 1,
            currentPosition: index + 1,
            hide: false,
          });
        })
      }
      return positions;
    },
    getEntryId: (entry: Entry) => entry.sys.id,
    getRuleEntries: (entry: Entry) => entry.fields[pzRulesFieldId] as Entry[],
    getRulesForVisitor: (context: Context, entry: Entry, pzConfig: PzConfig<Entry, Entry, Entry>) => {
      const { pzRuleConfigs } = pzConfig;
      const ruleEntries = pzConfig.getRuleEntries(entry);
      const pzRules = convertContentfulPzRuleEntries(ruleEntries, pzRuleConfigs);
      
      const { variations } = context.personalize<PzRule<Entry>>({
        name: `Personalization rules for entry ${pzConfig.getEntryId(entry)}`,
        variations: pzRules,
        take: pzRules.length,
      })
      return variations.map(({ ruleEntry }) => ruleEntry);
    },
    pzRuleConfigs: convertContentfulPzRuleConfigs(pzRuleConfigs, { pzRuleActionHandlers }),
  }
}
export function convertContentfulPzConfigs(pzConfigs: LookupConfig<ContentfulPzConfig>, pzRuleConfigs: LookupConfig<ContentfulPzRuleConfig>, pzRuleActionHandlers: PzRuleActionHandlers<Entry>): Lookup<PzConfig<Entry, Entry, Entry>> {
  const converted: LookupConfig<PzConfig<Entry, Entry, Entry>> = {};
  if (pzConfigs.defaultElement) {
    converted.defaultElement = convertContentfulPzConfig(pzConfigs.defaultElement, pzRuleConfigs, pzRuleActionHandlers);
  }
  const elements: { [id: string]: PzConfig<Entry, Entry, Entry> } = {};
  if (pzConfigs.elements) {
    Object.keys(pzConfigs.elements).forEach(key => {
      const contentfulPzConfig = pzConfigs.elements![key];
      if (contentfulPzConfig) {
        const pzConfig = convertContentfulPzConfig(contentfulPzConfig, pzRuleConfigs, pzRuleActionHandlers);
        elements[key] = pzConfig;  
      }
    })
  }
  converted.elements = elements;
  return createLookup(converted);
}
