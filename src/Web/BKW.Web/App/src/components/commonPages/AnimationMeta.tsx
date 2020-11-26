import React, { Fragment, useContext, useEffect } from 'react';

import { Descriptions, Button, Space } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';

import { ADMIN, CUSTOMER } from '../../constants/roleConstants';

const AnimationMeta: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const {
    selectedAnimation,
    purchaseAnimation,
    getOwnAnimations,
    ownAnimations,
    disableAnimation,
  } = webshopContext;

  const authContext = useContext(AuthContext);
  const { user } = authContext;

  useEffect(() => {
    if (user?.Role === CUSTOMER) {
      getOwnAnimations && getOwnAnimations('');
    }
  }, []);

  const onPurchase = () => {
    console.log('Purchase image');
    selectedAnimation &&
      purchaseAnimation &&
      purchaseAnimation(selectedAnimation);
  };

  const onDisable = () => {
    console.log('Disable image');
    selectedAnimation &&
      disableAnimation &&
      disableAnimation(selectedAnimation);
  };

  const onDownload = () => {
    console.log('Download image');
  };

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
          ownAnimations.some(
            (animation) => animation.id === selectedAnimation?.id
          ) ? (
            <Button type='primary' onClick={onDownload} disabled={selectedAnimation?.banned}>
              Download
            </Button>
          ) : (
            <Button type='primary' onClick={onPurchase} disabled={selectedAnimation?.banned}>
              Purchase
            </Button>
          )
        ) : (
          <Button type='primary' onClick={onDisable} disabled={selectedAnimation?.banned}>
            {selectedAnimation?.banned ? 'Disabled' : 'Disable'}
          </Button>
        )}
      </Space>
    </Fragment>
  );
};

export default AnimationMeta;
