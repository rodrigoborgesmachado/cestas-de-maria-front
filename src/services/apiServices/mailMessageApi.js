import api from './serviceApi'; // Import the axios instance

const mailMessageApi = {
    /**
     * Fetch all mail messages with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list of mail messages.
     */
    getAllMailMessages: async (params = {}) => {
        try {
            const response = await api.get('/MailMessage', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all mail messages:', error);
            throw error;
        }
    },

    /**
     * Fetch a mail message by its code.
     * @param {string} code - The mail message's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The mail message data.
     */
    getMailMessageByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/MailMessage/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching mail message by code:', error);
            throw error;
        }
    },

    /**
     * Create a new mail message.
     * @param {Object} mailMessageData - The mail message data to create.
     * @returns {Promise<Object>} - The created mail message data.
     */
    createMailMessage: async (mailMessageData) => {
        try {
            const response = await api.post('/MailMessage', mailMessageData);
            return response.data;
        } catch (error) {
            console.error('Error creating mail message:', error);
            throw error;
        }
    },

    /**
     * Update an existing mail message.
     * @param {Object} mailMessageData - The mail message data to update.
     * @returns {Promise<Object>} - The updated mail message data.
     */
    updateMailMessage: async (mailMessageData) => {
        try {
            const response = await api.put('/MailMessage', mailMessageData);
            return response.data;
        } catch (error) {
            console.error('Error updating mail message:', error);
            throw error;
        }
    },

    /**
     * Delete a mail message by its code.
     * @param {string} mailMessageCode - The mail message code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    deleteMailMessage: async (mailMessageCode) => {
        try {
            const response = await api.delete('/MailMessage', {
                data: { code: mailMessageCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting mail message:', error);
            throw error;
        }
    },

    /**
     * Export mail messages based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    exportMailMessages: async (params) => {
        try {
            const response = await api.get('/MailMessage/export', {
                params,
                
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting mail messages:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of mail messages with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of mail messages.
     */
    getMailMessagesPaginated: async (params) => {
        try {
            const response = await api.get('/MailMessage/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated mail messages:', error);
            throw error;
        }
    },

    /**
     * Resend a mail message by its code.
     * @param {string} code - The mail message's unique code.
     * @returns {Promise<Object>} - The response from the resend request.
     */
    resendMailMessage: async (code) => {
        try {
            const response = await api.get(`/MailMessage/resend/${code}`);
            return response.data;
        } catch (error) {
            console.error('Error resending mail message:', error);
            throw error;
        }
    },
};

export default mailMessageApi;
