import { Notebook, Edit, PinIcon, Folder, Trash2 } from "lucide-react";

export default function Sidebar (){
    return(
        <aside className="bg-base-100 border-r border-base-300 p-4">
            <div className="flex gap-1">
                <Notebook className="w-6 h-6"/>
                <h1 className="text-xl font-bold mb-6">DCNotes</h1>
            </div>

             <button className="btn btn-primary w-full mb-4"><Edit className="w-4 h-4"/> Nouvelle note</button>

             <ul className="menu menu-sm gap-1 w-full">
                <li><a><PinIcon className="w-4 h-4"/> Epinglées</a></li>
                <li><a><Folder className="w-4 h-4"/> Travail</a></li>
                <li><a><Folder className="w-4 h-4"/> Personnel</a></li>
                <li><a><Folder className="w-4 h-4"/> Idées</a></li>
                <li><a className="text-error"><Trash2 className="w-4 h-4"/> Corbeille</a></li>
             </ul>
        </aside>
    );
}