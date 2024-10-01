import React, { useState } from 'react';

interface File {
  name: string;
  content: string;
}

interface FileExplorerProps {
  files: File[];
  onFileSelect: (file: File) => void;
  onCreateFile: (file: File) => void;
  selectedFile: File | null; // Nueva prop para el archivo seleccionado
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, onCreateFile, selectedFile }) => {
  const [newFileName, setNewFileName] = useState('');

  // Crear un nuevo archivo
  const createNewFile = () => {
    if (!newFileName.trim()) return alert('El nombre del archivo no puede estar vacío.');

    // Verificar si el nombre del archivo ya existe
    if (files.some(file => file.name === newFileName.trim())) {
      return alert('Ya existe un archivo con ese nombre.');
    }

    const newFile: File = { name: newFileName.trim(), content: '' };
    onCreateFile(newFile);
    setNewFileName('');
  };

  return (
    <div>
      <h2>Explorador de Archivos</h2>

      {/* Listado de archivos */}
      <ul>
        {files.map(file => (
          <li
            key={file.name}
            onClick={() => onFileSelect(file)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedFile?.name === file.name ? '#e0e0e0' : 'transparent',
              padding: '5px',
              borderRadius: '4px',
              marginBottom: '5px',
            }}
          >
            {file.name}
          </li>
        ))}
      </ul>

      {/* Crear un nuevo archivo */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Nombre del archivo"
          value={newFileName}
          onChange={e => setNewFileName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              createNewFile();
            }
          }}
          style={{ padding: '5px', width: '70%', marginRight: '5px' }}
        />
        <button onClick={createNewFile} style={{ padding: '5px 10px' }}>
          Crear Archivo
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
