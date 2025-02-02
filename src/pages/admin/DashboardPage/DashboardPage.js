import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import { toast } from "react-toastify";
import basketDeliveryApi from "../../../services/apiServices/basketDeliveryApi";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./DashboardPage.css";
import { startOfMonth, endOfMonth, format, startOfYear, addWeeks, addDays } from "date-fns";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const [dashboardData, setDashboardData] = useState(null);
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"));

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            try {
                const response = await basketDeliveryApi.getByDashboardData({ startDate, endDate });
                setDashboardData(response);
            } catch (error) {
                toast.error("Erro ao buscar dados do dashboard.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [dispatch, startDate, endDate]);

    const getOrderedWeekNumbers = (weekNumbers) => {
        let orderedWeeks = [];
        let remainingWeeks = [];
    
        // Sort week numbers in descending order
        const sortedWeeks = weekNumbers.map(Number).sort((a, b) => b - a);
    
        let previousWeek = sortedWeeks[0];
    
        for (let weekNum of sortedWeeks) {
            if (previousWeek - weekNum > 1) {
                // If there's a gap, store remaining weeks separately
                remainingWeeks = [...orderedWeeks];
                orderedWeeks = [];
            }
            orderedWeeks.push(weekNum);
            previousWeek = weekNum;
        }
    
        // Merge, ensuring older weeks appear at the beginning
        return [...orderedWeeks, ...remainingWeeks];
    };

    const getSaturdayForWeeks = (weekNumbers, referenceYear) => {
        let year = referenceYear;
        let previousWeek = 0;
    
        // Organize weeks correctly before converting to dates
        const orderedWeeks = getOrderedWeekNumbers(weekNumbers);
    
        return orderedWeeks.map(weekNum => {
            if (previousWeek !== 0 && weekNum > previousWeek + 1) {
                year--;
            }
            previousWeek = weekNum;
    
            let firstDayOfYear = startOfYear(new Date(year, 0, 1));
            let saturdayDate = addWeeks(firstDayOfYear, weekNum - 1);
    
            while (saturdayDate.getDay() !== 6) {
                saturdayDate = addDays(saturdayDate, 1);
            }
    
            return format(saturdayDate, "dd/MM/yyyy");
        });
    };

    if (!dashboardData) {
        return <div className="dashboard-container">Carregando...</div>;
    }

    const referenceYear = new Date().getFullYear();
    const weekData = dashboardData.QuantityDeliveriesPerWeekday;
    const chartLabels = getSaturdayForWeeks(Object.keys(weekData), referenceYear);
    const chartValues = Object.values(weekData);

    const chartData = {
        labels: chartLabels.reverse(),
        datasets: [
            {
                label: "Entregas",
                data: chartValues.reverse(),
                backgroundColor: "#1B4332",
                borderColor: "#142E24",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container-admin-page">
            <div className='title-with-options'>
                <h1>DashBoard</h1>
            </div>
            <div className="dashboard-filter">
                <label>Data Início:</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>Data Fim:</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="dashboard-summary">
                <div className="summary-card">Famílias em Atendimento: {dashboardData.QuantityFamilyInProgress}</div>
                <div className="summary-card">Famílias Cortadas: {dashboardData.QuantityFamilyCutted}</div>
                <div className="summary-card">Famílias Elegíveis: {dashboardData.QuantityFamilyEligible}</div>
                <div className="summary-card">Famílias em Espera: {dashboardData.QuantityFamilyWaiting}</div>
                <div className="summary-card">Entregas Pendentes: {dashboardData.QuantityDeliveryPending}</div>
                <div className="summary-card">Entregas Concluídas: {dashboardData.QuantityDeliveryCompleted}</div>
                <div className="summary-card">Entregas Perdidas: {dashboardData.QuantityDeliveryMissed}</div>
                <div className="summary-card">Entregas Solicitadas: {dashboardData.QuantityDeliveryCalled}</div>
            </div>
            <div className="dashboard-chart">
                <h2>Entregas por Semana</h2>
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default DashboardPage;