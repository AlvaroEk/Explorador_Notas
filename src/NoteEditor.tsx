// src/NoteEditor.tsx
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Editor de texto enriquecido
import 'react-quill/dist/quill.snow.css'; // Estilos de Quill
import { Note } from './types';

interface NoteEditorProps {
  note: Note | null;
  onSave: (updatedNote: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave }) => {
  const [content, setContent] = useState(note ? note.content : '');

  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
  }, [note]);

  if (!note) {
    return <div>Selecciona una nota para editarla.</div>;
  }

  const saveChanges = () => {
    if (!note) return;
    onSave({ ...note, content });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
  };

  return (
    <div>
      <h2>Editando: {note.name}</h2>
      <ReactQuill value={content} onChange={setContent} modules={modules} theme="snow" />
      <button onClick={saveChanges} style={{ marginTop: '10px', padding: '5px 10px' }}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default NoteEditor;
