import React, { useContext } from 'react';

import { List, Row, Col, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { CUSTOMER } from '../../constants/roleConstants';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';
import { Comment } from '../../types';

const AnimationComments: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const authContext = useContext(AuthContext);

  const {
    loading,
    selectedAnimation,
    comments,
    deleteComment,
  } = webshopContext;
  const { user } = authContext;

  const onDelete = (id: string) => {
    deleteComment &&
      selectedAnimation &&
      deleteComment(selectedAnimation.id, id);
  };

  return (
    <Row justify='center'>
      <Col span={20}>
        <List
          style={{ width: '100%' }}
          dataSource={comments}
          bordered
          loading={loading}
          renderItem={(item: Comment) =>
            user && user.Role === CUSTOMER ? (
              <List.Item key={item.id}
               style={{ border: '1px solid #bfbfbf'}}>
                <List.Item.Meta
                  title={item.createdBy}
                  description={new Date(item.createdAt).toLocaleString()}
                />
                {item.content}
              </List.Item>
            ) : (
              <List.Item
                key={item.id}
                style={{ border: '1px solid #bfbfbf'}}
                actions={[
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
