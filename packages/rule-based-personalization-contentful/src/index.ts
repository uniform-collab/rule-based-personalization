import { Entry } from "contentful";
import { DoesRuleApplyHandler, RuleConverter, ReferencedEntriesReader, RulePropertyReaders, PersonalizationRule, EntryValueReader } from "@uniformdev-collab/rule-based-personalization";
import { VariantMatchCriteria } from "@uniformdev/context";

/**
 * Creates an object that can determine whether 
 * the enrichment tag values on an entry match 
 * the required values on a personalization rule.
 * @param fieldName 
 * @returns 
 */
export function createEnrichmentTagsMatcher(fieldName?: string): DoesRuleApplyHandler<Entry> {
  const reader = createEnrichmentTagsReader(fieldName);
  return (entry: Entry, rule: PersonalizationRule) => {
    const values = reader(entry) ?? [];
    const match = rule.requiredValues.every((requiredValue: string) =>
      values.includes(requiredValue)
    );
    return match;
  }
}

/**
 * Creates an object that can read the enrichment tags 
 * from a fields on an entry.
 * @param fieldName 
 * @returns 
 */
export function createEnrichmentTagsReader(fieldName?: string): EntryValueReader<Entry, string[]> {
  return (entry: Entry) => {
    const tags: string[] = [];
    const fields = entry?.fields ?? {};
    const field = fields[fieldName ?? "unfrmOptEnrichmentTag"];
    if (Array.isArray(field)) {
      field.forEach((value: any) => {
        const { cat, key } = value;
        if (cat && key) {
          const tag = `${cat}_${key}`;
          if (tags.indexOf(tag) === -1) {
            tags.push(tag);
          }
        }
      });
    }
    return tags;
  }
}

/**
 * Creates a reader that resolves referenced entries 
 * from the specified field.
 * @param fieldName 
 * @returns 
 */
export function createFieldEntriesReader(fieldName: string): ReferencedEntriesReader<Entry> {
  return (entry: Entry) => {
    const references = entry.fields[fieldName];
    if (Array.isArray(references)) {
      return references as Entry[];
    }
    return [];
  }
}

/**
 * This reader expects the entry to have the following 
 * fields: name, unfrmOptPersonalizationCriteria, action.
 * @param readers 
 * @returns 
 */
export function createPersonalizationRuleReader(readers: RulePropertyReaders<Entry>): RuleConverter<Entry> {
  return (entry: Entry) => {
    const { getAction, actionFieldId, getId, idFieldId, getPz, pzFieldId = "unfrmOptPersonalizationCriteria", getRequiredValues } = readers;
    const id = createFieldValueReader<string>(idFieldId, getId)(entry);
    if (id) {
      const pz = createFieldValueReader<VariantMatchCriteria>(pzFieldId, getPz)(entry);
      if (pz) {
        const action = createFieldValueReader<string>(actionFieldId, getAction)(entry);
        if (action) {
          const requiredValues = getRequiredValues(entry);
          if (Array.isArray(requiredValues)) {
            return {
              id,
              pz,
              action,
              requiredValues,
            }
          }
        }
      }
    }
  }
}

export function createFieldValueReader<TValue>(fieldId?: string, getFieldValue?: EntryValueReader<Entry, TValue>) {
  if (fieldId) {
    return (entry: Entry) => {
      const fields = entry?.fields ?? {};
      return fields[fieldId] as TValue;
    }
  }
  if (getFieldValue) return getFieldValue;
  return (entry: Entry) => undefined;
}
