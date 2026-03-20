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
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Maximize2,
} from "lucide-react";
import { useNotes } from "../../store/notesStore";
import { fmtFull } from "../../utils/dateUtils";
import "./editor.css";

const Sep = () => <div className="w-px h-4 bg-border mx-0.5 shrink-0" />;

function ToolBtn({ onClick, title, active, disabled, children }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`w-6 h-6 flex items-center justify-center rounded-md transition-all shrink-0
        ${active ? "bg-navy text-white" : "text-text-muted hover:bg-sky-pale hover:text-navy"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

export default function FloatingEditor() {
  const { activeNote, updateNote, closeNote, setFloating } = useNotes();

  const [pos, setPos]   = useState({ x: window.innerWidth / 2 - 300, y: 80 });
  const [size, setSize] = useState({ w: 600, h: 460 });
  const boxRef          = useRef(null);

  const startDrag = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;
    const onMove = (e) => setPos({
      x: Math.max(0, Math.min(window.innerWidth  - size.w, e.clientX - startX)),
      y: Math.max(0, Math.min(window.innerHeight - size.h, e.clientY - startY)),
    });
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [pos, size]);

  const startResize = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const startW = size.w,    startH = size.h;
    const onMove = (e) => setSize({
      w: Math.max(320, startW + e.clientX - startX),
      h: Math.max(200, startH + e.clientY - startY),
    });
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
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
        class: "editor-content outline-none min-h-full font-serif text-[13px] leading-[1.8] text-text-primary",
      },
    },
  });

  useEffect(() => {
    if (!editor || !activeNote) return;
    if (editor.getHTML() !== activeNote.content)
      editor.commands.setContent(activeNote.content || "", false);
  }, [activeNote?.id]);

  if (!activeNote) return null;

  return (
    <div
      ref={boxRef}
      style={{ position: "fixed", left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: 100 }}
      className="flex flex-col bg-white rounded-lg border border-border overflow-hidden shadow-xl"
    >
      {/* ── Handle drag + toolbar ── */}
      <div
        onMouseDown={startDrag}
        className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-off-white cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <GripHorizontal size={13} className="text-text-ghost shrink-0" />

        <div className="flex items-center gap-0.5 flex-1 flex-wrap">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor?.can().undo()}><Undo2 size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor?.can().redo()}><Redo2 size={12} /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor?.isActive("bold")}><Bold size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor?.isActive("italic")}><Italic size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")}><UnderlineIcon size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor?.isActive("strike")}><Strikethrough size={12} /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()}   active={editor?.isActive({ textAlign: "left" })}><AlignLeft size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })}><AlignCenter size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()}  active={editor?.isActive({ textAlign: "right" })}><AlignRight size={12} /></ToolBtn>
          <Sep />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")}><List size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()}    active={editor?.isActive("taskList")}><ListTodo size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")}><Quote size={12} /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={12} /></ToolBtn>
        </div>

        <ToolBtn onClick={() => setFloating(false)} title="Ancrer"><Maximize2 size={12} /></ToolBtn>
        <ToolBtn onClick={closeNote} title="Fermer"><X size={12} /></ToolBtn>
      </div>

      {/* ── Titre ── */}
      <div className="px-5 pt-4 shrink-0">
        <p className="text-[10px] text-text-ghost mb-1.5 font-sans">{fmtFull(activeNote.updatedAt)}</p>
        <input
          className="w-full bg-transparent border-none outline-none font-serif text-[18px] font-semibold text-navy placeholder:text-text-ghost"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          placeholder="Titre…"
        />
        <div className="border-t border-border my-2.5" />
      </div>

      {/* ── Contenu ── */}
      <div className="flex-1 px-5 pb-2 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* ── Poignée resize ── */}
      <div
        onMouseDown={startResize}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize rounded-br-lg"
        style={{ background: "linear-gradient(135deg, transparent 50%, #b0c8e4 50%)" }}
      />
    </div>
  );
}