import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import {
  ChevronLeft, Bold, Italic, Underline as UnderlineIcon,
  Strikethrough, List, ListTodo, Quote, Minus,
  Undo2, Redo2, Maximize2, Minimize2, Copy, Check,
  AlignLeft, AlignCenter, AlignRight, PictureInPicture2,
} from "lucide-react";
import { useNotes } from "../../store/notesStore";
import { fmtFull } from "../../utils/dateUtils";
import "./editor.css";

const Sep = () => <div className="w-px h-4 bg-zinc-200 mx-0.5 shrink-0" />;

function ToolBtn({ onClick, title, active, disabled, children }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors shrink-0
        ${active
          ? "bg-zinc-900 text-white"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"}
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function wordCount(html) {
  const text = (html || "").replace(/<[^>]*>/g, " ").trim();
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

export default function Editor() {
  const { activeNote, updateNote, setActiveId, closeNote, setFloating } = useNotes();
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied]         = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Entrée → toujours un <p>, jamais de continuation de liste
        hardBreak: false,
      }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: activeNote?.content || "",
    onUpdate: ({ editor }) => {
      if (activeNote) {
        updateNote(activeNote.id, { content: editor.getHTML() });
      }
    },
    editorProps: {
      attributes: {
        class: "editor-content outline-none min-h-full text-sm text-zinc-800 leading-relaxed",
      },
    },
  });

  // Recharge le contenu quand on change de note
  useEffect(() => {
    if (!editor || !activeNote) return;
    const current = editor.getHTML();
    if (current !== activeNote.content) {
      editor.commands.setContent(activeNote.content || "", false);
    }
  }, [activeNote?.id]);

  const copyText = useCallback(async () => {
    if (!activeNote || !editor) return;
    const plain = (activeNote.title ? activeNote.title + "\n\n" : "")
      + editor.getText();
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [activeNote, editor]);

  if (!activeNote) return (
    <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-sm text-zinc-400">
      Sélectionne une note
    </div>
  );

  const words = wordCount(activeNote.content);
  const chars = (editor?.getText() || "").length;

  return (
    <div className={`flex flex-col overflow-hidden min-w-0 bg-white border border-zinc-200
      ${fullscreen ? "fixed inset-0 z-50 rounded-none" : "flex-1 rounded-xl"}`}>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-zinc-100 flex-wrap">
        <button
          onClick={closeNote}
          className="flex items-center gap-1 text-xs text-zinc-500 px-1.5 py-1 rounded hover:bg-zinc-100 hover:text-zinc-900 transition-colors mr-1 shrink-0"
        >
          <ChevronLeft size={14} /> Retour
        </button>
        <Sep />

        <ToolBtn onClick={() => setFloating(true)} title="Mode flottant"><PictureInPicture2 size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Annuler (Ctrl+Z)" disabled={!editor?.can().undo()}><Undo2 size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Rétablir (Ctrl+Y)" disabled={!editor?.can().redo()}><Redo2 size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}          title="Gras (Ctrl+B)"     active={editor?.isActive("bold")}><Bold size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}        title="Italique (Ctrl+I)" active={editor?.isActive("italic")}><Italic size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()}     title="Souligné (Ctrl+U)" active={editor?.isActive("underline")}><UnderlineIcon size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}        title="Barré"             active={editor?.isActive("strike")}><Strikethrough size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()}   title="Gauche"   active={editor?.isActive({ textAlign: "left" })}><AlignLeft size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centrer"  active={editor?.isActive({ textAlign: "center" })}><AlignCenter size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()}  title="Droite"   active={editor?.isActive({ textAlign: "right" })}><AlignRight size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}    title="Liste à puces"  active={editor?.isActive("bulletList")}><List size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()}       title="Liste à cocher" active={editor?.isActive("taskList")}><ListTodo size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}    title="Citation"       active={editor?.isActive("blockquote")}><Quote size={13} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()}   title="Séparateur"><Minus size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={copyText} title="Copier le texte brut">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </ToolBtn>
        <ToolBtn onClick={() => setFullscreen(f => !f)} title={fullscreen ? "Quitter plein écran" : "Plein écran"}>
          {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </ToolBtn>
      </div>

      {/* ── Titre ── */}
      <div className="px-6 pt-5 shrink-0">
        <p className="text-[11px] text-zinc-400 mb-2">{fmtFull(activeNote.updatedAt)}</p>
        <input
          className="w-full bg-transparent border-none outline-none font-serif text-[22px] text-zinc-900"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          placeholder="Titre..."
        />
        <hr className="border-zinc-100 my-3" />
      </div>

      {/* ── Zone Tiptap ── */}
      <div className="flex-1 px-6 pb-2 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* ── Footer stats ── */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-zinc-100 shrink-0">
        <span className="text-[11px] text-zinc-400">
          {words} mot{words !== 1 ? "s" : ""} · {chars} caractère{chars !== 1 ? "s" : ""}
        </span>
        <span className="text-[11px] text-zinc-300 hidden sm:block">
          Ctrl+B · Ctrl+I · Ctrl+U
        </span>
      </div>
    </div>
  );
}