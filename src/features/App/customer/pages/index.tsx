import ButtonAdd from '@/components/Button/ButtonAdd';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import TableComponent from '@/components/TableComponents';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';
import PageLayout from '@/layout';
import { PageHeader, Popconfirm, Spin, Switch, Table, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IPaging } from '../../tour/pages';
import AddEditModal from '../components/AddEditModal';
import Filter from '../components/Filter';
import { customerService } from '../service';

const data = [
    {
        id: 1,
        name: 'Ja Morrant',
        phone: '09672720934',
        address: '299 Trung Kinh',
        date: '09/20/2002',
        status: 1,
    },
];

interface IParams {
    searchKey?: string;
    page?: number;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    status?: number;
}

interface ICustomer {
    id: number;
    name: string;
    phone: string;
    address: string;
    date: string;
    status: number;
}

const CustomerPage = () => {
    const columns: any = [
        {
            width: '70px',
            title: <b>STT</b>,
            dataIndex: 'stt',
            align: 'center',
            render: (row: any, record: any, index: number) =>
                params.page === 1 ? ++index : (params.page - 1) * 10 + ++index,
        },
        {
            title: <b>Tên khách hàng</b>,
            width: '35%',
            dataIndex: 'name',
        },
        {
            title: <b>Số điện thoại</b>,
            dataIndex: 'phone',
        },
        {
            title: <b>Email</b>,
            dataIndex: 'email',
        },
        {
            title: <b>Địa chỉ chi tiết</b>,
            dataIndex: 'address',
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'date',
            render: (value: any) => moment(value).format('DD/MM/YYYY'),
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            align: 'center',
            render: (value: number, record: any) => {
                return <Switch checked={value === 1} onChange={(check) => changeStatus(record.id, check)} />;
            },
        },

        // {
        //     title: <b>Chi tiết</b>,
        //     dataIndex: '',
        //     width: 100,
        //     render: (_: any, record: any) => {
        //         return (
        //             <>
        //                 <Popconfirm
        //                     title="Bạn có chắc chắn muốn xoá người dùng này?"
        //                     placement="top"
        //                     // onConfirm={() => deleteNews(record.id)}
        //                     okText="Xoá"
        //                     cancelText="Đóng"
        //                     okButtonProps={{
        //                         type: 'primary',
        //                         danger: true,
        //                     }}
        //                     style={{ background: 'red' }}
        //                 >
        //                     <a style={{ color: 'red' }} href="#">
        //                         <IconAntd icon="DeleteOutlined" fontSize={18} marginLeft={20} />
        //                     </a>
        //                 </Popconfirm>
        //             </>
        //         );
        //     },
        // },
    ];

    const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
    const [listCustomers, setListCustomers] = React.useState<ICustomer[]>([]);
    const [search, setSearch] = React.useState<string>('');
    const [status, setStatus] = React.useState<number>();
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    const [isLoading, setisLoading] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [total, setTotal] = React.useState<any>(0);
    const [page, setPage] = React.useState<number>(1);
    const [params, setParams] = React.useState<any>({
        search: '',
        page: 1,
        fromDate: '',
        toDate: '',
        limit: 10,
        status: status,
    });

    const getListCustomers = async () => {
        try {
            setisLoading(true);
            const res: any = await customerService.getListCustomers(params);
            if (res) {
                const data = res?.data?.map((item: any) => {
                    return {
                        id: item?.id,
                        name: item?.Name || '---',
                        phone: item?.Phone || '---',
                        email: item?.Email || '---',
                        address: item?.Address || '---',
                        date: item?.CreatedDate || '---',
                        status: item?.Status,
                    };
                });
                setListCustomers(data);
                setTotal(res?.totalItems);
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    const changeStatus = async (id: number, value: any) => {
        try {
            setisLoading(true);
            const res = await customerService.changeStatus(id, {
                Status: value,
            });
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái người dùng thành công!');
                getListCustomers();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Thay đổi trạng thái người dùng thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    const searchDebounce = useDebounce(search, 300);

    React.useEffect(() => {
        setParams({
            ...params,
            search: searchDebounce,
            status: status,
            fromDate: fromDate,
            toDate: toDate,
        });
    }, [searchDebounce, status, fromDate, toDate]);

    React.useEffect(() => {
        getListCustomers();
    }, [params]);

    return (
        <>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Khách hàng"
                        // extra={[
                        //     <ButtonAdd
                        //         text="Thêm mới"
                        //         onClickButton={() => {
                        //             setIsOpenModal(true);
                        //         }}
                        //     />,
                        // ]}
                    />
                }
                filterComponent={
                    <Filter
                        setSearch={setSearch}
                        search={search}
                        status={status}
                        setToDate={setToDate}
                        setStatus={setStatus}
                        toDate={toDate}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                    />
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns}
                        dataSource={listCustomers}
                        page={params.page}
                        total={total}
                        loading={isLoading}
                        onChangePage={(_page) => setParams({ ...params, page: _page })}
                    />
                }
            />
            <AddEditModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
        </>
    );
};

export default CustomerPage;
