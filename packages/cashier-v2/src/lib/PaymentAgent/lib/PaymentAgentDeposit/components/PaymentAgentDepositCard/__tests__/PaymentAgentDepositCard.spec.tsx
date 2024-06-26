import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDepositCard from '../PaymentAgentDepositCard';

jest.mock('../../../../../../../components', () => ({
    ExpansionPanel: jest.fn(() => <div>ExpansionPanel</div>),
}));

describe('PaymentAgentDepositCard', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentDepositCard>;

    beforeEach(() => {
        mockedProps = {
            //@ts-expect-error since this is a mock, we only need partial properties of payment agent
            paymentAgent: {
                currencies: 'USD',
                deposit_commission: '1',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                phone_numbers: [{ phone_number: '375291234567' }, { phone_number: '375297654321' }],
                withdrawal_commission: '2',
            },
        };
    });

    it('should render PaymentAgentDepositCard', () => {
        render(<PaymentAgentDepositCard {...mockedProps} />);

        expect(screen.getByTestId('dt_payment_agent_deposit_card')).toBeInTheDocument();
        expect(screen.getByText('ExpansionPanel')).toBeInTheDocument();
    });
});
