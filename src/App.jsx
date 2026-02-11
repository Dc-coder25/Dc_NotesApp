import Editor from "./components/Editor";
import NotesList from "./components/NotesList"
import Sidebar from "./components/Sidebar"
import { useState } from "react";

function App() {
    const [notes, setNotes] = useState(() => {
        return JSON.parse(localStorage.getItem("notes")) || [];
    });

    function createNote() {
        const newNote = {
            id: Date.now(),
            title: "Nouvelle note",
            content: "",
            updatedAt: Date.now(),
        };
        setNotes([newNote, ...notes]);
        console.log(notes);
    }

  return (
    <div className="h-screen grid grid-cols-[240px_320px_1fr] bg-base-200">
        <Sidebar
            onCreate={createNote}
        />
        <NotesList
            notes={notes}
        />
        <Editor />
    </div>
  );
}

export default App;
