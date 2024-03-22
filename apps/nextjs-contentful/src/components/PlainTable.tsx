export const PlainTable = ({ rows }: { rows: any }) => {
  return (
    <table className="text-xs table-auto m-1">
      {Object.keys(rows).map((key) => {
        const value = rows[key];
        return (
          <tr key={key} className="even:bg-gray-100 odd:bg-white">
            <td className="text-right p-1">{key}</td>
            <td className="font-mono p-1">{value}</td>
          </tr>
        );
      })}
    </table>
  );
};
