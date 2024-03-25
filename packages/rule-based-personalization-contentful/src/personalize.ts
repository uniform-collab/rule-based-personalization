import { DoPersonalizeResult, MapWithDefaultConfig, PzRuleActionHandlers, doPersonalize } from "@uniformdev-collab/rule-based-personalization";
import { Context } from "@uniformdev/context";
import { Entry } from "contentful";
import { convertContentfulPzConfigs } from "./converters";
import { ContentfulPzConfig, ContentfulPzRuleConfig } from "./types";

export type DoContentfulPersonalizeOptions = {
  context: Context;
  pzConfigs: MapWithDefaultConfig<ContentfulPzConfig>;
  pzRuleConfigs: MapWithDefaultConfig<ContentfulPzRuleConfig>;
  pzRuleActionHandlers?: PzRuleActionHandlers<Entry>;
}

export type DoContentfulPersonalizeResult = {
  original: Entry[];
  personalized: Entry[];
}

export function doContentfulPersonalize(entry: Entry, options: DoContentfulPersonalizeOptions): DoPersonalizeResult<Entry> {
  const { context, pzConfigs, pzRuleConfigs, pzRuleActionHandlers = {} } = options;
  const convertedPzConfigs = convertContentfulPzConfigs(pzConfigs, pzRuleConfigs, pzRuleActionHandlers);
  const entryContentType = entry.sys.contentType.sys.id;
  const pzConfig = convertedPzConfigs.get(entryContentType);
  if (!pzConfig) {
    return { error: `No personalization rules config could be found for entry with content type ${entryContentType}.` };
  }  
  return doPersonalize<Entry, Entry, Entry, ContentfulPzConfig, ContentfulPzRuleConfig>(entry, {
    context,
    pzConfig,
    getRuleType: ruleEntry => ruleEntry.sys.contentType.sys.id,
  });
}
