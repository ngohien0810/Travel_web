import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import { EMAIL_REGEX, EMAIL_REGEX_2, PHONE_REGEX } from '@/constant';
import { Button, Form, Input, Modal, Row, Select } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { accountService } from '../service';

interface IAddEditModal {
    isOpenModal: boolean;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    getListAccounts: () => Promise<void>;
    currentId: number | undefined;
    setCurrentId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const AddEditModal = (props: any) => {
    const { isOpenModal, setIsOpenModal, getListAccounts, currentId, setCurrentId, recordUpdate } = props;

    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const onFinish = async (values: any) => {
        const { name, phone, address, email, password, Role } = values;
        try {
            setIsLoading(true);
            if (!currentId) {
                // Thêm mới
                const payload = {
                    Username: name,
                    Phone: phone,
                    Address: address,
                    Password: password,
                    Email: email,
                    Role: Role,
                };
                const res: any = await accountService.addAccount(payload);
                if (res) {
                    openNotificationWithIcon('success', 'Thành công', 'Thêm tài khoản mới thành công!');
                    setIsOpenModal(false);
                    setCurrentId(undefined);
                    getListAccounts();
                } else {
                    // openNotificationWithIcon('error', 'Thất bại', 'Thêm tài khoản mới thất bại!');
                    openNotificationWithIcon('error', 'Thất bại', res?.data?.message);
                }
            } else {
                // Cập nhật
                const payload = {
                    Username: name,
                    Phone: phone,
                    Address: address,
                    Email: email,
                    Role: Role,
                };
                const res = await accountService.updateAccount(currentId, payload);
                if (res) {
                    openNotificationWithIcon('success', 'Thành công', 'Cập nhật tài khoản mới thành công!');
                    setIsOpenModal(false);
                    setCurrentId(undefined);
                    getListAccounts();
                } else {
                    openNotificationWithIcon('error', 'Thất bại', 'Cập nhật tài khoản mới thất bại!');
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        console.log(recordUpdate);
        if (currentId) {
            form.setFieldsValue({
                name: recordUpdate?.name,
                email: recordUpdate?.email,
                address: recordUpdate?.address,
                phone: recordUpdate?.phone,
                Role: recordUpdate?.Role,
            });
        }
    }, [currentId, recordUpdate]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Modal
                title={currentId ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
                open={isOpenModal}
                footer={null}
                onCancel={() => {
                    setIsOpenModal(false);
                    setCurrentId(undefined);
                }}
                destroyOnClose
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <CustomFormItem
                        label="Họ tên"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên!' },
                            { max: 65, message: 'Vui lòng nhập không quá 65 ký tự!' },
                        ]}
                    >
                        <Input allowClear placeholder="Họ tên" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { max: 10, message: 'Vui lòng nhập đúng 10 ký tự!' },
                            {
                                message: 'Số điện thoại không đúng định dạng!',
                                validator: (_, value) => {
                                    // const value = value.trim();
                                    if (PHONE_REGEX.test(value) || !value || value.length > 10) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject();
                                },
                            },
                        ]}
                    >
                        <Input disabled={currentId ? true : false} allowClear placeholder="Số điện thoại" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { max: 100, message: 'Vui lòng nhập không quá 100 ký tự!' },
                            {
                                message: 'Email không đúng định dạng!',
                                validator: (_, value) => {
                                    // const value = value.trim();
                                    if (
                                        (EMAIL_REGEX.test(value) && EMAIL_REGEX_2.test(value)) ||
                                        !value ||
                                        value.length > 100
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject();
                                },
                            },
                        ]}
                    >
                        <Input autoComplete="off" allowClear placeholder="Email" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng chọn địa chỉ!' }]}
                    >
                        <Input allowClear placeholder="Nhập địa chỉ chi tiết" />
                    </CustomFormItem>
                    <CustomFormItem
                        label="Loại tài khoản"
                        name="Role"
                        rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
                    >
                        <Select placeholder="Chọn loại tài khoản">
                            <Select.Option value={1}>Admin</Select.Option>
                            <Select.Option value={2}>Sub Admin</Select.Option>
                        </Select>
                    </CustomFormItem>

                    {!currentId && (
                        <>
                            <CustomFormItem
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 6, message: 'Mật khẩu chứa tối thiểu 6 ký tự!' },
                                    { max: 65, message: 'Mật khẩu chứa tối đa 65 ký tự!' },
                                    { whitespace: true, message: 'Mật khẩu không thể chứa khoảng trắng!' },
                                ]}
                            >
                                <Input.Password autoComplete="off" allowClear placeholder="Nhập mật khẩu" />
                            </CustomFormItem>
                            <CustomFormItem
                                label="Nhập lại mật khẩu"
                                name="confimedPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                    {
                                        message: 'Mật khẩu không khớp!',
                                        validator: (_, value) => {
                                            // const value = value.trim();
                                            if (value === form.getFieldValue('password') || !value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject();
                                        },
                                    },
                                ]}
                            >
                                <Input.Password allowClear placeholder="Nhập lại mật khẩu" />
                            </CustomFormItem>
                        </>
                    )}

                    <hr />
                    <Row justify="end">
                        <Button type="default" htmlType="submit" onClick={() => setIsOpenModal(false)}>
                            Đóng
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Row>
                </Form>
            </Modal>
        </CustomLoading>
    );
};

const CustomFormItem = styled(Form.Item)`
    margin-bottom: 30px;
`;

export default AddEditModal;
