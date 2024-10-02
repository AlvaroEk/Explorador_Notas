// src/App.tsx

import React, { useState, useEffect } from 'react';
import FileExplorer from './FileExplorer';
import NoteEditor from './NoteEditor';
import ConfirmationDialog from './ConfirmationDialog';
import { FileSystemItem, Folder, Note } from './types';
import { generateId } from './utils';
import './App.css';

const App: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(() => {
    const savedFileSystem = localStorage.getItem('fileSystem');
    return savedFileSystem ? JSON.parse(savedFileSystem) : [];
  });
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [confirmation, setConfirmation] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  // Crear carpeta sin confirmación
  const handleCreateFolder = (parentId: string | null, folderName: string) => {
    const newFolder: Folder = {
      id: generateId(),
      name: folderName,
      type: 'folder',
      children: [],
    };

    const addFolder = () => {
      if (parentId === null) {
        setFileSystem(prev => [...prev, newFolder]);
      } else {
        const updatedFileSystem = addItemToParent(fileSystem, parentId, newFolder);
        setFileSystem(updatedFileSystem);
      }
    };

    addFolder(); // Llamar directamente para crear la carpeta
  };

  // Crear nota sin confirmación
  const handleCreateNote = (parentId: string | null, noteName: string) => {
    const newNote: Note = {
      id: generateId(),
      name: noteName,
      type: 'file',
      content: '',
    };

    const addNote = () => {
      if (parentId === null) {
        setFileSystem(prev => [...prev, newNote]);
      } else {
        const updatedFileSystem = addItemToParent(fileSystem, parentId, newNote);
        setFileSystem(updatedFileSystem);
      }
      setSelectedNote(newNote); // Seleccionar automáticamente la nueva nota
    };

    addNote(); // Llamar directamente para crear la nota
  };

  const addItemToParent = (items: FileSystemItem[], parentId: string, newItem: Folder | Note): FileSystemItem[] => {
    return items.map(item => {
      if (item.type === 'folder') {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...item.children, newItem],
          };
        } else {
          return {
            ...item,
            children: addItemToParent(item.children, parentId, newItem),
          };
        }
      }
      return item;
    });
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSaveNote = (updatedNote: Note) => {
    const saveAction = () => {
      const updatedFileSystem = updateNoteContent(fileSystem, updatedNote);
      setFileSystem(updatedFileSystem);
      setSelectedNote(null); // Cierra el editor
      setConfirmation(null); // Restablecer el estado de confirmación
    };

    setConfirmation({
      message: '¿Estás seguro de que deseas guardar los cambios?',
      onConfirm: saveAction,
    });
  };

  const updateNoteContent = (items: FileSystemItem[], updatedNote: Note): FileSystemItem[] => {
    return items.map(item => {
      if (item.type === 'folder') {
        return {
          ...item,
          children: updateNoteContent(item.children, updatedNote),
        };
      } else if (item.type === 'file') {
        if (item.id === updatedNote.id) {
          return updatedNote;
        }
      }
      return item;
    });
  };

  const handleRenameItem = (itemId: string, newName: string) => {
    const renameAction = () => {
      const updatedFileSystem = renameItem(fileSystem, itemId, newName);
      setFileSystem(updatedFileSystem);
      setConfirmation(null); // Restablecer el estado de confirmación
    };

    // Solicitar confirmación solo para renombrar
    setConfirmation({
      message: `¿Estás seguro de que deseas renombrar a "${newName}"?`,
      onConfirm: renameAction,
    });
  };

  const renameItem = (items: FileSystemItem[], itemId: string, newName: string): FileSystemItem[] => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, name: newName };
      }
      if (item.type === 'folder') {
        return {
          ...item,
          children: renameItem(item.children, itemId, newName),
        };
      }
      return item;
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const deleteAction = () => {
      const updatedFileSystem = deleteItem(fileSystem, itemId);
      setFileSystem(updatedFileSystem);
      // Si la nota eliminada es la seleccionada, cerrar el editor
      if (selectedNote && selectedNote.id === itemId) {
        setSelectedNote(null);
      }
      setConfirmation(null); // Restablecer el estado de confirmación
    };

    // Solicitar confirmación solo para eliminar
    setConfirmation({
      message: '¿Estás seguro de que deseas eliminar este ítem?',
      onConfirm: deleteAction,
    });
  };

  const deleteItem = (items: FileSystemItem[], itemId: string): FileSystemItem[] => {
    return items
      .filter(item => item.id !== itemId)
      .map(item => {
        if (item.type === 'folder') {
          return {
            ...item,
            children: deleteItem(item.children, itemId),
          };
        }
        return item;
      });
  };

  const handleCloseConfirmation = () => {
    setConfirmation(null); // Restablecer el estado de confirmación
  };

  return (
    <div className="app-container">
      <div className="file-explorer-container">
        <FileExplorer
          fileSystem={fileSystem}
          onCreateFolder={handleCreateFolder}
          onCreateNote={handleCreateNote}
          onSelectNote={handleSelectNote}
          onDeleteItem={handleDeleteItem}
          onRenameItem={handleRenameItem}
        />
      </div>

      <div className="note-editor-container">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onClose={() => setSelectedNote(null)} // Para cerrar sin guardar
          />
        ) : (
          <div className="no-note-selected">Selecciona una nota para editarla.</div>
        )}
      </div>

      {/* Diálogo de Confirmación */}
      {confirmation && (
        <ConfirmationDialog
          message={confirmation.message}
          onConfirm={() => {
            confirmation.onConfirm();
            setConfirmation(null); // Restablecer el estado de confirmación
          }}
          onCancel={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

export default App;
