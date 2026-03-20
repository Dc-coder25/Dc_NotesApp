import { AlignLeft, Calendar, Folder, Trash2 } from "lucide-react";
import { useNotes } from "../../store/notesStore";

export default function Side() {
  const { activeFolder, setActiveFolder, folders, trashedNotes } = useNotes();

  const NavBtn = ({ id, icon: Icon, label, danger }) => {
    const active = activeFolder === id;
    return (
      <button
        onClick={() => setActiveFolder(id)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] w-full text-left font-sans transition-all border-l-2
          ${active
            ? "bg-sky-pale text-blue font-medium border-blue-mid"
            : danger
              ? "text-red-400 hover:bg-red-50 border-transparent"
              : "text-text-secondary hover:bg-sky-pale border-transparent"}`}
      >
        <Icon size={14} className="shrink-0 opacity-70" />
        <span className="flex-1 truncate">{label}</span>
        {danger && trashedNotes.length > 0 && (
          <span className="text-[10px] bg-red-100 text-red-400 rounded-full px-1.5 font-medium">
            {trashedNotes.length}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-44 bg-white rounded-lg border border-border flex flex-col shrink-0 p-2.5 gap-0.5">
      <p className="text-[9px] font-semibold uppercase tracking-[.1em] text-text-ghost px-2.5 py-1">
        Navigation
      </p>
      <NavBtn id="all"   icon={AlignLeft} label="Toutes les notes" />
      <NavBtn id="today" icon={Calendar}  label="Aujourd'hui" />

      <div className="border-t border-border my-1.5" />

      <p className="text-[9px] font-semibold uppercase tracking-[.1em] text-text-ghost px-2.5 py-1">
        Dossiers
      </p>
      {folders.map((f) => <NavBtn key={f} id={f} icon={Folder} label={f} />)}

      <div className="flex-1" />
      <div className="border-t border-border my-1.5" />
      <NavBtn id="trash" icon={Trash2} label="Corbeille" danger />
    </aside>
  );
}