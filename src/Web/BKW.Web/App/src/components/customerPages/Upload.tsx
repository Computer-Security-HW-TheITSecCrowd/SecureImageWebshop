import React, { useContext } from 'react';
import { Upload as AUpload, Button, Row, Input, Form, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import { RcCustomRequestOptions } from 'antd/lib/upload/interface';
import WebshopContext from '../../context/webshop/webshopContext';
import { FormInstance, useForm } from 'antd/lib/form/Form';

const Upload: React.FC = () => {

    const webshopContext = useContext(WebshopContext);
    const { uploadAnimation } = webshopContext;

    const upload = ({ file, onSuccess }: RcCustomRequestOptions) => {
        setTimeout(() => {
            onSuccess({result: 'ok'}, file);
        }, 0);
    };

    const normFile = (e: { file: any; }) => {
        console.log('Upload event:', e);
        return e && e.file;
      };

    const onFinish = (values: { title: string; upload: any }) => {
        uploadAnimation && uploadAnimation(values);
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
                        <Input type='text' name='title' required />
                    </Form.Item>
                    <Form.Item
                        name='upload'
                        label='Upload'
                        valuePropName='file'
                        getValueFromEvent={normFile}
                    >
                        <AUpload name='file' customRequest={upload} accept='.caff' >
                            <Button icon={<UploadOutlined />}>Choose CAFF File</Button>
                        </AUpload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
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