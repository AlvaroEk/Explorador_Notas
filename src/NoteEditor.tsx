// src/NoteEditor.tsx

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Editor de texto enriquecido
import 'react-quill/dist/quill.snow.css'; // Estilos de Quill
import { Note } from './types';
import './NoteEditor.css'; // Asegúrate de que este archivo esté importado

interface NoteEditorProps {
  note: Note | null;
  onSave: (updatedNote: Note) => void;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose }) => {
  const [content, setContent] = useState(note ? note.content : '');

  // Actualizar el contenido cuando cambia la nota seleccionada
  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
  }, [note]);

  if (!note) {
    return <div className="no-note-selected-message">Selecciona una nota para editarla.</div>;
  }

  // Función para guardar los cambios realizados en la nota y cerrar el editor.
  const saveChanges = () => {
    if (!note) return;
    onSave({ ...note, content });
  };

  // Configuración de la barra de herramientas de Quill
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

  // Opciones de formatos disponibles
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'align',
    'list', 'bullet',
    'indent',
    'size',
    'color', 'background',
  ];

  return (
    <div className="note-editor">
      <h2 className="editor-title">Editando: {note.name}</h2>
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        theme="snow"
        className="quill-editor"
      />
      <div className="editor-buttons">
        <button onClick={saveChanges} className="save-button">
            Guardar Cambios
        </button>
        <button onClick={onClose} className="cancel-button">
            Cancelar
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
