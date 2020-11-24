import React, { useContext, useEffect } from 'react';
import { Col, Input, Row } from 'antd';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import AnimationCard from '../adminPages/AnimationCard';
import WebshopContext from '../../context/webshop/webshopContext';

const MainPage: React.FC = () => {

    const { Search } = Input;

    const webshopContext = useContext(WebshopContext);
    const { getAnimations, animations, loading, searchText, setSearchText } = webshopContext;

    useEffect(() => {
        getAnimations && getAnimations(searchText);
        // eslint-disable-next-line
    }, []);

    const onSearch = (term: string) => {
        setSearchText && setSearchText(term);
        getAnimations && getAnimations(term);
    };

    return (
        <AuthenticatedLayout>
            <Row justify='center' align='middle' style={{ minHeight: '10vh' }} >
                <Col span={5}>
                    <Search placeholder="Search..." onSearch={onSearch} enterButton defaultValue={searchText}/>
                </Col>
            </Row>
            <Row justify='center' align='middle'>
                {
                    animations && animations.map(animation => (
                        <Col key={animation.id}  style={{ margin: '16px' }}>
                            <AnimationCard animation={animation} loading={loading}/>
                        </Col>
                    ))
                }
            </Row>
        </AuthenticatedLayout>
    );
};

export default MainPage;