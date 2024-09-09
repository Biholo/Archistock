import React from "react";
import "./RemoveProfileModal.scss"

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveProfileModal({ isVisible, onClose, onConfirm }: ModalProps) {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Êtes-vous sûr de résilier votre abonnement ?</h2>
        <p>Vous perdrez l'ensemble de vos documents et votre compte sera supprimé.</p>
        <div className="modal-actions">
          <button className="btn confirm" onClick={onConfirm}>
            Confirmer
          </button>
          <button className="btn cancel" onClick={onClose}>
            Annulé
          </button>
        </div>
      </div>
    </div>
  );
}
