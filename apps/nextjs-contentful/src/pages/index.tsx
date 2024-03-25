import { useEffect, useState } from "react";
import { PersonalizationEvent } from "@uniformdev/context";
import { useUniformContext } from "@uniformdev/context-react";
import { EntryList, InputField, Toggle } from "@/components";
import { getEntry } from "@/lib/contentful";
import { useContentfulRuleBasedPz } from "@uniformdev-collab/rule-based-personalization-react-contentful";

const DEFAULT_ENTRY_ID = "282uRmMSQnXISWKSNXCh4T";
const DEFAULT_DISPLAY_FIELD_ID = "title";

export default function Home() {
  const { context } = useUniformContext();
  const { doPersonalize } = useContentfulRuleBasedPz();
  const [entryId, setEntryId] = useState<string>(DEFAULT_ENTRY_ID);
  const [displayFieldId, setDisplayFieldId] = useState<string>(DEFAULT_DISPLAY_FIELD_ID);
  const [disconnectedMode, setDisconnectedMode] = useState(true);

  const [listBefore, setListBefore] = useState<any[]>();
  const [listAfter, setListAfter] = useState<any[]>();

  async function personalize() {
    if (!entryId) return;
    const entry = await getEntry(entryId, disconnectedMode);
    if (entry) {      
      const { original, personalized } = doPersonalize(entry);
      setListBefore(original);
      setListAfter(personalized);  
      return;
    }
    setListBefore(undefined);
    setListAfter(undefined);
  }

  /**
   * Configure event listener on the Uniform tracker.
   * This will cause personalization to run whenever
   * the visitor's scores are updated.
   */
  function log(e: PersonalizationEvent) {
    console.log("Personalization was triggered on the home page.", e)
  }
  useEffect(() => {
    context.events.on("scoresUpdated", personalize);
    context.events.on("personalizationResult", log);
    return () => {
      context.events.off("scoresUpdated", personalize);
      context.events.off("personalizationResult", log);
    };
  }, []);
  return (
    <main>
      <div className="w-96">
        <div className="p-2">
          <Toggle
            label="Run disconnected from Contentful"
            onChange={(value: boolean) => {
              setDisconnectedMode(value);
              if (value) {
                setEntryId(DEFAULT_ENTRY_ID);
                setDisplayFieldId(DEFAULT_DISPLAY_FIELD_ID);
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
            <InputField
              id="display-field-id"
              label="Display Field ID"
              value={displayFieldId}
              onChange={(e) => setDisplayFieldId(e.currentTarget.value)}
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
        <EntryList title="Before" entries={listBefore} displayFieldId={displayFieldId}/>
        <hr className="my-2" />
        <EntryList title="After" entries={listAfter} displayFieldId={displayFieldId} />
      </div>
    </main>
  );
}
