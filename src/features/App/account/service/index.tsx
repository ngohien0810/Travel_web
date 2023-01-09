import AxiosClient from '@/apis/AxiosClient';

export const accountService = {
    getListAccounts: (payload: any) => {
        return AxiosClient.get('/accounts', { params: payload });
    },
    changeStatus: (id: number) => {
        return AxiosClient.post(`/User/ChangeStatus/${id}`);
    },
    deleteAccount: (id: number) => {
        return AxiosClient.post(`/User/DeleteUser/${id}`);
    },
    addAccount: (payload: any) => {
        return AxiosClient.post(`/User/CreateUser`, payload);
    },
    getAccountDetail: (id: number | undefined) => {
        return AxiosClient.get(`/User/GetUserDetail/${id}`);
    },
    updateAccount: (payload: any) => {
        return AxiosClient.post(`/User/UpdateUser`, payload);
    },
    resetAccount: (id: number) => {
        return AxiosClient.post(`/User/ResetPassword?ID=${id}`, {});
    },
};
