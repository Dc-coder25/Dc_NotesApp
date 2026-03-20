import { useState } from "react";
import { FileText, Trash2, RotateCcw } from "lucide-react";
import { useNotes } from "../../store/notesStore";
import NoteItem from "./NoteItem";

export default function NotesList() {
  const { filteredNotes, trashedNotes, activeFolder, emptyTrash,
          activeId, floating, trashNote, restoreNote, deleteNote } = useNotes();

  const [selectedIds, setSelectedIds] = useState([]);
  const [selecting, setSelecting]     = useState(false);

  const isTrash     = activeFolder === "trash";
  const notes       = isTrash ? trashedNotes : filteredNotes;
  const expanded    = !activeId || floating;
  const allSelected = notes.length > 0 && selectedIds.length === notes.length;

  const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  const toggleAll       = () => setSelectedIds(allSelected ? [] : notes.map((n) => n.id));
  const cancelSelect    = () => { setSelectedIds([]); setSelecting(false); };
  const trashSelected   = () => { selectedIds.forEach(trashNote); cancelSelect(); };
  const restoreSelected = () => { selectedIds.forEach(restoreNote); cancelSelect(); };
  const deleteSelected  = () => {
    if (window.confirm(`Supprimer définitivement ${selectedIds.length} note${selectedIds.length > 1 ? "s" : ""} ?`)) {
      selectedIds.forEach(deleteNote);
      cancelSelect();
    }
  };

  return (
    <section className={`bg-white rounded-lg border border-border flex flex-col overflow-hidden transition-all
      ${expanded ? "flex-1" : "w-56 shrink-0"}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border shrink-0">

        {/* Gauche : checkbox + boutons d'action + label */}
        <div className="flex items-center gap-2">
          {selecting && (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-3.5 h-3.5 cursor-pointer accent-blue shrink-0"
            />
          )}

          {selecting && selectedIds.length > 0 && (
            isTrash ? (
              <>
                <button onClick={restoreSelected}
                  className="flex items-center gap-1 text-[11px] text-green-500 hover:bg-green-50 px-2 py-0.5 rounded-md transition-colors font-sans">
                  <RotateCcw size={10} /> Restaurer
                </button>
                <button onClick={deleteSelected}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:bg-red-50 px-2 py-0.5 rounded-md transition-colors font-sans">
                  <Trash2 size={10} /> Supprimer
                </button>
              </>
            ) : (
              <button onClick={trashSelected}
                className="flex items-center gap-1 text-[11px] text-red-400 hover:bg-red-50 px-2 py-0.5 rounded-md transition-colors font-sans">
                <Trash2 size={10} /> Corbeille
              </button>
            )
          )}

          <span className={`text-[10px] font-semibold uppercase tracking-[.1em]
            ${selecting && selectedIds.length > 0 ? "text-blue" : "text-text-ghost"}`}>
            {selecting && selectedIds.length > 0
              ? `${selectedIds.length} sélectionné${selectedIds.length > 1 ? "s" : ""}`
              : isTrash ? "Corbeille" : "Notes"}
          </span>
        </div>

        {/* Droite : vider corbeille + sélectionner + compteur */}
        <div className="flex items-center gap-1.5">
          {isTrash && !selecting && notes.length > 0 && (
            <button
              onClick={() => { if (window.confirm("Vider définitivement ?")) emptyTrash(); }}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:bg-red-50 px-2 py-0.5 rounded-md transition-colors font-sans"
            >
              <Trash2 size={10} /> Vider
            </button>
          )}

          {notes.length > 0 && (
            <button
              onClick={selecting ? cancelSelect : () => setSelecting(true)}
              className="text-[11px] px-2 py-0.5 rounded-md border border-border text-text-muted hover:border-border-mid hover:text-text-secondary transition-all font-sans"
            >
              {selecting ? "Annuler" : "Sélectionner"}
            </button>
          )}

          <span className="text-[11px] text-text-muted bg-sky-pale rounded-full px-2 font-medium">
            {notes.length}
          </span>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className={`flex-1 overflow-y-auto ${expanded ? "p-3" : ""}`}>
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <FileText size={28} strokeWidth={1} className="text-text-ghost" />
            <p className="text-[12px] text-text-muted">
              {isTrash ? "Corbeille vide" : "Aucune note"}
            </p>
          </div>
        ) : expanded ? (
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {notes.map((n) => (
              <NoteItem key={n.id} note={n} isTrashed={isTrash} grid
                selecting={selecting} selected={selectedIds.includes(n.id)}
                onSelect={() => toggleSelect(n.id)} />
            ))}
          </div>
        ) : (
          notes.map((n) => (
            <NoteItem key={n.id} note={n} isTrashed={isTrash}
              selecting={selecting} selected={selectedIds.includes(n.id)}
              onSelect={() => toggleSelect(n.id)} />
          ))
        )}
      </div>
    </section>
  );
}