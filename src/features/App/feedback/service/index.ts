import AxiosClient from '@/apis/AxiosClient';

export const feedbackService = {
    get: (params?: any) => {
        return AxiosClient.get('/feedback', { params });
    },
    delete: (id?: any) => {
        return AxiosClient.delete('/feedback/' + id);
    },
    changeFeedbackStatus: (id: number, isActive: any) => {
        return AxiosClient.patch(`/feedback/${id}`, { isActive });
    },
};
