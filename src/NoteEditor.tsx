import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Editor de texto enriquecido
import 'react-quill/dist/quill.snow.css'; // Estilos de Quill

interface File {
  name: string;
  content: string;
}

interface NoteEditorProps {
  file: File | null;
  onSave: (updatedFile: File) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ file, onSave }) => {
  const [content, setContent] = useState(file ? file.content : '');

  useEffect(() => {
    if (file) {
      setContent(file.content);
    } else {
      setContent('');
    }
  }, [file]);

  if (!file) {
    return <div>Selecciona un archivo para editarlo.</div>;
  }

  const saveChanges = () => {
    if (!file) return;
    onSave({ ...file, content });
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
      <h2>Editando: {file.name}</h2>
      <ReactQuill value={content} onChange={setContent} modules={modules} theme="snow" />
      <button onClick={saveChanges} style={{ marginTop: '10px', padding: '5px 10px' }}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default NoteEditor;
