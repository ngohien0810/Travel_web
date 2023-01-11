import React from 'react';

import ButtonAdd from '@/components/Button/ButtonAdd';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import { Input, PageHeader, Tag, Switch } from 'antd';
import Icon from '@ant-design/icons';
// import { categoryService } from './service';
import moment from 'moment';
import { orderService } from './service';
import { Notification } from '@/utils';

const OrdersPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [callback, setCallback] = React.useState(false);

    React.useEffect(() => {
        orderService.getOrders({ search, page }).then((res: any) => {
            setOrders(res.data);
            setTotal(res?.totalItems);
        });
    }, [search, page, callback]);

    const columns: any = [
        {
            width: '60px',
            title: <b>STT</b>,
            dataIndex: 'id',
            align: 'center',
            // render: (text: any, record: any, index: any) => (
            //     <td id={record.id}>{(paging.current - 1) * paging.pageSize + index + 1}</td>
            // ),
        },
        {
            title: <b>Mã đơn hàng</b>,
            dataIndex: 'Code',
        },
        {
            title: <b>Mã Tour</b>,
            dataIndex: 'CodeTour',
        },
        {
            title: <b>Tên khách hàng</b>,
            dataIndex: 'Name',
            render: (value: any, row: any) => row?.customer?.Name,
        },
        {
            title: <b>Số điện thoại</b>,
            dataIndex: 'Phone',
            render: (value: any, row: any) => row?.customer?.Phone,
        },
        {
            title: <b>Hình thức thanh toán</b>,
            dataIndex: 'PaymentMethod',
            render: (value: any) =>
                value == 1 ? <Tag color="processing">Tiền mặt</Tag> : <Tag color="processing">Chuyển khoản</Tag>,
        },
        {
            title: <b>Tổng tiền</b>,
            dataIndex: 'TotalPrice',
        },
        {
            title: <b>Trạng thái đơn hàng</b>,
            dataIndex: 'StatusOrder',
            render: (value: number, record: any) => {
                return <Switch checked={!!value} onChange={(value) => changeStatus(record.id, value)} />;
            },
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'CreatedDate',
            render: (value: number, record: any) => {
                return moment(value).format('DD/MM/YYYY');
            },
        },
        // {
        //     title: <b>Chi tiết</b>,
        //     dataIndex: 'title',
        // },
    ];

    const changeStatus = (id: any, status: any) => {
        orderService.changeStatus(id, status).then((res: any) => {
            if (res) {
                setCallback(!callback);
                Notification('success', 'Thay đổi trạng thái thành công');
            }
        });
    };

    return (
        <div>
            <Container
                header={<PageHeader style={{ borderRadius: 8 }} title="Danh sách đơn hàng" />}
                filterComponent={
                    <Input.Search
                        allowClear
                        style={{ width: '360px', margin: 0 }}
                        placeholder="Mã đơn hàng, tên khách hàng, số điện thoại"
                        addonAfter={<Icon type="close-circle-o" />}
                        value={search}
                        onChange={(e: any) => {
                            setSearch(e.target.value);
                        }}
                    />
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns}
                        dataSource={orders}
                        page={page}
                        total={total}
                        onChangePage={(_page) => setPage(_page)}
                    />
                }
            />
        </div>
    );
};

export default OrdersPage;
