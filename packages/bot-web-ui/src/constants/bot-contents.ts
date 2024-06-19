type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    DHUBBOTS: 2,
    CHART: 3,
    COPYTRADER: 4,
    TUTORIAL: 5,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = ['id-dbot-dashboard', 'id-bot-builder', 'id-dbot-apollo-bots', 'id-charts','id-copy-trader', 'id-analysis-page' ,'id-tutorials'];

export const DEBOUNCE_INTERVAL_TIME = 500;
