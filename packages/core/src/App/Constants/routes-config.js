import React from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { makeLazyLoader, routes, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import Redirect from 'App/Containers/Redirect';
import Endpoint from 'Modules/Endpoint';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const Trader = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "trader" */ '@deriv/trader');
    })
);

const Reports = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "reports" */ '@deriv/reports');
});

const Bot = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "bot-web-ui-app" */ '@deriv/bot-web-ui');
    })
);

const getModules = () => {
    const modules = [
        {
            path: routes.bot,
            component: Bot,
            // Don't use `Localize` component since native html tag like `option` cannot render them
            getTitle: () => localize('Bot'),
        },
        {
            path: routes.reports,
            component: Reports,
            getTitle: () => localize('Reports'),
            icon_component: 'IcReports',
            is_authenticated: true,
            routes: [
                {
                    path: routes.positions,
                    component: Reports,
                    getTitle: () => localize('Open positions'),
                    icon_component: 'IcOpenPositions',
                    default: true,
                },
                {
                    path: routes.profit,
                    component: Reports,
                    getTitle: () => localize('Trade table'),
                    icon_component: 'IcProfitTable',
                },
                {
                    path: routes.statement,
                    component: Reports,
                    getTitle: () => localize('Statement'),
                    icon_component: 'IcStatement',
                },
            ],
        },
        {
            path: routes.root,
            component: Trader,
            getTitle: () => localize('Trader'),
            routes: [
                {
                    path: routes.contract,
                    component: Trader,
                    getTitle: () => localize('Contract Details'),
                    is_authenticated: true,
                },
                { path: routes.error404, component: Trader, getTitle: () => localize('Error 404') },
            ],
        },
    ];

    return modules;
};

const lazyLoadComplaintsPolicy = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "complaints-policy" */ 'Modules/ComplaintsPolicy')),
    () => <Loading />
);

// Order matters
// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = ({ is_appstore, is_eu_country }) => [
    { path: routes.index, component: RouterRedirect, getTitle: () => '', to: routes.root },
    { path: routes.endpoint, component: Endpoint, getTitle: () => 'Endpoint' }, // doesn't need localization as it's for internal use
    { path: routes.redirect, component: Redirect, getTitle: () => localize('Redirect') },
    {
        path: routes.complaints_policy,
        component: lazyLoadComplaintsPolicy(),
        getTitle: () => localize('Complaints policy'),
        icon_component: 'IcComplaintsPolicy',
        is_authenticated: true,
    },
    ...getModules({ is_appstore, is_eu_country }),
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

// is_deriv_crypto = true as default to prevent route ui blinking
const getRoutesConfig = ({ is_appstore = true, is_eu_country }) => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig({ is_appstore, is_eu_country });
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;
