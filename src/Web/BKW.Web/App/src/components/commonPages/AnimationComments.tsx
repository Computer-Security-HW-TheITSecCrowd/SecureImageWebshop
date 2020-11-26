import React, { MouseEvent, useContext, useEffect } from 'react';

import { List, Row, Col, Descriptions, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

import { ADMIN, CUSTOMER } from '../../constants/roleConstants';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';
import CommentItem from './CommentItem';
import { Comment } from '../../types';

const AnimationComments: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const authContext = useContext(AuthContext);

  const {
    selectedAnimation,
    animationSelectionClear,
    getAnimationComments,
    comments,
  } = webshopContext;
  const { user } = authContext;

  useEffect(() => {
    getAnimationComments &&
      selectedAnimation &&
      getAnimationComments(selectedAnimation.id);
  }, []);

  const onDelete = (id: string) => {
    // console.log('Delete item: ', e.currentTarget.)
    
  }

  return (
    <Row justify='center'>
      <Col span={20}>
        <List
          style={{ width: '100%' }}
          header={<h1>Animation Comments</h1>}
          dataSource={comments}
          bordered
          renderItem={(item: Comment) =>
            user && user.Role === CUSTOMER ? (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.createdBy}
                  description={item.createdAt}
                />
                {item.content}
                {/* <CommentItem comment={item} /> */}
              </List.Item>
            ) : (
              <List.Item key={item.id} actions={[
                // <DeleteOutlined onClick={onDelete} />
                <Button type='primary' icon={<DeleteOutlined />} onClick={_e => onDelete(item.id)} key={item.id} id={`delete-button-${item.id}`}/>
              ]}>
                {item.content}
              </List.Item>
            )
          }
        />
      </Col>
    </Row>
  );
};

export default AnimationComments;
