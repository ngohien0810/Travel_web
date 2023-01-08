import ButtonAdd from '@/components/Button/ButtonAdd';
import { openNotificationWithIcon } from '@/components/Notification';
import TableComponent from '@/components/TableComponents';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';
import { currencyFormat } from '@/utils';

import { PageHeader, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import TourDetail from '../components/TourDetail';
import { tourService } from '../service';

export interface IPaging {
    total: number;
    current: number;
    pageSize: number;
}

interface ITour {
    title: string;
    numberDestination: number;
    status: number;
    date: string;
    image: string;
    description: string;
}

const TourPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = React.useState<string>('');
    const searchDebounce = useDebounce(search, 300);
    const [listTours, setListTours] = React.useState<ITour[]>([]);
    const [status, setStatus] = React.useState<number>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [currentTourId, setCurrentTourId] = React.useState<number>();
    const [expandedRowKeys, setExpandedRowKeys] = React.useState<number[]>([]);
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    const [params, setParams] = React.useState<any>({
        search: '',
        page: 1,
        limit: 10,
        fromDate: '',
        toDate: '',
    });

    const [total, setTotal] = React.useState<number>(0);

    const columns: any = (page: any) => [
        {
            width: '60px',
            title: <b>STT</b>,
            align: 'center',
            render: (value: any, row: any, index: number) => (page === 1 ? ++index : (page - 1) * 10 + ++index),
        },
        {
            title: <b>Mã tour</b>,
            align: 'center',
            dataIndex: 'Code',
        },
        {
            title: <b>Tên tour du lịch</b>,
            dataIndex: 'Title',
        },
        {
            title: <b>Giá tour</b>,
            dataIndex: 'TourPrice',
            render: (value: any) => currencyFormat(value),
        },
        {
            title: <b>Ngày khởi hành</b>,
            dataIndex: 'DateStartTour',
        },
        {
            title: <b>Lượt đánh giá</b>,
            dataIndex: 'feedbacks',
            align: 'center',
            render: (value: any) => value?.length,
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'Status',
            align: 'center',
            render: (value: number) => {
                if (value === 1) {
                    return <Tag color="green">Hoạt động</Tag>;
                } else return <Tag color="red">Ngừng hoạt động</Tag>;
            },
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'CreatedDate',
            render: (value: any) => moment(value).format('DD/MM/YYYY'),
        },
    ];

    const getTours = async () => {
        try {
            setIsLoading(true);
            const res: any = await tourService.getTours(params);
            if (res?.data) {
                const data = res?.data;
                setListTours(data);
                setTotal(res?.totalItems);
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDestination = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await tourService.deleteDestination(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá điểm đến thành công!');
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Xoá điểm đến thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeTourStatus = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await tourService.changeTourStatus(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái tour thành công!');
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Thay đổi trạng thái tour thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getTours();
    }, [params]);

    React.useEffect(() => {
        setParams({
            ...params,
            search: searchDebounce,
            fromDate: fromDate,
            toDate: toDate,
            status: status,
            page: currentPage,
        });
    }, [searchDebounce, status, fromDate, toDate, currentPage]);

    return (
        <Container
            header={
                <PageHeader
                    style={{ borderRadius: 8 }}
                    title="Danh sách tour"
                    extra={[
                        <ButtonAdd
                            text="Thêm mới"
                            onClickButton={() => {
                                navigate(routerPage.addEditTour);
                            }}
                        />,
                    ]}
                />
            }
            filterComponent={
                <Filter
                    setSearch={setSearch}
                    search={search}
                    status={status}
                    setStatus={setStatus}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            }
            contentComponent={
                <TableComponent
                    showTotalResult
                    columns={columns(params.page)}
                    dataSource={listTours}
                    page={params.page}
                    total={total}
                    loading={isLoading}
                    expandedRowRender={(record) => (
                        <TourDetail
                            record={record}
                            changeTourStatus={changeTourStatus}
                            deleteDestination={deleteDestination}
                            getTours={getTours}
                            currentTourId={currentTourId}
                        />
                    )}
                    onExpand={(expanded: boolean, record: any) => {
                        const keys = [];
                        if (expanded) {
                            keys.push(record.key);
                            setCurrentTourId(record.id);
                        }

                        setExpandedRowKeys(keys);
                    }}
                    onChangePage={(_page) => setParams({ ...params, page: _page })}
                />
            }
        />
    );
};

export default TourPage;
