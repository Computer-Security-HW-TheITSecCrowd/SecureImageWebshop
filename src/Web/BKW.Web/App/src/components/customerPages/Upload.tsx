import React, { ChangeEvent, useState } from 'react';
import { Upload as AUpload, Button, Row, Input, Form, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import openNotification from '../../utils/notification';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

const Upload: React.FC = () => {

    const [title, setTitle] = useState('');

    const props = {
        name: title,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },

        onChange(info: UploadChangeParam<UploadFile<any>>) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                openNotification('success', `${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                openNotification('error', `${info.file.name} file upload failed.`);
            }
        }
    };

    const checkTitle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (title === '') {
            e.preventDefault(); // TODO not working, needs fix
        }
    };

    const onTitleSet = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.target.value);
    };

    return (
        <AuthenticatedLayout>
            <Row justify='center' align='middle' style={{ marginTop: '10vh' }}>
                <Card>
                <Form>
                    <Form.Item label='Animation Title'>
                        <Input type='text' name='title' required onChange={onTitleSet} />
                    </Form.Item>
                </Form>
                <AUpload {...props}>
                    <Button icon={<UploadOutlined />} onClick={checkTitle}>Click to Upload</Button>
                </AUpload>
                </Card>
            </Row>
        </AuthenticatedLayout>
    );
};

export default Upload;