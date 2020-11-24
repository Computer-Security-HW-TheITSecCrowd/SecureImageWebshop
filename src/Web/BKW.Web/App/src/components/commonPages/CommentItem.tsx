import React from 'react'

import { CommentProps }  from '../../types';

const CommentItem: React.FC<CommentProps> = ({ comment }) => {

    return (
        <div>
            <strong>Comment ID: {comment.id}</strong>
        </div>
    )
}

export default CommentItem
