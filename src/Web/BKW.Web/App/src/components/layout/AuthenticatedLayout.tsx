import React, { Fragment } from 'react';
import { Layout } from 'antd';

import Navbar from './Navbar';
import Footer from './Footer';

const AuthenticatedLayout: React.FC = ({ children }) => {

    const { Content } = Layout;

    return (
        <Fragment>
            <Layout style={{ minHeight: '100vh' }}>
                <Navbar />
                <Content style={{ marginTop: '64px' }}>
                    {children}
                </Content>
                <Footer />
            </Layout>
        </Fragment>
    );
};

export default AuthenticatedLayout;