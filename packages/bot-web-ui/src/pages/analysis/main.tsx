import React from 'react';
import './style.css';

const AnalysisPage = () => {
    return (
        <div className='main_analysis'>
            <iframe
                className='analysis-iframe'
                src='https://api.binarytool.site/'
            ></iframe>
        </div>
    );
};

export default AnalysisPage;
