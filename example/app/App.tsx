export function App(stories: { title: string; domain?: string }[]) {
  return (
    <flex className="h-full w-full flex-col justify-start">
      <flex className="h-14 shrink-0 items-center justify-between bg-orange-500">
        <flex className="m-4 h-4 shrink-0 border-2 border-white p-1 font-bold text-white">
          <t>Y</t>
        </flex>

        <flex className="shrink-[2] flex-col">
          <t className="text-base font-bold">Hacker News</t>
          <t className="text-xs leading-none">
            new | threads | past | comments | ask | show | jobs | submit
          </t>
        </flex>
        <flex className="shrink-1">
          <t>LinguaBrowse (336) | logout</t>
        </flex>
      </flex>

      <flex className="grow-1 w-full flex-col justify-start bg-[#F6F6F0]">
        {stories.map(({ title, domain }, i) => (
          <Story key={i} rank={i + 1} title={title} domain={domain} />
        ))}
      </flex>
    </flex>
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
    <flex className="items-start p-4">
      <flex className="mr-1 shrink-0 text-[#828282]">
        <t>{rank}. ▲</t>
      </flex>
      <flex className="flex-col items-stretch justify-start">
        <t className="text-base leading-none">{title}</t>
        {domain && <t className="py-1 text-xs text-[#828282]">({domain})</t>}
        <t className="text-s mb-3 text-[#828282]">
          123 points by whoever 3 hours ago | flag | hide | 12 comments
        </t>
      </flex>
    </flex>
  );
}
