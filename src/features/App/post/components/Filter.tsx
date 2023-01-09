import Icon from '@ant-design/icons';
import { Col, DatePicker, Input, Row, Select } from 'antd';
import { Item } from 'rc-menu';
import React from 'react';
import { ICategory } from './Interface';

interface IFilter {
    search: string;
    categories: ICategory[];
    status: number | undefined;
    toDate: string | undefined;
    fromDate: string | undefined;
    categoryId: number | undefined;
    setCategoryId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
    setToDate: React.Dispatch<React.SetStateAction<string | undefined>>;
    setFromDate: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Filter = (props: IFilter) => {
    const { setSearch, search, status, setStatus, setFromDate, setToDate, categories, categoryId, setCategoryId } =
        props;

    return (
        <Row gutter={[16, 16]}>
            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                <Input.Search
                    allowClear
                    style={{ width: '100%', margin: 0 }}
                    placeholder="Tiều đề bài viết"
                    addonAfter={<Icon type="close-circle-o" />}
                    value={search}
                    onChange={(e: any) => {
                        setSearch(e.target.value);
                    }}
                />
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn danh mục"
                    allowClear
                    onChange={(value: number | undefined) => {
                        if (value === undefined) {
                            setCategoryId(undefined);
                        } else {
                            setCategoryId(value);
                        }
                    }}
                >
                    {categories.map((item: ICategory, index: number) => (
                        <Select.Option key={index} value={item.id}>
                            {item.title}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    placeholder="Chọn trạng thái"
                    onChange={(value: number | undefined) => {
                        if (value === undefined) {
                            setStatus(undefined);
                        } else {
                            setStatus(value);
                        }
                    }}
                >
                    <Select.Option value={1}>Hoạt động</Select.Option>
                    <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                </Select>
            </Col>
            {/* <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    format={'DD/MM/YYYY'}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    onChange={(value: any, dateString: [string, string]) => {
                        setFromDate(dateString[0]);
                        setToDate(dateString[1]);
                    }}
                />
            </Col> */}
        </Row>
    );
};

export default Filter;
