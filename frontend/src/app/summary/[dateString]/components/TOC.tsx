export default function TOC({ content }: { content: string }) {
  // 簡易的なh1タグの抽出（実際の実装ではより堅牢なパースが必要かもしれません）
  const headings = content.match(/^# (.*)$/gm) || [];
  return (
    <div className="toc bg-gray-50 p-4 rounded-lg sticky top-4">
      <h2 className="text-lg font-bold mb-2">目次</h2>
      <ul className="space-y-1">
        {headings.map((heading, index) => {
          const title = heading.replace("# ", "");
          // IDを作成（スペースをダッシュに置き換えるなど）
          const id = title.toLowerCase().replace(/\s+/g, "-");
          return (
            <li key={index}>
              <a href={`#${id}`} className="text-blue-500 hover:underline">
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
