'use client';

import { useState, useCallback, useRef } from 'react';
import { DateRange, NoteEntry, formatDate } from '@/lib/calendarUtils';

interface NotesPanelProps {
  notes: NoteEntry[];
  selectedRange: DateRange;
  onAddNote: (text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onReorderNotes: (reordered: NoteEntry[]) => void;
  theme: 'light' | 'dark';
  accentColor: string;
}

export default function NotesPanel({
  notes,
  selectedRange,
  onAddNote,
  onDeleteNote,
  onReorderNotes,
  theme,
  accentColor,
}: NotesPanelProps) {
  const [noteText, setNoteText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragNodeRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  const handleSubmit = () => {
    if (!noteText.trim()) return;
    onAddNote(noteText.trim());
    setNoteText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = useCallback((noteId: string) => {
    setDeletingId(noteId);
    setTimeout(() => {
      onDeleteNote(noteId);
      setDeletingId(null);
    }, 400);
  }, [onDeleteNote]);

  const handleDragStart = (e: React.DragEvent, idx: number, noteId: string) => {
    dragNodeRef.current = idx;
    setDragId(noteId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', noteId);
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragNodeRef.current === null || dragNodeRef.current === idx) return;

    const reordered = [...notes];
    const fromIdx = dragNodeRef.current;
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(idx, 0, moved);

    onReorderNotes(reordered);
    dragNodeRef.current = idx;
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    resetDrag();
  };
  const resetDrag = () => {
    dragNodeRef.current = null;
    setDragId(null);
  };

  const hasRange = selectedRange.start && selectedRange.end;

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div
      className="h-full px-4 py-4 md:px-5 border-t lg:border-t-0 lg:border-r font-display"
      style={{ borderColor: isDark ? '#3a3a40' : '#e8e4df' }}
    >
      
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: isDark ? '#666' : '#aaa' }}>
          Notes
        </h3>
        {notes.length > 0 && (
          <span className="text-[9px] px-1.5 rounded-full"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
            {notes.length}
          </span>
        )}
      </div>

      {hasRange && (
        <div className="mb-3 text-[9px] font-medium" style={{ color: accentColor }}>
          {formatDate(selectedRange.start! <= selectedRange.end! ? selectedRange.start! : selectedRange.end!)}
          {' → '}
          {formatDate(selectedRange.start! <= selectedRange.end! ? selectedRange.end! : selectedRange.start!)}
        </div>
      )}

      <div className="mb-4 flex items-end gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasRange ? 'Note for range...' : 'Add a note...'}
            className="w-full bg-transparent border-0 border-b-[1.5px] outline-none text-sm py-1.5 px-0
              transition-colors duration-200 placeholder:text-gray-400"
            style={{
              borderBottomColor: noteText ? accentColor : isDark ? '#3a3a40' : '#ddd8d2',
              color: isDark ? '#e8e4df' : '#2d2d2d',
            }}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderBottomColor = accentColor; }}
            onBlur={(e) => { if (!noteText) (e.target as HTMLInputElement).style.borderBottomColor = isDark ? '#3a3a40' : '#ddd8d2'; }}
            aria-label="Note input"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!noteText.trim()}
          className="flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 pb-1.5"
          style={{
            color: noteText.trim() ? accentColor : isDark ? '#444' : '#ccc',
            cursor: noteText.trim() ? 'pointer' : 'default',
          }}
          title="Add note (Enter)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 2v12M2 8h12"/>
          </svg>
        </button>
      </div>

      <div className="space-y-4 max-h-56 lg:max-h-72 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
        {notes.length === 0 ? (
          <p className="text-[10px] italic py-3" style={{ color: isDark ? '#555' : '#ccc' }}>
            No notes yet
          </p>
        ) : (
          notes.map((note, idx) => (
            <div
              key={note.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx, note.id)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={handleDrop}
              onDragEnd={resetDrag}
              className={`group relative transition-all duration-300 cursor-grab active:cursor-grabbing ${
                deletingId === note.id ? 'note-deleting' : ''
              } ${dragId === note.id ? 'opacity-30 scale-95 shadow-md z-10' : ''}`}
            >
              <div
                className="pl-3 py-1.5 border-l-2 transition-colors duration-200"
                style={{
                  borderLeftColor: isDark ? '#3a3a40' : '#e0dbd4',
                }}
              >
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-[13px] leading-relaxed whitespace-pre-wrap"
                    style={{ color: isDark ? '#c8c4c0' : '#444' }}>
                    {note.text}
                  </p>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                    className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity duration-150 flex-shrink-0 mt-0.5 p-1 -mr-1"
                    style={{ color: isDark ? '#f87171' : '#d44' }}
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4l8 8M12 4l-8 8"/>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                  {note.rangeStart && note.rangeEnd && (
                    <span className="text-[10px]" style={{ color: accentColor }}>
                      {formatDate(new Date(note.rangeStart))} – {formatDate(new Date(note.rangeEnd))}
                    </span>
                  )}
                  <span className="text-[10px]" style={{ color: isDark ? '#555' : '#aaa' }}>
                    {timeAgo(note.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notes.length > 0 && (
        <p className="mt-2 text-[9px] text-center" style={{ color: isDark ? '#3a3a40' : '#ddd' }}>
          hover to delete · drag to reorder
        </p>
      )}
    </div>
  );
}
