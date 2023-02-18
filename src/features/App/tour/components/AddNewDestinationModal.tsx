import AxiosClient from '@/apis/AxiosClient';
import MyEditor from '@/components/Editor/EditorComponent';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadCloundComponent from '@/components/Upload';
import useDebounce from '@/hooks/useDebounce';
import { Notification } from '@/utils';
import { AutoComplete, Button, Col, Input, InputNumber, Modal, Row, Space } from 'antd';
import GoogleMapReact from 'google-map-react';
import React from 'react';
import styled from 'styled-components';
import { tourService } from '../service';

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
const getPlaceAuto = (payload: any) =>
    AxiosClient.get('https://api.pyoyo.vn/api/v1/google-address/place-auto', { params: payload });

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

    // option google map
    const [options, setOptions] = React.useState<Array<any>>([]);

    const [placeId, setPlaceId] = React.useState('');
    const [searchLocation, setSearchLocation] = React.useState('');
    const debounceSearchLocation = useDebounce(searchLocation, 500);

    const [center, setCenter] = React.useState({
        lat: 21.028511,
        lng: 105.804817,
    });

    React.useEffect(() => {
        onChange(debounceSearchLocation);
    }, [debounceSearchLocation]);

    const onChange = async (data: string) => {
        try {
            const res: any = await getPlaceAuto({ address: data });
            const list_option = res?.data?.predictions?.map((item: any) => ({
                value: item.description,
                place_id: item.place_id,
            }));
            setOptions(list_option);
        } catch (error) {
            console.log(error);
        }
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
        if (!payload.Name) {
            Notification('error', 'Tên điểm đến không được để trống!');
            return;
        }
        if (!payload.OrderIndex) {
            Notification('error', 'Thứ tự không được để trống!');
            return;
        }
        if (!payload.Description) {
            Notification('error', 'Mô tả không được để trống!');
            return;
        }
        if (!fileUpload) {
            Notification('error', 'Hình ảnh không được để trống!');
            return;
        }

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
        setFileUpload(currentRecord?.ImageUrl);
        setPlaces({
            lat: currentRecord?.Latitude,
            lng: currentRecord?.Longtitude,
        });
        setCenter({
            lat: currentRecord?.Latitude,
            lng: currentRecord?.Longtitude,
        });
    }, [currentRecord]);

    // place to lonlat
    React.useEffect(() => {
        if (placeId) {
            fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=AIzaSyBnQuI2W5DyQVHJZpOXqiyODTG_d7dkPfk`
            )
                .then((response) => response.json())
                .then((data) => {
                    const location = data.results[0].geometry.location;
                    const latitude = location.lat;
                    const longitude = location.lng;
                    setCenter({
                        lat: latitude,
                        lng: longitude,
                    });
                    setPlaces({
                        lat: latitude,
                        lng: longitude,
                    });
                });
        }
    }, [placeId]);

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
                <Row className="gx-mb-2" justify="space-between" align="middle">
                    <AutoComplete
                        // className={styles.auto_complete}
                        // filterOption={(inputValue, option) =>
                        //   option!.value
                        //     .toUpperCase()
                        //     .indexOf(inputValue.toUpperCase()) !== -1
                        // }
                        // value={}
                        style={{ width: '400px' }}
                        options={options}
                        placeholder="Chọn địa chỉ google maps"
                        onSelect={(select: any, option: any) => {
                            setPlaceId(option?.place_id);
                            console.log('select: ', option);
                        }}
                        onChange={(value: string) => {
                            setSearchLocation(value);
                        }}
                    />
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
                                center={center}
                                defaultZoom={15}
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
                                onRemove={() => setFileUpload(null)}
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
