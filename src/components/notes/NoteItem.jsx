import { Trash2, RotateCcw } from "lucide-react";
import { useNotes } from "../../store/notesStore";
import { fmt } from "../../utils/dateUtils";

export default function NoteItem({
  note, isTrashed, grid = false,
  selecting = false, selected = false, onSelect,
}) {
  const { activeId, setActiveId, trashNote, restoreNote } = useNotes();
  const isActive = activeId === note.id;

  const preview = note.content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, grid ? 120 : 80);

  const handleClick = () => {
    if (selecting) { onSelect(); return; }
    setActiveId(note.id);
  };

  if (grid) {
    return (
      <div
        onClick={handleClick}
        className={`relative flex flex-col gap-2 p-4 rounded-xl cursor-pointer group transition-all
          ${selected
            ? "border-2 border-blue-mid bg-sky-pale"
            : isActive
              ? "border border-sky bg-sky-pale"
              : "border border-border bg-white hover:border-border-mid"}`}
      >
        <p className={`text-[13px] font-serif font-medium leading-snug line-clamp-2
          ${isTrashed ? "text-text-muted" : "text-text-primary"}`}>
          {note.title || "Note sans titre"}
        </p>
        <p className="text-[12px] text-text-muted leading-relaxed line-clamp-3 flex-1">
          {preview}
        </p>
        <p className="text-[11px] text-text-ghost">{fmt(note.updatedAt)}</p>

        {!selecting && (
          <button
            onClick={(e) => { e.stopPropagation(); isTrashed ? restoreNote(note.id) : trashNote(note.id); }}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all text-text-ghost hover:text-red-400"
          >
            {isTrashed ? <RotateCcw size={12} /> : <Trash2 size={12} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border cursor-pointer group transition-all border-l-2
        ${selected
          ? "bg-sky-pale border-l-blue-mid"
          : isActive
            ? "bg-sky-pale border-l-sky"
            : "hover:bg-off-white border-l-transparent"}`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-serif font-medium truncate
          ${isTrashed ? "text-text-muted" : "text-text-primary"}`}>
          {note.title || "Note sans titre"}
        </p>
        <p className="text-[11px] text-text-muted truncate mt-0.5">{preview}</p>
        <p className="text-[10px] text-text-ghost mt-1">{fmt(note.updatedAt)}</p>
      </div>

      {!selecting && (
        isTrashed ? (
          <button
            onClick={(e) => { e.stopPropagation(); restoreNote(note.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all text-text-ghost hover:text-green-500"
          >
            <RotateCcw size={12} />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); trashNote(note.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all text-text-ghost hover:text-red-400"
          >
            <Trash2 size={12} />
          </button>
        )
      )}
    </div>
  );
}