import { Trash2, PinOff } from "lucide-react";

export default function NotesList({ notes, activeId, onSelect, onDelete, search, onSearch }){
    
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

                    <h4 className="text-xs uppercase font-semibold opacity-60 mb-2"></h4>

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
                                        <h3 className="font-semibold truncate">{note.content === "" ? "Nouvelle note" : note.content}</h3>

                                        <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex gap-1">
                                            <button 
                                                className="btn btn-ghost btn-xs p-1"
                                            ><PinOff className="w-4 h-4"/>
                                            </button>

                                            <button
                                                className={`p-1 rounded-4xl cursor-pointer hover:scale-110  btn-xs transition-all duration-200  
                                                    ${ note.id === activeId ? "hover:text-red-500 hover:bg-white" : "hover:text-white hover:bg-red-500"}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(note.id);
                                                }}
                                            ><Trash2 className="w-4 h-4"/>
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


