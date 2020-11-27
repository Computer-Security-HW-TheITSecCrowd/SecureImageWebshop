import React from 'react';
import { List } from 'antd';

import { CommentProps } from '../../types';

const CommentItem: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div>
      <strong>Comment ID: </strong>
      {comment.id}
      <strong>Owner: </strong>
      {comment.createdBy}
      <strong>Created at: </strong>
      {comment.createdAt}
      <strong>Content: </strong>
      {comment.content}
      <strong>Content: </strong>
      {comment.content}

    </div>
  );
};

export default CommentItem;
