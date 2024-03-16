import { contractStatus, info, log } from '../utils/broadcast';
import { purchaseSuccessful } from './state/actions';

export const updatePurchase = (response,this) => {
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
    info({
        accountID: this.accountInfo.loginid,
        totalRuns: this.updateAndReturnTotalRuns(),
        transaction_ids: { buy: buy.transaction_id },
        contract_type,
        buy_price: buy.buy_price,
    });
};
