import LocalStorage from '@/apis/LocalStorage';
import IconAntd from '@/components/IconAntd';
import SearchBox from '@/components/SearchBox';
import { wait } from '@/utils';
import { MenuOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, Space } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Topbar = ({ handleCallbackCollapseMobile }: { handleCallbackCollapseMobile: () => void }) => {
    const [SearchText, setSearchText] = React.useState('');
    const userInfor = useSelector((state: any) => state?.root?.user);

    const menu = (
        <Menu
            style={{ width: 250 }}
            items={[
                // {
                //     key: '1',
                //     label: 'Thông tin cá nhân',
                //     icon: <IconAntd icon="UserOutlined" fontSize={16} marginRight={14} />,
                // },
                {
                    key: '2',
                    label: 'Đăng xuất',
                    icon: <IconAntd icon="LogoutOutlined" fontSize={16} marginRight={14} />,
                    onClick: () => {
                        LocalStorage.removeLogged();
                        wait(1000).then(() => {
                            window.location.reload();
                        });
                    },
                },
            ]}
        />
    );

    return (
        <>
            <Layout.Header style={{ height: 100 }}>
                <div className="gx-linebar gx-mr-3">
                    <MenuOutlined className="gx-icon-btn" onClick={handleCallbackCollapseMobile} />
                </div>
                <Link className="gx-d-block gx-d-lg-none gx-pointer" to="/">
                    <img
                        height={65}
                        alt=""
                        src="https://i0.wp.com/daknonggeopark.com/wp-content/uploads/2021/10/logo-CVDC-Dak-Nong19.5-02.png?w=769&ssl=1"
                    />
                </Link>
                <SearchBox
                    styleName="gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg"
                    placeholder="Tìm kiếm..."
                    onChange={(e) => setSearchText(e.target.value)}
                    value={SearchText}
                />
                <ul className="gx-header-notifications gx-ml-auto">
                    <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
                        <Dropdown overlay={menu}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <IconAntd icon="UserOutlined" /> {userInfor?.Username}
                                </Space>
                            </a>
                        </Dropdown>
                    </li>
                </ul>
            </Layout.Header>
        </>
    );
};

export default Topbar;
