"use client";

import "./product-description-editor.css";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import { descriptionHtmlForEditor } from "@/lib/product-description-editor";
import {
  PRODUCT_DESCRIPTION_MAX_TEXT,
  sanitizeProductDescriptionHtml,
} from "@/lib/sanitize-product-description";

type Props = {
  /** Raw DB value: HTML or legacy plain text */
  defaultValue?: string | null;
  placeholder?: string;
  /** Form field name for the hidden HTML input (default: product `description`). */
  hiddenInputName?: string;
  /** Unique id for the editor surface (avoid duplicates when several editors exist). */
  fieldId?: string;
  /** Character limit for visible text (default: product cap). */
  textLimit?: number;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold touch-manipulation disabled:opacity-40 ${
        active ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

export function ProductDescriptionEditor({
  defaultValue = "",
  placeholder = "Write product copy…",
  hiddenInputName = "description",
  fieldId = "product-description-editor",
  textLimit = PRODUCT_DESCRIPTION_MAX_TEXT,
}: Props) {
  const initialHtml = descriptionHtmlForEditor(defaultValue);
  const [html, setHtml] = useState(() =>
    initialHtml.trim() ? sanitizeProductDescriptionHtml(initialHtml) : "",
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
        },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({
        limit: textLimit,
        mode: "textSize",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        id: fieldId,
        class: "focus:outline-none",
        spellcheck: "true",
        "aria-label": "Rich text",
      },
    },
    onCreate: ({ editor: ed }) => {
      setHtml(sanitizeProductDescriptionHtml(ed.getHTML()));
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(sanitizeProductDescriptionHtml(ed.getHTML()));
    },
  }, [textLimit]);

  const chars =
    useEditorState({
      editor,
      selector: (s) => (s.editor ? s.editor.storage.characterCount.characters() : 0),
    }) ?? 0;

  return (
    <div className="product-description-editor space-y-2">
      <input type="hidden" name={hiddenInputName} value={html} readOnly />
      {editor ? (
        <>
          <div className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 p-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              Bold
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              Italic
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
            >
              Underline
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
              Strike
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive("heading", { level: 2 })}
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive("heading", { level: 3 })}
            >
              H3
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
            >
              List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
            >
              1. List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
            >
              Quote
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const prev = editor.getAttributes("link").href as string | undefined;
                const url = typeof window !== "undefined" ? window.prompt("Link URL (https://…)", prev ?? "") : null;
                if (url === null) return;
                const t = url.trim();
                if (t === "") {
                  editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  return;
                }
                editor.chain().focus().extendMarkRange("link").setLink({ href: t }).run();
              }}
              active={editor.isActive("link")}
            >
              Link
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
              Undo
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
              Redo
            </ToolbarButton>
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white ring-zinc-400 focus-within:ring-2">
            <EditorContent editor={editor} />
          </div>
          <p className="text-xs text-zinc-500">
            {chars.toLocaleString()} / {textLimit.toLocaleString()} characters
          </p>
        </>
      ) : (
        <div className="min-h-[12rem] rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-4 text-sm text-zinc-500">
          Loading editor…
        </div>
      )}
    </div>
  );
}
