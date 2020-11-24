import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PageHeader, Card, Row, Col, Typography, Form, Input, Button } from 'antd';

import AuthContext from '../../context/auth/authContext';
import { loginRoute } from '../../constants/routeConstants';

const Register: React.FC = () => {
	const history = useHistory();

	const { Title } = Typography;

	const authContext = useContext(AuthContext);
	const { loading, register } = authContext;

	const onBack = (): void => {
			history.push(loginRoute);
	};

	const [formData, setFormData] = useState({
			username: '',
			password: '',
			passwordConfirmation: ''
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
	
	const onRegister = (): void => {
	register && register(formData);
	}

	return (
		<Fragment>
			<PageHeader
				onBack={onBack}
				title="Secure Image Webshop"
        		subTitle="Registration"
			/>
			<Row justify='center' align='middle' style={{ minHeight: '100%' }}>
				<Col span={6} >
					<Card
						title={
							<Row justify='center' align='middle' >
								<Title level={2}>Registration</Title>
							</Row>
						}
					>
						<Form
							onFinish={onRegister}
						>
							<Form.Item
								label='Username'
								name='Username'
								rules={[
									{ required: true, message: "Please enter a username!" },
									{ pattern: new RegExp('^[A-Za-z0-9]+$'), message: "Username can only contain letters and numbers." },
									{ min: 3, message: "Username must be at least 3 characters long!" }
								]}
								hasFeedback
							>
								<Input
									type='text'
									name='username'
									required
									
									onChange={onChange}
								/>
							</Form.Item>
							<Form.Item
								label='Password'
								name='Password'
								rules={[
									{ required: true, message: "Please provide a password!" },
									{ min: 8, message: "Password must contain at least 8 characters!" }
								]}
								hasFeedback
							>
								<Input.Password
									type='password'
									name='password'
									required
									onChange={onChange}
								/>
							</Form.Item>
							<Form.Item
								label='Confirm Password'
								name='Confirm Password'
								dependencies={['Password']}
								hasFeedback
								rules={[
									{ required: true, message: "Please confirm your password!" },
									({ getFieldValue }) => ({
											validator(rule, value) {
												if (!value || getFieldValue('Password') === value) {
													return Promise.resolve();
												}
												return Promise.reject('The two passwords that you entered do not match!');
											},
										}),
								]}
							>
								<Input.Password
									type='password'
									name='passwordConfirmation'
									required
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
								Registration
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default Register;