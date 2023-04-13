export function App() {
  // This isn't working with React because they use some dumb Symbols to set
  // styles. May wanna try Preact instead unless there's a webpack option to
  // override it.
  return (
    <div className="flex flex-col w-full h-full justify-start">
      <div className="flex h-12 bg-orange-500 grow-0">
        <div className="text-white border border-white p-1 m-4 grow-0">Y</div>
        <div className="flex flex-col grow-1">
          <h1>Hacker News</h1>
          <p className="text-3xl font-bold underline">
            new | threads | past | comments | ask | show | jobs | submit
          </p>
        </div>
        <div className="grow-0">LinguaBrowse (336) | logout</div>
      </div>

      <div className="grow-1 bg-[rgb(246,246,240)]">
        <p>Para 2</p>
      </div>
    </div>
  );
}
