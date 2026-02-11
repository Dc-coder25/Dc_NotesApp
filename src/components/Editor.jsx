export default function Editor(){
    return(
        <main className="bg-base-100 p-6">
            <input 
                placeholder="Titre"
                className="input input-ghost text-2xl font-bold w-full mb-4" 
            />
            <textarea 
                className="textarea textarea-ghost w-full h-[calc(100vh-140px)] text-base resize-none"
                placeholder="Ecris ta note ici..."></textarea>
        </main>
    );
}