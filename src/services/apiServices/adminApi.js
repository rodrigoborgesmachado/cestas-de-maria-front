import api from './serviceApi'; // Import the axios instance

const adminApi = {
    /**
     * Fetch all admins with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of admins.
     */
    getAllAdmins: async (params = {}) => {
        try {
            const response = await api.get('/Admins', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all admins:', error);
            throw error;
        }
    },

    /**
     * Fetch an admin by their code.
     * @param {string} code - The admin's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The admin data.
     */
    getAdminByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/Admins/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching admin by code:', error);
            throw error;
        }
    },

    /**
     * Create a new admin.
     * @param {Object} adminData - The admin data to create.
     * @returns {Promise<Object>} - The created admin data.
     */
    createAdmin: async (adminData) => {
        try {
            const response = await api.post('/Admins', adminData);
            return response.data;
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    },

    /**
     * Create a new admin.
     * @param {Object} adminData - The admin data to create.
     * @returns {Promise<Object>} - The created admin data.
     */
    confirmUser: async (adminData) => {
        try {
            const response = await api.post('/Admins/confirm-user', adminData);
            return response.data;
        } catch (error) {
            console.error('Error confirming admin:', error);
            throw error;
        }
    },

    /**
     * Create a new admin.
     * @param {Object} userId - The admin data to create.
     * @returns {Promise<Object>} - The created admin data.
     */
    inativateAdmin: async (userId) => {
        try {
            const response = await api.post('/Admins/inactive-user/' + userId);
            return response.data;
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    },

    /**
     * Create a new admin.
     * @param {Object} userId - The admin data to create.
     * @returns {Promise<Object>} - The created admin data.
     */
    ativateAdmin: async (userId) => {
        try {
            const response = await api.post('/Admins/active-user/' + userId);
            return response.data;
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    },

    /**
     * Update an existing admin.
     * @param {Object} adminData - The admin data to update.
     * @returns {Promise<Object>} - The updated admin data.
     */
    updateAdmin: async (adminData) => {
        try {
            const response = await api.put('/Admins', adminData);
            return response.data;
        } catch (error) {
            console.error('Error updating admin:', error);
            throw error;
        }
    },

    /**
     * Delete an admin by their code.
     * @param {string} adminCode - The admin code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteAdmin: async (adminCode) => {
        try {
            const response = await api.delete('/Admins', {
                data: { code: adminCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting admin:', error);
            throw error;
        }
    },

    /**
     * Export admins based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportAdmins: async (params) => {
        try {
            const response = await api.get('/Admins/export', {
                params,
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting admins:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of admins with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of admins.
     */
    getAdminsPaginated: async (params) => {
        try {
            const response = await api.get('/Admins/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated admins:', error);
            throw error;
        }
    },

    /**
     * Create a new admin.
     * @param {Object} email - The admin data to create.
     * @returns {Promise<Object>} - The created admin data.
     */
    recoverPass: async (email) => {
        try {
            const response = await api.get('/Admins/recover-pass-user?email=' + email);
            return response.data;
        } catch (error) {
            console.error('Error getting password admin:', error);
            throw error;
        }
    },
};

export default adminApi;
