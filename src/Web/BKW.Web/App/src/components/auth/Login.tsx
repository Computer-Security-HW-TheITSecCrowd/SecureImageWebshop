import React, { FormEvent, useContext, useState } from 'react';
import { Card, Row, Col, Button, Form, Input, Typography, Divider } from 'antd';
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
    <Row justify='center' align='middle' style={{ minHeight: '100vh', backgroundColor: 'rgba(180, 180, 180, 0.7)' }}>
      <Col span={6} >
        <Card
          title={
            <Row justify='center' align='middle' >
              <Title level={2}>Bejelentkezés</Title>
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
                onClick={onLogin}
                loading={loading}
                block
              >
              Bejelentkezés
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Row justify='center' align='middle'>
            Nincs még felhasználói fiókja?
          </Row>
          <Row justify='center' align='middle'>
            <Link to={registerRoute}>
              <Button type='link' >
                  Regisztráció
              </Button>
            </Link>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;