import { Entry } from "contentful";

export function createEntry(entryId: string, contentTypeId: string, fields: any): Entry {
  return {
    sys: {
      id: entryId,
      contentType: { sys: { id: contentTypeId, linkType: "ContentType", type: "Link" } },
      createdAt: "2024-01-01T00:00:00.000Z",
      environment: { sys: { id: "master", linkType: "Environment", type: "Link" } },
      revision: 1,
      space: { sys: { id: "", linkType: "Space", type: "Link" } },
      type: "Entry",
      updatedAt: "2024-01-01T00:00:00.000Z",
      locale: "en-US",
    },
    metadata: {
      tags: [],
    },
    fields,
  }
}
