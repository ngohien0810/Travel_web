import LocalStorage from '@/apis/LocalStorage';
import { colors, PHONE_REGEX } from '@/constant';
import { enterNumbersOnly, Notification, wait } from '@/utils';
import { Button, Form, Input, Row, Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import '../components/styles.css';
import { authenService } from '../service';
import bgTravel from '../../../../assets/travel_bg.jpg';
import { BOX_SHADOW } from '@/config/theme';
import { BarLoader, DotLoader } from 'react-spinners';

const LoginPage = () => {
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                phone: values.phone,
                password: values.password,
            };
            const res: any = await authenService.login(payload);
            if (res?.status) {
                // LocalStorage.setToken(`${res?.data?.token}`);
                LocalStorage.setLogged(res?.user?.id);
                Notification('success', 'Đăng nhập thành công');
                wait(400).then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}
        >
            <Spin style={{ top: '12%' }} indicator={<DotLoader color="#015871" />} spinning={loading}>
                <LoginFormBlock>
                    <Block>
                        <FormBlock>
                            <div style={{ marginBottom: 40 }}>
                                <p style={{ fontSize: 25, fontWeight: '700' }}>VIETNAM TRAVEL</p>
                                <div style={{ marginTop: -20 }}>
                                    <p style={{ fontSize: 14, fontWeight: '700', color: 'lightgray' }}>
                                        Chào mừng bạn quay trở lại!
                                    </p>
                                </div>
                            </div>
                            <Form
                                name="basic"
                                labelCol={{ span: 0 }}
                                wrapperCol={{ span: 24 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    name="phone"
                                    style={{ marginBottom: 15 }}
                                    rules={[
                                        // { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        {
                                            message: 'Số điện thoại không đúng định dạng!',
                                            validator: (_, value) => {
                                                const trimValue = value.trim();
                                                if (PHONE_REGEX.test(trimValue)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject();
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nhập số điện thoại" allowClear autoComplete="off" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu cần chứa ít nhất 6 ký tự!' },
                                    ]}
                                >
                                    <Input.Password placeholder="Nhập mật khẩu" autoComplete="off" />
                                </Form.Item>

                                {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                <Checkbox>Nhớ tài khoản</Checkbox>
                            </Form.Item> */}
                                <br />
                                <Row justify="center" style={{ position: 'relative' }}>
                                    <Button htmlType="submit" type="primary">
                                        Đăng nhập
                                    </Button>
                                </Row>
                            </Form>
                        </FormBlock>
                    </Block>
                    <Block>
                        <Image className="image" src={bgTravel} />
                    </Block>
                </LoginFormBlock>
            </Spin>
        </div>
    );
};

const LoginFormBlock = styled.div`
    border-radius: 16px;
    background-color: white;
    display: flex;
    flex-direction: row;
    height: 65vh;
    width: 60vw;
    box-shadow: ${BOX_SHADOW};
    padding: 6px;
`;

const FormBlock = styled.div`
    width: 70%;

    .label-block {
        margin-bottom: 40px;
    }
`;

const Block = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
`;

export default LoginPage;
