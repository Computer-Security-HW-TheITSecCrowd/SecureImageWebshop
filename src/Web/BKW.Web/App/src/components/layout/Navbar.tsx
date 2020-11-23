import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { LoginOutlined, LogoutOutlined, UploadOutlined } from '@ant-design/icons';

import { animationsRoute, galleryRoute, loginRoute, uploadRoute } from '../../constants/routeConstants';
import AuthContext from '../../context/auth/authContext';

import { ADMIN, CUSTOMER } from '../../constants/roleConstants';

const Navbar: React.FC = () => {

    const authContext = useContext(AuthContext);
    const { isAuthenticated, user } = authContext;

    const { Header } = Layout;

    const history = useHistory();

    const [selectedKey, setSelectedKey] = useState(location.pathname.split('/')[0]);

    useEffect(() => {
        setSelectedKey(location.pathname)
      }, [location])

    const onLogout = () => {
        console.log("Logout");
        history.push(loginRoute);
    }

    const authLinks = (
        <Fragment>
            <Menu.Item key='logout' onClick={onLogout} style={{ float: 'right' }}>
                <LogoutOutlined />{' '}Logout
            </Menu.Item>
        </Fragment>
    );

    const customerLinks = (
        <Fragment>
            <Menu.Item key={animationsRoute}>
                <Link to={animationsRoute}>Animations</Link>
            </Menu.Item>
            <Menu.Item key={galleryRoute}>
                <Link to={galleryRoute}>Gallery</Link>
            </Menu.Item>
            <Menu.Item key={uploadRoute}>
                <Link to={uploadRoute}><UploadOutlined />{' '}Upload</Link>
            </Menu.Item>
        </Fragment>
    );

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Link to={loginRoute}>
                <img className="logo" src='images/logo.png' alt="Secure Image Webshop logo"/>
            </Link>
            <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]}>
                { isAuthenticated && user.role === CUSTOMER && customerLinks }
                { isAuthenticated && authLinks }
            </Menu>
        </Header>
    );
};

export default Navbar;