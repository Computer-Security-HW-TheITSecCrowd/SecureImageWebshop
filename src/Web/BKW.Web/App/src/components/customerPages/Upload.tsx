import React, { useContext, useState } from 'react';
import { Upload as AUpload, Button, Row, Input, Form, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import WebshopContext from '../../context/webshop/webshopContext';
import openNotification from '../../utils/notification';

const Upload: React.FC = () => {

    const webshopContext = useContext(WebshopContext);
    const { uploadAnimation, uploading } = webshopContext;

    const initialState: { title: string, upload: string | ArrayBuffer | null } = {
        title: '',
        upload: null
    }

    const [state, setState] = useState(initialState);

    const normFile = (e: { file: any; }) => {
        console.log('Upload event:', e);
        return e && e.file;
    };

    const onFinish = (values: { title: string; upload: any }) => {
        if (!values.upload) {
            openNotification('error', 'Please select a file to upload!');
        } else {
            uploadAnimation && uploadAnimation(values);
        }
    };

    return (
        <AuthenticatedLayout>
            <Row justify='center' align='middle' style={{ marginTop: '10vh' }}>
                <Card>
                <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label='Animation Title'
                        name='title'
                    >
                        <Input type='text' name='title' required onChange={e => setState({ ...state, title: e.target.value })} />
                    </Form.Item>
                    <Form.Item
                        name='upload'
                        label='Upload'
                        valuePropName='file'
                        getValueFromEvent={normFile}
                    >
                        <AUpload name='upload' accept='.caff' 
                            beforeUpload={file => {
                                const reader = new FileReader();

                                reader.readAsBinaryString(file);
                                setState({
                                    ...state,
                                    upload: reader.result
                                });
                                // Prevent upload
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Choose CAFF File</Button>
                        </AUpload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={uploading}>
                            Upload
                        </Button>
                    </Form.Item>
                </Form>
                </Card>
            </Row>
        </AuthenticatedLayout>
    );
};

export default Upload;