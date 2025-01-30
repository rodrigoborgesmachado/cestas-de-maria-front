import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import familiesApi from '../../../services/apiServices/familiesApi';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../services/redux/loadingSlice';
import { toast } from 'react-toastify';
import { maskCPF, maskPhone } from '../../../utils/masks';

const FamilyPage = () => {
    const { code } = useParams();
    const dispatch = useDispatch();
    const [family, setFamily] = useState(undefined);

    useEffect(() => {
        const fetchOrder =  async () => {
            dispatch(setLoading(true));
            try {
                const response = await familiesApi.getFamilyByCode(code, {include: 'Familystatus'});
                setFamily(response);
            } catch (error) {
                toast.error('Erro ao buscar os dados da família.');
            } finally {
                dispatch(setLoading(false));
            }
        }

        fetchOrder();
    }, [code, dispatch]);

    if(family === undefined)
        return(<div className='customer-container'>Carregando</div>)
    else
    return (
    <div className="container-admin-page">
        <div className='space-double-bottom'>
            <div className='flex-space-between margin-bottom'>
                <h1>Família: {family.Name} </h1>
            </div>
            <div>
                <div className="box margin-bottom-double-default">
                    <div className="info-group">
                        <p><strong>Id:</strong> {family.Id}</p>
                        <p><strong>Nome:</strong> {family.Name}</p>
                        <p><strong>Quantidade de Cestas:</strong> {family.Basketquantity}</p>
                        <p><strong>Telefone:</strong> {maskPhone(family.Phone)}</p>
                        <p><strong>Documento:</strong> {maskCPF(family.Document)}</p>
                        <p><strong>Adultos:</strong> {family.Adults}</p>
                        <p><strong>Crianças:</strong> {family.Children}</p>
                        <p><strong>Beneficiário de Programa Social:</strong> {family.Issocialprogrambeneficiary ? 'Sim' : 'Não'}</p>
                        <p><strong>É da Localidade:</strong> {family.Isfromlocal ? 'Sim' : 'Não'}</p>
                        <p><strong>Situação da Moradia:</strong> {family.Housingsituation}</p>
                        <p><strong>Possui Limitação Grave:</strong> {family.Hasseverelimitation ? 'Sim' : 'Não'}</p>
                        <p><strong>Bairro:</strong> {family.Neighborhood}</p>
                        <p><strong>Endereço:</strong> {family.Address}</p>
                        <p><strong>Semana da Entrega:</strong> {family.DeliveryWeek}</p>
                        <p><strong>Status:</strong> {family.Familystatus?.Description}</p>
                    </div>
                </div>

                <div className="box margin-bottom-double-default">
                    <div>
                        <h2>Informações Adicionais</h2>
                    </div>
                    <div className="info-group">
                        <p><strong>Criado em:</strong> {new Date(family.Created).toLocaleString()}</p>
                        <p><strong>Atualizado em:</strong> {new Date(family.Updated).toLocaleString()}</p>
                        <p><strong>Ativo:</strong> {family.IsActive ? 'Sim' : 'Não'}</p>
                        <p><strong>Deletado:</strong> {family.IsDeleted ? 'Sim' : 'Não'}</p>
                    </div>
                </div>
            </div>

        </div>

    </div>
  );
};

export default FamilyPage;
