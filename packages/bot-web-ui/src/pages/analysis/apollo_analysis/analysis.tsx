import React, { useEffect, useState } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import ApolloLineChart from './components/line_chart';
import MyResponsivePie from './components/pie_chart';
import OverUnderBarChart from './components/ou_bar_chart';
import { observer, useStore } from '@deriv/stores';
import DiffersBalls from './components/differs_balls';
import { api_base4, config } from '@deriv/bot-skeleton';
import './analysis.css';
import RiseFallBarChart from './components/rf_bar_chart';

function sleep(milliseconds: any) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

type LineChartProps = {
    name: string;
    value: number;
};


const ApolloAnalysisPage = observer(() => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [currentTick, setCurrentTick] = useState<number | String>('...');
    const [allLastDigitList, setAllLastDigitList] = useState<number[]>([]);
    const [lineChartList, setLineChartList] = useState<LineChartProps[]>([]);
    const [lastDigit, setLastDigit] = useState(0);
    useEffect(() => {
        startApi();
    }, []);

    const startApi = async () => {
        await sleep(5000);
        if (!isSubscribed) {
            api_base4.api.send({
                ticks_history: 'R_50',
                adjust_start_time: 1,
                count: 50,
                end: 'latest',
                start: 1,
                style: 'ticks',
            });
            setIsSubscribed(true);
        }

        const getLastDigits = (tick: any, pip_size: any) => {
            let lastDigit = tick.toFixed(pip_size);
            lastDigit = String(lastDigit).slice(-1);
            return Number(lastDigit);
        };

        if (api_base4.api) {
            const subscription = api_base4.api.onMessage().subscribe(({ data }: { data: any }) => {
                if (data.msg_type === 'tick') {
                    const { tick } = data;
                    const { ask, id, pip_size } = tick;
                    const last_digit = getLastDigits(ask, pip_size);

                    setLastDigit(last_digit);
                    setCurrentTick(ask);
                    removeFirstElement();
                    setAllLastDigitList(prevList => [...prevList, last_digit]);
                    setLineChartList(prevList => [...prevList, { name: last_digit.toString(), value: last_digit }]);
                }

                if (data.msg_type === 'history') {
                    const { history, pip_size } = data;
                    const { prices } = history;
                    prices.forEach((tick: number) => {
                        const last_digit = getLastDigits(tick, pip_size);
                        setAllLastDigitList(prevList => [...prevList, last_digit]);
                        setLineChartList(prevList => [...prevList, { name: last_digit.toString(), value: last_digit }]);
                    });
                    api_base4.api.send({
                        ticks: 'R_50',
                        subscribe: 1,
                    });
                }
            });

            api_base4.pushSubscription(subscription);
        }
    };

    //
    const removeFirstElement = () => {
        setAllLastDigitList(prevList => prevList.slice(1));
        setLineChartList(prevList => prevList.slice(1));
    };

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
                        <h3>{currentTick.toString()}</h3>
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
                    <RiseFallBarChart allDigitList={allLastDigitList} />
                </div>
                <div className='over_under card1'>
                    <h2 className='analysis_title'>Over/Under</h2>
                    <OverUnderBarChart overUnderList={allLastDigitList} />
                </div>
                <div className='line_chart card2'>
                    <h2 className='analysis_title'>Last Digits Charts</h2>
                    <ApolloLineChart data={lineChartList} />
                </div>
            </div>
            {/* Bottom Cards */}
            <div className='pie_diff'>
                <div className='pie card1'>
                    <h2 className='analysis_title'>Even/Odd</h2>
                    <MyResponsivePie allDigitList={allLastDigitList} />
                </div>
                <div className='digit_diff card3'>
                    <h2 className='analysis_title'>Differs/Matches</h2>
                    <DiffersBalls lastDigitList={allLastDigitList} active_last={lastDigit} />
                </div>
            </div>
        </div>
    );
});

export default ApolloAnalysisPage;
