import React from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import ApolloLineChart from './components/line_chart';
import MyResponsivePie from './components/pie_chart';
import ApolloBarChart from './components/bar_chart';
import { observer, useStore } from '@deriv/stores';
import './analysis.css';
import DiffersBalls from './components/differs_balls';
const pie_data = [
    {
        id: 'Even',
        label: 'Even',
        value: 165,
        color: 'hsl(245, 70%, 50%)',
    },
    {
        id: 'Odd',
        label: 'Odd',
        value: 364,
        color: 'hsl(11, 70%, 50%)',
    },
];

const ApolloAnalysisPage = observer(() => {
    const { contract_trade, ui } = useStore();
    const { is_mobile } = ui;
    const { last_contract } = contract_trade;
    const { contract_info = {}, digits_info = {}, display_status, is_digit_contract, is_ended } = last_contract;
    return (
        <div className='main_app'>
            <div className='top_bar'>
                <div className='symbol_price'>
                    <div className='active_symbol'>
                        <select name='' id='symbol_options'>
                            <option value='100'>Volatility 100</option>
                        </select>
                    </div>
                    <div className='current_price'>
                        <h3>1000</h3>
                    </div>
                </div>
                <div className='guide'>
                    <BsExclamationCircle />
                </div>
            </div>
            {/* Middle Cards */}
            <div className='rf_ou'>
                <div className='rise_fall card1'>
                    <h2 className='analysis_title'>Rise/Fall</h2>
                    <ApolloBarChart />
                </div>
                <div className='over_under card1'>
                    <h2 className='analysis_title'>Over/Under</h2>
                    <ApolloBarChart />
                </div>
                <div className='line_chart card2'>
                    <h2 className='analysis_title'>Last Digits Charts</h2>
                    <ApolloLineChart />
                </div>
            </div>
            {/* Bottom Cards */}
            <div className='pie_diff'>
                <div className='pie card1'>
                    <h2 className='analysis_title'>Even/Odd</h2>
                    <MyResponsivePie data={pie_data} />
                </div>
                <div className='digit_diff card3'>
                <h2 className='analysis_title'>Differs/Matches</h2>
                    <DiffersBalls />
                </div>
            </div>
        </div>
    );
});

export default ApolloAnalysisPage;
