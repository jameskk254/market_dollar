import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import React from 'react';
import { observer, useStore } from '@deriv/stores';

const RiskAcceptTestWarningModal = observer(() => {
    const { ui } = useStore();
    const {
        should_show_risk_accept_modal,
        setShouldShowWarningModal,
        setShouldShowAssessmentCompleteModal,
        setIsTradingAssessmentForNewUserEnabled,
    } = ui;
    const handleAcceptAppropriatenessTestWarning = () => {
        setShouldShowWarningModal(false);
        if (window.location.href.includes(routes.trading_assessment)) {
            setShouldShowAssessmentCompleteModal(false);
        } else {
            setShouldShowAssessmentCompleteModal(true);
            setIsTradingAssessmentForNewUserEnabled(true);
        }
    };

    return (
        <></>
    );
});

export default RiskAcceptTestWarningModal;
