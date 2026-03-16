import Editor from "./components/Editor";
import NotesList from "./components/NotesList"
import Sidebar from "./components/Sidebar"
import { useState, useEffect, useMemo } from "react";

function App() {
    const [notes, setNotes] = useState(() => {
        return JSON.parse(localStorage.getItem("notes")) || [];
    });
    const [corbeillle, setCorbeille] = useState(() => {
        return JSON.parse(localStorage.getItem("corbeille")) || [];
    })

    const [search, setSearch] = useState("");

    const filteredNotes = notes.filter(note => {
        const content = note.content || "";

        const matchSearch = content.toLowerCase().includes(search.toLowerCase());
    
        return matchSearch;
    
    }).sort((a, b) => b.updatedAt - a.updatedAt);

    const [activeId, setActiveId] = useState(null);

    const activeNote = activeId === "new" ? {id: null, content: ""} : notes.find(n => n.id === activeId);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
        localStorage.setItem("corbeille", JSON.stringify(corbeillle));
    }, [notes, corbeillle]);



    function updateNote(updatedNote) {
        if(activeId === "new") {
            const newNote = {
                id: Date.now(),
                content: updateNote.content,
                updatedAt: Date.now(),
            };

            setNotes(prev => [newNote, ...prev]);
            setActiveId(newNote.id);
            return;
        }

        setNotes(prev =>
            prev.map(note => note.id === updatedNote.id ? updatedNote : note)
        );
    }

    function addToCorbeille (id) {
        notes.map(note => note.id === id ? 
            setCorbeille(prev => [{
                id: note.id,
                content: note.content,
                updatedAt: note.updatedAt,
            }, ...prev]) : '');
        
        setNotes(notes.filter(note => note.id !== id));
        setActiveId(null);    
    }

    function deleteNote(id) {
        setNotes(notes.filter(note => note.id !== id));
        setActiveId(null);
    }

  return (
    <div className="h-screen grid grid-cols-[240px_320px_1fr] bg-base-200">
        <Sidebar
            onCreate={() => setActiveId("new")}
        />
        <NotesList
            activeId={activeId}
            onSelect={setActiveId}
            notes={filteredNotes}
            onSearch={setSearch}
            search={search}
            onDelete={addToCorbeille}
        />
        <Editor note={activeNote} onChange={updateNote} setActiveId={setActiveId} />
    </div>
  );
}

export default App;
