import axiosInstance from './axiosInstance';

export const verifyPhone = (phone: string) => {
    return axiosInstance.post('/password-reset/verify-phone', { phone });
};

export const resetPassword = (phone: string, newPassword: string) => {
    return axiosInstance.post('/password-reset/reset', { phone, newPassword });
};
