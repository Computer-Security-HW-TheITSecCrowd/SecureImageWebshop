import React, { useContext } from 'react';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import ImageViewer from './ImageViewer';
import WebshopContext from '../../context/webshop/webshopContext';

const MainPage: React.FC = () => {

    const webshopContext = useContext(WebshopContext);
    const { getAnimations, animations, searchText, setSearchText, hasMore } = webshopContext;

    const onSearch = (term: string) => {
        setSearchText && setSearchText(term);
        getAnimations && getAnimations(term);
    };

    return (
        <AuthenticatedLayout>
            {
                getAnimations && 
                <ImageViewer
                    getAnimations={getAnimations}
                    onSearch={onSearch}
                    dataSource={animations}
                    hasMore={hasMore}
                    searchText={searchText}
                />
            }
        </AuthenticatedLayout>
        
    );
};

export default MainPage;