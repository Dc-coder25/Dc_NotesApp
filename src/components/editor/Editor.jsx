import { useRef, useEffect, useCallback, useState } from "react";
import {
  ChevronLeft, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote, Minus, Undo2, Redo2,
  Maximize2, Minimize2, Copy, Check, AlignLeft,
  AlignCenter, AlignRight,
} from "lucide-react";
import "./editor.css";
import { useNotes } from "../../store/notesStore";
import { fmtFull } from "../../utils/dateUtils";

const Sep = () => <div className="w-px h-4 bg-zinc-200 mx-0.5 shrink-0" />;

function ToolBtn({ onAction, title, active, children }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onAction(); }}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors shrink-0
        ${active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"}`}
    >
      {children}
    </button>
  );
}

// ─── Utilitaires de sélection ─────────────────────────────────────────────
function saveSelection() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return null;
  return sel.getRangeAt(0).cloneRange();
}

function restoreSelection(range) {
  if (!range) return;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function queryState(cmd) {
  try { return document.queryCommandState(cmd); } catch { return false; }
}

// ─── Insertion de bloc (liste, citation, titre) ────────────────────────────
function insertBlock(editorEl, tag) {
  editorEl.focus();
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);

  // Trouve le bloc parent dans l'éditeur
  let node = range.startContainer;
  while (node && node !== editorEl && node.parentNode !== editorEl) {
    node = node.parentNode;
  }
  if (!node || node === editorEl) {
    // Pas de bloc trouvé : insère à la fin
    const el = createBlock(tag);
    editorEl.appendChild(el);
    placeCursorIn(el);
    return;
  }

  if (tag === "ul" || tag === "ol") {
    const list = document.createElement(tag);
    const li = document.createElement("li");
    li.innerHTML = node.innerHTML || "<br>";
    list.appendChild(li);
    editorEl.replaceChild(list, node);
    placeCursorIn(li);
  } else if (tag === "blockquote") {
    const bq = document.createElement("blockquote");
    bq.innerHTML = node.innerHTML || "<br>";
    editorEl.replaceChild(bq, node);
    placeCursorIn(bq);
  } else {
    // h1, h2, h3, p
    const el = document.createElement(tag);
    el.innerHTML = node.innerHTML || "<br>";
    editorEl.replaceChild(el, node);
    placeCursorIn(el);
  }
}

function createBlock(tag) {
  const el = document.createElement(tag === "ul" || tag === "ol" ? tag : tag);
  if (tag === "ul" || tag === "ol") {
    const li = document.createElement("li");
    li.innerHTML = "<br>";
    el.appendChild(li);
  } else {
    el.innerHTML = "<br>";
  }
  return el;
}

function placeCursorIn(el) {
  const range = document.createRange();
  const target = el.lastChild || el;
  try {
    range.setStart(target, target.nodeType === Node.TEXT_NODE ? target.length : 0);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch {}
}

// ─── Compteurs ────────────────────────────────────────────────────────────
function wordCount(html) {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}
function charCount(html) {
  return html.replace(/<[^>]*>/g, "").length;
}

// ─── Éditeur ─────────────────────────────────────────────────────────────
export default function Editor() {
  const { activeNote, updateNote, setActiveId } = useNotes();
  const editorRef = useRef(null);
  const savedSel  = useRef(null);
  const [, forceUpdate] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync contenu quand on change de note
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

  // Sauvegarde la sélection avant que le bouton toolbar prenne le focus
  const handleSelectionChange = useCallback(() => {
    if (document.activeElement === editorRef.current) {
      savedSel.current = saveSelection();
    }
    refresh();
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  // Action inline (bold, italic...) — utilise execCommand sur sélection restaurée
  const inlineAction = useCallback((cmd) => {
    restoreSelection(savedSel.current);
    document.execCommand(cmd, false, null);
    if (editorRef.current) {
      updateNote(activeNote.id, { content: editorRef.current.innerHTML });
    }
    refresh();
  }, [activeNote?.id]);

  // Action de bloc — manipulation DOM directe
  const blockAction = useCallback((tag) => {
    restoreSelection(savedSel.current);
    if (editorRef.current) {
      insertBlock(editorRef.current, tag);
      updateNote(activeNote.id, { content: editorRef.current.innerHTML });
    }
    refresh();
  }, [activeNote?.id]);

  // Raccourcis clavier
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b": e.preventDefault(); document.execCommand("bold"); handleInput(); break;
        case "i": e.preventDefault(); document.execCommand("italic"); handleInput(); break;
        case "u": e.preventDefault(); document.execCommand("underline"); handleInput(); break;
        case "z":
          e.preventDefault();
          document.execCommand(e.shiftKey ? "redo" : "undo");
          handleInput();
          break;
      }
      return;
    }
    // Markdown shortcuts : "# " → h2, "- " → ul, "> " → blockquote
    if (e.key === " ") {
      const sel = window.getSelection();
      if (!sel?.rangeCount) return;
      const range = sel.getRangeAt(0);
      const node  = range.startContainer;
      if (node.nodeType !== Node.TEXT_NODE) return;
      const text = node.textContent.slice(0, range.startOffset);
      if (text === "#")  { e.preventDefault(); node.textContent = ""; insertBlock(editorRef.current, "h2"); }
      else if (text === "##") { e.preventDefault(); node.textContent = ""; insertBlock(editorRef.current, "h3"); }
      else if (text === "-")  { e.preventDefault(); node.textContent = ""; insertBlock(editorRef.current, "ul"); }
      else if (text === "1.") { e.preventDefault(); node.textContent = ""; insertBlock(editorRef.current, "ol"); }
      else if (text === ">")  { e.preventDefault(); node.textContent = ""; insertBlock(editorRef.current, "blockquote"); }
      else return;
      if (editorRef.current) updateNote(activeNote.id, { content: editorRef.current.innerHTML });
    }
  }, [activeNote?.id, handleInput]);

  const copyText = useCallback(async () => {
    if (!activeNote) return;
    const text = activeNote.content.replace(/<[^>]*>/g, "");
    await navigator.clipboard.writeText((activeNote.title ? activeNote.title + "\n\n" : "") + text);
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

        <ToolBtn onAction={() => { restoreSelection(savedSel.current); document.execCommand("undo"); handleInput(); }} title="Annuler (Ctrl+Z)"><Undo2 size={13} /></ToolBtn>
        <ToolBtn onAction={() => { restoreSelection(savedSel.current); document.execCommand("redo"); handleInput(); }} title="Rétablir (Ctrl+Y)"><Redo2 size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onAction={() => inlineAction("bold")}        title="Gras (Ctrl+B)"      active={queryState("bold")}><Bold size={13} /></ToolBtn>
        <ToolBtn onAction={() => inlineAction("italic")}      title="Italique (Ctrl+I)"  active={queryState("italic")}><Italic size={13} /></ToolBtn>
        <ToolBtn onAction={() => inlineAction("underline")}   title="Souligné (Ctrl+U)"  active={queryState("underline")}><Underline size={13} /></ToolBtn>
        <ToolBtn onAction={() => inlineAction("strikeThrough")} title="Barré"            active={queryState("strikeThrough")}><Strikethrough size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onAction={() => inlineAction("justifyLeft")}   title="Gauche"><AlignLeft size={13} /></ToolBtn>
        <ToolBtn onAction={() => inlineAction("justifyCenter")} title="Centrer"><AlignCenter size={13} /></ToolBtn>
        <ToolBtn onAction={() => inlineAction("justifyRight")}  title="Droite"><AlignRight size={13} /></ToolBtn>
        <Sep />

        <ToolBtn onAction={() => blockAction("ul")}         title="Liste à puces"    active={queryState("insertUnorderedList")}><List size={13} /></ToolBtn>
        <ToolBtn onAction={() => blockAction("ol")}         title="Liste numérotée"  active={queryState("insertOrderedList")}><ListOrdered size={13} /></ToolBtn>
        <ToolBtn onAction={() => blockAction("blockquote")} title="Citation"><Quote size={13} /></ToolBtn>
        <ToolBtn onAction={() => { restoreSelection(savedSel.current); document.execCommand("insertHorizontalRule"); handleInput(); }} title="Séparateur"><Minus size={13} /></ToolBtn>
        <Sep />

        <select
          onMouseDown={(e) => { savedSel.current = saveSelection(); e.stopPropagation(); }}
          onChange={(e) => { blockAction(e.target.value); e.target.value = "p"; }}
          defaultValue="p"
          className="text-xs text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5 bg-transparent outline-none cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <option value="p">Normal</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
        </select>
        <Sep />

        <ToolBtn onAction={copyText} title="Copier le texte brut">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </ToolBtn>
        <ToolBtn onAction={() => setFullscreen((f) => !f)} title={fullscreen ? "Quitter plein écran" : "Plein écran"}>
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

      {/* Zone rich text */}
      <div className="flex-1 px-6 pb-2 overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder="Commence à écrire…"
          className="min-h-full outline-none text-sm text-zinc-800 leading-relaxed editor-content"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-zinc-100 shrink-0">
        <span className="text-[11px] text-zinc-400">
          {words} mot{words !== 1 ? "s" : ""} · {chars} caractère{chars !== 1 ? "s" : ""}
        </span>
        <span className="text-[11px] text-zinc-300 hidden sm:block">
          Ctrl+B · Ctrl+I · Ctrl+U · # espace → titre
        </span>
      </div>
    </div>
  );
}