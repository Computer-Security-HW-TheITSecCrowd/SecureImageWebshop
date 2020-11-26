import React, { useContext, useState } from 'react';
import { Upload as AUpload, Button, Row, Input, Form, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import { RcCustomRequestOptions, UploadChangeParam } from 'antd/lib/upload/interface';
import WebshopContext from '../../context/webshop/webshopContext';

const Upload: React.FC = () => {

    const webshopContext = useContext(WebshopContext);
    const { uploadAnimation } = webshopContext;

    const initialState: { title: string, upload: string | ArrayBuffer | null } = {
        title: '',
        upload: null
    }

    const [state, setState] = useState(initialState);

    /* const upload = ({ file, onSuccess }: RcCustomRequestOptions) => {
        setTimeout(() => {
            onSuccess({result: 'ok'}, file);
        }, 0);
    }; */

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
                        <Input type='text' name='title' required onChange={e => setState({ ...state, title: e.target.value })} />
                    </Form.Item>
                    <Form.Item
                        name='upload'
                        label='Upload'
                        valuePropName='file'
                        getValueFromEvent={normFile}
                    >
                        <AUpload name='file' /* customRequest={upload} */ accept='.caff'
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