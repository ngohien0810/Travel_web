import UploadComponent from '@/components/UploadComponent';
import { Button, Col, Input, InputNumber, Modal, Row, Space } from 'antd';
import MyEditor from '@/components/Editor/EditorComponent';
import React from 'react';
import styled from 'styled-components';
import CustomLoading from '@/components/Loading';
import { tourService } from '../service';
import { openNotificationWithIcon } from '@/components/Notification';
import { IDestinationDetail } from './Interface';
import GoogleMapReact from 'google-map-react';
import UploadCloundComponent from '@/components/Upload';

interface IAddNewDestinationModal {
    isModalOpen: boolean;
    currentId: number | undefined;
    setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
    currentTourId: number | undefined;
    getDestinationList: () => Promise<void>;
    getTours: () => Promise<void>;
    currentRecord: any;
    setCurrentRecord: React.Dispatch<any>;
}

const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    user-select: none;
    border-radius: 50% 50% 50% 0;
    border: 4px solid red;
    width: 20px;
    height: 20px;
    transform: rotate(-45deg);
    cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
    &:hover {
        z-index: 1;
    }
    &::after {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        margin-left: -5px;
        margin-top: -5px;
        background-color: black;
    }
`;

const Marker = ({ text, onClick }: any) => <Wrapper alt={text} onClick={onClick} />;

const AddNewDestinationModal = (props: IAddNewDestinationModal) => {
    const {
        isModalOpen,
        setIsModalOpen,
        currentId,
        currentTourId,
        getDestinationList,
        getTours,
        currentRecord,
        setCurrentRecord,
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isAllSpace, setIsAllSpace] = React.useState<boolean>(false);
    const [desName, setDesName] = React.useState<string>();
    const [isDesNameError, setIsDesNameError] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>();
    const [mapUrl, setMapUrl] = React.useState<string>();
    const [index, setIndex] = React.useState<number | null>();
    const [isIndexError, setIsIndexError] = React.useState<boolean>(false);

    const [fileUpload, setFileUpload] = React.useState<any>(null);
    const fileEdit = React.useRef<any>(null);

    const defaultProps = {
        center: {
            lat: 21.028511,
            lng: 105.804817,
        },
        zoom: 15,
    };

    const [places, setPlaces] = React.useState({
        lat: 21.028511,
        lng: 105.804817,
    });

    const addUpdateDestination = async () => {
        const payload = {
            Name: desName,
            OrderIndex: index,
            MapUrl: '',
            ImageUrl: fileUpload,
            Description: description,
            TourID: currentTourId,
            Longtitude: places.lng,
            Latitude: places.lat,
        };
        try {
            setIsLoading(true);
            if (!currentRecord) {
                // Thêm mới
                const res = await tourService.addDestination(payload);
                if (res?.status) {
                    openNotificationWithIcon('success', 'Thành công', 'Thêm địa điểm mới thành công!');
                    getDestinationList();
                    setIsModalOpen(false);
                    getTours();
                }
            } else {
                // Cập nhật
                const res = await tourService.updateDestination(payload, currentRecord?.id);
                if (res?.status) {
                    openNotificationWithIcon('success', 'Thành công', 'Cập nhật địa điểm thành công!');
                    getDestinationList();
                    setIsModalOpen(false);
                    getTours();
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fileEdit.current = [
            {
                uuid: currentRecord?.ImageUrl,
                url: currentRecord?.ImageUrl,
            },
        ];
        setDesName(currentRecord?.destinationName);
        setIndex(currentRecord?.OrderIndex);
        setMapUrl(currentRecord?.MapUrl);
        setDescription(currentRecord?.Description);
        setPlaces({
            lat: currentRecord?.Latitude,
            lng: currentRecord?.Longtitude,
        });
    }, [currentRecord]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Modal
                title={currentRecord ? 'Sửa địa điểm' : 'Thêm điểm đến mới'}
                open={isModalOpen}
                centered
                cancelText="Đóng"
                okText="Lưu"
                width={'80%'}
                footer={null}
                bodyStyle={{ paddingTop: '0' }}
                closable={false}
            >
                <Row justify="end">
                    <Space style={{ padding: '10px 20px' }}>
                        <Button
                            onClick={() => {
                                setIsModalOpen(false);
                                setCurrentRecord(null);
                            }}
                        >
                            Đóng
                        </Button>
                        <Button onClick={addUpdateDestination} type="primary">
                            Lưu
                        </Button>
                    </Space>
                </Row>
                <MarginedRow>
                    <Col span={18}>
                        <div style={{ height: '400px' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyBnQuI2W5DyQVHJZpOXqiyODTG_d7dkPfk' }}
                                defaultCenter={defaultProps.center}
                                defaultZoom={defaultProps.zoom}
                                yesIWantToUseGoogleMapApiInternals
                                onClick={(e) => {
                                    setPlaces({
                                        lat: e.lat,
                                        lng: e.lng,
                                    });
                                }}
                            >
                                <Marker text="My Marker" lat={places.lat} lng={places.lng} />
                            </GoogleMapReact>
                        </div>
                    </Col>
                    <Col span={6}>
                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <span>
                                    Tên điểm đến<span style={{ color: 'red' }}> *</span>
                                </span>
                                <Input
                                    allowClear
                                    style={{ width: '100%', marginTop: '6px' }}
                                    placeholder="Tên điểm đến"
                                    value={desName}
                                    onChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            setIsDesNameError(false);
                                        } else setIsDesNameError(true);
                                        setDesName(e?.target?.value);
                                    }}
                                    status={isDesNameError ? 'error' : undefined}
                                />
                            </Col>
                            <Col span={24}>
                                <span>
                                    Thứ tự hiển thị<span style={{ color: 'red' }}> *</span>
                                </span>
                                <InputNumber
                                    style={{ width: '100%', marginTop: '6px' }}
                                    placeholder="Thứ tự hiển thị"
                                    min={1}
                                    value={index}
                                    onChange={(value: number | null) => {
                                        console.log('Value: ', value);
                                        if (value) {
                                            setIsIndexError(false);
                                        } else setIsIndexError(true);
                                        setIndex(value);
                                    }}
                                    status={isIndexError ? 'error' : undefined}
                                />
                            </Col>
                        </Row>
                        <div style={{ marginTop: '10px' }}>
                            <span>
                                Hình ảnh<span style={{ color: 'red' }}> *</span>
                            </span>
                            {/* <UploadComponent
                                isUploadServerWhenUploading
                                uploadType="single"
                                listType="picture-card"
                                maxLength={1}
                                initialFiles={
                                    currentRecord
                                        ? [
                                              {
                                                  uid: currentId,
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
                                    url && setFileUpload(url?.url);
                                }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <span>Địa chỉ</span>
                            <div style={{ marginTop: '10px' }}>
                                <div>
                                    Lat:
                                    <p style={{ fontWeight: 'bold' }}> {places?.lat}</p>
                                </div>
                                <div>
                                    Lng:
                                    <p style={{ fontWeight: 'bold' }}> {places?.lng}</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </MarginedRow>

                <MarginedRow>
                    <Col span={24}>
                        <MyEditor
                            refContent={currentRecord ? description : ''}
                            handleCallbackContent={(value) => {
                                setDescription(value);
                            }}
                        />
                    </Col>
                </MarginedRow>
            </Modal>
        </CustomLoading>
    );
};

const MarginedRow = styled(Row)``;

export default AddNewDestinationModal;
