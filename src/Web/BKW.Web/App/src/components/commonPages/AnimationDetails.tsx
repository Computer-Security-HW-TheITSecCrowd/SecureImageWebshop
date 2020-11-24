import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader } from 'antd';

import { animationsRoute } from '../../constants/routeConstants';
import WebshopContext from '../../context/webshop/webshopContext';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

const AnimationDetails: React.FC = () => {
    const webshopContext = useContext(WebshopContext);
    const { selectedAnimation, animationSelectionClear } = webshopContext;

    const onBack = () => {
        animationSelectionClear && animationSelectionClear();
    };

    return (
        selectedAnimation ?
            <AuthenticatedLayout>
                <PageHeader
                    onBack={onBack}
                    title={selectedAnimation.title}
                />
            </AuthenticatedLayout>:
                <Redirect to={animationsRoute} />
    );
};

export default AnimationDetails;