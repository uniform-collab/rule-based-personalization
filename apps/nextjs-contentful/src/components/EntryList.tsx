type EntryListProps = {
  title: string;
  entries?: any[];
  displayFieldId?: string;
};

function getDisplayValue(
  entry: any,
  displayFieldId?: string
): string | undefined {
  if (!entry) return;
  if (displayFieldId) {
    const fieldValue = entry.fields[displayFieldId];
    if (fieldValue) return fieldValue;
  }
  return entry.sys.id;
}

export function EntryList({ title, entries, displayFieldId }: EntryListProps) {
  return (
    <div className="p-2">
      <h1 className="text-2xl">{title}</h1>
      {!entries && <div>No entries have been loaded.</div>}
      {entries && (
        <ol className="list-decimal list-inside">
          {entries.map((entry, index) => {
            const displayValue = getDisplayValue(entry, displayFieldId);
            return <li key={index}>{displayValue ?? "???"}</li>;
          })}
        </ol>
      )}
    </div>
  );
}
