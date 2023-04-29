export function App(stories: { title: string; domain?: string }[]) {
  return (
    <div className="h-full w-full flex-col justify-start">
      <div className="h-14 shrink-0 items-center justify-between bg-orange-500">
        <div className="m-4 h-4 shrink-0 border-2 border-white p-1 font-bold text-white">
          Y
        </div>

        <div className="shrink-[2] flex-col">
          <p className="text-base font-bold">Hacker News</p>
          <p className="text-xs leading-none">
            new | threads | past | comments | ask | show | jobs | submit
          </p>
        </div>
        <div className="shrink-1">LinguaBrowse (336) | logout</div>
      </div>

      <div className="grow-1 w-full flex-col justify-start bg-[#F6F6F0]">
        {stories.slice(0, 1).map(({ title, domain }, i) => (
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
    <div className="items-start">
      <div className="mr-1 shrink-0 text-[#828282]">{rank}. ▲</div>
      <div className="flex-col items-stretch justify-start">
        <p className="text-base leading-none">{title}</p>
        {domain && <p className="py-1 text-xs text-[#828282]">({domain})</p>}
        <p className="text-s text-[#828282]">
          123 points by whoever 3 hours ago | flag | hide | 12 comments
        </p>
      </div>
    </div>
  );
}
