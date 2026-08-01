export const API ={
    BASE_URL: "http://localhost:3000/api/v1",
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        DASHBOARD: '/dashboard',
        EXPENSES: '/expenses',
        REFRESH: '/auth/refresh-token'
    },
    PROFILE: {
        GET: '/profile',
        UPDATE_BUDGET: '/profile/budget'
    },
    REPORTS: {
        EXPORT: '/reports/export'
    },
    EXPENSES: {
        ADDEXPENSE: '/expenses',
        GETEXPENSES: '/expenses'
    }
}