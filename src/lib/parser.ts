export function parseMarginalia(rawContent: string) {
  const NOTE_REGEX = /\|\|(.*?)\|\|\((.*?)\)/g;
  const notes: { context: string; content: string }[] = [];

  const cleanContent = rawContent.replace(
    NOTE_REGEX,
    (match, context, noteContent) => {
      notes.push({ context, content: noteContent });
      return context;
    },
  );

  return { cleanContent, notes };
}
