import { ChevronLeftIcon } from "lucide-react";

export default function Editor({ note, onChange, setActiveId }){
    if (!note) {
        return(
            <main className="flex items-center justify-center text-gray-400">Sélectionne ou crée une note </main>
        );
    }
    return(
        <main className="bg-base-100 p-6">
            <button onClick={() => setActiveId(null)} className="mb-2 cursor-pointer">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <input
                value={note.title}
                onChange={(e) => 
                    onChange({
                        ...note,
                        title : e.target.value,
                        updatedAt: Date.now(),
                    })
                } 
                placeholder="Titre"
                className="input input-ghost text-2xl font-bold w-full mb-4" 
            />
            <textarea 
                className="textarea textarea-ghost w-full h-[calc(100vh-140px)] text-base resize-none"
                value={note.content}
                onChange={(e) =>
                    onChange({
                        ...note,
                        content : e.target.value,
                        updatedAt: Date.now(),
                    })
                }
                placeholder="Ecris ta note ici..."></textarea>
        </main>
    );
}