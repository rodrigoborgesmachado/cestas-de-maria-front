import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import familiesApi from "../../../services/apiServices/familiesApi";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import { toast } from "react-toastify";
import './AddFamilyPage.css'
import { maskCPF, maskPhone } from "../../../utils/masks";
import familyStatusApi from "../../../services/apiServices/familyStatusApi";

const AddFamilyPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            dispatch(setLoading(true));
            try {
                const response = await familyStatusApi.getAllFamilyStatuses();
                setStatus(response);
            } catch (error) {
                toast.error('Erro ao carregar as marcas!');
            }
            finally{
                dispatch(setLoading(false));
            }
        };

        fetchStatus();
    }, [dispatch]);

    // State for form inputs
    const [formData, setFormData] = useState({
        name: "",
        basketquantity: "",
        phone: "",
        document: "",
        adults: "",
        children: "",
        issocialprogrambeneficiary: "0",
        isfromlocal: "1",
        housingsituation: "",
        hasseverelimitation: "0",
        neighborhood: "",
        address: "",
        familystatusid: 3,
    });

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            await familiesApi.createFamily(formData);
            toast.success("Família adicionada com sucesso!");
            navigate("/familias"); // Redirect after successful addition
        } catch (error) {
            toast.error("Erro ao adicionar família. Verifique os dados e tente novamente.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-admin-page">
            <h1>Adicionar Família</h1>

            <form className="box form-family" onSubmit={handleSubmit}>
                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>Nome:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Quantidade de Cestas:</label>
                        <input type="number" name="basketquantity" value={formData.basketquantity} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Telefone:</label>
                        <input type="text" name="phone" value={maskPhone(formData.phone)} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Documento:</label>
                        <input type="text" name="document" value={maskCPF(formData.document)} onChange={handleChange} required />
                    </div>
                </div>

                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>Adultos:</label>
                        <input type="number" name="adults" value={formData.adults} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Crianças:</label>
                        <input type="number" name="children" value={formData.children} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Beneficiário de Programa Social:</label>
                        <select name="issocialprogrambeneficiary" value={formData.issocialprogrambeneficiary} onChange={handleChange} required>
                            <option value="0">Não</option>
                            <option value="1">Sim</option>
                        </select>
                    </div>
                </div>

                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>É da Localidade:</label>
                        <select name="isfromlocal" value={formData.isfromlocal} onChange={handleChange} required>
                            <option value="1">Sim</option>
                            <option value="0">Não</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Situação da Moradia:</label>
                        <input type="text" name="housingsituation" value={formData.housingsituation} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Possui Limitação Grave:</label>
                        <select name="hasseverelimitation" value={formData.hasseverelimitation} onChange={handleChange} required>
                            <option value="0">Não</option>
                            <option value="1">Sim</option>
                        </select>
                    </div>
                </div>

                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>Bairro:</label>
                        <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Endereço:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Status da Família:</label>
                        <select
                            name="familystatusid"
                            className="main-input"
                            value={formData.familystatusid}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione o Status</option>
                            {status.map((model) => (
                                <option key={model.Id} value={model.Id}>
                                    {model.Description}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="admin-button">Adicionar Família</button>
            </form>
        </div>
    );
};

export default AddFamilyPage;