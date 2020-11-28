import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Typography, Image, Tooltip, Row, Col, Skeleton } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

import { AnimationProps } from '../../types';
import WebshopContext from '../../context/webshop/webshopContext';
import { animationDetailsRoute } from '../../constants/routeConstants';

const AnimationCard: React.FC<AnimationProps> = ({ animation, loading }) => {

    const webshopContext = useContext(WebshopContext);
    const { selectAnimation, selectedAnimation } = webshopContext;

    const history = useHistory();

    const { Title, Text } = Typography;

    const onSelectAnimation = () => {
        selectAnimation && selectAnimation(animation);
        history.push(animationDetailsRoute);
    };

    return (
        <Card
            onClick={onSelectAnimation}
            style={{
                width: '15vw'
            }}
            loading={loading}
            hoverable={true}
            cover={
                animation.banned ?
                    <Skeleton.Image style={{ height: '15vw', width: '15vw'}} /> :
                <Image alt='Animation preview' src={`https://picsum.photos/300/300?random=${animation.id}`} preview={false} height='15vw' width='15vw' />
            }
        >
            <Card.Meta
                title={
                    <Tooltip
                        mouseEnterDelay={0.5}
                        title={animation.title}
                    >
                        <Row align='top' >
                            <Title level={4} ellipsis >{animation.title}</Title>
                        </Row>
                    </Tooltip>
                }
                description={
                    <Row justify='end' align='middle' >
                        <Col>
                            <Tooltip
                                title={
                                    animation.numberOfPurchase === 0 ?
                                        'Nobody bought it yet' :
                                        animation.numberOfPurchase === 1 ?
                                            `${animation.numberOfPurchase} user has bought this animation` :
                                                `${animation.numberOfPurchase} users have bought this animation`}
                            >
                                <Text type='secondary' style={{ marginRight: '16px' }}>{animation.numberOfPurchase}{' '}<TeamOutlined /></Text>
                            </Tooltip>
                        </Col>
                    </Row>
                }
            />
        </Card>
    );
};

export default AnimationCard;