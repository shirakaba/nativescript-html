export function App(stories: { title: string; domain?: string }[]) {
  return (
    <div className="flex-col w-full h-full justify-start">
      <div className="h-14 bg-orange-500 shrink-0 items-center justify-between">
        <div className="text-white font-bold border-2 border-white p-1 h-4 m-4 shrink-0">
          Y
        </div>

        <div className="flex-col shrink-[2]">
          <p className="text-base font-bold">Hacker News</p>
          <p className="text-xs leading-none">
            new | threads | past | comments | ask | show | jobs | submit
          </p>
        </div>
        <div className="shrink-1">LinguaBrowse (336) | logout</div>
      </div>

      <div className="flex-col grow-1 bg-[#F6F6F0] justify-start w-full">
        {stories.map(({ title, domain }, i) => (
          <Story key={i} rank={i + 1} title={title} domain={domain} />
        ))}
      </div>
    </div>
  );
}

function Story({
  title,
  domain,
  rank,
}: {
  title: string;
  domain?: string;
  rank: number;
}) {
  return (
    <div className="items-start p-4">
      <div className="text-[#828282] mr-1 shrink-0">{rank}. ▲</div>
      <div className="flex-col justify-start items-stretch">
        <p className="text-base leading-none">{title}</p>
        {domain && <p className="text-xs text-[#828282] py-1">({domain})</p>}
        <p className="text-s text-[#828282] mb-3">
          123 points by whoever 3 hours ago | flag | hide | 12 comments
        </p>
      </div>
    </div>
  );
}
