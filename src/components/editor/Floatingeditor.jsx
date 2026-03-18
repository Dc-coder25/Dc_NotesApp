import { useRef, useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import {
  X, GripHorizontal, Bold, Italic, Underline as UnderlineIcon,
  Strikethrough, List, ListTodo, Quote, Minus,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight,
  Maximize2,
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
      className={`w-6 h-6 flex items-center justify-center rounded transition-colors shrink-0
        ${active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"}
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

export default function FloatingEditor() {
  const { activeNote, updateNote, closeNote, setFloating } = useNotes();

  // Position initiale — centré à l'écran
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - 300, y: 80 });
  const [size, setSize] = useState({ w: 600, h: 460 });
  const dragRef   = useRef(null);
  const resizeRef = useRef(null);
  const boxRef    = useRef(null);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const startDrag = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const onMove = (e) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - size.w, e.clientX - startX)),
        y: Math.max(0, Math.min(window.innerHeight - size.h, e.clientY - startY)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [pos, size]);

  // ── Resize (coin bas-droite) ───────────────────────────────────────────────
  const startResize = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onMove = (e) => {
      setSize({
        w: Math.max(320, startW + e.clientX - startX),
        h: Math.max(200, startH + e.clientY - startY),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [size]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: activeNote?.content || "",
    onUpdate: ({ editor }) => {
      if (activeNote) updateNote(activeNote.id, { content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: "editor-content outline-none min-h-full text-sm text-zinc-800 leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (!editor || !activeNote) return;
    if (editor.getHTML() !== activeNote.content) {
      editor.commands.setContent(activeNote.content || "", false);
    }
  }, [activeNote?.id]);

  // Quitter le mode flottant → repasser en 3 colonnes
  const exitFloat = () => setFloating(false);

  if (!activeNote) return null;

  return (
    <div
      ref={boxRef}
      style={{
        position: "fixed",
        left: pos.x,
        top:  pos.y,
        width:  size.w,
        height: size.h,
        zIndex: 100,
      }}
      className="flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-lg"
    >
      {/* ── Handle drag ── */}
      <div
        ref={dragRef}
        onMouseDown={startDrag}
        className="flex items-center gap-1 px-3 py-2 border-b border-zinc-100 cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <GripHorizontal size={13} className="text-zinc-300 shrink-0" />

        {/* Toolbar compacte */}
        <div className="flex items-center gap-0.5 flex-1 flex-wrap">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Annuler" disabled={!editor?.can().undo()}><Undo2 size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Rétablir" disabled={!editor?.can().redo()}><Redo2 size={12} /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor?.isActive("bold")}      title="Gras"><Bold size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor?.isActive("italic")}    title="Italique"><Italic size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Souligné"><UnderlineIcon size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor?.isActive("strike")}    title="Barré"><Strikethrough size={12} /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()}   active={editor?.isActive({ textAlign: "left" })}   title="Gauche"><AlignLeft size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })} title="Centrer"><AlignCenter size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()}  active={editor?.isActive({ textAlign: "right" })}  title="Droite"><AlignRight size={12} /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Liste"><List size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()}    active={editor?.isActive("taskList")}   title="Checklist"><ListTodo size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Citation"><Quote size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Séparateur"><Minus size={12} /></ToolBtn>
        </div>

        {/* Quitter flottant / Fermer */}
        <ToolBtn onClick={exitFloat} title="Ancrer dans la fenêtre"><Maximize2 size={12} /></ToolBtn>
        <ToolBtn onClick={closeNote} title="Fermer"><X size={12} /></ToolBtn>
      </div>

      {/* ── Titre ── */}
      <div className="px-5 pt-4 shrink-0">
        <p className="text-[10px] text-zinc-400 mb-1.5">{fmtFull(activeNote.updatedAt)}</p>
        <input
          className="w-full bg-transparent border-none outline-none font-serif text-lg text-zinc-900"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          placeholder="Titre..."
        />
        <hr className="border-zinc-100 my-2.5" />
      </div>

      {/* ── Contenu ── */}
      <div className="flex-1 px-5 pb-2 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* ── Poignée de resize ── */}
      <div
        ref={resizeRef}
        onMouseDown={startResize}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{
          background: "linear-gradient(135deg, transparent 50%, #d4d4d8 50%)",
          borderBottomRightRadius: 12,
        }}
      />
    </div>
  );
}