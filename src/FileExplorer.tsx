// src/FileExplorer.tsx
import React, { useState } from 'react';
import { FileSystemItem, Folder, Note } from './types';

interface FileExplorerProps {
  fileSystem: FileSystemItem[];
  onCreateFolder: (parentId: string | null, folderName: string) => void;
  onCreateNote: (parentId: string | null, noteName: string) => void;
  onSelectNote: (note: Note) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileSystem,
  onCreateFolder,
  onCreateNote,
  onSelectNote,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [parentIdForNewFolder, setParentIdForNewFolder] = useState<string | null>(null);
  const [parentIdForNewNote, setParentIdForNewNote] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNoteName, setNewNoteName] = useState('');

  // Función para alternar la expansión de carpetas
  const toggleFolder = (folderId: string) => {
    const newExpandedFolders = new Set(expandedFolders);
    if (newExpandedFolders.has(folderId)) {
      newExpandedFolders.delete(folderId);
    } else {
      newExpandedFolders.add(folderId);
    }
    setExpandedFolders(newExpandedFolders);
  };

  // Función para renderizar el árbol de archivos y carpetas
  const renderFileSystem = (items: FileSystemItem[], parentId: string | null = null) => {
    return (
      <ul style={{ listStyleType: 'none', paddingLeft: parentId ? '20px' : '0' }}>
        {items.map(item => (
          <li key={item.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {item.type === 'folder' ? (
                <>
                  <span
                    onClick={() => toggleFolder(item.id)}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                  >
                    {expandedFolders.has(item.id) ? '📂' : '📁'}
                  </span>
                  <span onClick={() => toggleFolder(item.id)} style={{ cursor: 'pointer' }}>
                    {item.name}
                  </span>
                </>
              ) : (
                <span
                  onClick={() => onSelectNote(item)}
                  style={{ cursor: 'pointer', marginLeft: '20px' }}
                >
                  📝 {item.name}
                </span>
              )}
            </div>
            {item.type === 'folder' && expandedFolders.has(item.id) && (
              <>
                {renderFileSystem(item.children, item.id)}
                {/* Botones para crear carpetas y notas dentro de la carpeta */}
                <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                  <button onClick={() => setParentIdForNewFolder(item.id)}>+ Carpeta</button>
                  <button onClick={() => setParentIdForNewNote(item.id)} style={{ marginLeft: '5px' }}>
                    + Nota
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Función para manejar la creación de carpetas
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return alert('El nombre de la carpeta no puede estar vacío.');
    onCreateFolder(parentIdForNewFolder, newFolderName.trim());
    setNewFolderName('');
    setParentIdForNewFolder(null);
  };

  // Función para manejar la creación de notas
  const handleCreateNote = () => {
    if (!newNoteName.trim()) return alert('El nombre de la nota no puede estar vacío.');
    onCreateNote(parentIdForNewNote, newNoteName.trim());
    setNewNoteName('');
    setParentIdForNewNote(null);
  };

  return (
    <div>
      <h2>Explorador de Archivos</h2>

      {/* Renderizar el sistema de archivos */}
      {renderFileSystem(fileSystem)}

      {/* Formulario para crear una nueva carpeta en el nivel raíz */}
      <div style={{ marginTop: '20px' }}>
        <h3>Crear Nueva Carpeta</h3>
        <input
          type="text"
          placeholder="Nombre de la carpeta"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCreateFolder();
            }
          }}
          style={{ padding: '5px', width: '70%', marginRight: '5px' }}
        />
        <button onClick={handleCreateFolder} style={{ padding: '5px 10px' }}>
          Crear Carpeta
        </button>
      </div>

      {/* Formulario para crear una nueva nota en el nivel raíz */}
      <div style={{ marginTop: '10px' }}>
        <h3>Crear Nueva Nota</h3>
        <input
          type="text"
          placeholder="Nombre de la nota"
          value={newNoteName}
          onChange={e => setNewNoteName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCreateNote();
            }
          }}
          style={{ padding: '5px', width: '70%', marginRight: '5px' }}
        />
        <button onClick={handleCreateNote} style={{ padding: '5px 10px' }}>
          Crear Nota
        </button>
      </div>

      {/* Formularios para crear carpetas y notas dentro de carpetas */}
      {parentIdForNewFolder && (
        <div style={{ marginTop: '10px' }}>
          <h3>Crear Carpeta en la Carpeta Seleccionada</h3>
          <input
            type="text"
            placeholder="Nombre de la carpeta"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
            style={{ padding: '5px', width: '70%', marginRight: '5px' }}
          />
          <button onClick={handleCreateFolder} style={{ padding: '5px 10px' }}>
            Crear Carpeta
          </button>
          <button onClick={() => setParentIdForNewFolder(null)} style={{ marginLeft: '5px' }}>
            Cancelar
          </button>
        </div>
      )}

      {parentIdForNewNote && (
        <div style={{ marginTop: '10px' }}>
          <h3>Crear Nota en la Carpeta Seleccionada</h3>
          <input
            type="text"
            placeholder="Nombre de la nota"
            value={newNoteName}
            onChange={e => setNewNoteName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCreateNote();
              }
            }}
            style={{ padding: '5px', width: '70%', marginRight: '5px' }}
          />
          <button onClick={handleCreateNote} style={{ padding: '5px 10px' }}>
            Crear Nota
          </button>
          <button onClick={() => setParentIdForNewNote(null)} style={{ marginLeft: '5px' }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
