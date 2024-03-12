import React from 'react';

const DiffersBalls = () => {
    return (
        <div>
            <div className='differs_container'>
                <div className='progress top' data-number='0'>
                    <h3>0</h3>
                    <h4>
                        11<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='1'>
                    <h3>1</h3>
                    <h4>
                        9.7<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='2'>
                    <h3>2</h3>
                    <h4>
                        10<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='3'>
                    <h3>3</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
                <div className='progress less' data-number='4'>
                    <h3>4</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='5'>
                    <h3>5</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='6'>
                    <h3>6</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='7'>
                    <h3>7</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='8'>
                    <h3>8</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='9'>
                    <h3>9</h3>
                    <h4>
                        12.1<span>%</span>
                    </h4>
                </div>
            </div>

            <div className='pointer'></div>
        </div>
    );
};

export default DiffersBalls;
