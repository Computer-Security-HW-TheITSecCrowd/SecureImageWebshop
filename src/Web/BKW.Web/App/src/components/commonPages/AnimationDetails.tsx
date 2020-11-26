import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Row, Col, Divider } from 'antd';

import { animationsRoute } from '../../constants/routeConstants';
import WebshopContext from '../../context/webshop/webshopContext';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import AnimationSummary from './AnimationSummary';
import AnimationComments from './AnimationComments';
import CommentForm from './CommentForm';

const AnimationDetails: React.FC = () => {
  const webshopContext = useContext(WebshopContext);
  const { selectedAnimation, animationSelectionClear } = webshopContext;

  const onBack = () => {
    animationSelectionClear && animationSelectionClear();
  };

  return selectedAnimation ? (
    <AuthenticatedLayout>
      <PageHeader onBack={onBack} title={selectedAnimation.title} />
      <div style={{ padding: '4vh 4vw' }}>
        <AnimationSummary />
        <Divider />
        <AnimationComments />
        <CommentForm />
      </div>
    </AuthenticatedLayout>
  ) : (
    <Redirect to={animationsRoute} />
  );
};

export default AnimationDetails;
