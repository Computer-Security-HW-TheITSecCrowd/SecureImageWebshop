import { notification } from 'antd';

const openNotification = (type: 'error' | 'warning' | 'success' | 'info', message: string, description: string = '') => {
  notification[type]({
    message,
    description
  });
};

export default openNotification;