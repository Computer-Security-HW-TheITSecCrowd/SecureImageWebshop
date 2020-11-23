import React, { FormEvent, Fragment, useContext, useState } from 'react';
import { Card, Row, Col, Button, Form, Input, Typography, Divider, PageHeader } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';

import AuthContext from '../../context/auth/authContext';
import { Link } from 'react-router-dom';
import { registerRoute } from '../../constants/routeConstants';

const Login: React.FC = () => {

  const authContext = useContext(AuthContext);
  const { user, isAuthenticated, error, loading } = authContext;

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const onChange = (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();
    if (event.target != null) {
      setFormData({
        ...formData,
        [event.currentTarget.name]: event.currentTarget.value
      });
    }
  };

  const onLogin = (): void => {
    console.log("Login");
    console.log(formData);
  }

  const { Title } = Typography;


  return (
    <Fragment>
      <PageHeader
        backIcon={false}
        title="Secure Image Webshop"
        subTitle="Login"
			/>
      <Row justify='center' align='middle' >
        <Col span={6} >
          <Card
            title={
              <Row justify='center' align='middle' >
                <Title level={2}>Welcome!</Title>
              </Row>
            }
          >
            <Form
              onFinish={onLogin}
            >
              <Form.Item>
                <Input
                  type='text'
                  name='username'
                  required
                  prefix={
                    <UserOutlined />
                  }
                  onChange={onChange}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password
                  type='password'
                  name='password'
                  required
                  prefix={
                    <KeyOutlined />
                  }
                  
                  onChange={onChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType='submit'
                  type="primary"
                  loading={loading}
                  block
                >
                Sign In
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Row justify='center' align='middle'>
              Don't have an account yet?
            </Row>
            <Row justify='center' align='middle'>
              <Link to={registerRoute}>
                <Button type='link' >
                    Register
                </Button>
              </Link>
            </Row>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Login;