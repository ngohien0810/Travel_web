import LocalStorage from '@/apis/LocalStorage';
import CustomScrollbars from '@/components/CustomScrollbars';
import IconAntd from '@/components/IconAntd';
import { TAB_SIZE } from '@/config/theme';
import ErrorBoundary from '@/features/Error/ErrorBoundary';
import useWindowSize from '@/hooks/useWindowSize';
import SideBar from '@/layout/SideBar';
import { wait } from '@/utils';
import { Dropdown, Layout, Menu, Popover, Row, Space, Tag } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Topbar from './Content/Topbar';
const { Content, Footer } = Layout;
const PageLayout = (PageComponent: React.JSXElementConstructor<any>) => {
    return function WithPage({ ...props }) {
        const [isLogin, setIsLogin] = React.useState(false);
        const userInfor = useSelector((state: any) => state?.root?.user);

        const { width } = useWindowSize();

        const [collapsedMobile, setCollapsedMobile] = React.useState(false);

        const handleCallbackCollapseMobile = React.useCallback(() => {
            setCollapsedMobile(!collapsedMobile);
        }, [collapsedMobile]);

        React.useLayoutEffect(() => {
            if (LocalStorage.getLogged()) {
                setIsLogin(true);
            }
        }, []);

        const menu = (
            <div>
                <ul className="gx-user-popover">
                    {/* <li>Thông tin cá nhân</li> */}
                    <li
                        onClick={() => {
                            LocalStorage.removeLogged();
                            wait(1000).then(() => {
                                window.location.reload();
                            });
                        }}
                    >
                        Đăng xuất
                    </li>
                </ul>
            </div>
        );

        return isLogin ? (
            <Layout className="gx-app-layout">
                {/* sidebar */}
                <SideBar
                    collapsedMobile={collapsedMobile}
                    handleCallbackCollapseMobile={handleCallbackCollapseMobile}
                />
                {/* content */}
                <LayoutStyled>
                    {/* top content */}
                    {width < TAB_SIZE && <Topbar handleCallbackCollapseMobile={handleCallbackCollapseMobile} />}
                    <TopBar>
                        <Row style={{ width: '100%' }} justify="space-between" align="middle">
                            <Tag color="#3598E7" style={{ fontSize: '15px', padding: '4px 12px', fontWeight: '600' }}>
                                {userInfor?.Role == 1 ? 'Quản trị viên' : 'Cộng tác viên'}
                            </Tag>
                            <Popover content={menu} placement="bottomRight">
                                <WrapperInfoStyled>
                                    <strong>Xin chào, {userInfor?.Username}</strong>
                                    <ImageAvatarStyled
                                        src="https://icons.iconarchive.com/icons/iconka/easter-egg-bunny/256/red-angel-icon.png"
                                        alt="avatar"
                                    />
                                </WrapperInfoStyled>
                            </Popover>
                        </Row>
                        {/* <div className="account-block">
                            <Dropdown overlay={menu}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <IconAntd icon="UserOutlined" /> {userInfor?.username}
                                    </Space>
                                </a>
                            </Dropdown>
                        </div> */}
                    </TopBar>
                    {/* body content */}
                    <ErrorBoundary>
                        <Content className="gx-layout-content">
                            <div className="gx-main-content-wrapper" style={{ overflow: 'hidden' }}>
                                <CustomScrollbars>
                                    <PageComponent {...props} />
                                </CustomScrollbars>
                            </div>
                            {/* footer content */}
                            {/* <Footer>
                                <div className="gx-layout-footer-content">
                                    <div className="gx-layout-footer-content">WindsSoft Frontend Team - 2022</div>
                                </div>
                            </Footer> */}
                        </Content>
                    </ErrorBoundary>
                </LayoutStyled>
            </Layout>
        ) : (
            <Layout className="gx-app-layout">
                <ContainerAuthStyled justify="center" align="middle">
                    <PageComponent {...props} />
                </ContainerAuthStyled>
            </Layout>
        );
    };
};

const ContainerAuthStyled = styled(Row)`
    min-height: 100vh;
`;

const TopBar = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 30px;

    strong {
        color: black;
    }

    .account-block {
        width: 18%;
        position: absolute;
        right: 180px;
        z-index: 3;
        margin: 0 auto;
    }
`;

const ImageAvatarStyled = styled.img`
    height: 35px;
    width: 35px;
    border-radius: 10px;
    border: 1px dashed #ccc;
    padding: 4px;
    margin-left: 10px;
`;

const WrapperInfoStyled = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

const LayoutStyled = styled(Layout)`
    background-color: #def4fc !important;
`;

export default PageLayout;
