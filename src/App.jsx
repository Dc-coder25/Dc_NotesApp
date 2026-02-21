import Editor from "./components/Editor";
import NotesList from "./components/NotesList"
import Sidebar from "./components/Sidebar"
import { useState, useEffect } from "react";

function App() {
    const [notes, setNotes] = useState(() => {
        return JSON.parse(localStorage.getItem("notes")) || [];
    });

    const [activeId, setActiveId] = useState(null);

    const activeNote = notes.find(n => n.id === activeId);

    useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

    function createNote() {
        const newNote = {
            id: Date.now(),
            content: "",
            updatedAt: Date.now(),
        };
        setNotes([newNote, ...notes]);
        setActiveId(newNote.id);
        console.log(notes);
    }

    function updateNote(updatedNote) {
        setNotes(
            notes.map(note => note.id === updatedNote.id ? updatedNote : note)
        );
    }

    function deleteNote(id) {
        setNotes(notes.filter(note => note.id !== id));
        setActiveId(null);
    }

  return (
    <div className="h-screen grid grid-cols-[240px_320px_1fr] bg-base-200">
        <Sidebar
            onCreate={createNote}
        />
        <NotesList
            activeId={activeId}
            onSelect={setActiveId}
            notes={notes}
            onDelete={deleteNote}
        />
        <Editor note={activeNote} onChange={updateNote} setActiveId={setActiveId} />
    </div>
  );
}

export default App;
