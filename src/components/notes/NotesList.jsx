import { useState } from "react";
import { FileText, Trash2, RotateCcw, CheckSquare } from "lucide-react";
import { useNotes } from "../../store/notesStore";
import NoteItem from "./NoteItem";

export default function NotesList() {
  const { filteredNotes, trashedNotes, activeFolder, emptyTrash,
          activeId, floating, trashNote, restoreNote } = useNotes();

  const [selectedIds, setSelectedIds] = useState([]);
  const [selecting, setSelecting]     = useState(false);

  const isTrash  = activeFolder === "trash";
  const notes    = isTrash ? trashedNotes : filteredNotes;
  const expanded = !activeId || floating;

  const allSelected = notes.length > 0 && selectedIds.length === notes.length;

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : notes.map((n) => n.id));
  };

  const cancelSelection = () => {
    setSelectedIds([]);
    setSelecting(false);
  };

  const trashSelected = () => {
    selectedIds.forEach((id) => trashNote(id));
    cancelSelection();
  };

  const restoreSelected = () => {
    selectedIds.forEach((id) => restoreNote(id));
    cancelSelection();
  };

  // Quand on change de dossier → reset sélection
  const handleFolderChange = () => cancelSelection();

  return (
    <section className={`bg-white rounded-xl border border-zinc-200 flex flex-col overflow-hidden transition-all
      ${expanded ? "flex-1" : "w-60 shrink-0"}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-2">
          {selecting && (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-3.5 h-3.5 accent-zinc-800 cursor-pointer"
              title="Tout sélectionner"
            />
          )}
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            {selecting && selectedIds.length > 0
              ? `${selectedIds.length} sélectionné${selectedIds.length > 1 ? "s" : ""}`
              : isTrash ? "Corbeille" : "Notes"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Actions sur la sélection */}
          {selecting && selectedIds.length > 0 && (
            <>
              {isTrash ? (
                <button
                  onClick={restoreSelected}
                  className="flex items-center gap-1 text-[10px] text-green-500 hover:text-green-700 hover:bg-green-50 px-1.5 py-0.5 rounded transition-colors"
                >
                  <RotateCcw size={10} /> Restaurer
                </button>
              ) : (
                <button
                  onClick={trashSelected}
                  className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Trash2 size={10} /> Supprimer
                </button>
              )}
            </>
          )}

          {/* Vider corbeille */}
          {isTrash && !selecting && notes.length > 0 && (
            <button
              onClick={() => { if (window.confirm("Vider définitivement la corbeille ?")) emptyTrash(); }}
              className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors"
            >
              <Trash2 size={10} /> Vider
            </button>
          )}

          {/* Toggle mode sélection */}
          {notes.length > 0 && (
            <button
              onClick={selecting ? cancelSelection : () => setSelecting(true)}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors
                ${selecting
                  ? "text-zinc-500 hover:bg-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"}`}
            >
              {selecting ? "Annuler" : "Sélectionner"}
            </button>
          )}

          <span className="text-[11px] text-zinc-400 bg-zinc-100 rounded-full px-2">
            {notes.length}
          </span>
        </div>
      </div>

      {/* ── Liste / Grille ── */}
      <div className={`flex-1 overflow-y-auto ${expanded ? "p-3" : ""}`}>
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-zinc-300">
            <FileText size={28} strokeWidth={1.2} />
            <p className="text-xs text-zinc-400">
              {isTrash ? "Corbeille vide" : "Aucune note"}
            </p>
          </div>
        ) : expanded ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {notes.map((n) => (
              <NoteItem
                key={n.id} note={n} isTrashed={isTrash} grid
                selecting={selecting}
                selected={selectedIds.includes(n.id)}
                onSelect={() => toggleSelect(n.id)}
              />
            ))}
          </div>
        ) : (
          notes.map((n) => (
            <NoteItem
              key={n.id} note={n} isTrashed={isTrash}
              selecting={selecting}
              selected={selectedIds.includes(n.id)}
              onSelect={() => toggleSelect(n.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}