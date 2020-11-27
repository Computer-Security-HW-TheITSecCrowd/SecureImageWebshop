import React, { Fragment, useContext } from 'react';
import { Col, Row, Image, Skeleton } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';

import { ADMIN, CUSTOMER } from '../../constants/roleConstants';

import AnimationMeta from './AnimationMeta';

const AnimationSummary: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation } = webshopContext;

  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return (
    <Row justify='center' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        {selectedAnimation?.banned && user?.Role === CUSTOMER ? (
          <Skeleton.Image />
        ) : (
          <Image
            src={`https://picsum.photos/800/600?random=${
              selectedAnimation && selectedAnimation.id
            }`}
            preview={false}
            height='24vw'
            width='32vw'
            style={{ margin: '0 auto' }}
          />
        )}
      </Col>
      <Col
        span={12}
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <AnimationMeta />
      </Col>
    </Row>
  );
};

export default AnimationSummary;