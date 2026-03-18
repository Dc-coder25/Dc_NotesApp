import { createContext, useContext, useState, useCallback } from "react";

const INITIAL_NOTES = [
  {
    id: "1",
    title: "Bienvenue dans Notario",
    content: "Commence à écrire tes notes ici...",
    folder: "Personnel",
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Idées de projet",
    content: "Liste des fonctionnalités à ajouter",
    folder: "Travail",
    updatedAt: new Date(Date.now() - 86400000),
  },
];

const NotesCtx = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes]               = useState(INITIAL_NOTES);
  const [activeId, setActiveId]         = useState("1");
  const [search, setSearch]             = useState("");
  const [sortBy, setSortBy]             = useState("date");
  const [activeFolder, setActiveFolder] = useState("all");
  const [trashedIds, setTrashedIds]     = useState([]);

  const activeNote = notes.find((n) => n.id === activeId);

  const filteredNotes = notes
    .filter((n) => !trashedIds.includes(n.id))
    .filter((n) => {
      if (activeFolder === "today")
        return n.updatedAt.toDateString() === new Date().toDateString();
      if (activeFolder !== "all") return n.folder === activeFolder;
      return true;
    })
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "date"
        ? b.updatedAt - a.updatedAt
        : a.title.localeCompare(b.title)
    );

  const createNote = useCallback(() => {
    const n = {
      id: Date.now().toString(),
      title: "",
      content: "",
      folder: "Personnel",
      updatedAt: new Date(),
    };
    setNotes((prev) => [n, ...prev]);
    setActiveId(n.id);
  }, []);

  const updateNote = useCallback((id, changes) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...changes, updatedAt: new Date() } : n
      )
    );
  }, []);

  const trashNote = useCallback((id) => {
    setTrashedIds((prev) => [...prev, id]);
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  return (
    <NotesCtx.Provider
      value={{
        notes,
        filteredNotes,
        activeNote,
        trashedNotes: notes.filter((n) => trashedIds.includes(n.id)),
        folders: [...new Set(notes.map((n) => n.folder))],
        activeId,
        setActiveId,
        search,
        setSearch,
        sortBy,
        setSortBy,
        activeFolder,
        setActiveFolder,
        createNote,
        updateNote,
        trashNote,
      }}
    >
      {children}
    </NotesCtx.Provider>
  );
}

export const useNotes = () => useContext(NotesCtx);