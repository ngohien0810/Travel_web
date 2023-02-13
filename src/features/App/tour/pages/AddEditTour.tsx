import ButtonSave from '@/components/Button/ButtonSave';
import MyEditor from '@/components/Editor/EditorComponent';
import FormComponent from '@/components/FormComponent';
import FormItemComponent from '@/components/FormComponent/FormItemComponent';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadCloundComponent from '@/components/Upload';
import UploadComponent from '@/components/UploadComponent';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import { Col, DatePicker, Input, PageHeader, Row, Form, Checkbox } from 'antd';
import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { tourService } from '../service';

const AddEditTour = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [isLoading, setisLoading] = React.useState<boolean>(false);

    const [isAllSpace, setIsAllSpace] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>(location?.state?.record?.description);

    const fileEdit = React.useRef<any>(null);

    const handleSubmit = async (values: any) => {
        const payload = {
            Code: values.Code,
            ImageUrl: typeof values?.imageUrl !== 'string' ? values?.imageUrl[0]?.url : values?.imageUrl,
            Title: values.Title,
            Description: description,
            TourPrice: values?.TourPrice,
            DateStartTour: moment(values?.DateStartTour).format('YYYY-MM-DD HH:mm'),
            IsHome: values?.IsHome ? 1 : 0,
            RangeTour: values?.RangeTour,
        };
        try {
            setisLoading(true);
            if (location?.state?.id) {
                // Cập nhật
                const res = await tourService.updateTour(payload, location?.state?.id);
                if (res) {
                    openNotificationWithIcon('success', 'Thành công', 'Cập nhật tour thành công!');
                    navigate(routerPage.tour);
                } else {
                    openNotificationWithIcon('error', 'Thất bại', 'Cập nhật tour thất bại!');
                }
            } else {
                // Thêm mới
                const res = await tourService.addTour(payload);
                if (res) {
                    openNotificationWithIcon('success', 'Thành công', 'Thêm tour mới thành công!');
                    navigate(routerPage.tour);
                } else {
                    openNotificationWithIcon('error', 'Thất bại', 'Thêm tour mới thất bại!');
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    React.useEffect(() => {
        if (location?.state?.id) {
            fileEdit.current = [
                {
                    uid: location?.state?.record?.ImageUrl,
                    url: location?.state?.record?.ImageUrl,
                },
            ];
            form.setFieldsValue({
                Code: location?.state?.record?.Code,
                Title: location?.state?.record?.Title,
                TourPrice: location?.state?.record?.TourPrice,
                DateStartTour: moment(location?.state?.record?.DateStartTour),
                imageUrl: [
                    {
                        uid: location?.state?.record?.ImageUrl,
                        url: location?.state?.record?.ImageUrl,
                    },
                ],
                IsHome: !!location?.state?.record?.IsHome,
                RangeTour: location?.state?.record?.RangeTour,
            });
        }
    }, [location?.state?.id]);

    return (
        <CustomLoading isLoading={isLoading}>
            <FormComponent form={form} onSubmit={handleSubmit}>
                <Container
                    header={
                        <PageHeader
                            onBack={() => navigate(routerPage.tour)}
                            style={{ borderRadius: 8 }}
                            title={location?.state?.id ? 'Chỉnh sửa tour' : 'Thêm tour mới'}
                            extra={[<ButtonSave text="Lưu" htmlType="submit" />]}
                        />
                    }
                    contentComponent={
                        <CustomLoading isLoading={isLoading}>
                            <Row gutter={[16, 16]}>
                                <FormItemComponent
                                    grid
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mã tour không được để trống',
                                        },
                                    ]}
                                    name="Code"
                                    label="Mã tour"
                                    inputField={<Input placeholder="Nhập mã tour" />}
                                />
                                <FormItemComponent
                                    grid
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên tour không được để trống',
                                        },
                                    ]}
                                    name="Title"
                                    label="Tên tour"
                                    inputField={<Input placeholder="Nhập tên tour" />}
                                />
                                <FormItemComponent
                                    grid
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên tour không được để trống',
                                        },
                                    ]}
                                    name="TourPrice"
                                    label="Giá tour"
                                    inputField={<Input placeholder="Nhập giá tour người lớn" />}
                                />
                                <FormItemComponent
                                    grid
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập thời gian tour',
                                        },
                                    ]}
                                    name="RangeTour"
                                    label="Thời gian tour"
                                    inputField={<Input placeholder="Nhập thời gian tour" />}
                                />
                                {/* <FormItemComponent
                                    grid
                                    name="title"
                                    label="Giá tour (Trẻ em)"
                                    inputField={<Input placeholder="Nhập giá tour trẻ em" />}
                                /> */}

                                <FormItemComponent
                                    grid
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên tour không được để trống',
                                        },
                                    ]}
                                    name="DateStartTour"
                                    label="Thời gian khởi hành"
                                    inputField={
                                        <DatePicker
                                            format="HH:mm DD/MM/YYYY"
                                            style={{ width: '100%' }}
                                            placeholder="Chọn thời gian khởi hành"
                                        />
                                    }
                                />

                                <FormItemComponent
                                    grid
                                    name="IsHome"
                                    label=" "
                                    valuePropName="checked"
                                    inputField={<Checkbox>Hiện thị ở trang chủ</Checkbox>}
                                />

                                <FormItemComponent
                                    grid
                                    name="imageUrl"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên tour không được để trống',
                                        },
                                    ]}
                                    label="Hình ảnh"
                                    inputField={
                                        <UploadCloundComponent
                                            isUploadServerWhenUploading
                                            initialFile={fileEdit.current}
                                            uploadType="list"
                                            listType="picture-card"
                                            maxLength={1}
                                            onSuccessUpload={(url: any) => {
                                                url && form.setFieldsValue({ imageUrl: url?.url });
                                            }}
                                        />
                                    }
                                />
                                <Col style={{ marginTop: 20 }} span={24}>
                                    <p>
                                        Nội dung bài viết<span style={{ color: 'red' }}> *</span>
                                    </p>
                                    <MyEditor
                                        refContent={location?.state?.record ? location?.state?.record?.Description : ''}
                                        handleCallbackContent={(value) => {
                                            setDescription(value);
                                        }}
                                    />
                                </Col>
                            </Row>
                        </CustomLoading>
                    }
                />
            </FormComponent>
        </CustomLoading>
    );
};

const CustomCol = styled(Col)`
    display: flex;
    flex-direction: row;

    .label-block {
        flex: 1;
        margin-right: -10px;
        width: 50px;
    }

    .input-block {
        flex: 4;
    }
`;

export default AddEditTour;
