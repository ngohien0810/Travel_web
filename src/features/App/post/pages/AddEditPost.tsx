import ButtonSave from '@/components/Button/ButtonSave';
import MyEditor from '@/components/Editor/EditorComponent';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadCloundComponent from '@/components/Upload';
import UploadComponent from '@/components/UploadComponent';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import { Checkbox, Col, Input, PageHeader, Row, Select, Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ICategory } from '../components/Interface';
import { newsService } from '../service';

const AddEditPost = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setisLoading] = React.useState<boolean>(false);
    const [isAllSpace, setIsAllSpace] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>();
    const [categoryIds, setCategoryIds] = React.useState<number[]>();
    const [description, setDescription] = React.useState<string>('');
    const [isHotNews, setIsHotNews] = React.useState<number>(0);
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [isTitleError, setIsTitleError] = React.useState<boolean>(false);
    const [isCategoriesError, setIsCategoriesError] = React.useState<boolean>(false);
    const [listImages, setListImages] = React.useState<Array<any>>([]);
    const [isNewsChosen, setIsNewsChosen] = React.useState<boolean>(false);
    const [isHomeChosen, setIsHomeChosen] = React.useState<boolean>(false);
    const [isHomeDisplayed, setIsHomeDisplayed] = React.useState<number>(0);

    const [fileUpload, setFileUpload] = React.useState<any>(null);
    console.log('🚀 ~ file: AddEditPost.tsx:36 ~ AddEditPost ~ fileUpload', fileUpload);
    const fileEdit = React.useRef<any>(null);

    const validateValue = () => {
        if (!title || title === '') {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng nhập tiêu đề bài viết!');
            setIsTitleError(true);
            return false;
        } else {
            setIsTitleError(false);
        }

        if (!categoryIds || categoryIds.length === 0) {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng chọn danh mục bài viết!');
            setIsCategoriesError(true);
            return false;
        } else {
            setIsCategoriesError(false);
        }
        if (!fileUpload) {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng chọn ảnh bìa cho bài viết!');
            return false;
        }

        if (!description || description === '<p></p>') {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng nhập nội dung bài viết!');
            return false;
        }
        if (isAllSpace) {
            openNotificationWithIcon('error', 'Thất bại', 'Nội dung bài viết không thể là khoảng trắng!');
            return false;
        }
        return true;
    };

    const getListCategories = async () => {
        try {
            const res = await newsService.getListCategories();
            if (res) {
                const data = res?.data?.map((item: any) => ({
                    id: item.id,
                    title: item.Name,
                }));
                setCategories(data);
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const getNewsDetail = async () => {
        try {
            setisLoading(true);
            const res = await newsService.getNewsDetail(location?.state?.id);
            if (res) {
                setTitle(res?.data?.Title);
                setCategoryIds(res?.data?.CategoryID);
                setIsHomeDisplayed(res?.data?.IsHome);
                setDescription(res?.data?.Description);
                setFileUpload(res?.data?.ImageUrl);
                fileEdit.current = [
                    {
                        uid: res?.data?.ImageUrl,
                        url: res?.data?.ImageUrl,
                    },
                ];
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Đã có lỗi xảy ra!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    const addEditNews = async () => {
        const payload = {
            ImageUrl: fileUpload,
            Title: title,
            IsHome: isHomeDisplayed ? 1 : 0,
            Description: description,
            CategoryID: categoryIds,
        };
        try {
            setisLoading(true);
            if (validateValue()) {
                // Cập nhật
                if (location?.state?.id) {
                    const res = await newsService.updateNews(payload, location?.state?.id);
                    if (res) {
                        openNotificationWithIcon('success', 'Thành công', 'Cập nhật bài viết thành công!');
                        navigate(routerPage.post);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Cập nhật bài viết thất bại!');
                    }
                } else {
                    const res = await newsService.addNews(payload);
                    if (res) {
                        openNotificationWithIcon('success', 'Thành công', 'Thêm bài viết mới thành công!');
                        navigate(routerPage.post);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Thêm bài viết mới thất bại!');
                    }
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
            getNewsDetail();
        }
        getListCategories();
    }, []);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        onBack={() => navigate(routerPage.post)}
                        style={{ borderRadius: 8 }}
                        title={location?.state?.id ? 'Sửa bài viết' : 'Thêm bài viết mới'}
                        extra={[<ButtonSave text="Lưu" onClickButton={addEditNews} />]}
                    />
                }
                contentComponent={
                    <CustomLoading isLoading={isLoading}>
                        <div>
                            <Row gutter={[16, 16]}>
                                <CustomCol span={12}>
                                    <div className="label-block">
                                        <p>
                                            Tiêu đề<span style={{ color: 'red' }}> *</span>
                                        </p>
                                    </div>
                                    <div className="input-block">
                                        <Input
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Tiều đề bài viết"
                                            value={title}
                                            onChange={(e: any) => {
                                                if (e.target.value !== '') {
                                                    setIsTitleError(false);
                                                } else setIsTitleError(true);
                                                setTitle(e?.target?.value);
                                            }}
                                            status={isTitleError ? 'error' : undefined}
                                        />
                                    </div>
                                </CustomCol>
                                <CustomCol span={2} />
                                <CustomCol span={10}>
                                    <div className="label-block">
                                        <p>
                                            Danh mục<span style={{ color: 'red' }}> *</span>
                                        </p>
                                    </div>
                                    <div className="input-block">
                                        <Select
                                            style={{ width: '100%' }}
                                            value={categoryIds}
                                            placeholder="Chọn danh mục"
                                            // mode="multiple"
                                            allowClear
                                            onChange={(value: number[]) => {
                                                setCategoryIds(value);
                                            }}
                                            status={isCategoriesError ? 'error' : undefined}
                                        >
                                            {categories.map((item: ICategory, index: number) => (
                                                <Select.Option key={index} value={item.id}>
                                                    {item.title}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </CustomCol>
                                <CustomCol span={12}>
                                    <div className="label-block">
                                        <p>
                                            Hình ảnh<span style={{ color: 'red' }}> *</span>
                                        </p>
                                    </div>
                                    <div className="input-block">
                                        {/* <UploadComponent
                                            isUploadServerWhenUploading
                                            uploadType="single"
                                            listType="picture-card"
                                            maxLength={1}
                                            initialFiles={
                                                location?.state?.id
                                                    ? [
                                                          {
                                                              uid: location?.state?.id,
                                                              name: 'image.png',
                                                              status: 'done',
                                                              url: listImages[0],
                                                          },
                                                      ]
                                                    : []
                                            }
                                            onSuccessUpload={(url: any) => {
                                                setListImages(url.flat());
                                            }}
                                        /> */}

                                        <UploadCloundComponent
                                            isUploadServerWhenUploading
                                            initialFile={fileEdit.current}
                                            uploadType="list"
                                            listType="picture-card"
                                            maxLength={1}
                                            onSuccessUpload={(url: any) => {
                                                url && setFileUpload(url.url);
                                            }}
                                        />
                                    </div>
                                </CustomCol>
                                <CustomCol span={2} />
                                <CustomCol span={10}>
                                    {isNewsChosen && (
                                        <Checkbox
                                            checked={isHotNews === 1 ? true : false}
                                            onChange={(e: CheckboxChangeEvent) => {
                                                setIsHotNews(e.target.checked ? 1 : 0);
                                            }}
                                        >
                                            Chọn làm tin tức nổi bật
                                        </Checkbox>
                                    )}
                                    {isHomeChosen && (
                                        <Checkbox
                                            checked={isHomeDisplayed === 1 ? true : false}
                                            onChange={(e: CheckboxChangeEvent) => {
                                                setIsHomeDisplayed(e.target.checked ? 1 : 0);
                                            }}
                                        >
                                            Hiển thị ở trang chủ
                                        </Checkbox>
                                    )}
                                </CustomCol>
                                <Col span={24} style={{ marginTop: 20 }}>
                                    <p>
                                        Nội dung bài viết<span style={{ color: 'red' }}> *</span>
                                    </p>
                                    <MyEditor
                                        defaultValue={location?.state?.id ? description : ''}
                                        logData={(value: string) => {
                                            setDescription(value.trim());
                                        }}
                                        editorStyle={{
                                            border: '1px solid #ACB0B0',
                                            borderRadius: '5px',
                                            overflow: 'hidden scroll',
                                            padding: '0 16px',
                                        }}
                                        height={350}
                                        setIsAllSpace={setIsAllSpace}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </CustomLoading>
                }
            />
        </CustomLoading>
    );
};

const CustomCol = styled(Col)`
    display: flex;
    flex-direction: row;

    .label-block {
        flex: 1;
        margin-right: 20px;
        width: 50px;
    }

    .input-block {
        flex: 6;
    }
`;

export default AddEditPost;
