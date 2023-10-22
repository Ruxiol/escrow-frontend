import React, { useEffect } from 'react';
import '../App.css'; // Ako se CSS ne nalazi u App.css, zamijenite s pravim putem

const Modal = ({ isOpen, onClose, children }) => {

    // Zatvaranje modalnog prozora pomoću tipke "Escape"
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        // Čišćenje event listenera kad komponenta nije montirana
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    // Funkcija za zatvaranje modalnog prozora ako korisnik klikne izvan sadržaja modala
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;

