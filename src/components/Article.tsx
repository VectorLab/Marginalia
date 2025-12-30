import React, { useRef, useEffect, useState, useMemo } from "react";

import parse, { DOMNode, Text } from "html-react-parser";
import { marked } from "marked";

import styles from "./Article.module.css";

type Note = {
  id: number;
  context: string | null;
  content: string;
};

type ArticleProps = {
  content: string;
  notes: Note[];
};

type NotePosition = {
  id: number;
  top: number;
  content: string;
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Article({ content, notes }: ArticleProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [notePositions, setNotePositions] = useState<NotePosition[]>([]);

  const htmlContent = useMemo(
    () => marked.parse(content, { async: false }) as string,
    [content],
  );

  const notesWithContext = useMemo(
    () => notes.filter((n): n is Note & { context: string } => !!n.context),
    [notes],
  );

  const contextMap = useMemo(
    () => new Map(notesWithContext.map((n) => [n.context, n])),
    [notesWithContext],
  );

  const contextRegex = useMemo(() => {
    if (notesWithContext.length === 0) return null;
    const escaped = notesWithContext
      .map((n) => escapeRegex(n.context))
      .join("|");
    return new RegExp(`(${escaped})([.,;:!?'"）】」』\\s]*)`, "g");
  }, [notesWithContext]);

  useEffect(() => {
    if (!contentRef.current) return;

    const calculatePositions = () => {
      const triggers = contentRef.current?.querySelectorAll("[data-note-id]");
      if (!triggers) return;

      const containerRect = contentRef.current!.getBoundingClientRect();
      const positions: NotePosition[] = [];

      for (const trigger of triggers) {
        const noteId = parseInt(
          trigger.getAttribute("data-note-id") || "0",
          10,
        );
        const note = notes.find((n) => n.id === noteId);
        if (!note) continue;

        const rect = trigger.getBoundingClientRect();
        positions.push({
          id: noteId,
          top: rect.top - containerRect.top,
          content: note.content,
        });
      }

      setNotePositions(positions);
    };

    const frame = requestAnimationFrame(calculatePositions);
    return () => cancelAnimationFrame(frame);
  }, [htmlContent, notes]);

  const options = useMemo(
    () => ({
      replace: (domNode: DOMNode) => {
        if (!(domNode instanceof Text) || !contextRegex) return;

        const text = domNode.data;
        const hasMatch = notesWithContext.some((n) => text.includes(n.context));
        if (!hasMatch) return;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        for (const match of text.matchAll(contextRegex)) {
          const [, context, punct] = match;
          const note = contextMap.get(context);
          if (!note || match.index === undefined) continue;

          if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
          }

          parts.push(
            <React.Fragment key={`${note.id}-${match.index}`}>
              <span className={styles.trigger} data-note-id={note.id}>
                {context}
              </span>
              {punct}
              <span className={styles.inlineNote}>{note.content}</span>
            </React.Fragment>,
          );

          lastIndex = match.index + context.length + punct.length;
        }

        if (lastIndex < text.length) {
          parts.push(text.slice(lastIndex));
        }

        return parts.length > 0 ? <>{parts}</> : undefined;
      },
    }),
    [contextRegex, contextMap, notesWithContext],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} ref={contentRef}>
        {parse(htmlContent, options)}
      </div>

      <aside className={styles.marginColumn} aria-label="Marginalia">
        {notePositions.map((pos) => (
          <div key={pos.id} className={styles.note} style={{ top: pos.top }}>
            {pos.content}
          </div>
        ))}
      </aside>
    </div>
  );
}
