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

type SymbolData = {
    allow_forward_starting: number;
    display_name: string;
    display_order: number;
    exchange_is_open: number;
    is_trading_suspended: number;
    market: string;
    market_display_name: string;
    pip: number;
    subgroup: string;
    subgroup_display_name: string;
    submarket: string;
    submarket_display_name: string;
    symbol: string;
    symbol_type: string;
};

type ActiveSymbolTypes = {
    active_symbols: SymbolData[];
};

const ApolloAnalysisPage = observer(() => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [currentTick, setCurrentTick] = useState<number | String>('Loading...');
    const [allLastDigitList, setAllLastDigitList] = useState<number[]>([]);
    const [lineChartList, setLineChartList] = useState<LineChartProps[]>([]);
    const [lastDigit, setLastDigit] = useState(0);
    const [numberOfTicks, setNumberOfTicks] = useState(50);
    const [optionsList, setOptions] = useState<SymbolData[]>([]);
    let active_symbol = 'R_100';

    useEffect(() => {
        startApi();
    }, []);

    const startApi = async () => {
        await sleep(5000);
        if (!isSubscribed) {
            api_base4.api.send({
                active_symbols: 'brief',
                product_type: 'basic',
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
                    const { ticks_history } = data.echo_req;
                    setAllLastDigitList([]);
                    setLineChartList([]);
                    prices.forEach((tick: number) => {
                        const last_digit = getLastDigits(tick, pip_size);
                        setAllLastDigitList(prevList => [...prevList, last_digit]);
                        setLineChartList(prevList => [...prevList, { name: last_digit.toString(), value: last_digit }]);
                    });
                    api_base4.api.send({
                        ticks: ticks_history,
                        subscribe: 1,
                    });
                }

                if (data.msg_type === 'active_symbols') {
                    const { active_symbols }: ActiveSymbolTypes = data;
                    const filteredSymbols = active_symbols.filter(symbol => symbol.subgroup === 'synthetics');
                    filteredSymbols.sort((a, b) => a.display_order - b.display_order);
                    api_base4.api.send({
                        ticks_history: filteredSymbols[0].symbol,
                        adjust_start_time: 1,
                        count: numberOfTicks,
                        end: 'latest',
                        start: 1,
                        style: 'ticks',
                    });
                    setOptions(filteredSymbols);
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

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        api_base4.api.forgetAll('ticks').then(() => {
            active_symbol = selectedValue;
            api_base4.api.send({
                ticks_history: active_symbol,
                adjust_start_time: 1,
                count: numberOfTicks,
                end: 'latest',
                start: 1,
                style: 'ticks',
            });
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setNumberOfTicks(newValue);
        if (newValue > 9 && newValue <= 5000) {
            api_base4.api.forgetAll('ticks').then(() => {
                api_base4.api.send({
                    ticks_history: active_symbol,
                    adjust_start_time: 1,
                    count: newValue,
                    end: 'latest',
                    start: 1,
                    style: 'ticks',
                });
            });
        }
    };

    return (
        <div className='main_app'>
            <div className='top_bar'>
                <div className='symbol_price'>
                    <div className='active_symbol'>
                        <select name='' id='symbol_options' onChange={handleSelectChange}>
                            {optionsList.length > 0 ? (
                                optionsList.map(option => (
                                    <option key={option.symbol} value={option.symbol}>
                                        {option.display_name}
                                    </option>
                                ))
                            ) : (
                                <option value=''>Loading...</option>
                            )}
                        </select>
                    </div>
                    <div className='no_of_ticks'>
                        <input type='number' name='' id='' value={numberOfTicks} onChange={handleInputChange} />
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
