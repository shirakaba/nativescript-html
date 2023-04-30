export function App(stories: { title: string; domain?: string }[]) {
  return (
    <n-flex className="h-full w-full flex-col justify-start">
      <n-flex className="h-14 shrink-0 items-center justify-between bg-orange-500">
        <n-flex className="m-4 h-4 shrink-0 border-2 border-white p-1 font-bold text-white">
          <n-label>Y</n-label>
        </n-flex>

        <n-flex className="shrink-[2] flex-col">
          <n-label className="text-base font-bold">Hacker News</n-label>
          <n-label className="text-xs leading-none">
            new | threads | past | comments | ask | show | jobs | submit
          </n-label>
        </n-flex>
        <n-flex className="shrink-1">
          <n-label>LinguaBrowse (336) | logout</n-label>
        </n-flex>
      </n-flex>

      <n-flex className="grow-1 w-full flex-col justify-start bg-[#F6F6F0]">
        {stories.map(({ title, domain }, i) => (
          <Story key={i} rank={i + 1} title={title} domain={domain} />
        ))}
      </n-flex>
    </n-flex>
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
    <n-flex className="items-start p-4">
      <n-flex className="mr-1 shrink-0 text-[#828282]">
        <n-label>{rank}. ▲</n-label>
      </n-flex>
      <n-flex className="flex-col items-stretch justify-start">
        <n-label className="text-base leading-none">{title}</n-label>
        {domain && (
          <n-label className="py-1 text-xs text-[#828282]">({domain})</n-label>
        )}
        <n-label className="text-s mb-3 text-[#828282]">
          123 points by whoever 3 hours ago | flag | hide | 12 comments
        </n-label>
      </n-flex>
    </n-flex>
  );
}
