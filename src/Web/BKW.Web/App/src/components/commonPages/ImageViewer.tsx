import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, List, Spin, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { Animation } from '../../types';
import AnimationCard from '../commonPages/AnimationCard';

export interface ImageViewerProps {
    getAnimations: (filter: string, count?: number | undefined, loadingMore?: boolean | undefined) => Promise<void>,
    onSearch: (term: string) => void,
    searchText: string,
    loading: boolean,
    moreLoading: boolean,
    hasMore: boolean,
    dataSource: Animation[]
};

const ImageViewer = ({ getAnimations, onSearch, searchText, hasMore, dataSource, loading, moreLoading }: ImageViewerProps) => {

    const [loadedCount, setLoadedCount] = useState(0);

    const { Search } = Input;

    useEffect(() => {
        getAnimations && getAnimations(searchText);
        setLoadedCount(dataSource.length);
        // eslint-disable-next-line
    }, []);

    const handleInfiniteOnLoad = () => {
        if (!hasMore) return;
        getAnimations && getAnimations(searchText, loadedCount + 10, true);
        setLoadedCount(dataSource.length);
    };

    return (
        <Fragment>
            <Row justify='center' align='middle' style={{ minHeight: '10vh' }} >
                <Col span={5}>
                    <Search placeholder="Search..." onSearch={onSearch} enterButton defaultValue={searchText}/>
                </Col>
            </Row>
            <div className="list-infinite-container" style={{ overflowY: 'scroll', height: '70vh' }} >
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={hasMore}
                    useWindow={false}
                >
                    <List
                        loading={loading}
                        grid={{ column: 5 }}
                        dataSource={dataSource}
                        renderItem={item =>
                            <List.Item style={{ marginStart: '32px'}}>
                                <AnimationCard animation={item} loading={false} />
                            </List.Item>
                        }
                    />
                </InfiniteScroll>
            </div>
            {moreLoading && (
                <div className="list-loading-container">
                    <Spin size='large' />
                </div>
            )}
        </Fragment>
    );
};

export default ImageViewer;