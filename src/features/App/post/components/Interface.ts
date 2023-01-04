export interface IPaging {
    total: number;
    current: number;
    pageSize: number;
}

export interface IParams {
    searchKey?: string;
    status?: number;
    category?: number;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit?: number;
}

export interface INews {
    id: number;
    title: string;
    category: string[];
    loveNumber: number;
    status: number;
    date: string;
}

export interface ICategory {
    id: number;
    title: string;
}
