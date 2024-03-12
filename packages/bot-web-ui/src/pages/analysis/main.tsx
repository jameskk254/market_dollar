import React from 'react';
import ApolloAnalysisPage from './apollo_analysis/analysis';
import './style.css';

const AnalysisPage = () => {
    return (
        <div className='main_analysis'>
            <ApolloAnalysisPage />
            {/* <iframe
                className='analysis-iframe'
                src='https://api.binarytool.site/'
            ></iframe> */}
        </div>
    );
};

export default AnalysisPage;
