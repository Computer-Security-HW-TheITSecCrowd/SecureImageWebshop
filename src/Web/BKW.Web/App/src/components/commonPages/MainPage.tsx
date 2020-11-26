import React, { useContext, useEffect, useState } from 'react';
import { Col, Input, List, Row, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import AnimationCard from './AnimationCard';
import WebshopContext from '../../context/webshop/webshopContext';

const MainPage: React.FC = () => {

    const { Search } = Input;

    const webshopContext = useContext(WebshopContext);
    const { getAnimations, animations, loading, searchText, setSearchText, hasMore } = webshopContext;
    const [moreLoading, setMoreLoading] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        getAnimations && getAnimations(searchText);
        setLoadedCount(animations.length);
        // eslint-disable-next-line
    }, []);

    const onSearch = (term: string) => {
        setSearchText && setSearchText(term);
        getAnimations && getAnimations(term);
    };

    const handleInfiniteOnLoad = () => {
        console.log("Load more");
        if (!hasMore) return;
        setMoreLoading(true);
        console.log(hasMore);
        getAnimations && getAnimations(searchText, loadedCount + 10, true);
        setMoreLoading(false);
        setLoadedCount(animations.length);
    };

    return (
        <AuthenticatedLayout>
            <Row justify='center' align='middle' style={{ minHeight: '10vh' }} >
                <Col span={5}>
                    <Search placeholder="Search..." onSearch={onSearch} enterButton defaultValue={searchText}/>
                </Col>
            </Row>
            <div className="list-infinite-container">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={hasMore}
                >
                    <List
                        grid={{ column: 5 }}
                        dataSource={animations}
                        renderItem={item =>
                            <List.Item style={{ margin: '32px'}}>
                                <AnimationCard animation={item} loading={loading} />
                            </List.Item>
                        }
                    />
                    {moreLoading && hasMore && (
                        <div className="list-loading-container">
                            <Spin />
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        </AuthenticatedLayout>
    );
};

export default MainPage;