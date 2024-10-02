// src/ConfirmationDialog.tsx

import React from 'react';
import './ConfirmationDialog.css'; // Asegúrate de crear este archivo de estilos

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div className="dialog-buttons">
          <button onClick={onConfirm} className="confirm-button">Confirmar</button>
          <button onClick={onCancel} className="cancelar-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
