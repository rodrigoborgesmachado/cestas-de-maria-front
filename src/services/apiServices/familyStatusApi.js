import api from './serviceApi'; // Import the axios instance

const familyStatusApi = {
    /**
     * Fetch all family statuses with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of family statuses.
     */
    getAllFamilyStatuses: async (params = {}) => {
        try {
            const response = await api.get('/FamilyStatus', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all family statuses:', error);
            throw error;
        }
    },

    /**
     * Fetch a family status by its code.
     * @param {string} code - The family status's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The family status data.
     */
    getFamilyStatusByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/FamilyStatus/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching family status by code:', error);
            throw error;
        }
    },

    /**
     * Create a new family status.
     * @param {Object} familyStatusData - The family status data to create.
     * @returns {Promise<Object>} - The created family status data.
     */
    createFamilyStatus: async (familyStatusData) => {
        try {
            const response = await api.post('/FamilyStatus', familyStatusData);
            return response.data;
        } catch (error) {
            console.error('Error creating family status:', error);
            throw error;
        }
    },

    /**
     * Update an existing family status.
     * @param {Object} familyStatusData - The family status data to update.
     * @returns {Promise<Object>} - The updated family status data.
     */
    updateFamilyStatus: async (familyStatusData) => {
        try {
            const response = await api.put('/FamilyStatus', familyStatusData);
            return response.data;
        } catch (error) {
            console.error('Error updating family status:', error);
            throw error;
        }
    },

    /**
     * Delete a family status by its code.
     * @param {string} familyStatusCode - The family status code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteFamilyStatus: async (familyStatusCode) => {
        try {
            const response = await api.delete('/FamilyStatus', {
                data: { code: familyStatusCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting family status:', error);
            throw error;
        }
    },

    /**
     * Export family statuses based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportFamilyStatuses: async (params) => {
        try {
            const response = await api.get('/FamilyStatus/export', {
                params,
                
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting family statuses:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of family statuses with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of family statuses.
     */
    getFamilyStatusesPaginated: async (params) => {
        try {
            const response = await api.get('/FamilyStatus/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated family statuses:', error);
            throw error;
        }
    },
};

export default familyStatusApi;
