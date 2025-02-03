import api from './serviceApi'; // Import the axios instance

const basketDeliveryStatusApi = {
    /**
     * Fetch all basket delivery statuses with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of basket delivery statuses.
     */
    getAllBasketDeliveryStatuses: async (params = {}) => {
        try {
            const response = await api.get('/BasketDeliveryStatus', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all basket delivery statuses:', error);
            throw error;
        }
    },

    /**
     * Fetch a basket delivery status by its code.
     * @param {string} code - The basket delivery status unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The basket delivery status data.
     */
    getBasketDeliveryStatusByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/BasketDeliveryStatus/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching basket delivery status by code:', error);
            throw error;
        }
    },

    /**
     * Create a new basket delivery status.
     * @param {Object} basketDeliveryStatusData - The basket delivery status data to create.
     * @returns {Promise<Object>} - The created basket delivery status data.
     */
    createBasketDeliveryStatus: async (basketDeliveryStatusData) => {
        try {
            const response = await api.post('/BasketDeliveryStatus', basketDeliveryStatusData);
            return response.data;
        } catch (error) {
            console.error('Error creating basket delivery status:', error);
            throw error;
        }
    },

    /**
     * Update an existing basket delivery status.
     * @param {Object} basketDeliveryStatusData - The basket delivery status data to update.
     * @returns {Promise<Object>} - The updated basket delivery status data.
     */
    updateBasketDeliveryStatus: async (basketDeliveryStatusData) => {
        try {
            const response = await api.put('/BasketDeliveryStatus', basketDeliveryStatusData);
            return response.data;
        } catch (error) {
            console.error('Error updating basket delivery status:', error);
            throw error;
        }
    },

    /**
     * Delete a basket delivery status by its code.
     * @param {string} basketDeliveryStatusCode - The basket delivery status code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteBasketDeliveryStatus: async (basketDeliveryStatusCode) => {
        try {
            const response = await api.delete('/BasketDeliveryStatus', {
                data: { code: basketDeliveryStatusCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting basket delivery status:', error);
            throw error;
        }
    },

    /**
     * Export basket delivery statuses based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportBasketDeliveryStatuses: async (params) => {
        try {
            const response = await api.get('/BasketDeliveryStatus/export', {
                params,
                
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting basket delivery statuses:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of basket delivery statuses with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of basket delivery statuses.
     */
    getBasketDeliveryStatusesPaginated: async (params) => {
        try {
            const response = await api.get('/BasketDeliveryStatus/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated basket delivery statuses:', error);
            throw error;
        }
    },
};

export default basketDeliveryStatusApi;