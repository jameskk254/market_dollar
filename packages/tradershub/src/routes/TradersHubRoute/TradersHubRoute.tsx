import React from 'react';
import { Button, Heading, Text, useBreakpoint } from '@deriv/quill-design';
import {
    ContentSwitcher,
    DemoRealSwitcher,
    OptionsAndMultipliersSection,
    StaticLink,
    TotalAssets,
} from '../../components';
import { CTraderList } from '../../features/cfd/components/CTraderList';
import { OtherCFDPlatformsList } from '../../features/cfd/components/OtherCFDPlatformsList';

const TradersHubRoute = () => {
    const { isMobile } = useBreakpoint();

    if (isMobile)
        return (
            <div className='p-800'>
                <div className='pb-1200'>
                    <Heading.H3 className='pb-200'>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
                <div className='grid place-content-center pb-1200'>
                    <TotalAssets />
                </div>
                <ContentSwitcher>
                    <ContentSwitcher.HeaderList list={['Options & Multipliers', 'CFDs']} />
                    <ContentSwitcher.PanelContainer>
                        <OptionsAndMultipliersSection />
                    </ContentSwitcher.PanelContainer>
                </ContentSwitcher>
            </div>
        );

    return (
        <div className='flex flex-col gap-1200'>
            <div className='flex items-center justify-between align-start gap-100'>
                <div className='flex flex-row gap-600'>
                    <Heading.H3>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
                <TotalAssets />
            </div>
            <OptionsAndMultipliersSection />

            <div className='border-solid p-1200 rounded-1200 border-xs border-opacity-black-100'>
                <div className='pb-1200'>
                    <div className='flex items-center gap-200'>
                        <Heading.H4>CFDs</Heading.H4>
                        <Button className='no-underline' colorStyle='coral' size='sm' variant='tertiary'>
                            Compare Accounts
                        </Button>
                    </div>
                    <Text size='sm'>
                        Trade with leverage and tight spreads for better returns on trades.
                        <StaticLink size='md' staticUrl='/trade-types/cfds/'>
                            Learn more
                        </StaticLink>
                    </Text>
                </div>
                <div className='flex flex-col gap-y-1200'>
                    <div>
                        <Text bold className='pb-800' size='md'>
                            Deriv MT5
                        </Text>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1200'>
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-1200'>
                        <CTraderList />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-1200'>
                        <OtherCFDPlatformsList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradersHubRoute;
