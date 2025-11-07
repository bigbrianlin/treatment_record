import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import styles from "./TiptapEditor.module.css";
import Button from "@/components/ui/Button/Button";

import { Bold, Italic, Strikethrough, List, ListOrdered } from "lucide-react";

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const iconSize = 18;

  return (
    <div className={styles.toolbar}>
      {/* Bold Button */}
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        <Bold size={iconSize} />
      </Button>

      {/* Italic Button */}
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        <Italic size={iconSize} />
      </Button>

      {/* Strike Button */}
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        <Strikethrough size={iconSize} />
      </Button>

      {/* Bullet List Button */}
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        <List size={iconSize} />
      </Button>

      {/* Ordered List Button */}
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        <ListOrdered size={iconSize} />
      </Button>
    </div>
  );
};

/**
 * Basic Tiptap Editor component
 * @param {object} props
 * @param {string} props.value - Editor initial content
 * @param {function} props.onChange - Callback when content changes
 */
export default function TiptapEditor({ value, onChange }) {
  // Create a dummy state. Its only purpose is to trigger a re-render.
  const [, setForceRender] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Click to edit...",
      }),
    ],
    content: value,

    // Prevent immediate rendering to avoid flicker
    immediatelyRender: false,

    // Update parent component on content change
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    // onTransaction triggers on *any* state change (incl. selection, stored marks)
    onTransaction: () => {
      // Call setState to force a re-render of this component,
      // which in turn re-renders the Toolbar and re-evaluates editor.isActive()
      setForceRender(Math.random());
    },
  });

  return (
    <div className={styles.editorContainer}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
}
