import NotesList from "./components/NotesList"

function App() {

  return (
    <div className="h-screen grid grid-cols-[240px_320px_1fr] bg-base-200">
      <NotesList />
    </div>
  );
}

export default App;
