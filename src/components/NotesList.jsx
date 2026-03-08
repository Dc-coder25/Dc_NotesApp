import { Trash2, Download } from "lucide-react";
import React from "react";

export default function NotesList({ notes, activeId, onSelect, onDelete, search, onSearch }){

    // Fonction pour télécharger une note en .txt avec date/heure/id
    const downloadNote = (note) => {
        const now = new Date();
        const dateString = now.toLocaleDateString("fr-FR").replace(/\//g, "-"); // ex: 08-03-2026
        const timeString = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "-"); // ex: 14-53
        const fileName = `Note_${dateString}_${timeString}_${note.id}.txt`;

        const element = document.createElement("a");
        const file = new Blob([note.content || "Note vide"], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return(
        <section className="bg-base-100 border-r border-base-300 p-4 overflow-y-auto">
            <input 
                type="text"
                placeholder="Rechercher..."
                className="input input-bordered w-full mb-4"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />

            {notes.length === 0 && (
                <p className="text-center opacity-60 mt-10">Aucune note trouvée</p>
            )}

            <div className="mb-6">
                <div className="space-y-2">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`group card cursor-pointer h-24 transition ${
                                note.id === activeId ? "bg-primary text-primary-content" : "bg-base-200"
                            }`} 
                            onClick={()=> onSelect(note.id)}
                        >
                            <div className="card-body p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-10">
                                    <h3 className="font-semibold truncate">
                                        {note.content === "" ? "Nouvelle note" : note.content}
                                    </h3>

                                    <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex gap-1">
                                        {/* Bouton Télécharger */}
                                        <button 
                                            className="btn btn-ghost btn-xs p-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                downloadNote(note);
                                            }}
                                        >
                                            <Download className="w-4 h-4"/>
                                        </button>

                                        {/* Bouton Supprimer */}
                                        <button
                                            className={`p-1 rounded-4xl cursor-pointer hover:scale-110 btn-xs transition-all duration-200  
                                                ${ note.id === activeId ? "hover:text-red-500 hover:bg-white" : "hover:text-white hover:bg-red-500"}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(note.id);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
