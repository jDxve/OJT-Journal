'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useRef, useCallback, useState, useEffect } from 'react';
import { uploadImage } from '@/lib/storage';
import {
  Bold, Italic, Underline as UnderlineIcon,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Start writing your journal entry...',
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-[#30363d] max-h-[500px] w-full object-cover my-6 shadow-2xl',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[450px] md:px-8 py-8 text-[#c9d1d9] leading-relaxed selection:bg-[#1f6feb]/40 selection:text-white',
      },
    },
  });

  // Sync content when loaded async (e.g. Firestore edit page)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (currentHTML === content) return;
    
    // Use an empty paragraph if content is truly empty to keep the editor usable
    editor.commands.setContent(content || '<p></p>', { emitUpdate: false });
  }, [content, editor]);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setUploading(true);
      setProgress(0);
      try {
        const url = await uploadImage(file, (pct) => setProgress(pct));
        editor.chain().focus().setImage({ src: url }).run();
        editor.chain().focus().insertContent('<p></p>').run();
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setUploading(false);
        setProgress(0);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [editor],
  );

  if (!editor) return null;

  const ToolbarButton = ({
    onClick, isActive, title, children, disabled = false,
  }: {
    onClick: () => void;
    isActive: boolean;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md flex items-center justify-center transition-all duration-200 ${
        isActive
          ? 'bg-[#1f6feb] text-white shadow-sm'
          : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] border border-transparent hover:border-[#30363d]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  const Separator = () => <div className="w-[1px] h-4 bg-[#30363d] mx-1" />;

  return (
    <div className="border border-[#30363d] rounded-xl bg-[#0d1117] overflow-hidden focus-within:border-[#58a6ff] focus-within:ring-1 focus-within:ring-[#58a6ff]/50 transition-all shadow-xl">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10 backdrop-blur-md">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>

        <Separator />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Align Justify"
        >
          <AlignJustify className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onClick={handleImageUpload}
          isActive={false}
          title="Insert Image"
          disabled={uploading}
        >
          {uploading ? (
            <div className="relative w-4 h-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#21262d" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none" stroke="#3fb950" strokeWidth="12"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 - (282.7 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-white">
                {Math.round(progress)}
              </div>
            </div>
          ) : (
            <ImageIcon className="w-4 h-4" strokeWidth={2.5} />
          )}
        </ToolbarButton>
      </div>

      <div className="relative">
        <EditorContent editor={editor} />

        {uploading && (
          <div className="absolute inset-0 bg-[#0d1117]/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
            <div className="relative w-12 h-12 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#21262d" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none" stroke="#3fb950" strokeWidth="8"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 - (282.7 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {Math.round(progress)}%
              </div>
            </div>
            <p className="text-sm font-medium text-white shadow-sm">Uploading photo...</p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-[11px] text-[#8b949e]">
        <span>Rich text · Images autosaved to cloud</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        style={{ display: 'none' }}
      />
    </div>
  );
}
