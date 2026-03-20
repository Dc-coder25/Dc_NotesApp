import Header from "../layout/Header";
import Navbar from "../layout/Navbar";
import Side from "../layout/Side";
import NotesList from "../notes/NotesList";
import Editor from "../editor/Editor";
import FloatingEditor from "../editor/FloatingEditor";
import { useNotes } from "../../store/notesStore";

export default function Layout() {
  const { activeId, floating } = useNotes();
  const threeCol = activeId && !floating;

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <Header />
      <Navbar />
      <main className="flex flex-1 gap-2 overflow-hidden p-2">
        <Side />
        <NotesList />
        {threeCol && <Editor />}
      </main>
      {floating && activeId && <FloatingEditor />}
    </div>
  );
}