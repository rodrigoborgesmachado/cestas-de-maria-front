import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apiServices/adminApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { saveAs } from 'file-saver';
import AddUserModal from '../../../components/admin/Modals/AddUserModal/AddUserModal';
import ConfirmModal from '../../../components/common/Modals/ConfirmModal/ConfirmModal';

const AdminsPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [clientSelected, setClientSelected] = useState();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const quantity = configService.getDefaultNumberOfItemsTable(); 
    const orderBy = "Created:Desc";

    useEffect(() => {
        const fetchUsuários = async () => {
            dispatch(setLoading(true));
            try {
                const response = await adminApi.getAdminsPaginated({ page, quantity, orderBy, term: searchTerm });

                setItems(response.Results);
                setTotalPages(response.TotalPages);
                setTotalItens(response.TotalCount);
            } catch (error) {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchUsuários();
    }, [page, quantity, searchTerm, isModalCreateOpen, dispatch, refresh]);

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
            const response = await adminApi.exportFunction({ term: term });
            
            if (response.Status === 200 && response.Object) {
                saveAs(response.Object, 'reportUsuarios.csv');
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

    const deleteOption = (client) => {
        setClientSelected(client);
        setIsModalDeleteOpen(true);
    }

    const handleYesModalDelete = async (item) => {
        dispatch(setLoading(true));
        try {
            if(item.IsActive) {
                await adminApi.inativateAdmin(item.Id);
            } else {
                await adminApi.ativateAdmin(item.Id);
            }
            
            toast.success('Usuário atualizado com sucesso!');
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error('Error updating client status:' + error);
        } finally {
            dispatch(setLoading(false));
            setIsModalDeleteOpen(false);
        }
    };
    
    const handleNoModalDelete = () =>{
        setIsModalDeleteOpen(false);
    };

    return (
    <div className="container-admin-page">
        <ConfirmModal
            isOpen={isModalDeleteOpen}
            title={'Atenção'}
            message={`Deseja realmente ${clientSelected?.IsActive ? 'desativar' : 'ativar'} o usuário ${clientSelected?.Username}?`}
            onYes={handleYesModalDelete}
            onNo={handleNoModalDelete}
            yesLabel="Sim"
            noLabel="Não"
            confirmData={clientSelected}
        />
        <AddUserModal isOpen={isModalCreateOpen} closeModal={() => setIsModalCreateOpen(false)}/>
        <div className='title-with-options'>
            <h1>Lista dos Usuários</h1>
            <button className='main-button' onClick={() => setIsModalCreateOpen(true)}>Novo Admin</button>
        </div>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Nome | Email'} showTermFilter={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Criado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Id}>
                        <td data-label='Id'><span>{item.Id}</span></td>
                        <td data-label='Nome'><span>{item.Name}</span></td>
                        <td data-label='Email'><span>{item.Username}</span></td>
                        <td data-label='Criado'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Opção'>
                            <button onClick={() => deleteOption(item)} 
                            className={item.IsActive === 1 ? 'item-active brighten-on-hover clickable' : 'item-inactive brighten-on-hover clickable'}>
                                {item.IsActive === 1 ? 'Ativo' : 'Inativo'}
                            </button>
                        </td>
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

export default AdminsPage;
