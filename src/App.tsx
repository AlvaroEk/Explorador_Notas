// src/App.tsx
import React, { useState, useEffect } from 'react';
import FileExplorer from './FileExplorer';
import NoteEditor from './NoteEditor';
import { FileSystemItem, Folder, Note } from './types';
import { generateId } from './utils';

const App: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(() => {
    const savedFileSystem = localStorage.getItem('fileSystem');
    return savedFileSystem ? JSON.parse(savedFileSystem) : [];
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Guardar el sistema de archivos en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  // Función para crear una nueva carpeta
  const handleCreateFolder = (parentId: string | null, folderName: string) => {
    const newFolder: Folder = {
      id: generateId(),
      name: folderName,
      type: 'folder',
      children: [],
    };
    setFileSystem(prev => addItem(prev, parentId, newFolder));
  };

  // Función para crear una nueva nota
  const handleCreateNote = (parentId: string | null, noteName: string) => {
    const newNote: Note = {
      id: generateId(),
      name: noteName,
      type: 'file',
      content: '',
    };
    setFileSystem(prev => addItem(prev, parentId, newNote));
    setSelectedNote(newNote);
  };

  // Función para agregar un ítem al sistema de archivos
  const addItem = (
    items: FileSystemItem[],
    parentId: string | null,
    newItem: FileSystemItem
  ): FileSystemItem[] => {
    if (parentId === null) {
      return [...items, newItem];
    }

    return items.map(item => {
      if (item.type === 'folder' && item.id === parentId) {
        return {
          ...item,
          children: [...item.children, newItem],
        };
      } else if (item.type === 'folder') {
        return {
          ...item,
          children: addItem(item.children, parentId, newItem),
        };
      }
      return item;
    });
  };

  // Función para seleccionar una nota
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  // Función para guardar cambios en una nota
  const handleSaveNote = (updatedNote: Note) => {
    setFileSystem(prev => updateNote(prev, updatedNote));
    setSelectedNote(updatedNote);
  };

  // Función para actualizar una nota en el sistema de archivos
  const updateNote = (items: FileSystemItem[], updatedNote: Note): FileSystemItem[] => {
    return items.map(item => {
      if (item.type === 'file' && item.id === updatedNote.id) {
        return updatedNote;
      } else if (item.type === 'folder') {
        return {
          ...item,
          children: updateNote(item.children, updatedNote),
        };
      }
      return item;
    });
  };

  return (
    <div>
      <h1>Explorador de Archivos y Editor de Notas</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Explorador de archivos */}
        <div style={{ width: '30%' }}>
          <FileExplorer
            fileSystem={fileSystem}
            onCreateFolder={handleCreateFolder}
            onCreateNote={handleCreateNote}
            onSelectNote={handleSelectNote}
          />
        </div>

        {/* Editor de notas */}
        <div style={{ width: '70%' }}>
          <NoteEditor note={selectedNote} onSave={handleSaveNote} />
        </div>
      </div>
    </div>
  );
};

export default App;
