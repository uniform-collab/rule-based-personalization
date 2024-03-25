import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  Context,
  ManifestV2,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
} from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import { RuleBasedPersonalization } from "@uniformdev-collab/rule-based-personalization-react";
import manifest from "../../data/manifest.json";
import Head from "next/head";
import { ContentfulPzConfigLookupConfig, ContentfulPzRuleLookupConfig } from "@uniformdev-collab/rule-based-personalization-contentful";

const context = new Context({
  manifest: manifest as ManifestV2,
  defaultConsent: true,
  plugins: [enableContextDevTools(), enableDebugConsoleLogDrain("info")],
});

/**
 * These are the global personalization configs. They 
 * can be overridden in the hook useContentfulRuleBasedPz.
 */
const contentfulPzConfigs: ContentfulPzConfigLookupConfig = {
  defaultElement: undefined,
  elements: {
    curatedLocationList: {
      contentEntriesFieldId: "locations",
      pzRulesFieldId: "personalizationRules",
    }
  }
}

/**
 * These are the global personalization rule configs. They 
 * can be overridden in the hook useContentfulRuleBasedPz.
 */
const contentfulPzRuleConfigs: ContentfulPzRuleLookupConfig = {
  defaultElement: {
    nameFieldId: "name",
    actionFieldId: "action",
    contentCriteriaMatchTypeFieldId: "contentCriteriaMatchType",
  },
  elements: {},
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Rule-based personalization</title>
      </Head>
      <UniformContext context={context}>
        <RuleBasedPersonalization context={context} pzConfigs={contentfulPzConfigs} pzRuleConfigs={contentfulPzRuleConfigs}>
          <Component {...pageProps} />
        </RuleBasedPersonalization>
      </UniformContext>
    </>
  );
}
