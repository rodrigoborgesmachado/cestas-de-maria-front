import React, { useState } from "react";
import "./BasketDeliveryModal.css";
import { maskPhone } from "../../../../utils/masks";
import ConfirmModal from "../../../common/Modals/ConfirmModal/ConfirmModal";

const BasketDeliveryModal = ({ 
    isOpen,
    delivery, 
    onClose, 
    onContactMade, 
    onConfirmAttendence,
    onConfirmDelivery, 
    onConfirmAbsence, 
    onChangeFamily 
}) => {
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, data: null, message: "" });
    
    if (!isOpen) return null;

    const handleConfirmAction = (action, message, data = null) => {
        setConfirmModal({
            isOpen: true,
            action,
            data,
            message
        });
    };

    const handleConfirmYes = () => {
        if (confirmModal.action) {
            confirmModal.action(confirmModal.data);
        }
        setConfirmModal({ isOpen: false, action: null, data: null, message: "" });
    };

    const handleConfirmNo = () => {
        setConfirmModal({ isOpen: false, action: null, data: null, message: "" });
    };

    return (
        <>
            {/* Confirmation Modal */}
            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                title="Confirmação"
                message={confirmModal.message}
                onYes={handleConfirmYes}
                onNo={handleConfirmNo}
            />

            <div className="modal-backdrop">
                <div className="modal-container">
                    <button className="close-button" onClick={onClose}>×</button>
                    <div className="modal-confirm-delivery">
                        <h2>{delivery.Families.Name}</h2>

                        {/* Options based on status */}
                        {delivery.Families.Familystatus.Id === 4 ? (
                            <div className="modal-actions">
                                <button 
                                    className="modal-button" 
                                    onClick={() => handleConfirmAction(
                                        onConfirmAttendence, 
                                        "Essa ação coloca a família em atendimento. Deseja realmente avançar?"
                                    )}
                                >
                                    Colocar em Atendimento
                                </button>
                                <button 
                                    className="modal-button" 
                                    onClick={() => handleConfirmAction(
                                        onChangeFamily, 
                                        "Deseja realmente substituir essa família?"
                                    )}
                                >
                                    Selecionar outra família
                                </button>
                            </div>
                        ) : (
                            <>
                                {delivery.Basketdeliverystatus.Id === 1 ? (
                                    <div className="modal-actions">
                                        <p className="alert-text">
                                            Deve ser feito contato com a família com o seguinte telefone: 
                                            <strong 
                                                className="option-link" 
                                                onClick={() => window.open(`https://wa.me/${delivery.Families.Phone.replace(/\D/g, '')}`, '_blank')}
                                            >
                                                {maskPhone(delivery.Families.Phone)}
                                            </strong>
                                        </p>
                                        <div className="right-component">
                                            <button 
                                                className="modal-button" 
                                                onClick={() => handleConfirmAction(
                                                    onContactMade, 
                                                    'O status agora será "Solicitado". Deseja realmente avançar?'
                                                )}
                                            >
                                                Confirmar Contato
                                            </button>
                                        </div>
                                    </div>
                                ) : delivery.Basketdeliverystatus.Id === 2 ? (
                                    <div className="modal-actions">
                                        <button 
                                            className="modal-button confirm" 
                                            onClick={() => handleConfirmAction(
                                                onConfirmDelivery, 
                                                "Essa ação confirma o recebimento da cesta. Deseja realmente avançar?"
                                            )}
                                        >
                                            Confirmar Entrega
                                        </button>
                                        <button 
                                            className="modal-button danger" 
                                            onClick={() => handleConfirmAction(
                                                onConfirmAbsence, 
                                                "Essa ação confirma que a cesta não foi entregue à família. Deseja realmente avançar?"
                                            )}
                                        >
                                            Confirmar Ausência
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="modal-actions">
                                            <p className="alert-text">
                                                Atendimento finalizado!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BasketDeliveryModal;
