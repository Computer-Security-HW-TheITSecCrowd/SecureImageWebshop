import React, { Fragment } from 'react';
import { Layout } from 'antd';

import Navbar from './Navbar';

const AuthenticatedLayout: React.FC = ({ children }) => {

    const { Content } = Layout;

    return (
        <Fragment>
            <Layout>
                <Navbar />
                <Content style={{ marginTop: '64px' }}>
                    {children}
                </Content>
            </Layout>
        </Fragment>
    );
};

export default AuthenticatedLayout;