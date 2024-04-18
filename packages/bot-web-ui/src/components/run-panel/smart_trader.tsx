import React, { useRef } from 'react';
import { config, getContractTypeOptions, api_base } from '@deriv/bot-skeleton';
import { IconTradeTypes, Popover } from '@deriv/components';
import classNames from 'classnames';
import { popover_zindex } from 'Constants/z-indexes';
import { PurchaseContract, SendPropasalType, runSmartApi, sendProposalRequest } from './api_middle_ware';

type TTransactionIconWithText = {
    icon: React.ReactElement;
    title: string;
    message?: React.ReactNode;
    className?: string;
};

function getAllKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

const TransactionIconWithText = ({ icon, title, message, className }: TTransactionIconWithText) => (
    <React.Fragment>
        <Popover
            className={classNames(className, 'transactions__icon')}
            alignment='left'
            message={title}
            zIndex={popover_zindex.TRANSACTION.toString()}
        >
            {icon}
        </Popover>
        {message}
    </React.Fragment>
);

const SmartTrader = () => {
    const [active_trade, setActiveTrade] = React.useState([]);
    const [all_tradeTypes, setAllTradeTypes] = React.useState([]);
    const [stake_amount, setStakeAmount] = React.useState<number | string>(0.35);
    const [duration, setDuration] = React.useState<number | string>(2);
    const [duration_unit, setDurationUnit] = React.useState<string>('t');
    const [symbol, setSymbol] = React.useState<string>('R_100');
    React.useEffect(() => {
        const all_tradeTypes = getAllKeys(config.opposites);
        setAllTradeTypes(all_tradeTypes);
        setActiveTrade(getContractTypeOptions('both', all_tradeTypes[0]));
        runSmartApi();
    }, []);

    // React.useEffect(() => {
    //     for (const typesPP of active_trade) {
    //         const proposal: SendPropasalType = {
    //             amount: parseFloat(stake_amount),
    //             contract_type: typesPP[1],
    //             duration: parseInt(duration),
    //             duration_unit: duration_unit,
    //             symbol: 'R_100',
    //         };
    //         sendProposalRequest(proposal);
    //     }
    // }, [active_trade]);

    const buyContract = (contract_type: string) => {
        const contract: SendPropasalType = {
            amount: parseFloat(stake_amount),
            contract_type: contract_type,
            duration: parseInt(duration),
            duration_unit: duration_unit,
            symbol: symbol,
        };
        PurchaseContract(contract);
    };

    const handleTradeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveTrade(getContractTypeOptions('both', event.target.value)); // Update the selected trade type when the value changes
    };
    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(event.target.value);
    };

    const handleDurationUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDurationUnit(event.target.value);
    };
    const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSymbol(event.target.value);
    };

    const handleStakeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStakeAmount(event.target.value);
    };
    return (
        <div className='smart_trader'>
            <div className='contract_input'>
                <div className='contract_symbol'>
                    <select onChange={handleTradeTypeChange}>
                        {all_tradeTypes.map((pair, index) => (
                            <option key={index} value={pair}>
                                {pair}
                            </option>
                        ))}
                    </select>
                    <select id='symbolSelect' onChange={handleSymbolChange}>
                        {config.active_symbol.map(symbol => (
                            <option key={symbol.symbol} value={symbol.symbol}>
                                {symbol.display_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='duration'>
                    <input type='text' value={duration} onChange={handleDurationChange} />
                    <select onChange={handleDurationUnitChange}>
                        <option value='t'>ticks</option>
                        <option value='s'>seconds</option>
                        <option value='m'>minutes</option>
                    </select>
                </div>
                <div className='stake'>
                    <input type='text' value={stake_amount} onChange={handleStakeAmountChange} />
                    <small>USD</small>
                </div>
            </div>
            <div className='top_btn'>
                <div className='contract_info'>
                    <div className='contract_type'>
                        <TransactionIconWithText
                            icon={<IconTradeTypes type={active_trade.length > 0 ? active_trade[0][1] : ''} size={16} />}
                            title={active_trade.length > 0 ? active_trade[0][0] : ''}
                        />
                        <h4>{active_trade.length > 0 && active_trade[0][0]}</h4>
                    </div>
                    <div className='buy_info'>
                        <div className='stake_payout'>
                            <h4>Stake: {stake_amount}</h4>
                            {/* <h4>
                                Payout: <span id={active_trade.length > 0 ? `pay${active_trade[0][1]}` : ''}></span>
                            </h4> */}
                        </div>
                        <div className='purchase_btn' onClick={() => buyContract(active_trade[0][1])}>
                            <h3>Purchase</h3>
                        </div>
                    </div>
                </div>
                <div className='net_profit'>
                    <h5>
                        Net profit: 80.91 USD | Return{' '}
                        <span id={active_trade.length > 0 ? active_trade[0][1] : ''}></span>
                    </h5>
                </div>
            </div>
            <div className='top_btn'>
                <div className='contract_info'>
                    <div className='contract_type'>
                        <TransactionIconWithText
                            icon={<IconTradeTypes type={active_trade.length > 0 ? active_trade[1][1] : ''} size={16} />}
                            title={active_trade.length > 0 ? active_trade[1][0] : ''}
                        />
                        <h4>{active_trade.length > 0 && active_trade[1][0]}</h4>
                    </div>
                    <div className='buy_info'>
                        <div className='stake_payout'>
                            <h4>Stake: {stake_amount}</h4>
                            {/* <h4>
                                Payout: <span id={active_trade.length > 0 ? `pay${active_trade[1][1]}` : ''}></span>
                            </h4> */}
                        </div>
                        <div className='purchase_btn low' onClick={() => buyContract(active_trade[1][1])}>
                            <h3>Purchase</h3>
                        </div>
                    </div>
                </div>
                <div className='net_profit'>
                    <h5>
                        Net profit: 80.91 USD | Return{' '}
                        <span id={active_trade.length > 0 ? active_trade[1][1] : ''}></span>
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default SmartTrader;
