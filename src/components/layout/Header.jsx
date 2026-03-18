import { Search, X } from "lucide-react";
import { useNotes } from "../../store/notesStore";

export default function Header() {
  const { search, setSearch } = useNotes();

  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
      <span className="font-serif text-lg font-medium tracking-tight">
        Notario
      </span>

      <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 rounded-full px-4 py-1.5 w-64 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
        <Search size={13} className="text-zinc-400 shrink-0" />
        <input
          className="bg-transparent text-sm outline-none w-full placeholder:text-zinc-400"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="w-20" />
    </header>
  );
}