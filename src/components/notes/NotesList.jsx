import { FileText, Trash2 } from "lucide-react";
import { useNotes } from "../../store/notesStore";
import NoteItem from "./NoteItem";

export default function NotesList() {
  const { filteredNotes, trashedNotes, activeFolder, emptyTrash } = useNotes();

  const isTrash = activeFolder === "trash";
  const notes = isTrash ? trashedNotes : filteredNotes;

  return (
    <section className="w-60 bg-white rounded-xl border border-zinc-200 flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-zinc-100 shrink-0">
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
          {isTrash ? "Corbeille" : "Notes"}
        </span>
        <div className="flex items-center gap-2">
          {isTrash && notes.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Vider définitivement la corbeille ?")) {
                  emptyTrash();
                }
              }}
              className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors"
              title="Vider la corbeille"
            >
              <Trash2 size={10} />
              Vider
            </button>
          )}
          <span className="text-[11px] text-zinc-400 bg-zinc-100 rounded-full px-2">
            {notes.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-zinc-300">
            <FileText size={28} strokeWidth={1.2} />
            <p className="text-xs text-zinc-400">
              {isTrash ? "Corbeille vide" : "Aucune note"}
            </p>
          </div>
        ) : (
          notes.map((n) => (
            <NoteItem key={n.id} note={n} isTrashed={isTrash} />
          ))
        )}
      </div>
    </section>
  );
}