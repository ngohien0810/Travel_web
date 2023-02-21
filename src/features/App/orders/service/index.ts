import AxiosClient from '@/apis/AxiosClient';

export const orderService = {
    getOrders: (params: any) => {
        return AxiosClient.get('/orders', { params });
    },
    changeStatus: (id: any, status: any) => {
        return AxiosClient.patch('/orders/' + id, { StatusOrder: status });
    },
    deleteOrder: (id: any) => {
        return AxiosClient.delete('/orders/' + id);
    },
};
