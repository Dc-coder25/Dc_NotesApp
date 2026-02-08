import NotesList from "./components/NotesList"
import Sidebar from "./components/Sidebar"

function App() {

  return (
    <div className="h-screen grid grid-cols-[240px_320px_1fr] bg-base-200">
      <Sidebar />
      <NotesList />
    </div>
  );
}

export default App;
