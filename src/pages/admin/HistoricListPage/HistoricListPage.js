import React, { useState, useEffect } from 'react';
import './HistoricListPage.css';
import basketApi from '../../../services/apiServices/basketDeliveryApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { saveAs } from 'file-saver';
import { putDateOnPattern } from '../../../utils/functions';

const HistoricListPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const quantity = configService.getDefaultNumberOfItemsTable(); 
    const orderBy = "Created:Desc";

    useEffect(() => {
        const fetchHistórico = async () => {
            dispatch(setLoading(true));
            try {
                const response = await basketApi.getBasketDeliveriesPaginated({ page, quantity, orderBy, term: searchTerm, startDate, endDate, include: "Families.Familystatus,Basketdeliverystatus" });

                setItems(response.Results);
                setTotalPages(response.TotalPages);
                setTotalItens(response.TotalCount);
            } catch (error) {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchHistórico();
    }, [page, quantity, searchTerm, startDate, endDate, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({term, startDate, endDate} = {}) => {
        setSearchTerm(term);
        setStartDate(startDate);
        setEndDate(endDate);
    }

    const exportFunction = async (term) => {
        try {
            dispatch(setLoading(true));
            const response = await basketApi.exportFunction({ term: term });
            
            if (response.Status === 200 && response.Object) {
                saveAs(response.Object, 'reportHistórico.csv');
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
        <h1>Histórico de Doações</h1>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Família'} showTermFilter={true} showEndDate={true} showStartDate={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Família</th>
                        <th>Documento</th>
                        <th>Telefone</th>
                        <th>Cestas</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Id}>
                        <td data-label='Data'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Família'><span>{item.Families?.Name}</span></td>
                        <td data-label='Documento'><span>{item.Families?.Document}</span></td>
                        <td data-label='Telefone'><span>{item.Families?.Phone}</span></td>
                        <td data-label='Cestas'><span>{item.Families?.Basketquantity}</span></td>
                        <td data-label='Status'><span>{item.Basketdeliverystatus?.Description}</span></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <sub>Total de Histórico: {totalItens}</sub>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    </div>
    );
};

export default HistoricListPage;
