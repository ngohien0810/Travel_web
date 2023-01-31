import ButtonAdd from '@/components/Button/ButtonAdd';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import { Input, PageHeader, Switch, Button, Row, Space, Popconfirm, Form } from 'antd';
import React from 'react';
import Icon from '@ant-design/icons';
import { categoryService } from './service';
import moment from 'moment';
import ModalComponent from '@/components/ModalComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import { Notification } from '@/utils';
import IconAntd from '@/components/IconAntd';

const CategoryPage = () => {
    const [categories, setCategories] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);

    const [search, setSearch] = React.useState('');

    const [visible, setVisible] = React.useState(false);
    const [callback, setCallback] = React.useState(false);

    const [id, setId] = React.useState('');

    const [form] = Form.useForm();

    React.useEffect(() => {
        categoryService.getListCategory({ title: search, page }).then((res: any) => {
            setTotal(res.totalItems);
            setCategories(res.data);
        });
    }, [search, page, callback]);

    const onSubmitForm = (values: any) => {
        if (id) {
            categoryService.updateCategory(id, { ...values }).then((res: any) => {
                Notification('success', 'Cập nhật thành công');
                setCallback(!callback);
                setVisible(false);
                setId('');
            });
        } else {
            categoryService.createCategory({ ...values }).then((res: any) => {
                Notification('success', 'Thêm mới thành công');
                setCallback(!callback);
                setVisible(false);
            });
        }

        form.resetFields();
    };

    const columns: any = (page: any) => [
        {
            width: '60px',
            title: <b>STT</b>,
            dataIndex: 'id',
            align: 'center',
            render: (row: any, record: any, index: number) => (page === 1 ? ++index : (page - 1) * 10 + ++index),
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
                return (
                    <Switch
                        checked={value === 1}
                        onChange={() => {
                            categoryService
                                .updateCategory(record.id, { Status: value === 1 ? 0 : 1 })
                                .then((res: any) => {
                                    Notification('success', 'Cập nhật thành công');
                                    setCallback(!callback);
                                    setVisible(false);
                                    setId('');
                                });
                        }}
                    />
                );
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
        {
            title: '',
            dataIndex: 'action',
            width: '100px',
            render: (_: any, row: any) => {
                return (
                    <Space>
                        <Button
                            icon={<IconAntd icon="EditOutlined" />}
                            onClick={() => {
                                setId(row?.id);
                                form.setFieldsValue({
                                    Name: row?.Name,
                                });
                                setVisible(true);
                            }}
                        />
                        <Popconfirm
                            onConfirm={() => {
                                categoryService.deleteCategory(row?.id).then((res: any) => {
                                    Notification('success', 'Xoá thành công');
                                    setCallback(!callback);
                                });
                            }}
                            title="Bạn có chắc chắn muốn xoá?"
                        >
                            <Button icon={<IconAntd icon="DeleteOutlined" />} />
                        </Popconfirm>
                    </Space>
                );
            },
        },
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
                                    setVisible(true);
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
                        value={search}
                        onChange={(e: any) => {
                            setSearch(e.target.value);
                        }}
                    />
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns(page)}
                        dataSource={categories}
                        page={page}
                        total={total}
                        // loading={isLoading}
                        onChangePage={(_page) => setPage(_page)}
                    />
                }
            />

            <ModalComponent modalVisible={visible} title="Thêm danh mục">
                <FormComponent form={form} onSubmit={onSubmitForm}>
                    <FormItemComponent
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên danh mục',
                            },
                        ]}
                        name="Name"
                        inputField={<Input placeholder="Tên danh mục" />}
                        label="Tên danh mục"
                    />

                    <Row justify="end" className="gx-m-0">
                        <Button
                            onClick={() => {
                                setId('');
                                setVisible(false);
                            }}
                        >
                            Đóng
                        </Button>
                        <Button htmlType="submit" type="primary">
                            Lưu
                        </Button>
                    </Row>
                </FormComponent>
            </ModalComponent>
        </div>
    );
};

export default CategoryPage;
