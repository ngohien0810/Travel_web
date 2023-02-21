import React from 'react';

import ButtonAdd from '@/components/Button/ButtonAdd';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import {
    Input,
    PageHeader,
    Tag,
    Switch,
    Row,
    Col,
    Select,
    DatePicker,
    Space,
    Button,
    Popconfirm,
    Descriptions,
} from 'antd';
import Icon from '@ant-design/icons';
// import { categoryService } from './service';
import moment from 'moment';
import { orderService } from './service';
import { Notification } from '@/utils';
import IconAntd from '@/components/IconAntd';

const OrdersPage = () => {
    const [orders, setOrders] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [callback, setCallback] = React.useState(false);
    const [status, setStatus] = React.useState<any>('');
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    React.useEffect(() => {
        orderService.getOrders({ search, page, status, fromDate, toDate }).then((res: any) => {
            setOrders(res.data);
            setTotal(res?.totalItems);
        });
    }, [search, page, callback, status, fromDate, toDate]);

    const columns: any = [
        {
            width: '60px',
            title: <b>STT</b>,
            dataIndex: 'id',
            align: 'center',
            render: (row: any, record: any, index: number) => (page === 1 ? ++index : (page - 1) * 10 + ++index),

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
            title: <b>HT thanh toán</b>,
            dataIndex: 'PaymentMethod',
            render: (value: any) =>
                value == 1 ? <Tag color="processing">Tiền mặt</Tag> : <Tag color="processing">Chuyển khoản</Tag>,
        },
        {
            title: <b>Tổng tiền</b>,
            dataIndex: 'TotalPrice',
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'StatusOrder',
            align: 'center',
            render: (value: number, record: any) => {
                return <Switch checked={!!value} onChange={(value) => changeStatus(record.id, value)} />;
            },
        },
        {
            title: <b>Trạng thái tour</b>,
            dataIndex: 'tourStatus',
            align: 'center',
            render: (value: number, record: any) => {
                return !value ? <Tag color="processing">Đang chờ</Tag> : <Tag color="success">Hoàn thành</Tag>;
            },
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'CreatedDate',
            render: (value: number, record: any) => {
                return moment(value).format('DD/MM/YYYY');
            },
        },
        {
            title: <b>Thao tác</b>,
            dataIndex: 'action',
            align: 'center',
            render: (_: any, row: any) => {
                return (
                    <Popconfirm
                        onConfirm={() => {
                            // categoryService.deleteCategory(row?.id).then((res: any) => {
                            //     Notification('success', 'Xoá thành công');
                            //     setCallback(!callback);
                            // });
                            orderService.deleteOrder(row?.id).then((res: any) => {
                                Notification('success', 'Xoá thành công');
                                setCallback(!callback);
                            });
                        }}
                        title="Bạn có chắc chắn muốn xoá?"
                    >
                        <Button icon={<IconAntd icon="DeleteOutlined" />} />
                    </Popconfirm>
                );
            },
        },
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
                    <Row>
                        <Col span={8}>
                            <Input.Search
                                allowClear
                                style={{ margin: 0 }}
                                placeholder="Mã đơn hàng, tên khách hàng"
                                addonAfter={<Icon type="close-circle-o" />}
                                value={search}
                                onChange={(e: any) => {
                                    setSearch(e.target.value);
                                }}
                            />
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn trạng thái"
                                allowClear
                                onChange={(value: number | undefined) => {
                                    if (value === undefined) {
                                        setStatus(null);
                                    } else setStatus(value);
                                }}
                            >
                                <Select.Option value={1}>Hoạt động</Select.Option>
                                <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                format={'DD/MM/YYYY'}
                                placeholder={['Từ ngày', 'Đến ngày']}
                                onCalendarChange={(dates: any, dateStrings: any) => {
                                    if (!dates) {
                                        setFromDate(undefined);
                                        setToDate(undefined);
                                        return;
                                    }
                                    setFromDate(dates[0]?.format('YYYY-MM-DD'));
                                    setToDate(dates[1]?.format('YYYY-MM-DD'));
                                }}
                            />
                        </Col>
                    </Row>
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns}
                        dataSource={orders}
                        expandedRowRender={(record) => (
                            <div style={{ padding: '10px 60px' }}>
                                <Descriptions
                                    labelStyle={{ width: '200px' }}
                                    title="Thông tin liên hệ"
                                    bordered
                                    column={2}
                                >
                                    <Descriptions.Item label="Họ tên">
                                        {record?.contact?.Name || '--'}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Số điện thoại">
                                        {record?.contact?.Phone || '--'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ email">
                                        {record?.contact?.Email || '--'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Yêu cầu khác">
                                        {record?.contact?.Note || '--'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        )}
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
