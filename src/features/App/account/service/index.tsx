import AxiosClient from '@/apis/AxiosClient';

export const accountService = {
    getListAccounts: (payload: any) => {
        return AxiosClient.get('/accounts', { params: payload });
    },
    changeStatus: (id: number) => {
        return AxiosClient.post(`/User/ChangeStatus/${id}`);
    },
    deleteAccount: (id: number) => {
        return AxiosClient.delete(`/accounts/${id}`);
    },
    addAccount: (payload: any) => {
        return AxiosClient.post(`/accounts`, payload);
    },
    getAccountDetail: (id: number | undefined) => {
        return AxiosClient.get(`/User/GetUserDetail/${id}`);
    },
    updateAccount: (currentId: any, payload: any) => {
        return AxiosClient.put(`/accounts/${currentId}`, payload);
    },
    resetAccount: (id: number) => {
        return AxiosClient.post(`/User/ResetPassword?ID=${id}`, {});
    },
};
