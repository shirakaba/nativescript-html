export function App() {
  // This isn't working with React because they use some dumb Symbols to set
  // styles. May wanna try Preact instead unless there's a webpack option to
  // override it.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          backgroundColor: 'rgb(237,112,45)',
          height: 50,
        }}
      >
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