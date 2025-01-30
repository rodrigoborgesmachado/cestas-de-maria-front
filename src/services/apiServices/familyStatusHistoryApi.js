import api from './serviceApi'; // Import the axios instance

const familyStatusHistoryApi = {
    /**
     * Fetch all family status history records with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of family status history records.
     */
    getAllFamilyStatusHistories: async (params = {}) => {
        try {
            const response = await api.get('/FamilyFamilyStatusHistory', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all family status histories:', error);
            throw error;
        }
    },

    /**
     * Fetch a family status history record by its code.
     * @param {string} code - The record's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The family status history data.
     */
    getFamilyStatusHistoryByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/FamilyFamilyStatusHistory/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching family status history by code:', error);
            throw error;
        }
    },

    /**
     * Create a new family status history record.
     * @param {Object} historyData - The history record data to create.
     * @returns {Promise<Object>} - The created record data.
     */
    createFamilyStatusHistory: async (historyData) => {
        try {
            const response = await api.post('/FamilyFamilyStatusHistory', historyData);
            return response.data;
        } catch (error) {
            console.error('Error creating family status history record:', error);
            throw error;
        }
    },

    /**
     * Update an existing family status history record.
     * @param {Object} historyData - The record data to update.
     * @returns {Promise<Object>} - The updated record data.
     */
    updateFamilyStatusHistory: async (historyData) => {
        try {
            const response = await api.put('/FamilyFamilyStatusHistory', historyData);
            return response.data;
        } catch (error) {
            console.error('Error updating family status history record:', error);
            throw error;
        }
    },

    /**
     * Delete a family status history record by its code.
     * @param {string} historyCode - The record code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteFamilyStatusHistory: async (historyCode) => {
        try {
            const response = await api.delete('/FamilyFamilyStatusHistory', {
                data: { code: historyCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting family status history record:', error);
            throw error;
        }
    },

    /**
     * Export family status history records based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportFamilyStatusHistories: async (params) => {
        try {
            const response = await api.get('/FamilyFamilyStatusHistory/export', {
                params,
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting family status histories:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of family status history records with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of family status history records.
     */
    getFamilyStatusHistoriesPaginated: async (params) => {
        try {
            const response = await api.get('/FamilyFamilyStatusHistory/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated family status histories:', error);
            throw error;
        }
    },
};

export default familyStatusHistoryApi;
