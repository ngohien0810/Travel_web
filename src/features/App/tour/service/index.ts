import AxiosClient from '@/apis/AxiosClient';

export const tourService = {
    getTours: (payload: any) => {
        return AxiosClient.get('/tours', { params: payload });
    },
    addTour: (payload: any) => {
        return AxiosClient.post(`/tours`, payload);
    },
    updateTour: (payload: any, id: any) => {
        return AxiosClient.put(`/tours/${id}`, payload);
    },
    deleteTour: (id: number) => {
        return AxiosClient.delete(`/tours/${id}`);
    },
    changeTourStatus: (id: number) => {
        return AxiosClient.post(`/Tour/ChangeStatus/${id}`);
    },
    getDestinations: (payload: any) => {
        return AxiosClient.get('/tours/destination', { params: payload });
    },
    deleteDestination: (id: number) => {
        return AxiosClient.delete(`/tours/destination/${id}`);
    },
    addDestination: (payload: any) => {
        return AxiosClient.post(`/tours/destination`, payload);
    },
    updateDestination: (payload: any, id: any) => {
        return AxiosClient.put(`/tours/destination/${id}`, payload);
    },
    changeDesStatus: (id: number) => {
        // return AxiosClient.post(`/Destination/ChangeStatus`, {params: {ID: id}})
        return AxiosClient.post(`/Destination/ChangeStatus?ID=${id}`);
    },
};
