import { Plus } from "lucide-react";
import { useNotes } from "../../store/notesStore";

export default function Navbar() {
  const { createNote, sortBy, setSortBy } = useNotes();
  return (
    <nav className="h-[42px] bg-navy-mid flex items-center justify-between px-5 shrink-0 border-b border-white/[0.08]">
      <button
        onClick={createNote}
        className="flex items-center gap-1.5 bg-sky text-navy font-semibold text-[12px] rounded-lg px-3 py-1.5 hover:bg-sky-light transition-colors font-sans"
      >
        <Plus size={13} strokeWidth={2.5} />
        Nouvelle note
      </button>

      <div className="flex items-center gap-2 text-[12px] text-white/40 font-sans">
        <span>Trier par</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/[0.08] border border-white/[0.15] rounded-md px-2 py-0.5 text-[12px] text-white/80 outline-none cursor-pointer font-sans"
        >
          <option value="date">Date</option>
          <option value="name">Nom</option>
        </select>
      </div>
    </nav>
  );
}