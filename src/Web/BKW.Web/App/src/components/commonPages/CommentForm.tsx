import React, { useContext } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

import WebshopContext from '../../context/webshop/webshopContext';

const { TextArea } = Input;

// const layout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 16 },
// };

type CommentFormResult = {
  content: string;
};

const CommentForm: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation, sendComment } = webshopContext;

  const [form] = Form.useForm()

  const onFinish = (values: CommentFormResult) => {
    console.log('Send comment', values);
    selectedAnimation &&
      sendComment &&
      sendComment(selectedAnimation.id, values.content);
    form.resetFields()
  };

  return (
    <Row justify='center'>
      <Col span={20}>
        <Form
          //   {...layout}
          form={form}
          name='commentForm'
          onFinish={onFinish}
          layout='inline'
          style={{ margin: '0 auto' }}
        >
          <Form.Item
            // label='Username'
            name='content'
            rules={[
              { required: true, message: 'Please write an awesome comment' },
            ]}
            style={{ margin: '0 auto', width: '50vw' }}
          >
            <Input placeholder='Write your comment here' />
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
