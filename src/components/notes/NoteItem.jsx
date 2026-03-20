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

  // ── Checkbox sélection ─────────────────────────────────────────────────
  const Checkbox = () => (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer
        ${selected
          ? "bg-zinc-900 border-zinc-900"
          : "border-zinc-300 bg-white hover:border-zinc-500"}`}
    >
      {selected && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );

  // ── Mode grille ────────────────────────────────────────────────────────
  if (grid) {
    return (
      <div
        onClick={handleClick}
        className={`relative flex flex-col gap-2 p-4 rounded-xl border cursor-pointer group transition-all
          ${selected
            ? "border-zinc-400 bg-zinc-50 ring-1 ring-zinc-300"
            : isActive
              ? "border-zinc-400 bg-zinc-50"
              : "border-zinc-200 bg-white hover:border-zinc-300"}`}
      >
        {/* Checkbox — visible en mode sélection ou au hover */}
        <div className={`absolute top-3 left-3 transition-opacity
          ${selecting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <Checkbox />
        </div>

        <p className={`text-[13px] font-medium leading-snug line-clamp-2 transition-all
          ${selecting ? "pl-6" : ""}
          ${isTrashed ? "text-zinc-400" : "text-zinc-900"}`}>
          {note.title || "Note sans titre"}
        </p>
        <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-3 flex-1">
          {preview || <span className="italic text-zinc-300">Vide</span>}
        </p>
        <p className="text-[11px] text-zinc-300">{fmt(note.updatedAt)}</p>

        {/* Bouton action — caché en mode sélection */}
        {!selecting && (
          <button
            onClick={(e) => { e.stopPropagation(); isTrashed ? restoreNote(note.id) : trashNote(note.id); }}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-zinc-300 hover:text-red-400"
          >
            {isTrashed ? <RotateCcw size={12} /> : <Trash2 size={12} />}
          </button>
        )}
      </div>
    );
  }

  // ── Mode liste ─────────────────────────────────────────────────────────
  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2 px-3.5 py-3 border-b border-zinc-100 cursor-pointer group transition-colors
        ${selected ? "bg-zinc-50" : isActive ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
    >
      {/* Checkbox — visible en mode sélection ou au hover */}
      <div className={`transition-opacity flex-shrink-0
        ${selecting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <Checkbox />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium truncate ${isTrashed ? "text-zinc-400" : "text-zinc-900"}`}>
          {note.title || "Note sans titre"}
        </p>
        <p className="text-[12px] text-zinc-400 truncate mt-0.5">{preview}</p>
        <p className="text-[11px] text-zinc-400 mt-1">{fmt(note.updatedAt)}</p>
      </div>

      {/* Bouton action — caché en mode sélection */}
      {!selecting && (
        isTrashed ? (
          <button
            onClick={(e) => { e.stopPropagation(); restoreNote(note.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-zinc-400 hover:bg-green-50 hover:text-green-600"
          >
            <RotateCcw size={12} />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); trashNote(note.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-zinc-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={12} />
          </button>
        )
      )}
    </div>
  );
}