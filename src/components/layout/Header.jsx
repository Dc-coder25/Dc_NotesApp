import { Search, X } from "lucide-react";
import { useNotes } from "../../store/notesStore";

export default function Header() {
  const { search, setSearch } = useNotes();
  return (
    <header className="h-[52px] bg-navy flex items-center justify-between px-5 shrink-0 border-b border-navy-mid">
      <span className="font-serif text-[18px] font-semibold text-white tracking-tight">
        Notario
      </span>

      <div className="flex items-center gap-2 bg-white/[0.08] border border-white/[0.15] rounded-full px-4 py-1.5 w-60 focus-within:bg-white/[0.14] transition-colors">
        <Search size={13} className="text-white/40 shrink-0" strokeWidth={2} />
        <input
          className="bg-transparent border-none outline-none text-[13px] text-white placeholder:text-white/40 w-full font-sans"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-white/40 hover:text-white/70 transition-colors">
            <X size={12} />
          </button>
        )}
      </div>
      <div className="w-16" />
    </header>
  );
}