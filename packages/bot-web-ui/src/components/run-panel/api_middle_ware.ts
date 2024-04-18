import { api_base } from '@deriv/bot-skeleton';
const singleContracts = [
    'DIGITEVEN',
    'DIGITODD',
    'CALL',
    'PUT',
    'CALLE',
    'PUTE',
    'RUNHIGH',
    'RUNLOW',
    'RESETCALL',
    'RESETPUT',
    'TICKHIGH',
    'TICKLOW',
    'ASIANU',
    'ASIAND',
];

export const runSmartApi = () => {
    const subscription = api_base.api.onMessage().subscribe(({ data }: { data: any }) => {
        if (data.msg_type === '!proposal') {
            const contract_type = data.echo_req.contract_type;
            const percentage_return =
                ((data.proposal.payout - parseFloat(data.proposal.display_value)) /
                    parseFloat(data.proposal.display_value)) *
                100;

            document.getElementById(contract_type)!.innerText = `${percentage_return}%`;
            document.getElementById(`pay${contract_type}`)!.innerText = data.proposal.payout.toFixed(2);
        } else if (data.msg_type === 'active_symbols') {
            const symbolList: any = data.active_symbols;
            const syntheticSymbols = symbolList
                .filter((symbol: any) => symbol.market === 'synthetic_index')
                .sort((a: any, b: any) => a.display_order - b.display_order);

            const selectElement = document.getElementById('symbolSelect') as HTMLSelectElement;
            syntheticSymbols.forEach((symbol: any) => {
                const option = document.createElement('option');
                option.value = symbol.symbol;
                option.text = symbol.display_name;
                selectElement.appendChild(option);
            });
        }
    });
    api_base.pushSubscription(subscription);
};

export type SendPropasalType = {
    contract_type: string;
    amount: number;
    duration: number | undefined;
    duration_unit: string | undefined;
    symbol: string;
};

export const sendProposalRequest = ({ contract_type, amount, duration, duration_unit, symbol }: SendPropasalType) => {
    if (singleContracts.includes(contract_type)) {
        api_base.api.send({
            proposal: 1,
            amount: amount,
            basis: 'payout',
            contract_type,
            currency: 'USD',
            duration: duration,
            duration_unit: duration_unit,
            symbol: symbol,
        });
    }
};

export const PurchaseContract = ({ contract_type, amount, duration, duration_unit, symbol }: SendPropasalType) => {
    if (singleContracts.includes(contract_type)) {
        api_base.api.send({
            buy: '1',
            subscribe: 1,
            price: amount,
            parameters: {
                amount: amount,
                basis: 'stake',
                contract_type: contract_type,
                currency: 'USD',
                duration: duration,
                duration_unit: duration_unit,
                symbol: symbol,
            },
        });
    }
};
