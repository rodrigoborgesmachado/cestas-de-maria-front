import api from './serviceApi'; // Import the axios instance

const loggerApi = {
    /**
     * Fetch all log entries with optional filters.
     * @param {Object} params - Query parameters such as `dateBegin`, `dateFinal`, `filtro`, `page`, `quantity`, `orderby`, `include`.
     * @returns {Promise<Object>} - The list of log entries.
     */
    getAllLogs: async (params = {}) => {
        try {
            const response = await api.get('/logger', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all logs:', error);
            throw error;
        }
    },

    /**
     * Fetch a log entry by its code.
     * @param {string} code - The log entry's unique code.
     * @returns {Promise<Object>} - The log entry data.
     */
    getLogByCode: async (code) => {
        try {
            const response = await api.get(`/logger/${code}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching log by code:', error);
            throw error;
        }
    },

    /**
     * Create a new log entry.
     * @param {string} logData - The log message or data.
     * @returns {Promise<Object>} - The created log entry data.
     */
    createLog: async (logData) => {
        try {
            const response = await api.post('/logger', logData);
            return response.data;
        } catch (error) {
            console.error('Error creating log entry:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of log entries with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of log entries.
     */
    getLogsPaginated: async (params) => {
        try {
            const response = await api.get('/logger/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated logs:', error);
            throw error;
        }
    },
};

export default loggerApi;
