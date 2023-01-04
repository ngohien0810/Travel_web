import AxiosClient from '@/apis/AxiosClient';

export const categoryService = {
    getListCategory: (payload?: any) => {
        return AxiosClient.get('/categories', { params: payload });
    },
    createCategory: (payload: any) => {
        return AxiosClient.post('/categories', payload);
    },
    updateCategory: (id: any, payload: any) => {
        return AxiosClient.put('/categories/' + id, payload);
    },
    deleteCategory: (id: any) => {
        return AxiosClient.delete('/categories/' + id);
    },
};
