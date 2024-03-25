import { Entry } from "contentful";
import { EntryValueReader } from "@uniformdev-collab/rule-based-personalization";

export function createContentfulEnrichmentTagsReader(fieldName: string = "unfrmOptEnrichmentTag"): EntryValueReader<Entry, string[]> {
  return (entry: Entry) => {
    const tags: string[] = [];
    const fields = entry?.fields ?? {};
    const field = fields[fieldName];
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
