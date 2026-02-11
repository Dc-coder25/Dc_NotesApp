import { Trash2, PinOff } from "lucide-react";

export default function NotesList({ notes, activeId, onSelect, onDelete }){
    
    return(
        <section className="bg-base-100 border-r border-base-300 p-4 overflow-y-auto">
            <input 
                type="text"
                placeholder="Rechercher..."
                className="input input-bordered w-full mb-4"
            />

            {notes.length === 0 && (
                <p className="text-center opacity-60 mt-10">Aucune note trouvée</p>
            )}

                <div className="mb-6">

                    <h4 className="text-xs uppercase font-semibold opacity-60 mb-2"></h4>

                    <div className="space-y-2">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                className={`card cursor-pointer h-24 transition ${
                                    note.id === activeId ? "bg-primary text-primary-content" : "bg-base-200"
                                }`} 
                                onClick={()=> onSelect(note.id)}
                            >
                                <div className="card-body p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-10">
                                        <h3 className="font-semibold truncate">{note.title}</h3>

                                        <div className="flex gap-1">
                                            <button 
                                                className="btn btn-ghost btn-xs p-1"
                                            ><PinOff className="w-4 h-4"/>
                                            </button>

                                            <button
                                                className="btn btn-ghost hover:text-error btn-xs p-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(note.id);
                                                }}
                                            ><Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm opacity-60 line-clamp-2 truncate">{note.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </section>
    );
}


