import api from './serviceApi'; // Import the axios instance

const basketDeliveryApi = {
    /**
     * Fetch all basket deliveries with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of basket deliveries.
     */
    getAllBasketDeliveries: async (params = {}) => {
        try {
            const response = await api.get('/BasketDeliveries', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all basket deliveries:', error);
            throw error;
        }
    },

    /**
     * Fetch a basket delivery by its code.
     * @param {string} code - The basket delivery's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The basket delivery data.
     */
    getBasketDeliveryByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/BasketDeliveries/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching basket delivery by code:', error);
            throw error;
        }
    },

    /**
     * Create a new basket delivery.
     * @param {Object} basketDeliveryData - The basket delivery data to create.
     * @returns {Promise<Object>} - The created basket delivery data.
     */
    createBasketDelivery: async (basketDeliveryData) => {
        try {
            const response = await api.post('/BasketDeliveries', basketDeliveryData);
            return response.data;
        } catch (error) {
            console.error('Error creating basket delivery:', error);
            throw error;
        }
    },

    /**
     * Update an existing basket delivery.
     * @param {Object} basketDeliveryData - The basket delivery data to update.
     * @returns {Promise<Object>} - The updated basket delivery data.
     */
    updateBasketDelivery: async (basketDeliveryData) => {
        try {
            const response = await api.put('/BasketDeliveries', basketDeliveryData);
            return response.data;
        } catch (error) {
            console.error('Error updating basket delivery:', error);
            throw error;
        }
    },

    /**
     * Delete a basket delivery by its code.
     * @param {string} basketDeliveryCode - The basket delivery code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteBasketDelivery: async (basketDeliveryCode) => {
        try {
            const response = await api.delete('/BasketDeliveries', {
                data: { code: basketDeliveryCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting basket delivery:', error);
            throw error;
        }
    },

    /**
     * Export basket deliveries based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportBasketDeliveries: async (params) => {
        try {
            const response = await api.get('/BasketDeliveries/export', {
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting basket deliveries:', error);
            throw error;
        }
    },

    /**
     * Export basket deliveries based on filters.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportFullReport: async () => {
        try {
            const response = await api.get('/BasketDeliveries/full-report');
            return response.data;
        } catch (error) {
            console.error('Error exporting basket deliveries:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of basket deliveries with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of basket deliveries.
     */
    getBasketDeliveriesPaginated: async (params) => {
        try {
            const response = await api.get('/BasketDeliveries/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated basket deliveries:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of basket deliveries with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of basket deliveries.
     */
    getByDate: async (params) => {
        try {
            const response = await api.get('/BasketDeliveries/GetByDate', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated basket deliveries:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of basket deliveries with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of basket deliveries.
     */
    getByDashboardData: async (params) => {
        try {
            const response = await api.get('/BasketDeliveries/dashboard-statistics', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated basket deliveries:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of basket deliveries with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of basket deliveries.
     */
    updateStatus: async (code, status) => {
        try {
            const response = await api.post(`/BasketDeliveries/update-status/${code}`, null, { // No request body
                params: { status }, // Send status as query param
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating basket delivery status:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of basket deliveries with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of basket deliveries.
     */
    updatefamily: async (code, newfamily, oldfamily) => {
        try {
            const response = await api.post(`/BasketDeliveries/update-family/${code}/${newfamily}/${oldfamily}`, null, { // No request body
                params: { }, // Send status as query param
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating basket delivery status:', error);
            throw error;
        }
    },
};

export default basketDeliveryApi;
