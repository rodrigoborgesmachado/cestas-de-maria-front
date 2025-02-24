import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    const [documentExists, setDocumentExists] = useState('');
    const [phoneExists, setPhoneExists] = useState('');
    const { code } = useParams();
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
        deliveryWeek: 1,
        neighborhood: "",
        address: "",
        familystatusid: 2,
    });

    useEffect(() => {
        const fetchStatus = async () => {
            dispatch(setLoading(true));
            try {
                const response = await familyStatusApi.getAllFamilyStatuses();
                setStatus(response);
            } catch (error) {
                toast.error('Erro ao carregar os status!');
            }
            finally{
                dispatch(setLoading(false));
            }
        };

        const fetchFamily =  async () => {
            dispatch(setLoading(true));
            try {
                const response = await familiesApi.getFamilyByCode(code, {include: 'Familystatus'});
                
                setFormData({
                    name: response.Name || "",
                    basketquantity: response.Basketquantity || "",
                    phone: response.Phone || "",
                    document: response.Document || "",
                    adults: response.Adults || "",
                    children: response.Children || "",
                    issocialprogrambeneficiary: response.Issocialprogrambeneficiary ? "1" : "0",
                    isfromlocal: response.Isfromlocal ? "1" : "0",
                    housingsituation: response.Housingsituation || "",
                    hasseverelimitation: response.Hasseverelimitation ? "1" : "0",
                    deliveryWeek: response.DeliveryWeek || 1,
                    neighborhood: response.Neighborhood || "",
                    address: response.Address || "",
                    familystatusid: response.Familystatusid || 2,
                });
            } catch (error) {
                toast.error('Erro ao buscar os dados da família.');
            } finally {
                dispatch(setLoading(false));
            }
        }
        
        fetchStatus();

        if(code)
            fetchFamily();
    }, [code, dispatch]);

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
            var result = !code ? await familiesApi.createFamily(formData) : await familiesApi.updateFamily(code, formData);

            if(result.code === 401){
                toast.warn(result.message);
            }
            else{
                toast.success(!code ? "Família adicionada com sucesso!" : "Família editada com sucesso!");
                navigate("/familias"); 
            }
        } catch (error) {
            if(error.response.data && error.response.data.Code === 401){
                toast.warn(error.response.data.Message);
            }
            else{
                toast.error("Erro ao adicionar família. Verifique os dados e tente novamente.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getFamilyByDocument =  async (document) => {
        dispatch(setLoading(true));
        try {
            const response = await familiesApi.getFamilyByDocument(document);
            
            if(response){
                setDocumentExists('Documento já cadastrado!');
            }
            else{
                setDocumentExists('');
            }
        } catch (error) {
            toast.error('Erro ao verificar se documento já existe.');
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getFamilyByPhone =  async (phone) => {
        dispatch(setLoading(true));
        try {
            const response = await familiesApi.getFamilyByPhone(phone);
            
            if(response){
                setPhoneExists('Telefone já cadastrado!');
            }
            else{
                setPhoneExists('');
            }
        } catch (error) {
            toast.error('Erro ao verificar se telefone já existe.');
        } finally {
            dispatch(setLoading(false));
        }
    }

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
                        <input type="text" name="phone" value={maskPhone(formData.phone)} onChange={handleChange} required onBlur={() => getFamilyByPhone(formData.document)}/>
                        {
                            phoneExists && 
                            <label className="danger">{phoneExists}</label>
                        }
                    </div>

                    <div className="form-group">
                        <label>Documento:</label>
                        <input type="text" name="document" value={maskCPF(formData.document)} onChange={handleChange} required onBlur={() => getFamilyByDocument(formData.document)} />
                        {
                            documentExists && 
                            <label className="danger">{documentExists}</label>
                        }
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
                        <label>Semana para entrega:</label>
                        <input type="number" name="deliveryWeek" value={formData.deliveryWeek} onChange={handleChange} required />
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
                        <label>É de Uberlândia:</label>
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

                <button type="submit" className="admin-button">{code ? 'Editar família' : 'Adicionar Família'}</button>
            </form>
        </div>
    );
};

export default AddFamilyPage;