import AxiosClient from '@/apis/AxiosClient';

export const customerService = {
    getListCustomers: (payload: any) => {
        return AxiosClient.get('/users', { params: payload });
    },
    changeStatus: (id: number, payload: any) => {
        return AxiosClient.patch(`/users/${id}`, payload);
    },
    deleteCustomer: (id: number) => {
        return AxiosClient.delete(`/users/${id}`);
    },
};
