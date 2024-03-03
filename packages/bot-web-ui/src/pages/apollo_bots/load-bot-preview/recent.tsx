import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { getApolloSavedWorkspaces } from '@deriv/bot-skeleton';
import { MobileWrapper, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import DeleteDialog from './delete-dialog';
import RecentWorkspace from './recent-workspace';
import SaveModal from './save-modal';
import './index.scss';

type THeader = {
    label: string;
    className: string;
};

const HEADERS: THeader[] = [
    {
        label: localize('Bot name'),
        className: 'bot-list__header__label',
    },
];

const RecentComponent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [apollo_bots, setApolloBots] = React.useState([
        { id: 0, name: '$DollarprinterbotOrignal$' },
        { id: 1, name: "Big  Boyz Rise N' fall" },
        { id: 2, name: 'Candle-Mine Version 2' },
        { id: 3, name: 'Digit Differ 3 free BOT_Rate 1_0.09' },
        { id: 4, name: 'Digit Matches (extended Fibonacci)' },
        { id: 5, name: 'LAS VEGAS 📃💵' },
        { id: 6, name: 'TRADE CITY BOT Version 1.2' },
    ]);

    React.useEffect(() => {
        const getStrategies = async () => {
            const recent_strategies = await getApolloSavedWorkspaces();
            console.log('Saved Bots', recent_strategies);
        };
        getStrategies();
    }, []);

    if (!apollo_bots?.length) return null;
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__recent'>
                <div className='load-strategy__recent__files'>
                    <div className='load-strategy__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Free bots:' />
                        </Text>
                    </div>
                    <div className='apollo-list__wrapper'>
                        {apollo_bots.map((workspace, index) => {
                            return (
                                <RecentWorkspace
                                    key={workspace.id}
                                    workspace={{ name: workspace.name }}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                    <MobileWrapper>
                        <SaveModal />
                    </MobileWrapper>
                </div>
            </div>
        </div>
    );
});

export default RecentComponent;
