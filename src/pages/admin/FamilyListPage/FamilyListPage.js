import React, { useState, useEffect } from 'react';
import './FamilyListPage.css';
import familiesApi from '../../../services/apiServices/familiesApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { saveAs } from 'file-saver';
import { maskCPF, maskPhone } from '../../../utils/masks';
import EyeIcon from '../../../components/icons/EyeIcon';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../../components/icons/EditIcon';

const FamilyListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable(); 
    const orderBy = "Created:Desc";

    useEffect(() => {
        const fetchFamílias = async () => {
            dispatch(setLoading(true));
            try {
                const response = await familiesApi.getFamiliesPaginated({ page, quantity, orderBy, term: searchTerm, include: "Familystatus" });

                setItems(response.Results);
                setTotalPages(response.TotalPages);
                setTotalItens(response.TotalCount);
            } catch (error) {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchFamílias();
    }, [page, quantity, searchTerm, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({term} = {}) => {
        setSearchTerm(term);
    }

    const exportFunction = async (term) => {
        try {
            dispatch(setLoading(true));
            const response = await familiesApi.exportFunction({ term: term });
            
            if (response.Status === 200 && response.Object) {
                saveAs(response.Object, 'reportFamílias.csv');
                toast.success('Relatório gerado com sucesso!');
            } else {
                toast.error('Erro ao gerar o relatório');
            }
        } catch (error) {
            toast.error('Erro ao gerar o relatório');
        }
        finally{
            dispatch(setLoading(false));
        }
    };

    return (
    <div className="container-admin-page">
        <div className='title-with-options'>
            <h1>Lista das Famílias</h1>
            <button className='main-button' onClick={() => navigate('adicionar')}>Nova Família</button>
        </div>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Descrição'} showTermFilter={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Semana de Entrega</th>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Telefone</th>
                        <th>Quantidade Pessoas</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Id} 
                        className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }
                        >
                        <td data-label='Id' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{item.Id}</span>
                        </td>
                        <td data-label='Semana' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{item.DeliveryWeek}</span>
                        </td>
                        <td data-label='Nome' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{item.Name}</span>
                        </td>
                        <td data-label='CPF' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{maskCPF(item.Document)}</span>
                        </td>
                        <td data-label='Telefone' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{maskPhone(item.Phone)}</span>
                        </td>
                        <td data-label='Qt. Pessoas' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{item.Children + item.Adults} ({item.Children} crianças)</span>
                        </td>
                        <td data-label='Status' className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}>{item.Familystatus.Description}</span>
                        </td>
                        <td className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('editar/' + item.Id)}><EditIcon/></span>
                        </td>
                        <td className={
                            item.Familystatus.Id === 1 
                            ? 'erase-info' :
                            item.Familystatus.Id === 2
                            ? 'waiting-info' :
                            item.Name && item.Document && item.Phone 
                            ? '' : 
                            'missing-info'
                        }>
                            <span className='option-link' onClick={() => navigate('' + item.Id)}><EyeIcon/></span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <sub>Total de Famílias: {totalItens}</sub>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    </div>
    );
};

export default FamilyListPage;
