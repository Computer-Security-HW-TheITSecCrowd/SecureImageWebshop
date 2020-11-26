import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;

// const layout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 16 },
// };

const CommentForm: React.FC = () => {
  const onFinish = (values: any) => {
      console.log('Send comment');
      
  };

  return (
    <Row justify='center'>
      <Col span={20}>
        <Form
        //   {...layout}
          name='commentForm'
          onFinish={onFinish}
          layout='inline'
          
        >
          <Form.Item
            // label='Username'
            name='content'
            rules={[
              { required: true, message: 'Please write an awesome comment' },
            ]}
          >
            <Input style={{width: '50vw'}}/>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Send
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default CommentForm;
