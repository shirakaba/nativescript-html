export function App() {
  // This isn't working with React because they use some dumb Symbols to set
  // styles. May wanna try Preact instead unless there's a webpack option to
  // override it.
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex h-12 bg-orange">
        <div
          style={{
            color: 'white',
            borderColor: 'white',
            borderWidth: '1px',
            padding: '4px',
            margin: '16px',
            flexGrow: 0,
          }}
        >
          Y
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <h1 style={{ display: 'flex' }}>Hacker News</h1>
          <p>new | threads | past | comments | ask | show | jobs | submit</p>
        </div>
        <div style={{ flexGrow: 0 }}>LinguaBrowse (336) | logout</div>
      </div>
      <div
        style={{
          backgroundColor: 'rgb(246,246,240)',
          flexGrow: 1,
        }}
      >
        <p>Para 2</p>
      </div>
    </div>
  );
}
