import LocalStorage from '@/apis/LocalStorage';
import { AuthRoutes, PrivateRoutes, routerPage } from '@/config/routes';
import PageLayout from '@/layout';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';

// config routes
const MainPage = ({ role }: { role: string }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const userInfor = useSelector((state: any) => state?.root?.user);

    // chỗ này để cấu hình route cho từng role
    let element = useRoutes(LocalStorage.getLogged() ? PrivateRoutes : AuthRoutes);

    const [logged, setLogged] = React.useState(false);

    React.useEffect(() => {
        if (logged) return;

        // nếu đăng nhập và domain không webview và domain không public
        // if (LocalStorage.getToken() && pathname.includes('webview') && pathname.includes('public')) {

        if (LocalStorage.getLogged()) {
            setLogged(true);

            if (pathname === routerPage.register || pathname === routerPage.login) {
                return userInfor?.Role === 1 ? navigate('/') : navigate('/category');
            }
            // navigate(pathname);
        } else {
            switch (pathname) {
                case routerPage.register:
                    navigate(routerPage.register);
                    break;
                default:
                    navigate(routerPage.login);
                    break;
            }
        }
    }, [logged, pathname]);

    return element;
};

export default PageLayout(MainPage);
