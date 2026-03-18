import { Plus } from "lucide-react";
import { useNotes } from "../../store/notesStore";

export default function Navbar() {
  const { createNote, sortBy, setSortBy } = useNotes();

  return (
    <nav className="h-11 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
      <button
        onClick={createNote}
        className="flex items-center gap-1.5 text-xs font-medium bg-zinc-900 text-white rounded-md px-3 py-1.5 hover:opacity-85 active:scale-95 transition-all"
      >
        <Plus size={13} strokeWidth={2.5} />
        Nouvelle note
      </button>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span>Trier par</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-zinc-200 rounded px-2 py-0.5 text-xs text-zinc-600 bg-transparent outline-none"
        >
          <option value="date">Date</option>
          <option value="name">Nom</option>
        </select>
      </div>
    </nav>
  );
}