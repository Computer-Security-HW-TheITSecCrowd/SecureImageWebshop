import React from 'react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

const Gallery: React.FC = () => {

    return (
        <AuthenticatedLayout>
            <h1>
                My Animation Gallery
            </h1>
        </AuthenticatedLayout>
    );
};

export default Gallery;