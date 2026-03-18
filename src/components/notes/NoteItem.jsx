import { Trash2, RotateCcw } from "lucide-react";
import { useNotes } from "../../store/notesStore";
import { fmt } from "../../utils/dateUtils";

export default function NoteItem({ note, isTrashed }) {
  const { activeId, setActiveId, trashNote, restoreNote } = useNotes();
  const isActive = activeId === note.id;

  return (
    <div
      onClick={() => setActiveId(note.id)}
      className={`flex items-start gap-2 px-3.5 py-3 border-b border-zinc-100 cursor-pointer group transition-colors ${
        isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium truncate ${isTrashed ? "text-zinc-400" : "text-zinc-900"}`}>
          {note.title || "Note sans titre"}
        </p>
        <p className="text-[12px] text-zinc-400 truncate mt-0.5">
          {note.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80)}
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">{fmt(note.updatedAt)}</p>
      </div>

      {isTrashed ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            restoreNote(note.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-zinc-400 hover:bg-green-50 hover:text-green-600"
          title="Restaurer"
        >
          <RotateCcw size={12} />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            trashNote(note.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-zinc-400 hover:bg-red-50 hover:text-red-500"
          title="Supprimer"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}