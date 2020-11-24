import React, { useContext } from 'react';

import { List, Row, Col } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';

import CommentItem from './CommentItem';

const AnimationComments: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation, animationSelectionClear } = webshopContext;

  return (
    <Row justify='center'>
      <List
        header={<h1>Animation Comments</h1>}
        dataSource={selectedAnimation?.comments}
        renderItem={(item) => (
          <List.Item>
            <CommentItem
              comment={{
                id: item,
                owner: -1,
                created_at: new Date(),
                content: "Test content",
                animID: -1
              }}
            />
          </List.Item>
        )}
      />
    </Row>
  );
};

export default AnimationComments;
