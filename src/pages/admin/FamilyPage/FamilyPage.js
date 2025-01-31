import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import familiesApi from '../../../services/apiServices/familiesApi';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../services/redux/loadingSlice';
import { toast } from 'react-toastify';
import { maskCPF, maskPhone } from '../../../utils/masks';
import { getLastDayOfWeek } from '../../../utils/functions';

const FamilyPage = () => {
    const { code } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [family, setFamily] = useState(undefined);
    const [historyStatus, setHistoryStatus] = useState([]);
    const [basketDeliveries, setBasketDeliveries] = useState([]);

    useEffect(() => {
        const fetchFamily = async () => {
            dispatch(setLoading(true));
            try {
                const response = await familiesApi.getFamilyByCode(code, {
                    include: 'Familystatus,Familyfamilystatushistory.NewFamilystatus,Familyfamilystatushistory.OldFamilystatus,Admins,Basketdeliveries,Basketdeliveries.Basketdeliverystatus'
                });
                setFamily(response);
                setHistoryStatus(response.Familyfamilystatushistory);
                setBasketDeliveries(response.Basketdeliveries);
            } catch (error) {
                toast.error('Erro ao buscar os dados da família.');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchFamily();
    }, [code, dispatch]);

    if (family === undefined) {
        return <div className='customer-container'>Carregando...</div>;
    } else {
        const year = new Date(family.Created).getFullYear(); // Extract year from Created date

        return (
            <div className="container-admin-page">
                <div className='space-double-bottom'>
                    <div className='flex-space-between margin-bottom-default wrap'>
                        <h1>Família: {family.Name}</h1>
                        <button className='main-button' onClick={() => navigate('/familias/editar/' + family.Id)}>
                            Editar
                        </button>
                    </div>

                    {/* Informações Principais */}
                    <div className="box margin-bottom-double-default">
                        <div className='margin-bottom-double-default'>
                            <h2>Informações Principais</h2>
                        </div>
                        <div className="info-group">
                            <p><strong>Id:</strong> {family.Id}</p>
                            <p><strong>Nome:</strong> {family.Name}</p>
                            <p><strong>Quantidade de Cestas:</strong> {family.Basketquantity}</p>
                            <p><strong>Telefone:</strong> {maskPhone(family.Phone)}</p>
                            <p><strong>Documento:</strong> {maskCPF(family.Document)}</p>
                            <p><strong>Adultos:</strong> {family.Adults}</p>
                            <p><strong>Crianças:</strong> {family.Children}</p>
                            <p><strong>Beneficiário de Programa Social:</strong> {family.Issocialprogrambeneficiary ? 'Sim' : 'Não'}</p>
                            <p><strong>É de Uberlândia:</strong> {family.Isfromlocal ? 'Sim' : 'Não'}</p>
                            <p><strong>Situação da Moradia:</strong> {family.Housingsituation}</p>
                            <p><strong>Possui Limitação Grave:</strong> {family.Hasseverelimitation ? 'Sim' : 'Não'}</p>
                            <p><strong>Bairro:</strong> {family.Neighborhood}</p>
                            <p><strong>Endereço:</strong> {family.Address}</p>
                            <p><strong>Semana da Entrega:</strong> {family.DeliveryWeek}</p>
                            <p><strong>Status:</strong> {family.Familystatus?.Description}</p>
                            <p><strong>Criado por:</strong> {family.Admins?.Name}</p>
                        </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="box margin-bottom-double-default">
                        <div className='margin-bottom-double-default'>
                            <h2>Informações Adicionais</h2>
                        </div>
                        <div className="info-group">
                            <p><strong>Criado em:</strong> {new Date(family.Created).toLocaleString()}</p>
                            <p><strong>Atualizado em:</strong> {new Date(family.Updated).toLocaleString()}</p>
                            <p><strong>Ativo:</strong> {family.IsActive ? 'Sim' : 'Não'}</p>
                            <p><strong>Deletado:</strong> {family.IsDeleted ? 'Sim' : 'Não'}</p>
                        </div>
                    </div>

                    {historyStatus.length > 0 && (
                        <div className="box margin-bottom-double-default">
                            <div className='margin-bottom-double-default'>
                                <h2>Histórico de Status</h2>
                            </div>
                            {historyStatus.map((item, index) => (
                                <div key={index} className="info-group">
                                    <p>Em <strong>{new Date(item.Created).toLocaleString()}</strong> foi atualizado do status <strong>{item.OldFamilystatus.Description}</strong> para o status <strong>{item.NewFamilystatus.Description}</strong>.</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {basketDeliveries.length > 0 && (
                        <div className="box margin-bottom-double-default">
                            <div className='margin-bottom-double-default'>
                                <h2>Histórico de Entregas</h2>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Semana do Ano</th>
                                        <th>Data da Entrega</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {basketDeliveries.map((delivery) => (
                                        <tr key={delivery.Id}>
                                            <td data-label='Id'>{delivery.Id}</td>
                                            <td data-label='Nº Semana'>{delivery.Weekofmonth}</td>
                                            <td data-label='Data'>{getLastDayOfWeek(year, delivery.Weekofmonth)}</td>
                                            <td data-label='Status'>{delivery.Basketdeliverystatus?.Description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
};

export default FamilyPage;
