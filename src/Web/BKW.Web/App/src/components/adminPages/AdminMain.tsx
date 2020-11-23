import React from 'react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

const AdminMain: React.FC = () => {

    return (
        <AuthenticatedLayout>
            <h1>
                Admin Main Page
            </h1>
        </AuthenticatedLayout>
    );
};

export default AdminMain;