import React from 'react';
import classNames from 'classnames';
import { Dialog, MobileWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderstackDashboardOpenButton } from '../analytics/rudderstack-dashboard';
import BotPreview from './bot-preview';
import { Text } from '@deriv/components';
import './index.scss';
import './style.css';
const LocalComponent = observer(() => {
    return (
        <div className='apollo_massive_logo'>  
            <Text size='m' line_height='xs' className='header__menu-link-text'>
                    <Localize i18n_default_text='Deriv Apollo' />
                </Text>
        </div>
    );
});

export default LocalComponent;
