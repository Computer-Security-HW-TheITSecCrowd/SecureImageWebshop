import React, { useContext } from 'react';

import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import ImageViewer from '../commonPages/ImageViewer';
import WebshopContext from '../../context/webshop/webshopContext';

const Gallery: React.FC = () => {

    const webshopContext = useContext(WebshopContext);
    const { getOwnAnimations, ownAnimations, gallerySearchText, setSearchText, hasMoreOwn, loading, moreOwnLoading } = webshopContext;

    const onSearch = (term: string) => {
        setSearchText && setSearchText(term, true);
        getOwnAnimations && getOwnAnimations(term);
    };

    return (
        <AuthenticatedLayout>
            {
                getOwnAnimations && 
                <ImageViewer
                    loading={loading}
                    moreLoading={moreOwnLoading}
                    getAnimations={getOwnAnimations}
                    onSearch={onSearch}
                    dataSource={ownAnimations}
                    hasMore={hasMoreOwn}
                    searchText={gallerySearchText}
                />
            }
        </AuthenticatedLayout>
        
    );
};

export default Gallery;