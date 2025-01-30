import React, { useState } from "react";
import "./AddUserModal.css";
import adminApi from "../../../../services/apiServices/adminApi";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../services/redux/loadingSlice";
import MessageModal from "../../../common/Modals/MessageModal/MessageModal";
import { useNavigate } from 'react-router-dom';

const AddUserModal = ({ isOpen, closeModal }) => {
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [passwordhash, setPasswordhash] = useState("");
    const [message, setMessage] = useState("");
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const dispatch = useDispatch();

    const openMessageModal = () => {
        setIsMessageOpen(true);
    };

    const closeMessageModal = () => {
        setIsMessageOpen(false);
        if (message.includes("sucesso")) {
            closeModal(); // Close the modal on successful creation
            navigate('/usuarios');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            username,
            passwordhash,
        };

        try {
            dispatch(setLoading(true));
            const response = await adminApi.createAdmin(payload);
            var message = response.Id ? 'Usuário criado com sucesso' : 'Erro ao criar usuário. Verifique os dados e tente novamente.';

            setMessage(message);
            openMessageModal();
        } catch (error) {
            setMessage("Erro ao criar usuário. Verifique os dados e tente novamente.");
            openMessageModal();
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <MessageModal
                isOpen={isMessageOpen}
                click={closeMessageModal}
                message={message}
            />
            <div className="modal-container">
                <button className="close-button" onClick={closeModal}>
                    &times;
                </button>
                <h2 className="modal-title">Adicionar Usuário</h2>
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="cadastro-new-user">
                        <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <input
                                type="text"
                                id="name"
                                className="main-input"
                                placeholder="Digite o nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Email</label>
                            <input
                                type="email"
                                id="username"
                                className="main-input"
                                placeholder="Digite o email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="document">Senha</label>
                            <input
                                type="password"
                                id="document"
                                className="main-input"
                                value={passwordhash}
                                onChange={(e) => setPasswordhash(e.target.value)}
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="main-button"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="main-button">
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
