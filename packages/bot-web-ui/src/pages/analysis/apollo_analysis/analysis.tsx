import React, { useEffect, useState, useRef } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import ApolloLineChart from './components/line_chart';
import MyResponsivePie from './components/pie_chart';
import OverUnderBarChart from './components/ou_bar_chart';
import { observer, useStore } from '@deriv/stores';
import DiffersBalls from './components/differs_balls';
import { api_base4, api_base } from '@deriv/bot-skeleton';
import { IoSyncCircleOutline } from 'react-icons/io5';
import RiseFallBarChart from './components/rf_bar_chart';
import { useDBotStore } from 'Stores/useDBotStore';
import './analysis.css';

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
    const [isTickChart, setIsTickChart] = useState(true);
    const [lastDigit, setLastDigit] = useState(0);
    const [numberOfTicks, setNumberOfTicks] = useState<string | number>(50);
    const [optionsList, setOptions] = useState<SymbolData[]>([]);
    const [overValue, setOverValue] = useState<string | number>(4);
    const [martingaleValue, setMartingaleValue] = useState<string | number>(1.2);
    const [percentageValue, setPercentageValue] = useState<string | number>(60);
    const [underValue, setUnderValue] = useState<string | number>(4);
    const [isOneClickActive, setIsOneClickActive] = useState(false);
    const [isAutoClickerActive, setIsAutoClickerActive] = useState(false);
    const [isRiseFallOneClickActive, setIsRiseFallOneClickActive] = useState(false);
    const [isOverUnderOneClickActive, setIsOverUnderOneClickActive] = useState(false);
    const [isTradeActive, setIsTradeActive] = useState(false);
    const [oneClickContract, setOneClickContract] = useState('DIGITDIFF');
    const [overUnderContract, setOverUnderContract] = useState('DIGITOVER');
    const [oneClickDuration, setOneClickDuration] = useState(1);
    const [oneClickAmount, setOneClickAmount] = useState<number | string>(0.5);
    const [oneClickDefaultAmount, setOneClickDefaultAmount] = useState<number | string>(0.5);
    const [accountCurrency, setAccountCurrency] = useState('');
    const [active_symbol, setActiveSymbol] = useState('R_100');
    const [prev_symbol, setPrevSymbol] = useState('R_100');
    const [pip_size, setPipSize] = useState(2);
    const [prevLowestValue, setPrevLowestValue] = useState<string | number>('');
    // Refs
    const martingaleValueRef = useRef(martingaleValue);
    const isTradeActiveRef = useRef(isTradeActive);
    const current_contractids = useRef<string[]>([]);
    const totalLostAmount = useRef(0);

    const { ui } = useStore();
    const DBotStores = useDBotStore();
    const { transactions } = DBotStores;

    const { is_mobile } = ui;
    const { updateResultsCompletedContract } = transactions;

    useEffect(() => {
        startApi();
    }, []);

    useEffect(() => {
        if (prev_symbol !== active_symbol) {
            api_base4.api.send({
                ticks_history: active_symbol,
                adjust_start_time: 1,
                count: 5000,
                end: 'latest',
                start: 1,
                style: 'ticks',
            });
        }
        setPrevSymbol(active_symbol);
    }, [active_symbol]);

    const getLastDigits = (tick: any, pip_size: any) => {
        let lastDigit = tick.toFixed(pip_size);
        lastDigit = String(lastDigit).slice(-1);
        return Number(lastDigit);
    };

    const startApi = async () => {
        await sleep(5000);
        if (!isSubscribed) {
            api_base4.api.send({
                active_symbols: 'brief',
                product_type: 'basic',
            });
            setIsSubscribed(true);
        }

        if (api_base4.api) {
            const subscription = api_base4.api.onMessage().subscribe(({ data }: { data: any }) => {
                if (data.msg_type === 'tick') {
                    const { tick } = data;
                    const { ask, id, pip_size } = tick;
                    const last_digit = getLastDigits(ask, pip_size);

                    setLastDigit(last_digit);
                    setCurrentTick(ask);
                    removeFirstElement();
                    setAllLastDigitList(prevList => [...prevList, ask]);
                }

                if (data.msg_type === 'history') {
                    const { history, pip_size } = data;
                    setPipSize(pip_size);
                    const { prices } = history;
                    const { ticks_history } = data.echo_req;
                    setAllLastDigitList(prices);
                    setActiveSymbol(ticks_history);
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
                        count: 5000,
                        end: 'latest',
                        start: 1,
                        style: 'ticks',
                    });
                    setOptions(filteredSymbols);
                }
            });

            api_base4.pushSubscription(subscription);
        }

        if (api_base.api) {
            const subscription = api_base.api.onMessage().subscribe(({ data }: { data: any }) => {
                if (data.msg_type === 'proposal_open_contract') {
                    const { proposal_open_contract } = data;

                    if (
                        proposal_open_contract.contract_type === 'DIGITOVER' ||
                        proposal_open_contract.contract_type === 'DIGITUNDER'
                    ) {
                        if (proposal_open_contract.is_sold) {
                            if (proposal_open_contract.status === 'lost') {
                                if (!current_contractids.current.includes(proposal_open_contract.contract_id)) {
                                    totalLostAmount.current += Math.abs(proposal_open_contract.profit);
                                    const newStake = totalLostAmount.current * parseFloat(martingaleValueRef.current);
                                    setOneClickAmount(parseFloat(newStake.toFixed(2)));
                                }
                            } else {
                                totalLostAmount.current = 0;
                                setOneClickAmount(oneClickDefaultAmount);
                            }
                            if (
                                isTradeActiveRef.current &&
                                !current_contractids.current.includes(proposal_open_contract.contract_id)
                            ) {
                                isTradeActiveRef.current = false;
                                setIsTradeActive(false);
                                current_contractids.current.push(proposal_open_contract.contract_id);
                            }
                        }
                    }
                    updateResultsCompletedContract(proposal_open_contract);
                }
            });

            api_base.pushSubscription(subscription);
        }
        setAccountCurrency(api_base.account_info.currency);
    };

    const selectTickList = () => {
        return (
            <>
                <select name='intervals' id='contract_duration' onChange={handleDurationSelect}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='2'>3</option>
                    <option value='2'>4</option>
                    <option value='2'>5</option>
                    <option value='2'>6</option>
                    <option value='2'>7</option>
                    <option value='2'>8</option>
                    <option value='2'>9</option>
                </select>
                <div className='oneclick_amout'>
                    <input type='number' value={oneClickAmount} onChange={handleOneClickAmountInputChange} />
                    <h3 className='user_currency'>{accountCurrency}</h3>
                </div>
            </>
        );
    };

    const buy_contract = (contract_type: string, isTradeActive: boolean) => {
        if (isTradeActive) {
            api_base.api.send({
                buy: '1',
                price: oneClickAmount,
                subscribe: 1,
                parameters: {
                    amount: oneClickAmount,
                    basis: 'stake',
                    contract_type,
                    currency: 'USD',
                    duration: oneClickDuration,
                    duration_unit: 't',
                    symbol: active_symbol,
                },
            });
        }
    };

    // =========================
    const removeFirstElement = () => {
        setAllLastDigitList(prevList => prevList.slice(1));
    };

    const getLastDigitList = () => {
        const requiredItems = allLastDigitList.slice(-numberOfTicks);
        const returnedList: number[] = [];
        requiredItems.forEach((tick: number) => {
            const last_digit = getLastDigits(tick, pip_size);
            returnedList.push(last_digit);
        });

        return returnedList;
    };

    const getLineChartList = () => {
        const requiredItems = allLastDigitList.slice(-numberOfTicks);
        const returnedList: LineChartProps[] = [];
        let previous_tick = 0;
        let tick_difference = 0;
        requiredItems.forEach((tick: number) => {
            const last_digit = getLastDigits(tick, pip_size);
            if (previous_tick !== 0) {
                tick_difference = tick - previous_tick;
                previous_tick = tick;
            } else {
                previous_tick = tick;
                tick_difference = tick;
            }
            returnedList.push({
                name: isTickChart ? tick.toString() : last_digit.toString(),
                value: isTickChart ? parseFloat(tick_difference.toFixed(2)) : last_digit,
            });
        });

        return returnedList;
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        api_base4.api.forgetAll('ticks').then(() => {
            setCurrentTick('Loading...');
            setActiveSymbol(selectedValue);
        });
    };

    const handleLineChartSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue === 'risefall') {
            setIsTickChart(true);
        } else if (selectedValue === 'lastdigit') {
            setIsTickChart(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setNumberOfTicks(newValue === '' ? '' : Number(newValue));
    };
    const handleOverInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setOverValue(newValue === '' ? '' : Number(newValue));
    };
    const handleMartingaleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        martingaleValueRef.current = newValue === '' ? '' : Number(newValue);
        setMartingaleValue(newValue === '' ? '' : Number(newValue));
    };
    const handlePercentageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setPercentageValue(newValue === '' ? '' : Number(newValue));
    };
    const handleUnderInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setUnderValue(newValue === '' ? '' : Number(newValue));
    };
    const handleOneClickAmountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setOneClickAmount(newValue === '' ? '' : Number(newValue));
        setOneClickDefaultAmount(newValue === '' ? '' : Number(newValue));
    };

    const handleContractSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setOneClickContract(selectedValue);
    };
    const handleOverUnderContractSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setOverUnderContract(selectedValue);
    };

    const handleDurationSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setOneClickDuration(Number(selectedValue));
    };

    const handleIsOneClick = () => {
        setIsOneClickActive(!isOneClickActive);
    };
    const handleIsAutoClicker = () => {
        setIsAutoClickerActive(!isAutoClickerActive);
    };

    const handleIsRiseFallOneClick = () => {
        setIsRiseFallOneClickActive(!isRiseFallOneClickActive);
    };
    const handleIsOverUnderOneClick = () => {
        setIsOverUnderOneClickActive(!isOverUnderOneClickActive);
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
                    <RiseFallBarChart allDigitList={getLastDigitList()} is_mobile={is_mobile} />
                </div>
                <div className='over_under card1'>
                    <div className='over_under_options'>
                        {/* <h2 className='analysis_title'>Over/Under</h2> */}
                        <div className='digit_inputs'>
                            <div className='over_digit'>
                                <label htmlFor='over_input'>Over</label>
                                <input type='number' value={overValue} onChange={handleOverInputChange} />
                            </div>
                            <div className='under_digit'>
                                <label htmlFor='under_input'>Under</label>
                                <input type='number' value={underValue} onChange={handleUnderInputChange} />
                            </div>
                        </div>
                        <div className='over_oct_container'>
                            <div className='over_oct'>
                                <input
                                    type='checkbox'
                                    checked={isOverUnderOneClickActive}
                                    onChange={handleIsOverUnderOneClick}
                                />
                                {selectTickList()}
                            </div>
                            <div className='over_under_settings'>
                                <select name='ct_types' id='contract_types' onChange={handleOverUnderContractSelect}>
                                    <option value='DIGITOVER'>Over</option>
                                    <option value='DIGITUNDER'>Under</option>
                                </select>
                                <div className='martingale'>
                                    <small>martingale</small>
                                    <input
                                        type='number'
                                        value={martingaleValueRef.current}
                                        onChange={handleMartingaleInputChange}
                                    />
                                </div>
                                <div className='percentage_value'>
                                    <small>% value</small>
                                    <input
                                        type='number'
                                        value={percentageValue}
                                        onChange={handlePercentageInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <OverUnderBarChart
                        overUnderList={getLastDigitList()}
                        overValue={overValue}
                        underValue={underValue}
                        is_mobile={is_mobile}
                        active_symbol={active_symbol}
                        isOverUnderOneClickActive={isOverUnderOneClickActive}
                        oneClickAmount={oneClickAmount}
                        oneClickDuration={oneClickDuration}
                        isTradeActive={isTradeActive}
                        percentageValue={percentageValue}
                        overUnderContract={overUnderContract}
                        setIsTradeActive={setIsTradeActive}
                        isTradeActiveRef={isTradeActiveRef}
                    />
                </div>
                <div className='line_chart card2'>
                    <div className='linechat_oct'>
                        <select name='' id='linechat_oct_options' onChange={handleLineChartSelectChange}>
                            <option value='risefall'>Rise/Fall Chart</option>
                            <option value='lastdigit'>Last Digits Chart</option>
                        </select>
                        {!isTickChart && <h2 className='analysis_title'>Last Digits Chart</h2>}
                        {isTickChart && (
                            <div className='oct_trading_options'>
                                <div className='details_options'>
                                    <input
                                        type='checkbox'
                                        checked={isRiseFallOneClickActive}
                                        onChange={handleIsRiseFallOneClick}
                                    />
                                    {selectTickList()}
                                </div>
                                <div className='rise_fall_buttons'>
                                    <button
                                        className='rise_btn'
                                        onClick={() => buy_contract('CALL', isRiseFallOneClickActive)}
                                    >
                                        Rise
                                    </button>
                                    <button
                                        className='fall_btn'
                                        onClick={() => buy_contract('PUT', isRiseFallOneClickActive)}
                                    >
                                        Fall
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <ApolloLineChart data={getLineChartList()} />
                </div>
            </div>
            {/* Bottom Cards */}
            <div className='pie_diff'>
                <div className='pie card1'>
                    <h2 className='analysis_title'>Even/Odd</h2>
                    <MyResponsivePie allDigitList={getLastDigitList()} />
                </div>
                <div className='digit_diff card3'>
                    <div className='title_oc_trader'>
                        <h2 className='analysis_title'>Differs/Matches</h2>
                        {oneClickContract === 'DIGITDIFF' && (
                            <div className='auto_clicker'>
                                <input type='checkbox' checked={isAutoClickerActive} onChange={handleIsAutoClicker} />
                                <h4>Auto Clicker</h4>
                            </div>
                        )}
                        <div className='oneclick_trader'>
                            <input type='checkbox' checked={isOneClickActive} onChange={handleIsOneClick} />
                            <select name='ct_types' id='contract_types' onChange={handleContractSelect}>
                                <option value='DIGITDIFF'>Differs</option>
                                <option value='DIGITMATCH'>Matches</option>
                            </select>
                            {selectTickList()}
                        </div>
                    </div>
                    <DiffersBalls
                        lastDigitList={getLastDigitList()}
                        active_last={lastDigit}
                        active_symbol={active_symbol}
                        contract_type={oneClickContract}
                        duration={oneClickDuration}
                        isOneClickActive={isOneClickActive}
                        stake_amount={oneClickAmount}
                        prevLowestValue={prevLowestValue}
                        isAutoClickerActive={isAutoClickerActive}
                        setPrevLowestValue={setPrevLowestValue}
                    />
                </div>
            </div>
        </div>
    );
});

export default ApolloAnalysisPage;
