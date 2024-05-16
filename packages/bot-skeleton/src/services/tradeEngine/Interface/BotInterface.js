import { observer as globalObserver } from '../../../utils/observer';
import { createDetails } from '../utils/helpers';
import { config } from '../../../constants';

const getBotInterface = tradeEngine => {
    const getDetail = i => createDetails(tradeEngine.data.contract)[i];

    return {
        init: (...args) => tradeEngine.init(...args),
        start: (...args) => tradeEngine.start(...args),
        stop: (...args) => tradeEngine.stop(...args),
        purchase: contract_type => tradeEngine.purchase(contract_type),
        getAskPrice: contract_type => Number(getProposal(contract_type, tradeEngine).ask_price),
        getPayout: contract_type => Number(getProposal(contract_type, tradeEngine).payout),
        getPurchaseReference: () => tradeEngine.getPurchaseReference(),
        isSellAvailable: () => tradeEngine.isSellAtMarketAvailable(),
        sellAtMarket: () => tradeEngine.sellAtMarket(),
        getSellPrice: () => getSellPrice(tradeEngine),
        isResult: result => getDetail(10) === result,
        isTradeAgain: result => globalObserver.emit('bot.trade_again', result),
        readDetails: i => getDetail(i - 1),
        // === Custom Bot Functions ====
        enabaleVH: status => {
            if (status == 'enable') {
                config.vh_variables.is_enabled = true;
            } else {
                config.vh_variables.is_enabled = false;
            }
        },
        enabaleTotalLost: status => {
            if (status == 'enable') {
                config.vh_variables.enable_total_lost = true;
            } else {
                config.vh_variables.enable_total_lost = false;
            }
        },
        
        enabaleDemoCopyTrading: (dataString) => {
            const data = JSON.parse(dataString);
            if (data.copy_status == 'enable') {
                config.demo_copy_trading.is_active = true;
                config.demo_copy_trading.login_id = data.account_id;
            } else {
                config.demo_copy_trading.login_id = '';
                config.demo_copy_trading.is_active = false;
            }
        },
        getVHStatus: ()=>{
            return config.vh_variables.is_enabled
        },
        enableBarrierChanger: status => {
            if (status == 'enable') {
                config.touch_notouch_vars.barrier_offset_active = true;
            } else {
                config.touch_notouch_vars.barrier_offset_active = false;
            }
        },
        contractSwitcher: status => {
            config.contract_switcher.contract_switcher_value = status;
        },
        predictionSetter: status => {
            config.pred_setter.allow_pred_setter = true;
            config.pred_setter.prediction = status;
        },
        updateBarrierOffseter: status => {
            const removeExtraQuotes = str => {
                return str.replace(/^'|"|'$/g, '');
            };

            const cleanedString = removeExtraQuotes(status);
            config.touch_notouch_vars.barrier_offset = cleanedString;
        },
        showTP: ()=>{
            config.show_notifications.show_tp = true;
        },
        showSL: ()=>{
            config.show_notifications.show_sl = true;
        }
    };
};

const getProposal = (contract_type, tradeEngine) => {
    return tradeEngine.data.proposals.find(
        proposal =>
            proposal.contract_type === contract_type &&
            proposal.purchase_reference === tradeEngine.getPurchaseReference()
    );
};

const getSellPrice = tradeEngine => {
    return tradeEngine.getSellPrice();
};

export default getBotInterface;
