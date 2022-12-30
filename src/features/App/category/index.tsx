import ButtonAdd from '@/components/Button/ButtonAdd';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import { Input, PageHeader, Switch } from 'antd';
import React from 'react';
import Icon from '@ant-design/icons';
import { categoryService } from './service';
import moment from 'moment';
const CategoryPage = () => {
    const [categories, setCategories] = React.useState([]);
    React.useEffect(() => {
        categoryService.getListCategory().then((res: any) => {
            setCategories(res.data);
        });
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
            title: <b>Tên danh mục</b>,
            dataIndex: 'Name',
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'Status',
            width: '200px',
            align: 'center',
            render: (value: number, record: any) => {
                return <Switch checked={value === 1} onChange={() => record.id} />;
            },
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'CreatedDate',
            width: '200px',
            align: 'center',
            render: (value: number, record: any) => {
                return moment(value).format('DD/MM/YYYY');
            },
        },
        // {
        //     title: <b>Chi tiết</b>,
        //     dataIndex: 'title',
        // },
    ];
    return (
        <div>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Danh sách danh mục"
                        extra={[
                            <ButtonAdd
                                text="Thêm mới"
                                onClickButton={() => {
                                    // navigate(routerPage.addEditPost);
                                }}
                            />,
                        ]}
                    />
                }
                filterComponent={
                    <Input.Search
                        allowClear
                        style={{ width: '360px', margin: 0 }}
                        placeholder="Tên danh mục"
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

export default CategoryPage;
