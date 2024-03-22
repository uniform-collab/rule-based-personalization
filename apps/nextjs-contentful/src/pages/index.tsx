import { useEffect, useState } from "react";
import { Entry } from "contentful";
import { useUniformContext } from "@uniformdev/context-react";
import { ArticleList, InputField, Toggle } from "../components";
import { getArticleList } from "@/lib/contentful";
import { useRuleBasedPersonalization } from "@uniformdev-collab/rule-based-personalization-react";
import { PlainTable } from "@/components/PlainTable";

const DEFAULT_ENTRY_ID = "4Eo320J8anqK7CgqoAjPin";

export default function Home() {
  const { context } = useUniformContext();
  const [entryId, setEntryId] = useState<string>(DEFAULT_ENTRY_ID);
  const [disconnectedMode, setDisconnectedMode] = useState(true);

  const [articlesBefore, setArticlesBefore] = useState<any[]>();
  const [articlesAfter, setArticlesAfter] = useState<any[]>();
  const { doPersonalize } = useRuleBasedPersonalization<Entry>();

  /**
   * Personalization is implemented as a separate
   * function so it can be triggered in multiple
   * ways (button click, when scores are updated).
   */
  async function personalize() {
    if (!entryId) return;
    const entry = await getArticleList(entryId, disconnectedMode);
    if (!entry) {
      setArticlesBefore(undefined);
      setArticlesAfter(undefined);
      return;
    }

    const { result } = doPersonalize({
      name: `Personalizing an article list on entry ${entryId}.`,
      entry,
      context,
    });
    const { original, personalized } = result;
    setArticlesBefore(original);
    setArticlesAfter(personalized);
  }

  /**
   * Configure event listener on the Uniform tracker.
   * This will cause personalization to run whenever
   * the visitor's scores are updated.
   */
  useEffect(() => {
    context.events.on("scoresUpdated", personalize);
    return () => {
      context.events.off("scoresUpdated", personalize);
    };
  }, []);
  return (
    <main>
      <div className="w-96">
        <div className="p-2">
          <div className="text-sm italic">
            This demonstrates how to use Uniform to personalize a list of
            articles in Contentful. The entry you use should have the following:
            <PlainTable
              rows={{
                "Content type id": "articleList",
                "Field id for articles": "articles",
                "Field id for personalization rules": "personalizationRules",
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="w-96 py-2 text-sm italic text-gray-600">
            If you run in disconnected mode (the default), instead of making a
            live call to Contentful, a sample entry is used. This allows you to
            use this application without having to configure Contentful.
          </div>
          <hr className="my-2" />
          <Toggle
            label="Run disconnected from Contentful"
            onChange={(value: boolean) => {
              setDisconnectedMode(value);
              if (value) {
                setEntryId(DEFAULT_ENTRY_ID);
              }
            }}
          />
          <div className={disconnectedMode ? "opacity-25" : ""}>
            <InputField
              id="entry-id"
              label="Contentful Entry ID"
              value={entryId}
              onChange={(e) => setEntryId(e.currentTarget.value)}
              disabled={disconnectedMode}
            />
          </div>
          <button
            type="button"
            className="text-white bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-500"
            onClick={personalize}
          >
            Load entry
          </button>
        </div>
        <hr className="my-2" />
        <ArticleList title="Before" articles={articlesBefore} />
        <hr className="my-2" />
        <ArticleList title="After" articles={articlesAfter} />
      </div>
    </main>
  );
}
