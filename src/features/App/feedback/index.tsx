import React from 'react';

import ButtonAdd from '@/components/Button/ButtonAdd';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import { Button, Input, PageHeader, Popconfirm, Rate, Switch } from 'antd';
import Icon from '@ant-design/icons';
// import { categoryService } from './service';
import moment from 'moment';
import { feedbackService } from './service';
import { Notification } from '@/utils';
import IconAntd from '@/components/IconAntd';
import useDebounce from '@/hooks/useDebounce';
const FeedbackPage = () => {
    const [callback, setCallback] = React.useState(false);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const debounceSearch = useDebounce(search, 500);

    const [feedbacks, setFeedbacks] = React.useState([]);
    React.useEffect(() => {
        feedbackService.get({ page, search: debounceSearch }).then((res: any) => {
            setFeedbacks(res.data);
            setTotal(res.totalItems);
        });
    }, [callback, debounceSearch]);

    const columns: any = [
        {
            width: '60px',
            title: <b>STT</b>,
            dataIndex: 'id',
            align: 'center',
            render: (row: any, record: any, index: number) => (page === 1 ? ++index : (page - 1) * 10 + ++index),
        },
        {
            title: <b>Mã tour</b>,
            dataIndex: 'tour',
            render: (value: any, row: any) => row?.tour?.Code,
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
            title: <b>Email</b>,
            dataIndex: 'Email',
        },
        {
            title: <b>Nội dung</b>,
            dataIndex: 'Note',
        },
        {
            title: <b>Số sao</b>,
            dataIndex: 'Rate',
            align: 'center',
            render: (value: any) => {
                return <Rate disabled value={value} />;
            },
        },
        {
            title: <b>Ngày phản hồi</b>,
            dataIndex: 'CreatedDate',
            render: (value: number, record: any) => {
                return moment(value).format('DD/MM/YYYY');
            },
        },
        {
            title: <b>Chi tiết</b>,
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
                            feedbackService.delete(row?.id).then((res: any) => {
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
    return (
        <div>
            <Container
                header={<PageHeader style={{ borderRadius: 8 }} title="Danh sách phản hồi" />}
                filterComponent={
                    <Input.Search
                        allowClear
                        style={{ width: '360px', margin: 0 }}
                        placeholder="Tên khách hàng, số điện thoại"
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
                        dataSource={feedbacks}
                        page={page}
                        total={total}
                        // loading={isLoading}
                        onChangePage={(_page) => setPage(_page)}
                    />
                }
            />
        </div>
    );
};

export default FeedbackPage;
