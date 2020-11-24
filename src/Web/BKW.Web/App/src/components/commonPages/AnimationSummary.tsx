import React, { Fragment, useContext } from 'react';
import { Col, Row, Image } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';

import AnimationMeta from './AnimationMeta';

const AnimationSummary: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation, animationSelectionClear } = webshopContext;

  return (
    <Row justify='center'>
      <Col span={10}>
        <Image
          src={`https://picsum.photos/800/600?random=${
            selectedAnimation && selectedAnimation.id
          }`}
          preview={false}
          height='24vw'
          width='32vw'
        />
      </Col>
      <Col span={10}>
        <AnimationMeta />
      </Col>
    </Row>
  );
};

export default AnimationSummary;
