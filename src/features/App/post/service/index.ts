import AxiosClient from '@/apis/AxiosClient';

export const newsService = {
    getListNews: (payload: any) => {
        return AxiosClient.get('/news', { params: payload });
    },
    deleteNews: (id: number) => {
        return AxiosClient.delete(`/news/${id}`);
    },
    getListCategories: () => {
        return AxiosClient.get(`/categories`);
    },
    addNews: (payload: any) => {
        return AxiosClient.post(`news`, payload);
    },
    updateNews: (payload: any, id: any) => {
        return AxiosClient.put(`news/${id}`, payload);
    },
    uploadImageToServer: (payload: any) => {
        return AxiosClient.post('/UploadFile/UploadFile', payload);
    },
    getNewsDetail: (id: number) => {
        return AxiosClient.get(`/news/${id}`);
    },
    changeNewsStatus: (id: number) => {
        return AxiosClient.post(`/News/ChangeStatusNews/${id}`);
    },
};
