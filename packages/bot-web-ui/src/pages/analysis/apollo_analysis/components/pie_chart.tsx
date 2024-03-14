import { ResponsivePie } from '@nivo/pie';
import React from 'react';

type EvenOddPie = {
    allDigitList:number[]
}
const MyResponsivePie = ({allDigitList}:EvenOddPie) => {
    const calculateOddEvenPercentages = (numbers: number[]): { oddPercentage: number; evenPercentage: number } =>{
        let oddCount: number = 0;
        let evenCount: number = 0;
        const totalNumbers: number = numbers.length;
    
        // Count the occurrences of odd and even numbers
        numbers.forEach((number: number) => {
            if (number % 2 === 0) {
                evenCount++;
            } else {
                oddCount++;
            }
        });
    
        // Calculate the percentage appearance of odd and even numbers
        const oddPercentage: number = (oddCount / totalNumbers) * 100;
        const evenPercentage: number = (evenCount / totalNumbers) * 100;
    
        return {
            oddPercentage: +oddPercentage.toFixed(2),
            evenPercentage: +evenPercentage.toFixed(2)
        };
    }

    let percentages: { oddPercentage: number; evenPercentage: number } = calculateOddEvenPercentages(allDigitList);



    const pie_data = [
        {
            id: 'Even',
            label: 'Even',
            value: percentages.evenPercentage,
            color: 'hsl(245, 70%, 50%)',
        },
        {
            id: 'Odd',
            label: 'Odd',
            value: percentages.oddPercentage,
            color: 'hsl(11, 70%, 50%)',
        },
    ];
    return (
        <ResponsivePie
            data={pie_data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor='#333333'
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]],
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'c',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'go',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'python',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'scala',
                    },
                    id: 'lines',
                },
                {
                    match: {
                        id: 'lisp',
                    },
                    id: 'lines',
                },
                {
                    match: {
                        id: 'elixir',
                    },
                    id: 'lines',
                },
                {
                    match: {
                        id: 'javascript',
                    },
                    id: 'lines',
                },
            ]}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000',
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default MyResponsivePie;
