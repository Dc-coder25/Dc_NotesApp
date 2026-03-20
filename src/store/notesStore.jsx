import { createContext, useContext, useState, useCallback, useEffect } from "react";

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

// ─── helpers localStorage ──────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Les dates sont sérialisées en string → les reconvertir en Date
    if (key === "notario_notes") {
      return parsed.map((n) => ({ ...n, updatedAt: new Date(n.updatedAt) }));
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("localStorage indisponible");
  }
}
// ──────────────────────────────────────────────────────────────────────────

const NotesCtx = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes]               = useState(() => load("notario_notes", INITIAL_NOTES));
  const [activeId, setActiveId]         = useState(() => load("notario_activeId", "1"));
  const [search, setSearch]             = useState("");
  const [sortBy, setSortBy]             = useState(() => load("notario_sortBy", "date"));
  const [activeFolder, setActiveFolder] = useState("all");
  const [trashedIds, setTrashedIds]     = useState(() => load("notario_trashedIds", []));
  const [floating, setFloating]         = useState(false);
  // ─── Sauvegarde automatique à chaque changement ──────────────────────────
  useEffect(() => { save("notario_notes", notes); }, [notes]);
  useEffect(() => { save("notario_activeId", activeId); }, [activeId]);
  useEffect(() => { save("notario_sortBy", sortBy); }, [sortBy]);
  useEffect(() => { save("notario_trashedIds", trashedIds); }, [trashedIds]);
  // ─────────────────────────────────────────────────────────────────────────

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
    setFloating(false);
  }, []);

  // Réinitialise le mode flottant quand on ferme une note
  const closeNote = useCallback(() => {
    setActiveId(null);
    setFloating(false);
  }, []);

  const restoreNote = useCallback((id) => {
    setTrashedIds((prev) => prev.filter((tid) => tid !== id));
  }, []);

  const emptyTrash = useCallback(() => {
    setNotes((prev) => prev.filter((n) => !trashedIds.includes(n.id)));
    setTrashedIds([]);
    setActiveId((prev) => (trashedIds.includes(prev) ? null : prev));
  }, [trashedIds]);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setTrashedIds((prev) => prev.filter((tid) => tid !== id));
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
        restoreNote,
        emptyTrash,
        deleteNote,
        floating,
        setFloating,
        closeNote,
      }}
    >
      {children}
    </NotesCtx.Provider>
  );
}

export const useNotes = () => useContext(NotesCtx);