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
        return AxiosClient.post(`/News/CreateNews`, payload);
    },
    updateNews: (payload: any) => {
        return AxiosClient.post(`/News/UpdateNews`, payload);
    },
    uploadImageToServer: (payload: any) => {
        return AxiosClient.post('/UploadFile/UploadFile', payload);
    },
    getNewsDetail: (id: number) => {
        return AxiosClient.get(`/News/GetNewsDetail/${id}`);
    },
    changeNewsStatus: (id: number) => {
        return AxiosClient.post(`/News/ChangeStatusNews/${id}`);
    },
};
