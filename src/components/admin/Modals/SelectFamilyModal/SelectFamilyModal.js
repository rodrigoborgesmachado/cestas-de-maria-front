import React, { useState, useEffect } from "react";
import familiesApi from "../../../../services/apiServices/familiesApi";
import { setLoading } from "../../../../services/redux/loadingSlice";
import { useDispatch } from "react-redux";
import configService from "../../../../services/configService";
import Pagination from "../../../common/Pagination/Pagination";
import { toast } from "react-toastify";
import FilterComponent from "../../../admin/FilterComponent/FilterComponent";
import { maskCPF, maskPhone } from "../../../../utils/masks";
import "./SelectFamilyModal.css";

const SelectFamilyModal = ({ isOpen, onClose, onSelectFamily }) => {
    const dispatch = useDispatch();
    const [families, setFamilies] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const orderBy = "Created:Desc";

    useEffect(() => {
        if (!isOpen) return; // Avoid fetching when modal is closed

        const fetchFamilies = async () => {
            dispatch(setLoading(true));
            try {
                const response = await familiesApi.getFamiliesPaginated({
                    page,
                    quantity,
                    orderBy,
                    status: "EMESPERA",
                    term: searchTerm,
                    include: "Familystatus",
                });

                setFamilies(response.Results);
                setTotalPages(response.TotalPages);
                setTotalItems(response.TotalCount);
            } catch (error) {
                toast.error("Erro ao buscar as famílias.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchFamilies();
    }, [isOpen, quantity, page, searchTerm, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({ term } = {}) => {
        setSearchTerm(term);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <button className="close-button" onClick={onClose}>×</button>
                <h2 className="family-modal-title">Selecionar Família</h2>

                <div className="family-modal-filter">
                    <FilterComponent
                        placeHolder={"Nome ou Documento"}
                        showTermFilter={true}
                        submitFilter={search}
                    />
                </div>

                <div className="family-modal-list">
                    <table className="admin-table">
                        <thead>
                            <tr className="normal-info">
                                <th>Id</th>
                                <th>Nome</th>
                                <th>Documento</th>
                                <th>Telefone</th>
                                <th>Status</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {families.map((family) => (
                                <tr key={family.Id} className="normal-info">
                                    <td data-label="Id">
                                        <span className="option-link">{family.Id}</span>
                                    </td>
                                    <td data-label="Nome">
                                        <span className="option-link">{family.Name}</span>
                                    </td>
                                    <td data-label="CPF">
                                        <span className="option-link">{maskCPF(family.Document)}</span>
                                    </td>
                                    <td data-label="Telefone">
                                        <span className="option-link">{maskPhone(family.Phone)}</span>
                                    </td>
                                    <td data-label="Status">
                                        <span className="option-link">{family.Familystatus?.Description}</span>
                                    </td>
                                    <td>
                                        <button className="family-select-button" onClick={() => onSelectFamily(family)}>
                                            Selecionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <sub className="family-total-count">Total de Famílias: {totalItems}</sub>
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};

export default SelectFamilyModal;
