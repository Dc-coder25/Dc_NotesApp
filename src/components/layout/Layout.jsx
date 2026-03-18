import Header from "../layout/Header";
import Navbar from "../layout/Navbar";
import Side from "../layout/Side";
import NotesList from "../notes/NotesList";
import Editor from "../editor/Editor";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-zinc-100 overflow-hidden">
      <Header />
      <Navbar />
      <main className="flex flex-1 gap-2 overflow-hidden p-2">
        <Side />
        <NotesList />
        <Editor />
      </main>
    </div>
  );
}