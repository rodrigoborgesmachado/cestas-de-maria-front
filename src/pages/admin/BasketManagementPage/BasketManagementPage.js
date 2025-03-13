import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import { toast } from "react-toastify";
import basketDeliveryApi from "../../../services/apiServices/basketDeliveryApi";
import familiesApi from "../../../services/apiServices/familiesApi";
import { format, addDays, subDays } from "date-fns";
import "./BasketManagementPage.css";
import { maskCPF, maskPhone } from "../../../utils/masks";
import BasketDeliveryModal from "../../../components/admin/Modals/BasketDeliveryModal/BasketDeliveryModal";
import SelectFamilyModal from "../../../components/admin/Modals/SelectFamilyModal/SelectFamilyModal";
import { getLastDayOfWeekByDate } from "../../../utils/functions";
import ConfirmModal from "../../../components/common/Modals/ConfirmModal/ConfirmModal";

const BasketManagementPage = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState(getLastDayOfWeekByDate(new Date()));
    const [allDeliveries, setAllDeliveries] = useState([]); // Store all deliveries from API
    const [filteredDeliveries, setFilteredDeliveries] = useState([]); // Store filtered deliveries
    const [filterText, setFilterText] = useState(""); // Filter text state
    const [isModalDelivery, setIsModalDelivery] = useState(null); // For Modal
    const [selectedDelivery, setSelectedDelivery] = useState(null); // For Modal
    const [selectedFamily, setSelectedFamily] = useState(null); // For Modal
    const [showLegend, setShowLegend] = useState(false); // Toggle Legenda
    const [refresh, setRefresh] = useState(false); // Controls the Message Modal
    const [showSelectFamilyModal, setShowSelectFamilyModal] = useState(false);
    const [updateStatusModal, setUpdateStatusModal] = useState(false);

    const openUpdateFamilyStatus = () => {
        setIsModalDelivery(false);
        setUpdateStatusModal(true);
    }

    const closeUpdateFamilyStatus = () => {
        setUpdateStatusModal(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            try {
                const formattedDate = format(date, "yyyy-MM-dd");
                const response = await basketDeliveryApi.getByDate({ date: formattedDate });
                setAllDeliveries(response); // Store the original response
                setFilteredDeliveries(response); // Initialize filtered data
            } catch (error) {
                toast.error("Erro ao buscar as entregas.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [date, refresh, dispatch]);

    // Get next Saturday
    const getNextSaturday = (currentDate) => {
        let nextSaturday = addDays(currentDate, 1);
        while (nextSaturday.getDay() !== 6) {
            nextSaturday = addDays(nextSaturday, 1);
        }
        return nextSaturday;
    };

    // Get previous Saturday
    const getPreviousSaturday = (currentDate) => {
        let previousSaturday = subDays(currentDate, 1);
        while (previousSaturday.getDay() !== 6) {
            previousSaturday = subDays(previousSaturday, 1);
        }
        return previousSaturday;
    };

    // Filter logic
    const handleFilterChange = (e) => {
        const text = e.target.value.toLowerCase();
        setFilterText(text);

        if (!text) {
            setFilteredDeliveries(allDeliveries); // Reset to original data when filter is empty
        } else {
            const filtered = allDeliveries.filter((delivery) =>
                delivery.Families.Name.toLowerCase().includes(text) ||
                (delivery.Families.Document && maskCPF(delivery.Families.Document).includes(text))
            );
            setFilteredDeliveries(filtered);
        }
    };

    // Handle card click
    const handleCardClick = (delivery) => {
        setSelectedDelivery(delivery); // Open the main modal
        setIsModalDelivery(true);
    };

    const updateStatus = async (id, status) => {
        dispatch(setLoading(true));
        try {
            const response = await basketDeliveryApi.updateStatus(id, status);
            if (response.Id) {
                toast.success("Status atualizado com sucesso!");

                if (status === "FALTOU") {
                    const history = await basketDeliveryApi.getBasketDeliveryHistoryByFamily(response.Familyid);
                    setSelectedFamily(response.Familyid);
                
                    if (history.length > 1) {
                        history.sort((a, b) => new Date(b.Created) - new Date(a.Created));
                
                        if (history[1].Deliverystatusid === 4) {
                            openUpdateFamilyStatus();
                            return; 
                        }
                    }
                }
                
                setRefresh(prev => !prev);
                setSelectedDelivery(null);
            } else {
                toast.error(response);
            }
        } catch (error) {
            toast.error("Erro ao atualizar status da entrega.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSelectFamily = async (newFamily) => {
        if (!selectedDelivery) return;
    
        dispatch(setLoading(true));
        try {
            const response = await basketDeliveryApi.updatefamily(selectedDelivery.Id, newFamily.Id, selectedDelivery.Familyid);
            if (response.Id) {
                toast.success("Família atualizada com sucesso!");
                setRefresh(prev => !prev); // Refresh the page
                setSelectedDelivery(null);
            } else {
                toast.error("Erro ao atualizar a família.");
            }
        } catch (error) {
            toast.error("Erro ao atualizar a família.");
        } finally {
            dispatch(setLoading(false));
            setShowSelectFamilyModal(false);
        }
    };

    const hasBeforeSolicitadoStatus = () => {
        return filteredDeliveries.some(delivery => delivery.Basketdeliverystatus.Id === 1);
    };

    const updateAllToSolicitados = async () => {
        if (filteredDeliveries.length === 0) {
            toast.warn("Nenhuma entrega encontrada.");
            return;
        }
    
        dispatch(setLoading(true));
        try {
            for (const delivery of filteredDeliveries) {
                if(delivery.Basketdeliverystatus.Id === 1)
                    await basketDeliveryApi.updateStatus(delivery.Id, "SOLICITADO");
            }
            toast.success("Todas as famílias foram atualizadas como 'Solicitadas'!");
            setRefresh(prev => !prev); // Refresh to update data
        } catch (error) {
            toast.error("Erro ao atualizar as famílias.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateFamilyStatus = async (id, status) => {
        dispatch(setLoading(true));
        try {
            const response = await familiesApi.updateStatus(id, status);
            if (response.Id) {
                toast.success("Família colocada como cortada com sucesso!");

                closeUpdateFamilyStatus();
                setRefresh(prev => !prev);
                setSelectedDelivery(null);
                setSelectedFamily(null);
            } else {
                toast.error(response);
            }
        } catch (error) {
            toast.error("Erro ao atualizar família.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-admin-page">
            <ConfirmModal isOpen={updateStatusModal} 
                title="Confirmação"
                message={'Essa família também faltou na última entrega, gostaria de coloca-la como cortada?'}
                onYes={() => updateFamilyStatus(selectedFamily, 'CORTADO')}
                onNo={() => {
                    closeUpdateFamilyStatus();
                    setRefresh(prev => !prev);
                }} />

            <div className="basket-navigation">
                <button className="nav-button" onClick={() => setDate(getPreviousSaturday(date))}>← Anterior</button>
                <h2>{format(date, "dd/MM/yyyy")}</h2>
                <button className="nav-button" onClick={() => setDate(getNextSaturday(date))}>Próximo →</button>
            </div>

            {/* Filter Input */}
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filtre por nome ou documento..."
                    value={filterText}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
            </div>

            {
                hasBeforeSolicitadoStatus() && 
                <div className="div-center margin-bottom-default">
                    <button 
                        className="main-button margin-top-double-default"
                        onClick={updateAllToSolicitados}
                    >
                        Atualizar todas famílias como Solicitados
                    </button>
                </div>
            }
            
            <div className="basket-card-container">
                {filteredDeliveries.length > 0 ? (
                    filteredDeliveries.map((delivery, index) => (
                        <div
                            key={delivery.Id}
                            className={
                                delivery.Families.Familystatus.Id === 1 ? "basket-card erase-info" :
                                delivery.Families.Familystatus.Id === 2 ? "basket-card missing-info" :
                                delivery.Families.Familystatus.Id === 4 ? "basket-card waiting-info" :
                                delivery.Basketdeliverystatus.Id === 3 ? "basket-card received-info" :
                                delivery.Basketdeliverystatus.Id === 4 ? "basket-card missed-delivery-info" :
                                delivery.Basketdeliverystatus.Id === 2 ? "basket-card solicited-info" :
                                delivery.Basketdeliverystatus.Id === 1 ? "basket-card before-solicited-info" :
                                "basket-card"
                            }
                            onClick={() => handleCardClick(delivery)} // Handle click with validation
                        >
                            <h3>{index+1} - {delivery.Families.Name}</h3>
                            <p><strong>Família:</strong> {delivery.Families.Familystatus.Description}</p>
                            <p><strong>Cestas:</strong> {delivery.Families.Basketquantity}</p>
                            <p><strong>Bairro:</strong> {delivery.Families.Neighborhood}</p>
                            <p><strong>Documento:</strong> {maskCPF(delivery.Families.Document)}</p>
                            <p><strong>Telefone:</strong> {maskPhone(delivery.Families.Phone)}</p>
                            <p><strong>Status:</strong> {delivery.Basketdeliverystatus.Description}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-deliveries">Nenhuma entrega encontrada</p>
                )}
            </div>

            {/* Toggle Legend Button */}
            <button 
                className="toggle-legend-button margin-top-triple-default" 
                onClick={() => setShowLegend(!showLegend)}
            >
                Legenda
                {showLegend && (
                    <div className="legend-box">
                        <div className="legend-item waiting-info"><span></span>Famílias Elegíveis</div>
                        <div className="legend-item before-solicited-info"><span></span>A solicitar</div>
                        <div className="legend-item solicited-info"><span></span>Solicitado</div>
                        <div className="legend-item missed-delivery-info"><span></span>Ausente</div>
                        <div className="legend-item received-info"><span></span>Cesta recebida</div>
                    </div>
                )}
            </button>

            {showSelectFamilyModal && (
                <SelectFamilyModal
                    isOpen={showSelectFamilyModal}
                    onClose={() => setShowSelectFamilyModal(false)}
                    onSelectFamily={handleSelectFamily}
                />
            )}

            {/* Render Basket Delivery Modal if valid date */}
            {selectedDelivery && (
                <BasketDeliveryModal
                    isOpen={isModalDelivery}
                    delivery={selectedDelivery}
                    onClose={() => setSelectedDelivery(null)}
                    onContactMade={() => updateStatus(selectedDelivery.Id, "SOLICITADO")}
                    onConfirmAttendence={() => updateStatus(selectedDelivery.Id, "SOLICITADO")}
                    onConfirmDelivery={() => updateStatus(selectedDelivery.Id, "ENTREGUE")}
                    onConfirmAbsence={() => updateStatus(selectedDelivery.Id, "FALTOU")}
                    onChangeFamily={() => {
                        setShowSelectFamilyModal(true);
                        setIsModalDelivery(false);
                    } }
                />
            )}
        </div>
    );
};

export default BasketManagementPage;
