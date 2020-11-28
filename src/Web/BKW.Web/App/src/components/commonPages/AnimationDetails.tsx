import React, { Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PageHeader,  Divider } from 'antd';

import { CUSTOMER } from '../../constants/roleConstants';

import WebshopContext from '../../context/webshop/webshopContext';
import AuthContext from '../../context/auth/authContext';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import AnimationSummary from './AnimationSummary';
import AnimationComments from './AnimationComments';
import CommentForm from './CommentForm';

const AnimationDetails: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const {
    selectedAnimation,
    animationSelectionClear,
    clearComments,
  } = webshopContext;

  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const history = useHistory();

  const onBack = () => {
    animationSelectionClear && animationSelectionClear();
    clearComments && clearComments();
    history.goBack();
  };

  return (
    <AuthenticatedLayout>
      <PageHeader onBack={onBack} title={selectedAnimation?.title} />
      <div style={{ padding: '4vh 4vw' }}>
        <AnimationSummary />
        <Divider />
        {user?.Role === CUSTOMER && (
          <Fragment>
            <CommentForm />
            <Divider />
          </Fragment>
        )}
        <AnimationComments />
      </div>
    </AuthenticatedLayout>
  );
};

export default AnimationDetails;
