import CustomScrollbars from '@/components/CustomScrollbars';
import UserInfo from '@/components/UserInfo';
import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined } from '@ant-design/icons';
import { Image, Menu, Row } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { items, itemsSubAdmin } from './Sidebar.Menu';
import logo from '../../assets/logo.png';
import { useSelector } from 'react-redux';

const SidebarContent = ({
    collapsed,
    handleCallbackCollapsed,
}: {
    collapsed?: boolean;
    handleCallbackCollapsed?: () => void;
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userInfor = useSelector((state: any) => state?.root?.user);

    const selectedKeys = location.pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1] || 'dashboard';

    return (
        <>
            {!collapsed && (
                <Row
                    align="middle"
                    justify="center"
                    style={{ borderBottom: '1px solid #e3e3e3', marginBottom: '20px' }}
                >
                    <span style={{ fontWeight: 'bold' }}>VietNam Travel</span>
                    <Link to="/">
                        <img src={logo} alt="logo" height={100} />
                    </Link>
                </Row>
            )}
            {/* <div className="gx-linebar" onClick={handleCallbackCollapsed}>
                    {collapsed ? (
                        <MenuUnfoldOutlined className="gx-icon-btn" />
                    ) : (
                        <MenuFoldOutlined className="gx-icon-btn" />
                    )}
                </div> */}
            <CustomScrollbars className="gx-layout-sider-scrollbar">
                <MenuStyled
                    defaultOpenKeys={[defaultOpenKeys]}
                    selectedKeys={[selectedKeys]}
                    mode="inline"
                    items={userInfor?.Role == 1 ? items : itemsSubAdmin}
                    onClick={(e) => navigate('/' + e.key)}
                />
            </CustomScrollbars>
        </>
    );
};

const MenuStyled = styled(Menu)`
    * {
        font-weight: 800;
    }
    & span.ant-menu-title-content {
        margin-left: 20px;
    }
`;

export default React.memo(SidebarContent);
