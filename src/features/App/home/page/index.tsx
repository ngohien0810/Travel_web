import { Col, Row } from 'antd';
import React from 'react';
import CountUp from 'react-countup';
import styled from 'styled-components';
import card1 from '../../../../assets/card1.png';
import card2 from '../../../../assets/card2.png';
import card3 from '../../../../assets/card3.png';
import Chart1 from '../components/Chart1';
import ChartColumn from '../components/ChartColumn';
import { homeService } from '../service';
const HomePage = () => {
    const [isLoading, setIsLoadng] = React.useState<boolean>(false);
    const [posts, setPosts] = React.useState<number>();
    const [tours, setTours] = React.useState<number>();
    const [customers, setCustomers] = React.useState<number>();
    const listBlocks = [
        {
            id: 1,
            title: 'Bài viết',
            value: posts,
            icon: card1,
        },
        {
            id: 2,
            title: 'Tour du lịch',
            value: tours,
            icon: card2,
        },
        {
            id: 3,
            title: 'Khách hàng',
            value: customers,
            icon: card3,
        },
    ];

    const renderBlock = (item: any, index: number) => {
        return (
            <Col key={index} className="gutter-row" span={8}>
                <WrapperBlockStyled>
                    <ItemBlock>
                        <div className="info-block">
                            <p className="title">{item.title}</p>
                            <div className="statistic-block">
                                <p className="statistic">
                                    <CountUp end={item.value} />
                                </p>
                            </div>
                        </div>
                        <div className="icon-block">
                            <div className="icon">
                                <img src={item.icon} alt="icon" />
                            </div>
                        </div>
                    </ItemBlock>
                </WrapperBlockStyled>
            </Col>
        );
    };

    const getData = async () => {
        try {
            setIsLoadng(true);
            const res: any = await homeService.getData();
            setPosts(res?.countNews);
            setTours(res?.countTour);
            setCustomers(res?.countUser);
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoadng(false);
        }
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <div style={{ backgroundColor: 'transparent', paddingTop: 40 }}>
            <Row className="gx-mx-5" justify="center" gutter={80}>
                {listBlocks.map((item: any, index: number) => renderBlock(item, index))}
            </Row>
            <div
                style={{
                    height: '80vh',
                    backgroundColor: 'white',
                    marginTop: '-50px',
                    padding: '60px 10px 0 10px',
                }}
            >
                <Row justify="center" style={{ height: '100%' }}>
                    <Col style={{ height: '100%', padding: '60px 20px 100px 80px' }} span={16}>
                        <p className="gx-text-center gx-mb-5" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            Thống kê đánh giá theo Tour
                        </p>
                        <ChartColumn />
                    </Col>
                </Row>
                {/* content ở đây nè */}
            </div>
        </div>
    );
};

const WrapperBlockStyled = styled.div`
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const ContentBlock = styled.div`
    width: 100%;
    padding: 30px;

    .label {
        font-weight: 800;
        padding-left: 10px;
        padding-bottom: 20px;
        font-size: 30px;
    }
`;

const ItemBlock = styled.div`
    height: 120px;
    display: flex;
    flex-direction: row;
    z-index: 9999999;

    .info-block {
        flex: 2;
        padding: 20px;

        .title {
            font-size: 18px;
            font-weight: 700;
        }

        .statistic-block {
            margin-top: -6px;
            font-size: 28px;
            font-weight: bold;
            color: #ff6b6b;
        }
    }

    .icon-block {
        flex: 1;
        position: relative;

        .icon {
            width: 130px;
            height: 130px;
            position: absolute;
            right: 10px;
            top: 61%;
            transform: translateY(-50%);
        }
    }
    background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;

    .ocean {
        height: 5%;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: #015871;
    }
`;

export default HomePage;
