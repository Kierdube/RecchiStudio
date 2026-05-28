"use client";

import "./product-description-editor.css";

import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { FontFamily, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import { descriptionHtmlForEditor } from "@/lib/product-description-editor";
import { sanitizeRichTextHtml } from "@/lib/rich-text-sanitize";
import {
  PRODUCT_DESCRIPTION_MAX_TEXT,
} from "@/lib/sanitize-product-description";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter Tight", value: "'Inter Tight', system-ui, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
] as const;

type Props = {
  defaultValue?: string | null;
  placeholder?: string;
  hiddenInputName?: string;
  fieldId?: string;
  textLimit?: number;
  /** `inline` for short labels; `block` for paragraphs and long copy. */
  variant?: "inline" | "block";
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

function ToolbarSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string }[];
}) {
  return (
    <label className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600">
      <span className="sr-only">{label}</span>
      <span aria-hidden className="hidden sm:inline">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[8.5rem] rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900"
      >
        {options.map((opt) => (
          <option key={opt.value || "default"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EditorToolbar({
  editor,
  inline,
  currentFont,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>;
  inline: boolean;
  currentFont: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 p-2">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        Bold
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        Italic
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        Underline
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
        Strike
      </ToolbarButton>
      <ToolbarSelect
        label="Font"
        value={currentFont}
        onChange={(family) => {
          if (!family) {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(family).run();
          }
        }}
        options={FONT_FAMILIES}
      />
      {!inline ? (
        <>
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
        </>
      ) : null}
      <ToolbarButton
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url =
            typeof window !== "undefined" ? window.prompt("Link URL (https://…)", prev ?? "") : null;
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
  );
}

export function ProductDescriptionEditor({
  defaultValue = "",
  placeholder = "Write product copy…",
  hiddenInputName = "description",
  fieldId = "product-description-editor",
  textLimit = PRODUCT_DESCRIPTION_MAX_TEXT,
  variant = "block",
}: Props) {
  const inline = variant === "inline";
  const initialHtml = descriptionHtmlForEditor(defaultValue);
  const [html, setHtml] = useState(() =>
    initialHtml.trim() ? sanitizeRichTextHtml(initialHtml) : "",
  );

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: inline ? false : { levels: [2, 3] },
          code: false,
          codeBlock: false,
          horizontalRule: false,
          bulletList: inline ? false : undefined,
          orderedList: inline ? false : undefined,
          blockquote: inline ? false : undefined,
        }),
        Underline,
        TextStyle,
        FontFamily,
        Link.configure({
          openOnClick: false,
          autolink: true,
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
          class: `focus:outline-none ${inline ? "product-description-editor--inline" : ""}`,
          spellcheck: "true",
          "aria-label": "Rich text",
        },
      },
      onCreate: ({ editor: ed }) => {
        setHtml(sanitizeRichTextHtml(ed.getHTML()));
      },
      onUpdate: ({ editor: ed }) => {
        setHtml(sanitizeRichTextHtml(ed.getHTML()));
      },
    },
    [textLimit, inline],
  );

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
          <EditorToolbar
            editor={editor}
            inline={inline}
            currentFont={(editor.getAttributes("textStyle").fontFamily as string | undefined) ?? ""}
          />
          <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white ring-zinc-400 focus-within:ring-2">
            <EditorContent editor={editor} />
          </div>
          <p className="text-xs text-zinc-500">
            {chars.toLocaleString()} / {textLimit.toLocaleString()} characters
          </p>
        </>
      ) : (
        <div className="min-h-[3rem] rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-4 text-sm text-zinc-500">
          Loading editor…
        </div>
      )}
    </div>
  );
}
