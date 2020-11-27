import React, { MouseEvent, useContext, useEffect } from 'react';

import { List, Row, Col, Descriptions, Button, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { ADMIN, CUSTOMER } from '../../constants/roleConstants';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';
import CommentItem from './CommentItem';
import { Comment } from '../../types';

const AnimationComments: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const authContext = useContext(AuthContext);

  const {
    loading,
    selectedAnimation,
    animationSelectionClear,
    getAnimationComments,
    comments,
    deleteComment,
  } = webshopContext;
  const { user } = authContext;

  useEffect(() => {
    getAnimationComments &&
      selectedAnimation &&
      getAnimationComments(selectedAnimation.id);
  }, []);

  const onDelete = (id: string) => {
    // console.log('Delete item: ', e.currentTarget.)

    deleteComment &&
      selectedAnimation &&
      deleteComment(selectedAnimation.id, id);
  };

  return (
    <Row justify='center'>
      <Col span={20}>
        <List
          style={{ width: '100%' }}
          // header={<h1 style={{ margin: '0 auto' }}>Comments</h1>}
          dataSource={comments}
          bordered
          loading={loading}
          renderItem={(item: Comment) =>
            user && user.Role === CUSTOMER ? (
              <List.Item key={item.id}
               style={{ border: '1px solid #bfbfbf'}}>
                <List.Item.Meta
                  title={item.createdBy}
                  description={item.createdAt}
                />
                {item.content}
                {/* <CommentItem comment={item} /> */}
              </List.Item>
            ) : (
              <List.Item
                key={item.id}
                style={{ border: '1px solid #bfbfbf'}}
                actions={[
                  // <DeleteOutlined onClick={onDelete} />
                  <Button
                    type='primary'
                    icon={<DeleteOutlined />}
                    onClick={(_e) => onDelete(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.createdBy}
                  description={item.createdAt}
                />
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
