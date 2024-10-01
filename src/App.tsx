import React, { useState, useEffect } from 'react';
import FileExplorer from './FileExplorer';
import NoteEditor from './NoteEditor';

interface File {
  name: string;
  content: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>(() => {
    const savedFiles = localStorage.getItem('files');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Guardar los archivos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  // Crear un nuevo archivo y seleccionarlo
  const handleCreateFile = (file: File) => {
    setFiles(prevFiles => [...prevFiles, file]);
    setSelectedFile(file); // Seleccionar el nuevo archivo automáticamente
  };

  // Guardar cambios en un archivo
  const handleSaveFile = (updatedFile: File) => {
    setFiles(prevFiles =>
      prevFiles.map(file => (file.name === updatedFile.name ? updatedFile : file))
    );
    setSelectedFile(null); // Opcional: Limpiar la selección después de guardar
  };

  return (
    <div>
      <h1>Explorador de Archivos y Editor de Notas</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Explorador de archivos */}
        <div style={{ width: '30%' }}>
          <FileExplorer
            files={files}
            onFileSelect={setSelectedFile}
            onCreateFile={handleCreateFile}
            selectedFile={selectedFile} // Pasar el archivo seleccionado para resaltar
          />
        </div>

        {/* Editor de notas */}
        <div style={{ width: '70%' }}>
          <NoteEditor file={selectedFile} onSave={handleSaveFile} />
        </div>
      </div>
    </div>
  );
};

export default App;
