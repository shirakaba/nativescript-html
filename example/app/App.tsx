export function App() {
  // This isn't working with React because they use some dumb Symbols to set
  // styles. May wanna try Preact instead unless there's a webpack option to
  // override it.
  return (
    <div className="flex flex-col w-full h-full justify-start">
      <div className="flex h-13 bg-orange-500 shrink-0 items-center justify-between">
        <div className="text-white font-bold border-2 border-white p-1 h-4 m-4 shrink-0">
          Y
        </div>
        <div className="flex flex-col shrink-1">
          <p className="text-base font-bold">Hacker News</p>
          <p className="text-xs leading-none">
            new | threads | past | comments | ask | show | jobs | submit
          </p>
        </div>
        <div className="shrink-1">LinguaBrowse (336) | logout</div>
      </div>

      <Story
        rank={1}
        title="Largest island in a lake on an island in a lake on an island"
        domain="elbruz.org"
      />
    </div>
  );
}

function Story({
  title,
  domain,
  rank,
}: {
  title: string;
  domain: string;
  rank: number;
}) {
  return (
    <div className="grow-1 bg-[rgb(246,246,240)]">
      <p>{title}</p>
    </div>
  );
}
