import { AlignLeft, Calendar, Folder, Trash2 } from "lucide-react";
import { useNotes } from "../../store/notesStore";

export default function Side() {
  const { activeFolder, setActiveFolder, folders, trashedNotes } = useNotes();

  const cls = (f) =>
    `flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm w-full text-left transition-colors ${
      activeFolder === f
        ? "bg-zinc-100 text-zinc-900 font-medium"
        : "text-zinc-500 hover:bg-zinc-100"
    }`;

  return (
    <aside className="w-48 bg-white rounded-xl border border-zinc-200 p-3 flex flex-col shrink-0">
      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 px-2.5 mb-1">
        Navigation
      </p>

      <button className={cls("all")} onClick={() => setActiveFolder("all")}>
        <AlignLeft size={14} /> Toutes les notes
      </button>
      <button className={cls("today")} onClick={() => setActiveFolder("today")}>
        <Calendar size={14} /> Aujourd'hui
      </button>

      <hr className="my-2 border-zinc-100" />

      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 px-2.5 mb-1">
        Dossiers
      </p>
      {folders.map((f) => (
        <button key={f} className={cls(f)} onClick={() => setActiveFolder(f)}>
          <Folder size={14} /> {f}
        </button>
      ))}

      <div className="flex-1" />
      <hr className="my-2 border-zinc-100" />

      <button
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm text-red-500 hover:bg-red-50 w-full"
        onClick={() => setActiveFolder("trash")}
      >
        <Trash2 size={14} /> Corbeille
        {trashedNotes.length > 0 && (
          <span className="ml-auto text-[10px] bg-red-100 rounded-full px-1.5">
            {trashedNotes.length}
          </span>
        )}
      </button>
    </aside>
  );
}