import React from 'react';

import ButtonAdd from '@/components/Button/ButtonAdd';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import { Input, PageHeader, Switch } from 'antd';
import Icon from '@ant-design/icons';
// import { categoryService } from './service';
import moment from 'moment';

const OrdersPage = () => {
    const [categories, setCategories] = React.useState([]);
    React.useEffect(() => {
        // categoryService.getListCategory().then((res: any) => {
        //     setCategories(res.data);
        // });
    }, []);
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
        },
        {
            title: <b>Số điện thoại</b>,
            dataIndex: 'Phone',
        },
        {
            title: <b>Hình thức thanh toán</b>,
            dataIndex: 'PaymentMethod',
        },
        {
            title: <b>Tổng tiền</b>,
            dataIndex: 'TotalPrice',
        },
        {
            title: <b>Trạng thái đơn hàng</b>,
            dataIndex: 'StatusOrder',
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'CreatedDate',
            render: (value: number, record: any) => {
                return moment(value).format('DD/MM/YYYY');
            },
        },
        {
            title: <b>Chi tiết</b>,
            dataIndex: 'title',
        },
    ];
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
                        // value={search}
                        // onChange={(e: any) => {
                        //     setSearch(e.target.value);
                        // }}
                    />
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns}
                        dataSource={categories}
                        // page={params.page}
                        // total={paging.total}
                        // loading={isLoading}
                        // onChangePage={(_page) => setParams({ ...params, page: _page })}
                    />
                }
            />
        </div>
    );
};

export default OrdersPage;
