import React, { useState, useEffect } from 'react';
import mailMessageApi from '../../../services/apiServices/mailMessageApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { saveAs } from 'file-saver';
import DownloadIcon from '../../../components/icons/DownloadIcon';

const MailMessageListPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const quantity = configService.getDefaultNumberOfItemsTable(); 
    const orderBy = "Id:Desc";

    useEffect(() => {
        const fetchMailMessages = async () => {
            dispatch(setLoading(true));
            try {
                const response = await mailMessageApi.getMailMessagesPaginated({ page, quantity, orderBy, term: searchTerm });
                setItems(response.Results);
                setTotalPages(response.TotalPages);
                setTotalItens(response.TotalCount);
            } catch (error) {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchMailMessages();
    }, [page, quantity, searchTerm, refresh, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({term} = {}) => {
        setSearchTerm(term);
    }

    const reenviar = async (id) => {
        try{
            dispatch(setLoading(true));
            var result = await mailMessageApi.resendMailMessage(id);
            if(result.Mailmessagefamilystatus && result.Mailmessagefamilystatus === 'Sent'){
                toast.success('Email reenviado!')
                setRefresh(prev => !prev);
            }
            else{
                toast.error('Erro ao reenviar!');
            }
        }
        catch{
            toast.error('Erro ao reenviar!');
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const exportFunction = async ({term}) => {
        try {
            dispatch(setLoading(true));
            const response = await mailMessageApi.exportMailMessages({ term: term });
            
            if (response.Status === 200 && response.Object) {
                window.open(response.Object, "_blank");
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

    const downloadItem = (mail) => {
        const blob = new Blob([mail.Body], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `${mail.Subject.replace(/ /g, '_')}.html`);
    };

    return (
    <div className="container-admin-page">
        <h1>Lista dos Emails</h1>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Email | Assunto'} showTermFilter={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Enviado</th>
                        <th>Assunto</th>
                        <th>To</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Id}>
                        <td data-label="Id"><span>{item.Id}</span></td>
                        <td data-label="Enviado"><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label="Assunto"><span>{item.Subject}</span></td>
                        <td data-label="To"><span>{item.To}</span></td>
                        <td data-label="Status"><span>{item.Mailmessagefamilystatus === 'Sent' ? 'Enviado' : 'Não enviado'}</span></td>
                        <td data-label="Opção"><button className='main-button' disabled={item.Mailmessagefamilystatus === 'Sent'} onClick={() => {if(item.Mailmessagefamilystatus !== 'Sent') reenviar(item.Id)}}>Reenviar</button></td>
                        <td><span className='option-link' onClick={() => downloadItem(item)}><DownloadIcon/></span></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <sub>Total de Usuários: {totalItens}</sub>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    </div>
    );
};

export default MailMessageListPage;