// src/FileExplorer.tsx
import React, { useState } from 'react';
import { FileSystemItem, Folder, Note } from './types';
import './FileExplorer.css';

interface FileExplorerProps {
  fileSystem: FileSystemItem[];
  onCreateFolder: (parentId: string | null, folderName: string) => void;
  onCreateNote: (parentId: string | null, noteName: string) => void;
  onSelectNote: (note: Note) => void;
  onDeleteItem: (id: string) => void;
  onRenameItem: (id: string, newName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileSystem,
  onCreateFolder,
  onCreateNote,
  onSelectNote,
  onDeleteItem,
  onRenameItem,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [parentIdForNewFolder, setParentIdForNewFolder] = useState<string | null>(null);
  const [parentIdForNewNote, setParentIdForNewNote] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNoteName, setNewNoteName] = useState('');
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
  const [renamingItemName, setRenamingItemName] = useState<string>('');

  /**
   * Alterna la expansión de una carpeta en el explorador.
   * @param folderId - ID de la carpeta a expandir o contraer.
   */
  const toggleFolder = (folderId: string) => {
    const newExpandedFolders = new Set(expandedFolders);
    if (newExpandedFolders.has(folderId)) {
      newExpandedFolders.delete(folderId);
    } else {
      newExpandedFolders.add(folderId);
    }
    setExpandedFolders(newExpandedFolders);
  };

  /**
   * Inicia el proceso de renombrar un ítem.
   * @param itemId - ID del ítem a renombrar.
   * @param currentName - Nombre actual del ítem.
   */
  const startRename = (itemId: string, currentName: string) => {
    setRenamingItemId(itemId);
    setRenamingItemName(currentName);
  };

  /**
   * Cancela el proceso de renombrar un ítem.
   */
  const cancelRename = () => {
    setRenamingItemId(null);
    setRenamingItemName('');
  };

  /**
   * Maneja el renombramiento de un ítem.
   * @param itemId - ID del ítem a renombrar.
   */
  const handleRename = (itemId: string) => {
    if (!renamingItemName.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }
    onRenameItem(itemId, renamingItemName.trim());
    cancelRename();
  };

  /**
   * Maneja la creación de una nueva carpeta.
   */
  const handleCreateFolderClick = () => {
    if (!newFolderName.trim()) return alert('El nombre de la carpeta no puede estar vacío.');
    onCreateFolder(parentIdForNewFolder, newFolderName.trim());
    setNewFolderName('');
    setParentIdForNewFolder(null);
  };

  /**
   * Maneja la creación de una nueva nota.
   */
  const handleCreateNoteClick = () => {
    if (!newNoteName.trim()) return alert('El nombre de la nota no puede estar vacío.');
    onCreateNote(parentIdForNewNote, newNoteName.trim());
    setNewNoteName('');
    setParentIdForNewNote(null);
  };

  /**
   * Renderiza recursivamente el sistema de archivos como una lista de carpetas y notas.
   * @param items - Lista de ítems (carpetas o notas) a renderizar.
   * @returns {JSX.Element} - Lista no ordenada de ítems.
   */
  const renderFileSystem = (items: FileSystemItem[]) => {
    return (
      <ul className="file-system-list">
        {items.map(item => (
          <li key={item.id} className="file-system-item">
            <div className="item-header">
              <div className="item-info">
                {item.type === 'folder' ? (
                  <>
                    <span
                      onClick={() => toggleFolder(item.id)}
                      className="folder-icon"
                    >
                      {expandedFolders.has(item.id) ? '📂' : '📁'}
                    </span>
                    {renamingItemId === item.id ? (
                      <input
                        type="text"
                        value={renamingItemName}
                        onChange={(e) => setRenamingItemName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(item.id);
                          }
                        }}
                        onBlur={() => cancelRename()}
                        autoFocus
                        className="rename-input"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startRename(item.id, item.name)}
                        className="item-name"
                      >
                        {item.name}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => onSelectNote(item)}
                      className="note-icon"
                    >
                      📝
                    </span>
                    {renamingItemId === item.id ? (
                      <input
                        type="text"
                        value={renamingItemName}
                        onChange={(e) => setRenamingItemName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(item.id);
                          }
                        }}
                        onBlur={() => cancelRename()}
                        autoFocus
                        className="rename-input"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startRename(item.id, item.name)}
                        className="item-name" // Agregar aquí para que el nombre se muestre
                      >
                        {item.name} {/* Agregar nombre de la nota */}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="item-actions">
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="action-button delete-button"
                >
                  🗑️
                </button>
                <button
                  onClick={() => startRename(item.id, item.name)}
                  className="action-button rename-button"
                >
                  ✏️
                </button>
              </div>
            </div>

            {item.type === 'folder' && expandedFolders.has(item.id) && (
              <>
                {renderFileSystem(item.children)}
                {/* Botones para crear carpetas y notas dentro de la carpeta */}
                <div className="create-buttons">
                  <button onClick={() => setParentIdForNewFolder(item.id)} className="create-button">
                    + Carpeta
                  </button>
                  <button onClick={() => setParentIdForNewNote(item.id)} className="create-button">
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

  return (
    <div className="file-explorer">
      <h2 className="section-title">Explorador de Archivos</h2>

      {/* Renderizar el sistema de archivos */}
      {renderFileSystem(fileSystem)}

      {/* Formulario para crear una nueva carpeta en el nivel raíz */}
      <div className="create-form">
        <h3 className="form-title">Crear Nueva Carpeta</h3>
        <input
          type="text"
          placeholder="Nombre de la carpeta"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCreateFolderClick();
            }
          }}
          className="input-field"
        />
        <button onClick={handleCreateFolderClick} className="create-button">
          Crear Carpeta
        </button>
      </div>

      {/* Formulario para crear una nueva nota en el nivel raíz */}
      <div className="create-form">
        <h3 className="form-title">Crear Nueva Nota</h3>
        <input
          type="text"
          placeholder="Nombre de la nota"
          value={newNoteName}
          onChange={e => setNewNoteName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCreateNoteClick();
            }
          }}
          className="input-field"
        />
        <button onClick={handleCreateNoteClick} className="create-button">
          Crear Nota
        </button>
      </div>

      {/* Formularios para crear carpetas y notas dentro de carpetas */}
      {parentIdForNewFolder && (
        <div className="create-form nested">
          <h3 className="form-title">Crear Carpeta en la Carpeta Seleccionada</h3>
          <input
            type="text"
            placeholder="Nombre de la carpeta"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCreateFolderClick();
              }
            }}
            className="input-field"
          />
          <button onClick={handleCreateFolderClick} className="create-button">
            Crear Carpeta
          </button>
        </div>
      )}
      {parentIdForNewNote && (
        <div className="create-form nested">
          <h3 className="form-title">Crear Nota en la Carpeta Seleccionada</h3>
          <input
            type="text"
            placeholder="Nombre de la nota"
            value={newNoteName}
            onChange={e => setNewNoteName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCreateNoteClick();
              }
            }}
            className="input-field"
          />
          <button onClick={handleCreateNoteClick} className="create-button">
            Crear Nota
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
