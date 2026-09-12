"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Strikethrough, Underline as UnderlineIcon, Undo2, Unlink } from "lucide-react";

type RichTextEditorProps = { value: string; onChange: (html: string) => void; error?: string };

export function RichTextEditor({ value, onChange, error }: RichTextEditorProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image, Placeholder.configure({ placeholder: "داستان، تحلیل یا دیدگاه خود را اینجا بنویسید..." })],
    content: value,
    editorProps: { attributes: { class: "tiptap min-h-[520px] px-6 py-7 outline-none sm:px-9 sm:py-8", role: "textbox", "aria-label": "محتوای مقاله", "aria-multiline": "true" } },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  if (!editor) return <div className="h-[570px] animate-pulse rounded-(--radius) border border-(--border) bg-white" />;

  const tools = [
    { label: "عنوان سطح دو", icon: Heading2, active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "عنوان سطح سه", icon: Heading3, active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "ضخیم", icon: Bold, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "مورب", icon: Italic, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "زیرخط", icon: UnderlineIcon, active: editor.isActive("underline"), run: () => editor.chain().focus().toggleUnderline().run() },
    { label: "خط‌خورده", icon: Strikethrough, active: editor.isActive("strike"), run: () => editor.chain().focus().toggleStrike().run() },
    { label: "کد درون‌خطی", icon: Code, active: editor.isActive("code"), run: () => editor.chain().focus().toggleCode().run() },
    { label: "فهرست نشانه‌دار", icon: List, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "فهرست شماره‌دار", icon: ListOrdered, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "نقل‌قول", icon: Quote, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
  ];

  return (
    <div className={`overflow-hidden rounded-(--radius) border bg-white transition-colors focus-within:border-(--border-strong) ${error ? "border-(--danger-border)" : "border-(--border)"}`}>
      <div className="sticky top-19 z-10 flex flex-wrap items-center gap-1 border-b border-(--border-subtle) bg-(--surface-subtle) p-2">
        {tools.map((tool) => <button key={tool.label} type="button" onClick={tool.run} aria-label={tool.label} title={tool.label} aria-pressed={tool.active} className={`grid size-10 place-items-center rounded-md transition-colors ${tool.active ? "bg-(--surface-muted) text-(--brand-teal)" : "text-(--text-secondary) hover:bg-(--surface-muted) hover:text-(--text-strong)"}`}><tool.icon size={15} /></button>)}
        <span className="mx-1 h-5 w-px bg-(--surface-muted)" />
        <div className="relative"><button type="button" onClick={() => setLinkOpen((open) => !open)} aria-label="افزودن لینک" title="افزودن لینک" className={`grid size-10 place-items-center rounded-md ${editor.isActive("link") ? "bg-(--surface-muted) text-(--brand-teal)" : "text-(--text-secondary) hover:bg-(--surface-muted)"}`}><Link2 size={15} /></button>{linkOpen && <div className="absolute right-0 top-10 z-20 flex w-72 gap-1 rounded-(--radius-sm) border border-(--border) bg-white p-2 shadow-[0_12px_30px_rgba(23,38,48,.13)]"><input dir="ltr" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://example.com" className="h-10 min-w-0 flex-1 rounded-md border border-(--border) px-2 text-[13px] outline-none focus:border-(--focus-border)" /><button type="button" onClick={() => { if (linkUrl) editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run(); setLinkOpen(false); setLinkUrl(""); }} className="rounded-md bg-(--brand-navy) px-2.5 text-[13px] font-bold text-white">ثبت</button></div>}</div>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} aria-label="حذف لینک" title="حذف لینک" className="grid size-10 place-items-center rounded-md text-(--text-secondary) hover:bg-(--surface-muted) disabled:opacity-30"><Unlink size={15} /></button>
        <div className="relative">
          <button type="button" onClick={() => { setImageOpen((open) => !open); setLinkOpen(false); }} aria-label="افزودن تصویر" title="افزودن تصویر" aria-expanded={imageOpen} className="grid size-10 place-items-center rounded-md text-(--text-secondary) hover:bg-(--surface-muted)"><ImagePlus size={15} /></button>
          {imageOpen && <form className="absolute right-0 top-10 z-20 w-80 rounded-(--radius-sm) border border-(--border) bg-white p-2 shadow-[0_12px_30px_rgba(23,38,48,.13)]" onSubmit={(event) => { event.preventDefault(); const url = imageUrl.trim(); if (url) editor.chain().focus().setImage({ src: url, alt: "تصویر مقاله" }).run(); setImageOpen(false); setImageUrl(""); }}>
            <label htmlFor="editor-image-url" className="mb-1.5 block text-[12px] font-bold text-(--text-secondary)">آدرس اینترنتی تصویر</label>
            <div className="flex gap-1">
              <input id="editor-image-url" type="url" dir="ltr" autoFocus required value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/image.jpg" className="h-10 min-w-0 flex-1 rounded-md border border-(--border) px-2 text-[13px] outline-none focus:border-(--focus-border)" />
              <button type="submit" className="rounded-md bg-(--brand-navy) px-3 text-[13px] font-bold text-white">افزودن</button>
            </div>
          </form>}
        </div>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="خط جداکننده" title="خط جداکننده" className="grid size-10 place-items-center rounded-md text-(--text-secondary) hover:bg-(--surface-muted)"><Minus size={15} /></button>
        <span className="mx-1 h-5 w-px bg-(--surface-muted)" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} aria-label="بازگشت" title="بازگشت" className="grid size-10 place-items-center rounded-md text-(--text-secondary) hover:bg-(--surface-muted) disabled:opacity-30"><Undo2 size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} aria-label="انجام دوباره" title="انجام دوباره" className="grid size-10 place-items-center rounded-md text-(--text-secondary) hover:bg-(--surface-muted) disabled:opacity-30"><Redo2 size={15} /></button>
      </div>
      <EditorContent editor={editor} />
      {error && <p className="border-t border-(--danger-border) bg-(--danger-soft) px-5 py-2 text-[13px] text-(--danger)">{error}</p>}
    </div>
  );
}
