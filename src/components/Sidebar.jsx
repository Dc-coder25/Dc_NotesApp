import { Notebook, Edit, Folder, Trash2 } from "lucide-react";

export default function Sidebar({ onCreate }) {
  return (
    <aside className="bg-base-100 border-r border-base-300 p-6 h-screen flex flex-col">
      {/* Logo + titre */}
      <div className="flex items-center gap-2 mb-8">
        <Notebook className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-wide">DCNotes</h1>
      </div>

      {/* Bouton nouvelle note */}
      <button
        className="btn btn-primary w-full mb-6 flex items-center gap-2 hover:scale-105 transition-transform"
        onClick={onCreate}
      >
        <Edit className="w-4 h-4" /> Nouvelle note
      </button>

      <div className="divider"></div>

      {/* Menu */}
      <ul className="menu menu-sm gap-2 w-full">
        <li>
          <a className="flex items-center gap-2 hover:bg-base-200 rounded-lg">
            <Folder className="w-4 h-4 text-blue-500" /> Dossiers
          </a>
        </li>
        <li>
          <a className="flex items-center gap-2 text-error hover:bg-base-200 rounded-lg">
            <Trash2 className="w-4 h-4" /> Corbeille
          </a>
        </li>
      </ul>
    </aside>
  );
}
