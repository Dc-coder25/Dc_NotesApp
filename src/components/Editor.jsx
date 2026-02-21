import { ChevronLeftIcon } from "lucide-react";

export default function Editor({ note, onChange, setActiveId }){
    if (!note) {
        return(
            <main className="flex items-center justify-center text-gray-400">Sélectionne ou crée une note </main>
        );
    }
    return(
        <main className="bg-base-100 p-6">
            <button onClick={() => setActiveId(null)} className="mb-4 cursor-pointer">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <textarea 
                className="textarea textarea-ghost w-full h-[calc(100vh-100px)] text-base resize-none"
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