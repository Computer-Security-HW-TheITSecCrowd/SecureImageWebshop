import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, List, Spin, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { Animation } from '../../types';
import AnimationCard from '../commonPages/AnimationCard';

export interface ImageViewerProps {
    getAnimations: (filter: string, count?: number | undefined, loadingMore?: boolean | undefined) => Promise<void>,
    onSearch: (term: string) => void,
    searchText: string,
    hasMore: boolean,
    dataSource: Animation[]
};

const ImageViewer = ({ getAnimations, onSearch, searchText, hasMore, dataSource }: ImageViewerProps) => {

    const [moreLoading, setMoreLoading] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    const { Search } = Input;

    useEffect(() => {
        getAnimations && getAnimations(searchText);
        setLoadedCount(dataSource.length);
        // eslint-disable-next-line
    }, []);

    const handleInfiniteOnLoad = () => {
        if (!hasMore) return;
        setMoreLoading(true);
        getAnimations && getAnimations(searchText, loadedCount + 10, true);
        setMoreLoading(false);
        setLoadedCount(dataSource.length);
    };

    return (
        <Fragment>
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
                        dataSource={dataSource}
                        renderItem={item =>
                            <List.Item style={{ margin: '32px'}}>
                                <AnimationCard animation={item} loading={false} />
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
        </Fragment>
    );
};

export default ImageViewer;