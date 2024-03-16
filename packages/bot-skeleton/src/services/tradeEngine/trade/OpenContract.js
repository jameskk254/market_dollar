import { getRoundedNumber } from '@deriv/shared';
import { sell, openContractReceived } from './state/actions';
import { contractStatus, contract as broadcastContract, info, log } from '../utils/broadcast';
import { purchaseSuccessful } from './state/actions';
import { api_base, api_base2 } from '../../api/api-base';
import { handleWinValue, handleLostValue } from '../../apollo_functions';
import { config } from '../../../constants';
import { log_types } from '../../../constants/messages';

export default Engine =>
    class OpenContract extends Engine {
        observeOpenContract() {
            if (!api_base.api) return;
            const subscription = api_base.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'proposal_open_contract') {
                    const contract = data.proposal_open_contract;

                    if (!contract || !this.expectedContractId(contract?.contract_id)) {
                        return;
                    }
                    console.log(contract);

                    this.setContractFlags(contract);

                    this.data.contract = contract;

                    broadcastContract({ accountID: api_base.account_info.loginid, ...contract });

                    if (this.isSold) {
                        this.contractId = '';
                        clearTimeout(this.transaction_recovery_timeout);
                        this.updateTotals(contract);
                        contractStatus({
                            id: 'contract.sold',
                            data: contract.transaction_ids.sell,
                            contract,
                        });

                        if (this.afterPromise) {
                            this.afterPromise();
                        }

                        this.store.dispatch(sell());
                    } else {
                        this.store.dispatch(openContractReceived());
                    }
                } else if (data.msg_type === 'buy') {
                    if (typeof data.buy.contract_id !== 'undefined') {
                        this.updatePurchase(data);
                    }
                }
            });
            api_base.pushSubscription(subscription);
        }

        observeOpenContractVH() {
            if (!api_base2.api) return;
            const subscription = api_base2.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'proposal_open_contract') {
                    const contract = data.proposal_open_contract;

                    if (!contract || !this.expectedContractId(contract?.contract_id)) {
                        return;
                    }

                    this.setContractFlags(contract);

                    this.data.contract = contract;

                    broadcastContract({ accountID: api_base2.account_info.loginid, ...contract });

                    if (this.isSold) {
                        this.contractId = '';
                        clearTimeout(this.transaction_recovery_timeout);
                        this.updateTotals(contract);
                        contractStatus({
                            id: 'contract.sold',
                            data: contract.transaction_ids.sell,
                            contract,
                        });

                        if (this.afterPromise) {
                            this.afterPromise();
                        }

                        if (config.vh_variables.vh_official) {
                            if (config.vh_variables.is_enabled) {
                                const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;

                                const profit = getRoundedNumber(Number(sellPrice) - Number(buyPrice), currency);

                                const win = profit > 0;
                                // VH calculations on win or lost contract
                                if (win) {
                                    handleWinValue();
                                } else {
                                    handleLostValue();
                                }
                            }
                        }

                        this.store.dispatch(sell());
                    } else {
                        this.store.dispatch(openContractReceived());
                    }
                } else if (data.msg_type === 'buy') {
                    if (typeof data.buy.contract_id !== 'undefined') {
                        const contract_id = data.buy.contract_id;
                        api_base2.api.send({
                            proposal_open_contract: 1,
                            contract_id: contract_id,
                            subscribe: 1,
                        });
                    }
                }
            });
            api_base2.pushSubscription(subscription);
        }

        updatePurchase(response) {
            let { buy } = response;
            const { buy_contract_for_multiple_accounts } = response;
            if (buy_contract_for_multiple_accounts) {
                buy = buy_contract_for_multiple_accounts.result[0];
            }

            contractStatus({
                id: 'contract.purchase_received',
                data: buy.transaction_id,
                buy,
            });

            this.contractId = buy.contract_id;
            this.store.dispatch(purchaseSuccessful());

            log(log_types.PURCHASE, { longcode: buy.longcode, transaction_id: buy.transaction_id });

            const { loginid: accountID } = api_base.account_info;
            info({
                accountID: accountID,
                totalRuns: this.updateAndReturnTotalRuns(),
                transaction_ids: { buy: buy.transaction_id },
                contract_type:'DIGITDIFF',
                buy_price: buy.buy_price,
            });
        }

        waitForAfter() {
            return new Promise(resolve => {
                this.afterPromise = resolve;
            });
        }

        setContractFlags(contract) {
            const { is_expired, is_valid_to_sell, is_sold, entry_tick } = contract;

            this.isSold = Boolean(is_sold);
            this.isSellAvailable = !this.isSold && Boolean(is_valid_to_sell);
            this.isExpired = Boolean(is_expired);
            this.hasEntryTick = Boolean(entry_tick);
        }

        expectedContractId(contractId) {
            return this.contractId && contractId === this.contractId;
        }

        getSellPrice() {
            const { bid_price: bidPrice, buy_price: buyPrice, currency } = this.data.contract;
            return getRoundedNumber(Number(bidPrice) - Number(buyPrice), currency);
        }
    };
