import React, { Fragment, useContext } from 'react';

import { Descriptions, Button, Space } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';

import { ADMIN, CUSTOMER } from '../../constants/roleConstants';

const AnimationMeta: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation, animationSelectionClear } = webshopContext;

  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return (
    <Fragment>
      <Space size='middle' direction='vertical' align='center'>
        {selectedAnimation && (
          <Descriptions title='Animation Info' bordered column={1}>
            <Descriptions.Item label='Owner'>
              {selectedAnimation.owner}
            </Descriptions.Item>
            <Descriptions.Item label='Title'>
              {selectedAnimation.title}
            </Descriptions.Item>
            <Descriptions.Item label='Purchased'>
              {selectedAnimation.numberOfPurchase + ' times'}
            </Descriptions.Item>
            <Descriptions.Item label='Created'>
              {selectedAnimation.createdAt}
            </Descriptions.Item>
          </Descriptions>
        )}
        {user && user.Role == CUSTOMER ? (
          <Button type='primary'>Purchase</Button>
        ) : (
          <Button type='primary'>Disable</Button>
        )}
      </Space>
    </Fragment>
  );
};

export default AnimationMeta;
