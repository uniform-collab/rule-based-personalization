import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Entry } from "contentful";
import {
  Context,
  ManifestV2,
  enableContextDevTools,
} from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import { RuleBasedPersonalization } from "@uniformdev-collab/rule-based-personalization-react";
import {
  RuleBasedPersonalizationActionCollection,
  RuleBasedPersonalizeOptions,
  RuleBasedPersonalizeOptionsResolver,
} from "@uniformdev-collab/rule-based-personalization";
import {
  createEnrichmentTagsMatcher,
  createEnrichmentTagsReader,
  createFieldEntriesReader,
  createPersonalizationRuleReader,
} from "@uniformdev-collab/rule-based-personalization-contentful";
import manifest from "../../data/manifest.json";

const context = new Context({
  manifest: manifest as ManifestV2,
  defaultConsent: true,
  plugins: [enableContextDevTools()],
});

/**
 * Returns the settings that control how rule-based personalization 
 * applies to Contentful entries. This example only supports the 
 * content type "articleList".
 * 
 * @param entry 
 * @returns 
 */
const optionsResolver: RuleBasedPersonalizeOptionsResolver<Entry> = (entry) => {
  switch (entry?.sys?.contentType?.sys?.id) {
    case "articleList":
      return articleOptions;
  }
};

/**
 * Rule-based personalization settings for entries based on
 * the content type "articleList". It assumes the content
 * type has fields named "articles" and "personalizationRules".  
 * It also provides settings that describe the shape of the 
 * entries that describe the personalization rules assigned
 * to an "articleList".
 */
const articleOptions: RuleBasedPersonalizeOptions<Entry> = {
  /**
   * Read list entries from the specified field.
   */
  getListEntries: createFieldEntriesReader("articles"),
  /**
   * Read rule entries from the specified field.
   */
  getRuleEntries: createFieldEntriesReader("personalizationRules"),
  /**
   * Create a personalization rule using the enrichment
   * tags assigned to the rule entry as the required
   * values.
   */
  convertToRule: createPersonalizationRuleReader({
    actionFieldId: "action",
    idFieldId: "name",
    /**
     * This property is optional if the field was created 
     * using the Uniform app in Contentful because the 
     * field will have the default id.
     */
    pzFieldId: "unfrmOptPersonalizationCriteria",
    // getAction: (entry: Entry) => entry.fields.action as string,
    // getId: (entry: Entry) => entry.fields.name as string,
    // getPz: (entry: Entry) =>
    //   entry.fields.unfrmOptPersonalizationCriteria as VariantMatchCriteria,
    getRequiredValues: createEnrichmentTagsReader(),
  }),
  /**
   * Compare the required values to the enrichment
   * tags on the list entry determine whether the
   * rule applies.
   */
  doesRuleApply: createEnrichmentTagsMatcher(),
};

const actions: RuleBasedPersonalizationActionCollection<Entry> = {
  example: (position) => {},
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UniformContext context={context}>
      <RuleBasedPersonalization<Entry> optionsResolver={optionsResolver} actions={actions}>
        <Component {...pageProps} />
      </RuleBasedPersonalization>
    </UniformContext>
  );
}
