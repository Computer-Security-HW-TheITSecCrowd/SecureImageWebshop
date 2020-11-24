import React, { Fragment, useContext } from 'react';

import { Descriptions, Button } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';

const AnimationMeta: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation, animationSelectionClear } = webshopContext;

  return (
    <Fragment>
      {selectedAnimation && (
        <Descriptions title='Animation Info' bordered column={1}>
          <Descriptions.Item label='Title'>
            {selectedAnimation.title}
          </Descriptions.Item>
          <Descriptions.Item label='Purchased'>
            {selectedAnimation.boughtcounter + ' times'}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {selectedAnimation.created_at}
          </Descriptions.Item>
        </Descriptions>
      )}
      <Button type='primary'>Purchase</Button>
    </Fragment>
  );
};

export default AnimationMeta;
