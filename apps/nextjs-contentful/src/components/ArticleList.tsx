type ArticleListProps = {
  title: string;
  articles?: any[];
};

export function ArticleList({ title, articles }: ArticleListProps) {
  return (
    <div className="p-2">
      <h1 className="text-2xl">{title}</h1>
      {!articles && <div>No articles have been loaded.</div>}
      {articles && (
        <ol className="list-decimal list-inside">
          {articles.map((article) => (
            <li key={article.fields.name}>{article.fields.name}</li>
          ))}
        </ol>
      )}
    </div>
  );
};
