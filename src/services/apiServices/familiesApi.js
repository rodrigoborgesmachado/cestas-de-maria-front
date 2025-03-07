import api from './serviceApi'; // Import the axios instance

const familiesApi = {
    /**
     * Fetch all families with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of families.
     */
    getAllFamilies: async (params = {}) => {
        try {
            const response = await api.get('/Families', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all families:', error);
            throw error;
        }
    },

    /**
     * Fetch a family by its code.
     * @param {string} code - The family's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The family data.
     */
    getFamilyByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/Families/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching family by code:', error);
            throw error;
        }
    },

    /**
     * Fetch a family by its document.
     * @param {string} document - The family's unique document.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The family data.
     */
    getFamilyByDocument: async (document, params = {}) => {
        try {
            const response = await api.get(`/Families/getbydocument/${document}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching family by document:', error);
            throw error;
        }
    },

    /**
     * Fetch a family by its phone.
     * @param {string} phone - The family's unique phone.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The family data.
     */
    getFamilyByPhone: async (phone, params = {}) => {
        try {
            const response = await api.get(`/Families/getbyphone/${phone}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching family by phone:', error);
            throw error;
        }
    },

    /**
     * Create a new family.
     * @param {Object} familyData - The family data to create.
     * @returns {Promise<Object>} - The created family data.
     */
    createFamily: async (familyData) => {
        try {
            const response = await api.post('/Families', familyData);
            return response.data;
        } catch (error) {
            console.error('Error creating family:', error);
            throw error;
        }
    },

    /**
     * Update an existing family.
     * @param {Object} familyData - The family data to update.
     * @returns {Promise<Object>} - The updated family data.
     */
    updateFamily: async (code, familyData) => {
        try {
            const response = await api.post('/Families/edit/' + code, familyData);
            return response.data;
        } catch (error) {
            console.error('Error updating family:', error);
            throw error;
        }
    },

    /**
     * Delete a family by its code.
     * @param {string} familyCode - The family code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteFamily: async (familyCode) => {
        try {
            const response = await api.delete('/Families', {
                data: { code: familyCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting family:', error);
            throw error;
        }
    },

    /**
     * Export families based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportFamilies: async (params) => {
        try {
            const response = await api.get('/Families/export', {
                params,
                
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting families:', error);
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
            const response = await api.post(`/Families/update-status/${code}`, null, { // No request body
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
     * Fetch a paginated list of families with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of families.
     */
    getFamiliesPaginated: async (params) => {
        try {
            const response = await api.get('/Families/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated families:', error);
            throw error;
        }
    },
};

export default familiesApi;
