export interface ITourDetail {
    record: any;
    changeTourStatus: any;
    deleteDestination: (id: number) => Promise<void>;
    getTours: () => Promise<void>;
    currentTourId: number | undefined;
}

export interface IParam {
    IDTour: number;
    SearchKey: string;
    page: number;
    limit: 10;
}

export interface IDestinationDetail {
    id: number;
    desName: string;
    index: number;
    description: string;
    mapUrl: string;
    imgUrl: string;
    videoUrl: string;
}
