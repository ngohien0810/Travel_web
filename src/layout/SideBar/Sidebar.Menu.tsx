import IconAntd from '@/components/IconAntd';
import MapIcon from '@/components/IconAntd/Map.Icon';

export const items: any = [
    {
        label: 'Tổng quan',
        key: '',
        icon: <IconAntd icon="HomeOutlined" />,
    },
    {
        label: 'Danh mục',
        key: 'category',
        icon: <IconAntd icon="ProfileOutlined" />,
    },
    {
        label: 'Bài viết',
        key: 'posts',
        icon: <IconAntd icon="ReadOutlined" />,
    },

    {
        label: 'Quản lý tour',
        key: 'tours',
        icon: <MapIcon />,
    },
    // {
    //     label: 'Thư viện',
    //     key: 'library',
    //     icon: <IconAntd icon="PictureOutlined" />,
    //     children: [
    //         { label: 'Quản lý danh mục', key: 'manage-category' },
    //         { label: 'Quản lý văn bản', key: 'manage-post' },
    //     ],
    // },
    {
        label: 'Đơn hàng',
        key: 'orders',
        icon: <IconAntd icon="CodepenOutlined" />,
    },
    {
        label: 'Phản hồi dịch vụ',
        key: 'feedback',
        icon: <IconAntd icon="ContactsOutlined" />,
    },
    {
        label: 'Khách hàng',
        key: 'customers',
        icon: <IconAntd icon="TeamOutlined" />,
    },
    {
        label: 'Tài khoản',
        key: 'account',
        icon: <IconAntd icon="UserOutlined" />,
    },
];

export const itemsSubAdmin: any = [
    {
        label: 'Danh mục',
        key: 'category',
        icon: <IconAntd icon="ProfileOutlined" />,
    },
    {
        label: 'Bài viết',
        key: 'posts',
        icon: <IconAntd icon="ReadOutlined" />,
    },

    {
        label: 'Quản lý tour',
        key: 'tours',
        icon: <MapIcon />,
    },
    {
        label: 'Phản hồi dịch vụ',
        key: 'feedback',
        icon: <IconAntd icon="ContactsOutlined" />,
    },
    // {
    //     label: 'Khách hàng',
    //     key: 'customers',
    //     icon: <IconAntd icon="TeamOutlined" />,
    // },
];
