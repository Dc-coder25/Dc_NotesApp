import { ChevronLeft, Bold, Italic, Underline } from "lucide-react";
import { useNotes } from "../../store/notesStore";
import { fmtFull } from "../../utils/dateUtils";

export default function Editor() {
  const { activeNote, updateNote, setActiveId } = useNotes();

  if (!activeNote)
    return (
      <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-sm text-zinc-400">
        Sélectionne une note
      </div>
    );

  return (
    <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex flex-col overflow-hidden min-w-0">
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-zinc-100">
        <button
          onClick={() => setActiveId(null)}
          className="flex items-center gap-1 text-xs text-zinc-500 px-1.5 py-1 rounded hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <ChevronLeft size={14} /> Retour
        </button>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        {[Bold, Italic, Underline].map((Icon, i) => (
          <button
            key={i}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      <div className="px-6 pt-5 shrink-0">
        <p className="text-[11px] text-zinc-400 mb-2">
          {fmtFull(activeNote.updatedAt)}
        </p>
        <input
          className="w-full bg-transparent border-none outline-none font-serif text-[22px] text-zinc-900"
          value={activeNote.title}
          onChange={(e) =>
            updateNote(activeNote.id, { title: e.target.value })
          }
          placeholder="Titre..."
        />
        <hr className="border-zinc-100 my-3" />
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <textarea
          className="w-full h-full bg-transparent border-none outline-none text-sm text-zinc-800 leading-relaxed resize-none"
          value={activeNote.content}
          onChange={(e) =>
            updateNote(activeNote.id, { content: e.target.value })
          }
          placeholder="Commence à écrire..."
        />
      </div>
    </div>
  );
}