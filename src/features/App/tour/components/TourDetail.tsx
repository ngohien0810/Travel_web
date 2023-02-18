import ButtonAdd from '@/components/Button/ButtonAdd';
import IconAntd from '@/components/IconAntd';
import { openNotificationWithIcon } from '@/components/Notification';
import { routerPage } from '@/config/routes';
import useDebounce from '@/hooks/useDebounce';
import { currencyFormat } from '@/utils';
import Icon from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Input, Popconfirm, Row, Switch, Table, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IPaging } from '../pages';
import { tourService } from '../service';
import AddNewDestinationModal from './AddNewDestinationModal';
import { ITourDetail } from './Interface';
const TourDetail = (props: ITourDetail) => {
    const navigate = useNavigate();
    const { record, changeTourStatus, getTours, currentTourId } = props;
    const [search, setSearch] = React.useState<string>('');
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [currentId, setCurrentId] = React.useState<number>();
    const [currentRecord, setCurrentRecord] = React.useState<any>();
    const [destinationList, setDestinationList] = React.useState<any[]>([]);
    const [currentTab, setCurrentTab] = React.useState<string>('1');

    const [params, setParams] = React.useState<any>({
        tour_id: record.id,
        search: '',
    });
    const searchDebounce = useDebounce(search, 300);
    const columns: any = [
        {
            title: <b>STT</b>,
            dataIndex: 'stt',
            align: 'center',
            render: (text: any, record: any, index: any) => index + 1,
        },
        {
            title: <b>Tên địa điểm</b>,
            dataIndex: 'destinationName',
        },
        {
            title: <b>Lượt yêu thích</b>,
            dataIndex: 'numberLove',
        },
        {
            title: <b>Longtitude</b>,
            dataIndex: 'Longtitude',
            align: 'center',
        },
        {
            title: <b>Latitude</b>,
            dataIndex: 'Latitude',
            align: 'center',
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            render: (value: number, record: any) => {
                return <Switch checked={value === 1} onChange={() => changeDesStatus(record.id)} />;
            },
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'date',
            render: (value: string) => {
                return moment(value).format('DD/MM/YYYY');
            },
        },
        {
            title: <b>Thao tác</b>,
            dataIndex: 'action',
            width: 100,
            render: (_: any, record: any) => {
                return (
                    <>
                        <a
                            onClick={() => {
                                setIsModalOpen(true);
                                setCurrentId(record.id);
                                setCurrentRecord(record);
                            }}
                        >
                            <IconAntd icon="EditOutlined" fontSize={18} />
                        </a>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xoá điểm đến này?"
                            placement="top"
                            onConfirm={() => {
                                deleteDestination(record.id);
                            }}
                            okText="Xoá"
                            cancelText="Đóng"
                            style={{ background: 'red' }}
                        >
                            <a style={{ color: 'red' }} href="#">
                                <IconAntd icon="DeleteOutlined" fontSize={18} marginLeft={20} />
                            </a>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const onChange = (key: string) => {
        setCurrentTab(key);
    };

    const getDestinationList = async () => {
        try {
            const res = await tourService.getDestinations(params);
            if (res) {
                const data = res?.data?.map((item: any) => {
                    return {
                        ...item,
                        id: item.id,
                        destinationName: item.Name,
                        numberLove: item?.favouriteCount || 0,
                        status: item.Status,
                        date: item.CreatedDate,
                    };
                });
                setDestinationList(data);
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const deleteDestination = async (id: number) => {
        try {
            const res = await tourService.deleteDestination(id);
            if (res) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá điểm đến thành công!');
                getDestinationList();
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Xoá điểm đến thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const deleteTour = async (id: number) => {
        try {
            const res = await tourService.deleteTour(id);
            if (res) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá tour thành công!');
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Xoá tour thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const changeDesStatus = async (id: number) => {
        try {
            const res = await tourService.changeDesStatus(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái điểm đến thành công!');
                getDestinationList();
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Thay đổi trạng thái điểm đến thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    React.useEffect(() => {
        setParams({
            ...params,
            search: searchDebounce,
        });
    }, [searchDebounce]);

    React.useEffect(() => {
        getDestinationList();
    }, [params]);

    return (
        <Card
            style={{ width: '100%', backgroundColor: '#f6f9ff' }}
            actions={
                currentTab === '1'
                    ? [
                          <Button
                              onClick={() =>
                                  navigate(routerPage.addEditTour, {
                                      state: { id: record.id, record: record, title: record.tourName },
                                  })
                              }
                              type="text"
                              size="large"
                              style={{ color: 'green' }}
                              icon={<IconAntd icon="EditOutlined" />}
                              children={'Chỉnh sửa'}
                          />,
                          <Popconfirm
                              title={
                                  record?.Status === 1
                                      ? 'Bạn có chắc chắn muốn ngừng hoạt động tour này?'
                                      : 'Bạn có chắc chắn muốn mở lại hoạt động tour này?'
                              }
                              onConfirm={() => changeTourStatus(record.id, record)}
                              okText={record?.Status === 1 ? 'Ngừng' : 'Mở'}
                              cancelText={'Đóng'}
                          >
                              <Button
                                  type="text"
                                  size="large"
                                  style={record?.Status === 1 ? { color: '#f29891' } : { color: '#f0b83e' }}
                                  icon={
                                      record?.Status === 1 ? (
                                          <IconAntd icon={'CloseCircleOutlined'} />
                                      ) : (
                                          <IconAntd icon={'CheckOutlined'} />
                                      )
                                  }
                                  children={record?.Status === 1 ? 'Ngừng hoạt động' : 'Mở hoạt động'}
                              />
                          </Popconfirm>,
                          <Popconfirm
                              title={'Bạn có chắc chắn muốn xoá tour này?'}
                              onConfirm={() => deleteTour(record.id)}
                              okText={'Xoá'}
                              cancelText={'Đóng'}
                          >
                              <Button
                                  type="text"
                                  size="large"
                                  style={{ color: '#cc0000' }}
                                  icon={<IconAntd icon={'DeleteFilled'} />}
                                  children={'Xoá tour'}
                              />
                          </Popconfirm>,
                      ]
                    : []
            }
        >
            <Tabs style={{ backgroundColor: '#f6f9ff' }} defaultActiveKey="1" onChange={onChange}>
                <TabPane tab={<span style={{ margin: 10 }}>Thông tin tour du lịch</span>} key="1">
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Mã tour">{record.Code || '--'}</Descriptions.Item>
                        <Descriptions.Item label="Giá tour(Người lớn)">
                            {currencyFormat(record.TourPrice) || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên tour">{record.Title || '--'}</Descriptions.Item>
                        <Descriptions.Item label="Giá tour(Trẻ em)">
                            {currencyFormat(record.TourPrice / 2) || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian">{record.numberDestination || '--'}</Descriptions.Item>
                        <Descriptions.Item label="Lượt đánh giá">{record.feedbacks.length || '--'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày khởi hành">{record.DateStartTour || '--'}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {record.Status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Tỉnh/thành phố">
                            {record.numberDestination || 'Bắc Giang'}
                        </Descriptions.Item> */}
                        <Descriptions.Item label="Ngày tạo">
                            {moment(record.CreatedDate).format('DD/MM/YYYY') || '--'}
                        </Descriptions.Item>
                    </Descriptions>
                </TabPane>
                <TabPane tab={<span style={{ margin: 10 }}>Danh sách điểm đến</span>} key="2">
                    <Row>
                        <Col span={12}>
                            <Input.Search
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Tên điểm đến"
                                addonAfter={<Icon type="close-circle-o" />}
                                value={search}
                                onChange={(e: any) => {
                                    setSearch(e.target.value);
                                }}
                            />
                        </Col>

                        <Col span={4}></Col>
                        <Col span={8}>
                            <Row justify="end">
                                <ButtonAdd
                                    text="Thêm điểm đến"
                                    styleButton={{ marginRight: 20 }}
                                    onClickButton={() => setIsModalOpen(true)}
                                />
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={destinationList}
                                scroll={{
                                    x: 800,
                                    scrollToFirstRowOnChange: true,
                                }}
                                locale={{
                                    emptyText: 'Chưa có bản ghi nào!',
                                }}
                                pagination={false}
                            />
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
            {isModalOpen && (
                <AddNewDestinationModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    currentId={currentId}
                    currentTourId={currentTourId}
                    getDestinationList={getDestinationList}
                    getTours={getTours}
                    currentRecord={currentRecord}
                    setCurrentRecord={setCurrentRecord}
                />
            )}
        </Card>
    );
};

export default TourDetail;
