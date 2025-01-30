import React, { useState, useEffect } from 'react';
import './FamilyListPage.css';
import familiesApi from '../../../services/apiServices/familiesApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { saveAs } from 'file-saver';
import { maskCPF, maskPhone } from '../../../utils/masks';
import EyeIcon from '../../../components/icons/EyeIcon';
import { useNavigate } from 'react-router-dom';

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
        <h1>Lista das Famílias</h1>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Descrição'} showTermFilter={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Criado</th>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Telefone</th>
                        <th>Quantidade Pessoas</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Id}>
                        <td data-label='Id'><span>{item.Id}</span></td>
                        <td data-label='Criado'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Nome'><span>{item.Name}</span></td>
                        <td data-label='CPF'><span>{maskCPF(item.Document)}</span></td>
                        <td data-label='Telefone'><span>{maskPhone(item.Phone)}</span></td>
                        <td data-label='Qt. Pessoas'><span>{item.Children + item.Adults} ({item.Children} crianças)</span></td>
                        <td data-label='Status'><span>{item.Familystatus.Description}</span></td>
                        <td><span className='option-link' onClick={() => navigate('' + item.Id)}><EyeIcon/></span></td>
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
