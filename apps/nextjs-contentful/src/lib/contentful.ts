import { Entry, createClient } from "contentful";
import entry from "../../data/282uRmMSQnXISWKSNXCh4T.json";

export async function getEntry(entryId: string, testMode?: boolean): Promise<Entry | undefined> {
  if (testMode) {
    return entry as Entry;
  }
  if (!entryId || entryId.trim().length === 0) return;
  try {
    const client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE!,
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
    })
    return await client.getEntry(entryId, { include: 1 });
  }
  catch {
    return;
  }
}
