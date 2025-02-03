import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import adminApi from "../../../services/apiServices/adminApi"; 
import MessageModal from "../../../components/common/Modals/MessageModal/MessageModal";
import LogoIcon from "../../../components/icons/LogoIcon";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecoverPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRecover = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            const response = await adminApi.recoverPass(email);

            if (response) {
                toast.success("Se este email estiver cadastrado, você receberá um link para redefinir sua senha.");
                navigate("/"); // Redirect to login
            } else {
                setMessage("Erro ao solicitar recuperação de senha.");
            }
        } catch (error) {
            setMessage("Erro ao processar a solicitação. Tente novamente.");
        } finally {
            setIsMessageOpen(true);
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="login-page-container">
            <MessageModal isOpen={isMessageOpen} click={() => setIsMessageOpen(false)} message={message} />
            <form className="login-page-form" onSubmit={handleRecover}>
                <div className="div-center margin-bottom-double-default flex-column">
                    <LogoIcon size={120} />
                    <h1>Cestas de Maria</h1>
                </div>

                <div className="login-page-form-group">
                    <label htmlFor="email" className="login-page-label">Digite seu e-mail</label>
                    <input
                        type="email"
                        id="email"
                        className="login-page-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu e-mail cadastrado"
                        required
                    />
                </div>

                <button type="submit" className="login-page-submit-button">Recuperar Senha</button>
                <button className="main-button" onClick={()=> navigate('/')}>Voltar</button>
            </form>
        </div>
    );
};

export default RecoverPasswordPage;
