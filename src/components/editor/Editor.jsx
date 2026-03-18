import { useRef, useEffect, useCallback, useState } from "react";
import {
  ChevronLeft, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote, Minus, Undo2, Redo2,
  Maximize2, Minimize2, Copy, Check, AlignLeft,
  AlignCenter, AlignRight,
} from "lucide-react";
import { useNotes } from "../../store/notesStore";
import { fmtFull } from "../../utils/dateUtils";

const Sep = () => <div className="w-px h-4 bg-zinc-200 mx-0.5 shrink-0" />;

function ToolBtn({ onClick, title, active, children }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors shrink-0
        ${active
          ? "bg-zinc-900 text-white"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"}`}
    >
      {children}
    </button>
  );
}

function exec(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

function isActive(cmd) {
  try { return document.queryCommandState(cmd); } catch { return false; }
}

function wordCount(html) {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function charCount(html) {
  return html.replace(/<[^>]*>/g, "").length;
}

export default function Editor() {
  const { activeNote, updateNote, setActiveId } = useNotes();
  const editorRef = useRef(null);
  const [, forceUpdate] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || !activeNote) return;
    if (el.innerHTML !== activeNote.content) {
      el.innerHTML = activeNote.content || "";
    }
  }, [activeNote?.id]);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const handleInput = useCallback(() => {
    if (!editorRef.current || !activeNote) return;
    updateNote(activeNote.id, { content: editorRef.current.innerHTML });
    refresh();
  }, [activeNote?.id]);

  const handleKeyDown = useCallback((e) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "b": e.preventDefault(); exec("bold"); break;
        case "i": e.preventDefault(); exec("italic"); break;
        case "u": e.preventDefault(); exec("underline"); break;
        case "z": e.preventDefault(); exec(e.shiftKey ? "redo" : "undo"); break;
      }
      refresh();
      return;
    }
    if (e.key === " ") {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const node  = range.startContainer;
      if (node.nodeType !== Node.TEXT_NODE) return;
      const text = node.textContent.slice(0, range.startOffset);
      if (text === "#")       { e.preventDefault(); exec("formatBlock", "h2"); node.textContent = ""; }
      else if (text === "##") { e.preventDefault(); exec("formatBlock", "h3"); node.textContent = ""; }
      else if (text === "-")  { e.preventDefault(); exec("insertUnorderedList"); node.textContent = ""; }
      else if (text === "1.") { e.preventDefault(); exec("insertOrderedList"); node.textContent = ""; }
      else if (text === ">")  { e.preventDefault(); exec("formatBlock", "blockquote"); node.textContent = ""; }
    }
  }, [refresh]);

  const copyToClipboard = useCallback(async () => {
    if (!activeNote) return;
    const text = activeNote.content.replace(/<[^>]*>/g, "");
    await navigator.clipboard.writeText(
      (activeNote.title ? activeNote.title + "\n\n" : "") + text
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [activeNote]);

  if (!activeNote)
    return (
      <div className="flex-1 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-sm text-zinc-400">
        Sélectionne une note
      </div>
    );

  const words = wordCount(activeNote.content);
  const chars = charCount(activeNote.content);

  return (
    <div className={`flex flex-col overflow-hidden min-w-0 bg-white border border-zinc-200
      ${fullscreen ? "fixed inset-0 z-50 rounded-none" : "flex-1 rounded-xl"}`}>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-zinc-100 flex-wrap">
        <button
          onClick={() => setActiveId(null)}
          className="flex items-center gap-1 text-xs text-zinc-500 px-1.5 py-1 rounded hover:bg-zinc-100 hover:text-zinc-900 transition-colors mr-1 shrink-0"
        >
          <ChevronLeft size={14} /> Retour
        </button>
        <Sep />

        <ToolBtn onClick={() => { exec("undo"); refresh(); }} title="Annuler (⌘Z)"><Undo2 size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("redo"); refresh(); }} title="Rétablir (⌘⇧Z)"><Redo2 size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => { exec("bold"); refresh(); }} title="Gras (⌘B)" active={isActive("bold")}><Bold size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("italic"); refresh(); }} title="Italique (⌘I)" active={isActive("italic")}><Italic size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("underline"); refresh(); }} title="Souligné (⌘U)" active={isActive("underline")}><Underline size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("strikeThrough"); refresh(); }} title="Barré" active={isActive("strikeThrough")}><Strikethrough size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => { exec("justifyLeft"); refresh(); }} title="Gauche"><AlignLeft size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("justifyCenter"); refresh(); }} title="Centrer"><AlignCenter size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("justifyRight"); refresh(); }} title="Droite"><AlignRight size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onClick={() => { exec("insertUnorderedList"); refresh(); }} title="Liste à puces" active={isActive("insertUnorderedList")}><List size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("insertOrderedList"); refresh(); }} title="Liste numérotée" active={isActive("insertOrderedList")}><ListOrdered size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("formatBlock", "blockquote"); refresh(); }} title="Citation"><Quote size={13} /></ToolBtn>
        <ToolBtn onClick={() => { exec("insertHorizontalRule"); refresh(); }} title="Séparateur"><Minus size={13} /></ToolBtn>
        <Sep />

        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => { exec("formatBlock", e.target.value); e.target.value = "p"; refresh(); }}
          defaultValue="p"
          className="text-xs text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5 bg-transparent outline-none cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <option value="p">Normal</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
        </select>
        <Sep />

        <ToolBtn onClick={copyToClipboard} title="Copier le texte">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </ToolBtn>
        <ToolBtn onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Quitter plein écran" : "Plein écran"}>
          {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </ToolBtn>
      </div>

      {/* Titre */}
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

      {/* Éditeur rich text */}
      <div className="flex-1 px-6 pb-2 overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={refresh}
          onKeyUp={refresh}
          className="min-h-full outline-none text-sm text-zinc-800 leading-relaxed editor-content"
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-zinc-100 shrink-0">
        <span className="text-[11px] text-zinc-400">
          {words} mot{words !== 1 ? "s" : ""} · {chars} caractère{chars !== 1 ? "s" : ""}
        </span>
        <span className="text-[11px] text-zinc-300 hidden sm:block">
          ⌘B · ⌘I · ⌘U · # espace → titre
        </span>
      </div>
    </div>
  );
}