import Icon from '@ant-design/icons';
import { Col, DatePicker, Input, Row, Select } from 'antd';
import React from 'react';

interface IFilter {
    search: string;
    status: number | undefined;
    fromDate: string | undefined;
    toDate: string | undefined;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
    setFromDate: React.Dispatch<React.SetStateAction<string | undefined>>;
    setToDate: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Filter = (props: IFilter) => {
    const { setSearch, search, fromDate, toDate, setStatus, setFromDate, setToDate } = props;

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Input.Search
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Mã, Tên, Giá chuyến du lịch"
                    addonAfter={<Icon type="close-circle-o" />}
                    value={search}
                    onChange={(e: any) => {
                        setSearch(e.target.value);
                    }}
                />
            </Col>
            <Col span={8}>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn trạng thái"
                    allowClear
                    onChange={(value: number | undefined) => {
                        if (value === undefined) {
                            setStatus(undefined);
                        } else setStatus(value);
                    }}
                >
                    <Select.Option value={1}>Hoạt động</Select.Option>
                    <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                </Select>
            </Col>
            <Col span={8}>
                <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    format={'DD/MM/YYYY'}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    onCalendarChange={(dates: any, dateStrings: any) => {
                        if (!dates) {
                            setFromDate(undefined);
                            setToDate(undefined);
                            return;
                        }
                        setFromDate(dates[0]?.format('YYYY-MM-DD'));
                        setToDate(dates[1]?.format('YYYY-MM-DD'));
                    }}
                />
            </Col>
        </Row>
    );
};

export default Filter;
