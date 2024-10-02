// src/types.ts

export interface FileBase {
    id: string;
    name: string;
    type: 'folder' | 'file';
  }
  
  export interface Folder extends FileBase {
    type: 'folder';
    children: Array<Folder | Note>;
  }
  
  export interface Note extends FileBase {
    type: 'file';
    content: string;
  }
  
  export type FileSystemItem = Folder | Note;
  